// src/pages/Strumming.jsx - V2 fixed: full pattern playback with down/upstrums
import React, { useState, useEffect, useRef } from 'react';
import { STRUMMING_PATTERNS } from '../data/chords';
import { playDownstrum, playUpstrum } from '../services/audioEngine';

const DEMO_CHORDS = ['G', 'C', 'Em', 'D'];

function StrumBeat({ beat, active }) {
  const isDown = beat === 'D';
  const isMute = beat === 'x';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: active
          ? isMute ? 'var(--bg-3)' : isDown ? 'var(--accent)' : 'var(--gold)'
          : 'var(--bg-2)',
        border: `2px solid ${active
          ? isMute ? 'var(--text-3)' : isDown ? 'var(--accent)' : 'var(--gold)'
          : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, transition: 'background 0.05s, transform 0.05s, box-shadow 0.05s',
        boxShadow: active && !isMute
          ? `0 0 18px ${isDown ? 'var(--accent-glow)' : 'rgba(240,192,96,0.5)'}`
          : 'none',
        transform: active ? 'scale(1.15)' : 'scale(1)',
      }}>
        {isMute ? '×' : isDown ? '↓' : '↑'}
      </div>
      <div style={{
        fontSize: 9, fontFamily: 'var(--font-display)', fontWeight: 700,
        color: active
          ? isDown ? 'var(--accent)' : 'var(--gold)'
          : 'var(--text-3)',
        textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        {isMute ? 'mute' : isDown ? 'down' : 'up'}
      </div>
    </div>
  );
}

function PatternPlayer({ pattern }) {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(pattern.bpm);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [currentChordIdx, setCurrentChordIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const stateRef = useRef({
    beatIndex: 0,       // current beat within the pattern
    chordCycle: 0,      // how many full patterns have completed
    nextBeatTime: 0,    // when to fire the next beat (ms)
    bpm: pattern.bpm,
    playing: false,
    pattern: pattern.beats,
    chordIdx: 0,
  });

  // Keep bpm in ref so the loop always reads the latest value
  useEffect(() => { stateRef.current.bpm = bpm; }, [bpm]);

  const stop = () => {
    stateRef.current.playing = false;
    cancelAnimationFrame(rafRef.current);
    clearInterval(timerRef.current);
    setPlaying(false);
    setActiveBeat(-1);
    setCurrentChordIdx(0);
    setElapsed(0);
    stateRef.current.beatIndex = 0;
    stateRef.current.chordCycle = 0;
    stateRef.current.chordIdx = 0;
  };

  // The main scheduler loop — fires every animation frame
  // Uses wall clock so it's rock solid regardless of frame rate
  const schedule = () => {
    if (!stateRef.current.playing) return;

    const now = performance.now();
    const s = stateRef.current;

    if (now >= s.nextBeatTime) {
      const beat = s.pattern[s.beatIndex];
      const chord = DEMO_CHORDS[s.chordIdx];

      // Fire the correct strum sound
      if (beat === 'D') {
        playDownstrum(chord, 0.18);
      } else if (beat === 'U') {
        playUpstrum(chord, 0.10);
      }
      // 'x' = muted, no sound

      // Update UI
      setActiveBeat(s.beatIndex);
      setCurrentChordIdx(s.chordIdx);

      // Advance beat
      s.beatIndex++;
      if (s.beatIndex >= s.pattern.length) {
        // Completed one full pattern — move to next chord
        s.beatIndex = 0;
        s.chordCycle++;
        s.chordIdx = s.chordCycle % DEMO_CHORDS.length;
      }

      // Schedule next beat: ms per beat = 60000 / bpm / 2 (8th notes)
      const msPerBeat = (60000 / s.bpm) / 2;
      s.nextBeatTime = now + msPerBeat;
    }

    rafRef.current = requestAnimationFrame(schedule);
  };

  const start = () => {
    const s = stateRef.current;
    s.playing = true;
    s.beatIndex = 0;
    s.chordCycle = 0;
    s.chordIdx = 0;
    s.nextBeatTime = performance.now();
    s.pattern = pattern.beats;
    setPlaying(true);
    setCurrentChordIdx(0);
    setElapsed(0);
    startRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startRef.current) / 1000));
    }, 1000);

    rafRef.current = requestAnimationFrame(schedule);
  };

  useEffect(() => () => stop(), []);

  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, margin: 0 }}>{pattern.name}</h2>
            <span className={`badge ${pattern.difficulty === 'Beginner' ? 'badge-green' : 'badge-gold'}`}>{pattern.difficulty}</span>
          </div>
          <p style={{ color: 'var(--text-2)', fontSize: 13, margin: 0 }}>{pattern.description}</p>
        </div>
        {playing && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold)' }}>{fmt(elapsed)}</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--accent)' }}>
              {DEMO_CHORDS[currentChordIdx]}
            </div>
          </div>
        )}
      </div>

      {/* Beat visualizer */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {pattern.beats.map((beat, i) => (
          <StrumBeat key={i} beat={beat} active={playing && activeBeat === i} />
        ))}
        <div style={{ marginLeft: 8, fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--font-body)', letterSpacing: 4 }}>
          {pattern.beats.join(' ')}
        </div>
      </div>

      {/* Demo chord cycle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Chord cycle:</div>
        {DEMO_CHORDS.map((c, i) => (
          <div key={c} style={{
            padding: '5px 14px', borderRadius: 8,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20,
            background: playing && currentChordIdx === i ? 'var(--accent-dim)' : 'var(--bg-2)',
            color: playing && currentChordIdx === i ? 'var(--accent)' : 'var(--text-2)',
            border: `1px solid ${playing && currentChordIdx === i ? 'var(--border-accent)' : 'var(--border)'}`,
            transition: 'all 0.15s',
            cursor: 'pointer',
          }} onClick={() => { playDownstrum(c); }}>
            {c}
          </div>
        ))}
      </div>

      {/* BPM slider */}
      <div style={{ marginBottom: 18 }}>
        <label className="form-label">Tempo: {bpm} BPM</label>
        <input
          type="range" min={40} max={160} value={bpm}
          onChange={e => { setBpm(Number(e.target.value)); if (playing) { stop(); } }}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
          disabled={playing}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
          <span>40 Slow</span><span>100 Medium</span><span>160 Fast</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {!playing ? (
          <button className="btn btn-primary" onClick={start}>▶ Play Full Pattern</button>
        ) : (
          <button className="btn btn-ghost" onClick={stop}>⏹ Stop</button>
        )}
        <button className="btn btn-secondary btn-sm" onClick={() => playDownstrum('G')}>🔊 Test Sound</button>
      </div>
    </div>
  );
}

export default function Strumming() {
  return (
    <div>
      <h1 className="page-title">Strumming Lessons</h1>
      <p className="page-subtitle">Each pattern plays the full D U sequence with real downstrums and upstrums. Strum along!</p>

      <div className="card" style={{ marginBottom: 24, background: 'var(--accent-dim)', borderColor: 'var(--border-accent)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>🎸 How to Practice</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.9 }}>
          1. Hit <strong>▶ Play Full Pattern</strong> — every beat fires its own sound.<br/>
          2. <strong>Downstrokes ↓</strong> hit all 6 strings, <strong>upstrokes ↑</strong> catch just the high 3 strings.<br/>
          3. Watch each beat light up and strum along in real time.<br/>
          4. Start slow. Accuracy before speed — always.
        </div>
      </div>

      {STRUMMING_PATTERNS.map(p => (
        <PatternPlayer key={p.id} pattern={p} />
      ))}

      <div className="card">
        <h3 className="section-title">Pattern Legend</h3>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { beat: '↓', label: 'D — Downstroke: strum all strings toward the floor', color: 'var(--accent)' },
            { beat: '↑', label: 'U — Upstroke: catch high strings toward the ceiling', color: 'var(--gold)' },
            { beat: '×', label: 'x — Muted: touch strings lightly, no sound', color: 'var(--text-3)' },
          ].map(({ beat, label, color }) => (
            <div key={beat} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bg-2)', border: `1px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 18, fontWeight: 700 }}>
                {beat}
              </div>
              <span style={{ color: 'var(--text-2)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
