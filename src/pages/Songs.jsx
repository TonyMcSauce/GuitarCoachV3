// src/pages/Songs.jsx - V2 with auto-scroll, tempo, loop, countdown
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SONGS } from '../data/chords';
import { useAuth } from '../services/AuthContext';
import { markSongCompleted, getSmartRecommendations } from '../services/userService';
import { playChordSound } from '../services/audioEngine';
import { XPToast } from '../components/XPToast';

function SongPlayer({ song, known, completed, onComplete, onClose }) {
  const [tempo, setTempo] = useState(1.0);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentChordIdx, setCurrentChordIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showSimplified, setShowSimplified] = useState(false);
  const intervalRef = useRef(null);
  const countRef = useRef(null);
  const canPlay = song.chords.every(c => known.includes(c));
  const bpmAdjusted = Math.round(song.bpm * tempo);
  const secPerChord = (60 / bpmAdjusted) * 2; // 2 beats per chord slot

  const allChords = song.progression.flatMap(s => s.chords.map(c => ({ chord: c, section: s.section })));

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    clearInterval(countRef.current);
    setPlaying(false);
    setCountdown(null);
  }, []);

  const start = () => {
    setPlaying(true);
    setCurrentChordIdx(0);
    let idx = 0;
    let cd = Math.round(secPerChord);
    setCountdown(cd);

    countRef.current = setInterval(() => {
      cd--;
      if (cd <= 0) cd = Math.round(secPerChord);
      setCountdown(cd);
    }, 1000);

    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % allChords.length;
      setCurrentChordIdx(idx);
      if (allChords[idx]) playChordSound(allChords[idx].chord);
    }, secPerChord * 1000);

    playChordSound(allChords[0].chord);
  };

  useEffect(() => () => stop(), [stop]);

  const currentChordObj = allChords[currentChordIdx];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-accent)',
        borderRadius: 24, padding: 28, maxWidth: 600, width: '100%',
        maxHeight: '90vh', overflow: 'auto',
        boxShadow: 'var(--shadow-accent)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{song.title}</h2>
            <div style={{ color: 'var(--text-2)', fontSize: 13 }}>{song.artist}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>🎵 {bpmAdjusted} BPM</span>
              {song.capo && <span style={{ fontSize: 12, color: 'var(--gold)' }}>Capo {song.capo}</span>}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Live chord display */}
        {playing && currentChordObj && (
          <div style={{ textAlign: 'center', padding: '20px', marginBottom: 16, background: 'var(--bg-2)', borderRadius: 16, border: '1px solid var(--border-accent)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{currentChordObj.section}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 72, fontStyle: 'italic', fontWeight: 300, color: 'var(--accent)', lineHeight: 1 }}>
              {currentChordObj.chord}
            </div>
            {countdown && (
              <div style={{ marginTop: 8, color: 'var(--text-3)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                Next in {countdown}s
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          {!playing ? (
            <button className="btn btn-primary" onClick={start} disabled={!canPlay}>
              ▶ Play Along
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={stop}>⏹ Stop</button>
          )}

          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              TEMPO: {Math.round(tempo * 100)}% ({bpmAdjusted} BPM)
            </div>
            <input type="range" min={50} max={125} value={Math.round(tempo * 100)}
              onChange={e => { stop(); setTempo(Number(e.target.value) / 100); }}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: showSimplified ? 'var(--accent)' : 'var(--text-3)' }}>
            <input type="checkbox" checked={showSimplified} onChange={e => setShowSimplified(e.target.checked)} />
            Simplified chords
          </label>
        </div>

        {/* Chord progression sheet */}
        {song.progression.map((section, si) => (
          <div key={si} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              {section.section}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {section.chords.map((c, ci) => {
                const globalIdx = song.progression.slice(0, si).reduce((a, s) => a + s.chords.length, 0) + ci;
                const isActive = playing && currentChordIdx === globalIdx;
                return (
                  <div key={ci} style={{
                    padding: '10px 18px', borderRadius: 10,
                    fontFamily: 'var(--font-serif)', fontSize: 24, fontStyle: 'italic',
                    background: isActive ? 'var(--accent-dim)' : 'var(--bg-2)',
                    color: isActive ? 'var(--accent)' : known.includes(c) ? 'var(--text-1)' : 'var(--red)',
                    border: `1px solid ${isActive ? 'var(--border-accent)' : known.includes(c) ? 'var(--border)' : 'rgba(255,107,122,0.3)'}`,
                    transition: 'all 0.15s', cursor: 'pointer',
                    transform: isActive ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: isActive ? 'var(--shadow-accent)' : 'none',
                  }} onClick={() => playChordSound(c)}>
                    {c}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Chord check */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Required Chords
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {song.chords.map(c => (
              <span key={c} style={{
                padding: '6px 14px', borderRadius: 8,
                fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic',
                background: known.includes(c) ? 'var(--green-dim)' : 'var(--red-dim)',
                color: known.includes(c) ? 'var(--green)' : 'var(--red)',
                border: `1px solid ${known.includes(c) ? 'var(--green)' : 'var(--red)'}`,
              }}>{c} {known.includes(c) ? '✓' : '✗'}</span>
            ))}
          </div>
        </div>

        {!canPlay && (
          <div className="error-msg" style={{ marginBottom: 16 }}>
            Learn {song.chords.filter(c => !known.includes(c)).join(', ')} to play along with this song.
          </div>
        )}

        {canPlay && !completed && (
          <button className="btn btn-success btn-full" onClick={onComplete}>✓ Mark as Completed · +100 XP</button>
        )}
        {completed && <div className="badge badge-green" style={{ padding: '10px 20px', width: '100%', justifyContent: 'center', borderRadius: 10, fontSize: 14 }}>✓ Completed!</div>}
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
  const recommended = getSmartRecommendations(userProfile, SONGS);

  const filtered = SONGS.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.artist.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'ready') return s.chords.every(c => known.includes(c));
    if (filter === 'completed') return songsCompleted.includes(s.id);
    if (filter === 'recommended') return recommended.some(r => r.id === s.id);
    if (filter === 'beginner') return s.difficulty === 'Beginner';
    if (filter === 'intermediate') return s.difficulty === 'Intermediate';
    return true;
  });

  const handleComplete = async () => {
    if (!selected || !currentUser) return;
    const result = await markSongCompleted(currentUser.uid, selected.id);
    await refreshProfile();
    setXpToast({ xp: result.xpGained, message: `"${selected.title}" completed!` });
    setSelected(null);
  };

  const readyCount = SONGS.filter(s => s.chords.every(c => known.includes(c))).length;

  return (
    <div>
      <h1 className="page-title">Song Library</h1>
      <p className="page-subtitle">{readyCount} songs you can play right now. Click any song to play along.</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="form-input" placeholder="Search songs..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 260 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { k: 'all', l: `All (${SONGS.length})` },
            { k: 'recommended', l: `⭐ Recommended (${recommended.length})` },
            { k: 'ready', l: `Ready (${readyCount})` },
            { k: 'beginner', l: 'Beginner' },
            { k: 'intermediate', l: 'Intermediate' },
            { k: 'completed', l: `Done (${songsCompleted.length})` },
          ].map(f => (
            <button key={f.k} className={`btn btn-sm ${filter === f.k ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f.k)}>{f.l}</button>
          ))}
        </div>
      </div>

      <div className="card-grid">
        {filtered.map(song => {
          const canPlay = song.chords.every(c => known.includes(c));
          const isCompleted = songsCompleted.includes(song.id);
          const rec = recommended.find(r => r.id === song.id);
          return (
            <div key={song.id}
              className="card"
              style={{ cursor: 'pointer', borderColor: isCompleted ? 'var(--green)' : canPlay ? 'var(--border-accent)' : undefined }}
              onClick={() => setSelected(song)}
              onMouseEnter={e => e.currentTarget.style.borderColor = isCompleted ? 'var(--green)' : 'var(--border-accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = isCompleted ? 'var(--green)' : 'var(--border)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{song.title}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 12 }}>{song.artist}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexDirection: 'column', alignItems: 'flex-end' }}>
                  {isCompleted && <span className="badge badge-green">✓ Done</span>}
                  {canPlay && !isCompleted && <span className="badge badge-accent">Ready</span>}
                  {rec && <span className="badge badge-gold">⭐ Rec</span>}
                  {song.capo && <span className="badge" style={{ background: 'var(--bg-2)', color: 'var(--text-3)' }}>Capo {song.capo}</span>}
                </div>
              </div>
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
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{song.bpm} BPM · {song.chords.length} chords · {song.difficulty}</div>
            </div>
          );
        })}
      </div>

      {selected && (
        <SongPlayer song={selected} known={known} completed={songsCompleted.includes(selected.id)} onComplete={handleComplete} onClose={() => setSelected(null)} />
      )}
      {xpToast && <XPToast {...xpToast} onDone={() => setXpToast(null)} />}
    </div>
  );
}
