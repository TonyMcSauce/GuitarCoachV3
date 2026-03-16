// src/pages/Songs.jsx - V2 fullscreen player with lyric sync
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SONG_LIBRARY } from '../data/songs';
import { SONGS as LEGACY_SONGS } from '../data/chords';
import { useAuth } from '../services/AuthContext';
import { markSongCompleted, getSmartRecommendations } from '../services/userService';
import { playDownstrum, playUpstrum } from '../services/audioEngine';
import { XPToast } from '../components/XPToast';

// ── Fullscreen Song Player ─────────────────────────────────────────
function SongPlayer({ song, known, completed, onComplete, onClose }) {
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(1.0);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [currentChord, setCurrentChord] = useState(song.chords[0] || 'G');
  const [elapsed, setElapsed] = useState(0);
  const [view, setView] = useState('sheet'); // 'sheet' | 'fullscreen'

  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const lineRef = useRef(null);
  const startRef = useRef(null);
  const activeLyricRef = useRef(null);

  const stateRef = useRef({
    playing: false,
    beatIndex: 0,
    lineIndex: 0,
    beatsPerLine: 0,
    lineBeatsElapsed: 0,
    nextBeatTime: 0,
    bpm: song.bpm,
    pattern: song.strummingPattern || ['D', 'D', 'U', 'D', 'U'],
    currentChord: song.chords[0] || 'G',
  });

  const allLines = song.sections.flatMap(s =>
    s.lines.map(l => ({ ...l, section: s.section }))
  );

  const canPlay = song.chords.every(c => known.includes(c));
  const bpmAdjusted = Math.round((song.bpm || 80) * tempo);
  const pattern = song.strummingPattern || ['D', 'D', 'U', 'D', 'U'];

  // Scroll active lyric into view
  useEffect(() => {
    if (activeLyricRef.current) {
      activeLyricRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLineIdx]);

  const stopAll = useCallback(() => {
    stateRef.current.playing = false;
    cancelAnimationFrame(rafRef.current);
    clearInterval(timerRef.current);
    clearInterval(lineRef.current);
    setPlaying(false);
    setActiveBeat(-1);
    stateRef.current.beatIndex = 0;
    stateRef.current.lineIndex = 0;
    stateRef.current.lineBeatsElapsed = 0;
  }, []);

  const schedule = useCallback(() => {
    if (!stateRef.current.playing) return;
    const now = performance.now();
    const s = stateRef.current;

    if (now >= s.nextBeatTime) {
      const beat = s.pattern[s.beatIndex];
      const chord = s.currentChord;

      // Play the right strum
      if (beat === 'D') playDownstrum(chord, 0.17);
      else if (beat === 'U') playUpstrum(chord, 0.09);

      setActiveBeat(s.beatIndex);

      // Advance beat within pattern
      s.beatIndex = (s.beatIndex + 1) % s.pattern.length;

      // Count beats and advance line every N beats
      s.lineBeatsElapsed++;
      if (s.lineBeatsElapsed >= s.beatsPerLine) {
        s.lineBeatsElapsed = 0;
        s.lineIndex++;
        if (s.lineIndex >= allLines.length) {
          stopAll();
          return;
        }
        // Update current chord from new line
        const newLine = allLines[s.lineIndex];
        if (newLine?.chords?.[0]) {
          s.currentChord = newLine.chords[0].chord;
          setCurrentChord(newLine.chords[0].chord);
        }
        setCurrentLineIdx(s.lineIndex);
      }

      const msPerBeat = (60000 / s.bpm) / 2;
      s.nextBeatTime = now + msPerBeat;
    }

    rafRef.current = requestAnimationFrame(schedule);
  }, [allLines, stopAll]);

  const startPlaying = () => {
    const s = stateRef.current;
    s.playing = true;
    s.beatIndex = 0;
    s.lineIndex = 0;
    s.lineBeatsElapsed = 0;
    s.bpm = bpmAdjusted;
    s.pattern = pattern;
    s.nextBeatTime = performance.now();
    s.beatsPerLine = pattern.length * 2; // 2 pattern reps per lyric line
    const firstLine = allLines[0];
    s.currentChord = firstLine?.chords?.[0]?.chord || song.chords[0] || 'G';

    setPlaying(true);
    setCurrentLineIdx(0);
    setCurrentChord(s.currentChord);
    setElapsed(0);
    startRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startRef.current) / 1000));
    }, 1000);

    rafRef.current = requestAnimationFrame(schedule);
  };

  useEffect(() => () => stopAll(), [stopAll]);

  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const currentSection = allLines[currentLineIdx]?.section;
  const nextLine = allLines[currentLineIdx + 1];

  // ── FULLSCREEN PLAYER ────────────────────────────────────────────
  if (view === 'fullscreen') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'var(--bg-0)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-1)', flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>{song.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{song.artist}</div>
          </div>

          {/* Strum pattern display */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {pattern.map((beat, i) => {
              const isActive = playing && activeBeat === i;
              const isDown = beat === 'D';
              return (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: 7,
                  background: isActive ? (isDown ? 'var(--accent)' : 'var(--gold)') : 'var(--bg-3)',
                  border: `1px solid ${isActive ? (isDown ? 'var(--accent)' : 'var(--gold)') : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, transition: 'all 0.05s',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: isActive ? `0 0 12px ${isDown ? 'var(--accent-glow)' : 'rgba(240,192,96,0.5)'}` : 'none',
                }}>
                  {beat === 'x' ? '×' : beat === 'D' ? '↓' : '↑'}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {playing && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold)' }}>{fmt(elapsed)}</span>}
            <button className="btn btn-ghost btn-sm" onClick={() => setView('sheet')}>⊡ Sheet</button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Main stage */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 40px', gap: 16 }}>

          {/* Section label */}
          <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
            {currentSection || ''}
          </div>

          {/* Big chord */}
          <div style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(80px, 15vw, 140px)',
            fontStyle: 'italic', fontWeight: 300,
            color: 'var(--accent)', lineHeight: 1,
            letterSpacing: -4,
            textShadow: '0 0 60px rgba(162,120,255,0.3)',
            transition: 'color 0.3s',
          }}>
            {currentChord}
          </div>

          {/* Current lyric line */}
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 28px)',
            fontWeight: 700, color: 'var(--text-1)',
            textAlign: 'center', maxWidth: 700,
            lineHeight: 1.4,
          }}>
            {allLines[currentLineIdx]?.lyric}
          </div>

          {/* Next line preview */}
          {nextLine && (
            <div style={{
              fontSize: 'clamp(13px, 2vw, 18px)',
              color: 'var(--text-3)', textAlign: 'center',
              fontStyle: 'italic',
            }}>
              Next: {nextLine.lyric}
            </div>
          )}

          {/* Chord chips */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {allLines[currentLineIdx]?.chords?.map((c, i) => (
              <div key={i} style={{
                padding: '6px 18px', borderRadius: 10,
                fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22,
                background: i === 0 ? 'var(--accent-dim)' : 'var(--bg-2)',
                color: i === 0 ? 'var(--accent)' : 'var(--text-2)',
                border: `1px solid ${i === 0 ? 'var(--border-accent)' : 'var(--border)'}`,
                cursor: 'pointer',
              }} onClick={() => playDownstrum(c.chord)}>
                {c.chord}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: 500, marginTop: 8 }}>
            <div className="progress-bar" style={{ height: 4 }}>
              <div className="progress-fill" style={{ width: `${(currentLineIdx / allLines.length) * 100}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-display)' }}>
              <span>Line {currentLineIdx + 1}</span>
              <span>{allLines.length} lines</span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          background: 'var(--bg-1)', display: 'flex', alignItems: 'center',
          gap: 16, flexShrink: 0, flexWrap: 'wrap',
        }}>
          {!playing ? (
            <button className="btn btn-primary btn-lg" onClick={startPlaying} disabled={!canPlay}>
              ▶ Play Song
            </button>
          ) : (
            <button className="btn btn-ghost btn-lg" onClick={stopAll}>⏹ Stop</button>
          )}

          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              TEMPO {Math.round(tempo * 100)}% · {bpmAdjusted} BPM
            </div>
            <input type="range" min={50} max={120} value={Math.round(tempo * 100)}
              onChange={e => { stopAll(); setTempo(Number(e.target.value) / 100); }}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
          </div>

          {canPlay && !completed && (
            <button className="btn btn-success" onClick={onComplete}>✓ Complete +100 XP</button>
          )}
          {completed && <span className="badge badge-green" style={{ fontSize: 13, padding: '8px 16px' }}>✓ Completed!</span>}
        </div>
      </div>
    );
  }

  // ── SHEET VIEW (modal) ───────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-accent)',
        borderRadius: 24, padding: '24px 28px', maxWidth: 680, width: '100%',
        maxHeight: '92vh', overflow: 'auto', boxShadow: '0 0 60px rgba(162,120,255,0.2)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 3 }}>{song.title}</h2>
            <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 6 }}>{song.artist}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>🎵 {bpmAdjusted} BPM</span>
              {song.capo && <span style={{ fontSize: 12, color: 'var(--gold)' }}>🎸 Capo {song.capo}</span>}
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{song.strummingName}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => setView('fullscreen')}>⛶ Fullscreen</button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Chords needed */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {song.chords.map(c => (
            <div key={c} style={{
              padding: '5px 14px', borderRadius: 8,
              fontFamily: 'var(--font-serif)', fontSize: 20, fontStyle: 'italic',
              background: known.includes(c) ? 'var(--green-dim)' : 'var(--red-dim)',
              color: known.includes(c) ? 'var(--green)' : 'var(--red)',
              border: `1px solid ${known.includes(c) ? 'var(--green)' : 'var(--red)'}`,
              cursor: 'pointer',
            }} onClick={() => playDownstrum(c)}>
              {c} {known.includes(c) ? '✓' : '✗'}
            </div>
          ))}
        </div>

        {/* Strum pattern */}
        <div style={{ padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Strum:</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {pattern.map((b, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: 5,
                background: playing && activeBeat === i
                  ? (b === 'D' ? 'var(--accent)' : 'var(--gold)')
                  : 'var(--bg-3)',
                border: `1px solid ${playing && activeBeat === i
                  ? (b === 'D' ? 'var(--accent)' : 'var(--gold)')
                  : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, transition: 'all 0.05s',
                transform: playing && activeBeat === i ? 'scale(1.2)' : 'scale(1)',
              }}>
                {b === 'x' ? '×' : b === 'D' ? '↓' : '↑'}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{song.strummingName}</span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          {!playing ? (
            <button className="btn btn-primary" onClick={startPlaying} disabled={!canPlay}>▶ Play Song</button>
          ) : (
            <button className="btn btn-ghost" onClick={stopAll}>⏹ Stop</button>
          )}
          <button className="btn btn-secondary" onClick={() => setView('fullscreen')}>⛶ Go Fullscreen</button>
          {playing && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold)' }}>{fmt(elapsed)}</span>}
          <div style={{ flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 2 }}>
              TEMPO {Math.round(tempo * 100)}%
            </div>
            <input type="range" min={50} max={120} value={Math.round(tempo * 100)}
              onChange={e => { stopAll(); setTempo(Number(e.target.value) / 100); }}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
          </div>
        </div>

        {!canPlay && (
          <div className="error-msg" style={{ marginBottom: 14 }}>
            Learn {song.chords.filter(c => !known.includes(c)).join(', ')} to play this song.
          </div>
        )}

        {/* Lyric sheet — scrollable, active line highlighted */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            Song Sheet
          </div>
          {song.sections.map((section, si) => {
            const sectionStart = song.sections.slice(0, si).reduce((a, s) => a + s.lines.length, 0);
            return (
              <div key={si} style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
                  — {section.section} —
                </div>
                {section.lines.map((line, li) => {
                  const globalIdx = sectionStart + li;
                  const isActive = playing && currentLineIdx === globalIdx;
                  return (
                    <div
                      key={li}
                      ref={isActive ? activeLyricRef : null}
                      style={{
                        marginBottom: 8, padding: '8px 12px', borderRadius: 8,
                        background: isActive ? 'var(--accent-dim)' : 'transparent',
                        border: `1px solid ${isActive ? 'var(--border-accent)' : 'transparent'}`,
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Chord markers */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                        {line.chords.map((c, ci) => (
                          <span key={ci} style={{
                            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13,
                            color: isActive ? 'var(--accent)' : 'var(--gold)',
                            fontWeight: 600, cursor: 'pointer',
                          }} onClick={() => playDownstrum(c.chord)}>
                            {c.chord}
                          </span>
                        ))}
                      </div>
                      {/* Lyric */}
                      <div style={{
                        fontSize: 15,
                        color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                        fontWeight: isActive ? 700 : 400,
                        fontFamily: isActive ? 'var(--font-display)' : 'inherit',
                        transition: 'all 0.2s',
                      }}>
                        {line.lyric}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {canPlay && !completed && (
          <button className="btn btn-success btn-full" style={{ marginTop: 14 }} onClick={onComplete}>
            ✓ Mark as Completed · +100 XP
          </button>
        )}
        {completed && (
          <div className="badge badge-green" style={{ padding: '10px 20px', width: '100%', justifyContent: 'center', borderRadius: 10, fontSize: 14, marginTop: 14 }}>
            ✓ Completed!
          </div>
        )}
      </div>
    </div>
  );
}

// ── Song Card + Library ────────────────────────────────────────────
export default function Songs() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [xpToast, setXpToast] = useState(null);

  const known = userProfile?.knownChords || [];
  const songsCompleted = userProfile?.songsCompleted || [];

  const filtered = SONG_LIBRARY.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'ready') return s.chords.every(c => known.includes(c));
    if (filter === 'completed') return songsCompleted.includes(s.id);
    return true;
  });

  const handleComplete = async () => {
    if (!selected || !currentUser) return;
    const result = await markSongCompleted(currentUser.uid, selected.id);
    await refreshProfile();
    setXpToast({ xp: result.xpGained, message: `"${selected.title}" completed!` });
    setSelected(null);
  };

  const readyCount = SONG_LIBRARY.filter(s => s.chords.every(c => known.includes(c))).length;

  return (
    <div>
      <h1 className="page-title">Song Library</h1>
      <p className="page-subtitle">
        Full songs with lyrics, chords and strumming. Hit ⛶ Fullscreen for the best experience.
      </p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="form-input" placeholder="Search songs or artists..."
          value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { k: 'all', l: `All (${SONG_LIBRARY.length})` },
            { k: 'ready', l: `✓ Ready (${readyCount})` },
            { k: 'completed', l: `Done (${songsCompleted.length})` },
          ].map(f => (
            <button key={f.k} className={`btn btn-sm ${filter === f.k ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f.k)}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid">
        {filtered.map(song => {
          const canPlay = song.chords.every(c => known.includes(c));
          const isCompleted = songsCompleted.includes(song.id);
          const totalLines = song.sections.reduce((a, s) => a + s.lines.length, 0);

          return (
            <div key={song.id} className="card" style={{
              cursor: 'pointer',
              borderColor: isCompleted ? 'var(--green)' : canPlay ? 'var(--border-accent)' : undefined,
            }}
              onClick={() => setSelected(song)}
              onMouseEnter={e => e.currentTarget.style.borderColor = isCompleted ? 'var(--green)' : 'var(--border-accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = isCompleted ? 'var(--green)' : 'var(--border)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{song.title}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 12 }}>{song.artist}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                  {isCompleted && <span className="badge badge-green">✓ Done</span>}
                  {canPlay && !isCompleted && <span className="badge badge-accent">Ready</span>}
                  {song.capo && <span className="badge badge-gold">Capo {song.capo}</span>}
                </div>
              </div>

              {/* Chords */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                {song.chords.map(c => (
                  <span key={c} style={{
                    padding: '1px 8px', borderRadius: 5, fontSize: 11,
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    background: known.includes(c) ? 'var(--green-dim)' : 'var(--bg-2)',
                    color: known.includes(c) ? 'var(--green)' : 'var(--text-3)',
                    border: `1px solid ${known.includes(c) ? 'var(--green)' : 'var(--border)'}`,
                  }}>{c}</span>
                ))}
              </div>

              {/* Strum pattern preview */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, marginRight: 4 }}>STRUM:</span>
                {(song.strummingPattern || []).map((b, i) => (
                  <div key={i} style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: b === 'D' ? 'var(--accent-dim)' : b === 'U' ? 'var(--gold-dim)' : 'var(--bg-3)',
                    border: `1px solid ${b === 'D' ? 'var(--border-accent)' : b === 'U' ? 'rgba(240,192,96,0.3)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10,
                    color: b === 'D' ? 'var(--accent)' : b === 'U' ? 'var(--gold)' : 'var(--text-3)',
                  }}>
                    {b === 'x' ? '×' : b === 'D' ? '↓' : '↑'}
                  </div>
                ))}
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 4 }}>{song.strummingName}</span>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 12 }}>
                <span>🎵 {song.bpm} BPM</span>
                <span>📄 {totalLines} lines</span>
                <span>📖 {song.sections.length} sections</span>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <SongPlayer
          song={selected}
          known={known}
          completed={songsCompleted.includes(selected.id)}
          onComplete={handleComplete}
          onClose={() => setSelected(null)}
        />
      )}

      {xpToast && <XPToast {...xpToast} onDone={() => setXpToast(null)} />}
    </div>
  );
}
