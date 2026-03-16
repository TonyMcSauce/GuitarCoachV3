// src/pages/Songs.jsx - V2 Full song experience with lyrics, chords, strumming
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SONG_LIBRARY } from '../data/songs';
import { SONGS as LEGACY_SONGS } from '../data/chords';
import { useAuth } from '../services/AuthContext';
import { markSongCompleted, getSmartRecommendations } from '../services/userService';
import { playChordSound } from '../services/audioEngine';
import { XPToast } from '../components/XPToast';

function StrumDisplay({ pattern, active, activeBeat }) {
  if (!pattern?.length) return null;
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      {pattern.map((beat, i) => {
        const isActive = active && activeBeat === i;
        const isDown = beat === 'D';
        return (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: 6,
            background: isActive ? (isDown ? 'var(--accent)' : 'var(--gold)') : 'var(--bg-3)',
            border: `1px solid ${isActive ? (isDown ? 'var(--accent)' : 'var(--gold)') : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, transition: 'all 0.06s',
            transform: isActive ? 'scale(1.15)' : 'scale(1)',
            boxShadow: isActive ? `0 0 10px ${isDown ? 'var(--accent-glow)' : 'rgba(240,192,96,0.4)'}` : 'none',
          }}>
            {beat === 'x' ? '×' : beat === 'D' ? '↓' : '↑'}
          </div>
        );
      })}
    </div>
  );
}

function SongPlayer({ song, known, completed, onComplete, onClose }) {
  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(1.0);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [currentChord, setCurrentChord] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const lineIntervalRef = useRef(null);
  const beatIntervalRef = useRef(null);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const lineRef = useRef(0);
  const beatRef = useRef(0);
  const linesRef = useRef([]);

  // Flatten all lines across sections
  const allLines = song.sections.flatMap(s =>
    s.lines.map(l => ({ ...l, section: s.section }))
  );
  linesRef.current = allLines;

  const bpmAdjusted = Math.round((song.bpm || 80) * tempo);
  const pattern = song.strummingPattern || ['D', 'D', 'U', 'D', 'U'];
  const msPerBeat = ((60 / bpmAdjusted) * 1000) / 2;
  const msPerLine = msPerBeat * pattern.length * 2; // 2 pattern repeats per line

  const stopAll = useCallback(() => {
    clearInterval(lineIntervalRef.current);
    clearInterval(beatIntervalRef.current);
    clearInterval(timerRef.current);
    setPlaying(false);
    setActiveBeat(-1);
    lineRef.current = 0;
    beatRef.current = 0;
  }, []);

  const startPlaying = () => {
    setPlaying(true);
    setCurrentLineIdx(0);
    lineRef.current = 0;
    beatRef.current = 0;
    startRef.current = Date.now();

    const firstLine = linesRef.current[0];
    if (firstLine?.chords?.[0]) {
      setCurrentChord(firstLine.chords[0].chord);
      playChordSound(firstLine.chords[0].chord);
    }

    // Beat animation
    beatIntervalRef.current = setInterval(() => {
      const beat = beatRef.current % pattern.length;
      setActiveBeat(beat);
      beatRef.current++;
    }, msPerBeat);

    // Line advancement
    lineIntervalRef.current = setInterval(() => {
      lineRef.current++;
      if (lineRef.current >= linesRef.current.length) {
        stopAll();
        return;
      }
      setCurrentLineIdx(lineRef.current);
      const line = linesRef.current[lineRef.current];
      if (line?.chords?.[0]) {
        setCurrentChord(line.chords[0].chord);
        playChordSound(line.chords[0].chord);
      }
    }, msPerLine);

    // Timer
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startRef.current) / 1000));
    }, 1000);
  };

  useEffect(() => () => stopAll(), [stopAll]);

  const canPlay = song.chords.every(c => known.includes(c));
  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const currentSection = allLines[currentLineIdx]?.section;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-accent)',
        borderRadius: 24, padding: '24px 28px', maxWidth: 680, width: '100%',
        maxHeight: '92vh', overflow: 'auto',
        boxShadow: '0 0 60px rgba(162,120,255,0.2)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 3 }}>{song.title}</h2>
            <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 6 }}>{song.artist}</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>🎵 {bpmAdjusted} BPM</span>
              {song.capo && <span style={{ fontSize: 12, color: 'var(--gold)' }}>🎸 Capo {song.capo}</span>}
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{song.strummingName}</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Required chords */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {song.chords.map(c => (
            <div key={c} style={{
              padding: '6px 14px', borderRadius: 8,
              fontFamily: 'var(--font-serif)', fontSize: 20, fontStyle: 'italic',
              background: known.includes(c) ? 'var(--green-dim)' : 'var(--red-dim)',
              color: known.includes(c) ? 'var(--green)' : 'var(--red)',
              border: `1px solid ${known.includes(c) ? 'var(--green)' : 'var(--red)'}`,
              cursor: 'pointer',
            }} onClick={() => playChordSound(c)}>
              {c} {known.includes(c) ? '✓' : '✗'}
            </div>
          ))}
        </div>

        {/* Strumming pattern */}
        <div style={{ padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Strum Pattern
          </div>
          <StrumDisplay pattern={pattern} active={playing} activeBeat={activeBeat} />
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{song.strummingName}</div>
        </div>

        {/* Live display when playing */}
        {playing && (
          <div style={{
            padding: '20px', marginBottom: 16, background: 'var(--bg-2)',
            borderRadius: 16, border: '1px solid var(--border-accent)', textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              {currentSection}
            </div>
            {currentChord && (
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 64, fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)', lineHeight: 1, marginBottom: 8 }}>
                {currentChord}
              </div>
            )}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--text-1)', marginBottom: 8 }}>
              {allLines[currentLineIdx]?.lyric}
            </div>
            <div style={{ color: 'var(--text-3)', fontSize: 12 }}>Line {currentLineIdx + 1} / {allLines.length}</div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          {!playing ? (
            <button className="btn btn-primary btn-lg" onClick={startPlaying} disabled={!canPlay}>
              ▶ Play Song
            </button>
          ) : (
            <button className="btn btn-ghost btn-lg" onClick={stopAll}>⏹ Stop</button>
          )}
          {playing && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', fontSize: 18 }}>{fmt(elapsed)}</div>}
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              TEMPO: {Math.round(tempo * 100)}%
            </div>
            <input type="range" min={50} max={120} value={Math.round(tempo * 100)}
              onChange={e => { stopAll(); setTempo(Number(e.target.value) / 100); }}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
          </div>
        </div>

        {!canPlay && (
          <div className="error-msg" style={{ marginBottom: 16 }}>
            Learn {song.chords.filter(c => !known.includes(c)).join(', ')} to play this song.
          </div>
        )}

        {/* Full lyric sheet */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
            Full Song Sheet
          </div>
          {song.sections.map((section, si) => {
            const sectionStartIdx = song.sections.slice(0, si).reduce((a, s) => a + s.lines.length, 0);
            return (
              <div key={si} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                  — {section.section} —
                </div>
                {section.lines.map((line, li) => {
                  const globalIdx = sectionStartIdx + li;
                  const isActive = playing && currentLineIdx === globalIdx;
                  return (
                    <div key={li} style={{
                      marginBottom: 10, padding: '8px 12px', borderRadius: 8,
                      background: isActive ? 'var(--accent-dim)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--border-accent)' : 'transparent'}`,
                      transition: 'all 0.2s',
                    }}>
                      {/* Chord markers above lyrics */}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        {line.chords.map((c, ci) => (
                          <span key={ci} style={{
                            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                            color: isActive ? 'var(--accent)' : 'var(--gold)',
                            fontWeight: 600, cursor: 'pointer',
                          }} onClick={() => playChordSound(c.chord)}>
                            {c.chord}
                          </span>
                        ))}
                      </div>
                      {/* Lyric line */}
                      <div style={{
                        fontSize: 15, color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                        fontFamily: isActive ? 'var(--font-display)' : 'inherit',
                        fontWeight: isActive ? 600 : 400,
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

        {/* Complete button */}
        {canPlay && !completed && (
          <button className="btn btn-success btn-full" style={{ marginTop: 16 }} onClick={onComplete}>
            ✓ Mark as Completed · +100 XP
          </button>
        )}
        {completed && (
          <div className="badge badge-green" style={{ padding: '10px 20px', width: '100%', justifyContent: 'center', borderRadius: 10, fontSize: 14, marginTop: 16 }}>
            ✓ Completed!
          </div>
        )}
      </div>
    </div>
  );
}

export default function Songs() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [xpToast, setXpToast] = useState(null);

  const known = userProfile?.knownChords || [];
  const songsCompleted = userProfile?.songsCompleted || [];
  const recommended = getSmartRecommendations(userProfile, LEGACY_SONGS);

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
        Full songs with lyrics, chords and strumming patterns. Press play to experience the whole song.
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
          const linesCount = song.sections.reduce((a, s) => a + s.lines.length, 0);

          return (
            <div key={song.id} className="card" style={{
              cursor: 'pointer',
              borderColor: isCompleted ? 'var(--green)' : canPlay ? 'var(--border-accent)' : undefined,
            }}
              onClick={() => setSelected(song)}
              onMouseEnter={e => e.currentTarget.style.borderColor = isCompleted ? 'var(--green)' : 'var(--border-accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = isCompleted ? 'var(--green)' : 'var(--border)'}
            >
              {/* Title + badges */}
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

              {/* Chords needed */}
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

              {/* Strumming pattern preview */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, marginRight: 4 }}>STRUM:</span>
                {(song.strummingPattern || []).map((b, i) => (
                  <div key={i} style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: b === 'D' ? 'var(--accent-dim)' : b === 'U' ? 'var(--gold-dim)' : 'var(--bg-3)',
                    border: `1px solid ${b === 'D' ? 'var(--border-accent)' : b === 'U' ? 'rgba(240,192,96,0.3)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: b === 'D' ? 'var(--accent)' : b === 'U' ? 'var(--gold)' : 'var(--text-3)',
                  }}>
                    {b === 'x' ? '×' : b === 'D' ? '↓' : '↑'}
                  </div>
                ))}
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 4 }}>{song.strummingName}</span>
              </div>

              {/* Meta */}
              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', gap: 12 }}>
                <span>🎵 {song.bpm} BPM</span>
                <span>📄 {linesCount} lines</span>
                <span>📖 {song.sections.length} sections</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>No songs found.</div>
      )}

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
