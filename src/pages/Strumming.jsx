// src/pages/Strumming.jsx
import React, { useState, useEffect, useRef } from 'react';
import { STRUMMING_PATTERNS } from '../data/chords';

function StrumBeat({ beat, active }) {
  const isDown = beat === 'D';
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: active ? (isDown ? 'var(--accent)' : 'var(--gold)') : 'var(--bg-2)',
        border: `2px solid ${active ? (isDown ? 'var(--accent)' : 'var(--gold)') : 'var(--border)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        transition: 'all 0.08s',
        boxShadow: active ? `0 0 12px ${isDown ? 'var(--accent-glow)' : 'var(--gold-dim)'}` : 'none',
      }}>
        {isDown ? '↓' : '↑'}
      </div>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', fontWeight: 700, color: active ? 'var(--text-1)' : 'var(--text-3)', textTransform: 'uppercase' }}>
        {isDown ? 'Down' : 'Up'}
      </div>
    </div>
  );
}

function PatternPlayer({ pattern }) {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(pattern.bpm);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const beatRef = useRef(0);
  const startRef = useRef(null);

  const stop = () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    setPlaying(false);
    setActiveBeat(-1);
    beatRef.current = 0;
    setElapsed(0);
  };

  const start = () => {
    setPlaying(true);
    startRef.current = Date.now();
    beatRef.current = 0;

    // Advance beat
    const msPerBeat = (60 / bpm) * 1000 / 2; // 8th notes
    intervalRef.current = setInterval(() => {
      setActiveBeat(beatRef.current % pattern.beats.length);
      beatRef.current++;
    }, msPerBeat);

    // Elapsed
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startRef.current) / 1000));
    }, 1000);
  };

  useEffect(() => () => stop(), []);

  const fmt = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, margin: 0 }}>{pattern.name}</h2>
            <span className={`badge ${pattern.difficulty === 'Beginner' ? 'badge-green' : 'badge-gold'}`}>{pattern.difficulty}</span>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: 13, margin: 0 }}>{pattern.description}</p>
        </div>
        {playing && (
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold)' }}>{fmt(elapsed)}</div>
        )}
      </div>

      {/* Beat visualizer */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {pattern.beats.map((beat, i) => (
          <StrumBeat key={i} beat={beat} active={playing && activeBeat === i} />
        ))}
      </div>

      {/* Notation string */}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, letterSpacing: 4, color: 'var(--text-2)', marginBottom: 20, padding: '10px 16px', background: 'var(--bg-2)', borderRadius: 10 }}>
        {pattern.beats.map((b, i) => (
          <span key={i} style={{ color: playing && activeBeat === i ? 'var(--accent)' : b === 'D' ? 'var(--text-1)' : 'var(--text-3)' }}>
            {b}{i < pattern.beats.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>

      {/* BPM control */}
      <div style={{ marginBottom: 20 }}>
        <label className="form-label">Tempo: {bpm} BPM</label>
        <input
          type="range" min={40} max={160} value={bpm}
          onChange={e => { setBpm(Number(e.target.value)); if (playing) { stop(); } }}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
          disabled={playing}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
          <span>40 BPM (Slow)</span><span>160 BPM (Fast)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {!playing ? (
          <button className="btn btn-primary" onClick={start}>▶ Start Practice</button>
        ) : (
          <button className="btn btn-ghost" onClick={stop}>⏹ Stop</button>
        )}
      </div>
    </div>
  );
}

export default function Strumming() {
  return (
    <div>
      <h1 className="page-title">Strumming Lessons</h1>
      <p className="page-subtitle">Master these fundamental patterns to play thousands of songs.</p>

      {/* Tips */}
      <div className="card" style={{ marginBottom: 28, background: 'var(--accent-dim)', borderColor: 'var(--border-accent)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>
          🎸 How to Practice
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8 }}>
          1. Start slow — accuracy matters more than speed.<br/>
          2. Keep your wrist loose and relaxed.<br/>
          3. Even downstrokes that miss strings still keep the rhythm.<br/>
          4. Build speed gradually over days, not minutes.
        </div>
      </div>

      {STRUMMING_PATTERNS.map(p => (
        <PatternPlayer key={p.id} pattern={p} />
      ))}

      {/* Legend */}
      <div className="card">
        <h3 className="section-title">Pattern Legend</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↓</div>
            <span style={{ color: 'var(--text-2)' }}>D = Downstroke (strum toward the floor)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--gold-dim)', border: '1px solid rgba(240,192,96,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>↑</div>
            <span style={{ color: 'var(--text-2)' }}>U = Upstroke (strum toward the ceiling)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
