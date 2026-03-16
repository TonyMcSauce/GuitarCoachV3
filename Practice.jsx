// src/pages/Strumming.jsx - V2 with real strum sounds
import React, { useState, useEffect, useRef } from 'react';
import { STRUMMING_PATTERNS } from '../data/chords';
import { playChordSound, playMetronomeClick } from '../services/audioEngine';

// Chords to demo each pattern with
const DEMO_CHORDS = ['G', 'C', 'Em', 'D'];

function StrumBeat({ beat, active }) {
  const isDown = beat === 'D';
  const isMute = beat === 'x';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: active
          ? isMute ? 'var(--bg-3)' : isDown ? 'var(--accent)' : 'var(--gold)'
          : 'var(--bg-2)',
        border: `2px solid ${active
          ? isMute ? 'var(--text-3)' : isDown ? 'var(--accent)' : 'var(--gold)'
          : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, transition: 'all 0.06s',
        boxShadow: active && !isMute ? `0 0 16px ${isDown ? 'var(--accent-glow)' : 'rgba(240,192,96,0.4)'}` : 'none',
        transform: active ? 'scale(1.12)' : 'scale(1)',
      }}>
        {isMute ? '×' : isDown ? '↓' : '↑'}
      </div>
      <div style={{ fontSize: 9, fontFamily: 'var(--font-display)', fontWeight: 700, color: active ? 'var(--text-1)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {isMute ? 'mute' : isDown ? 'down' : 'up'}
      </div>
    </div>
  );
}

function PatternPlayer({ pattern }) {
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(pattern.bpm);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [elapsed, setElapsed] = useState(0);
  const [currentChordIdx, setCurrentChordIdx] = useState(0);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const beatRef = useRef(0);
  const chordBeatRef = useRef(0);
  const startRef = useRef(null);

  const stop = () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
    setPlaying(false);
    setActiveBeat(-1);
    beatRef.current = 0;
    chordBeatRef.current = 0;
    setElapsed(0);
  };

  const start = () => {
    setPlaying(true);
    startRef.current = Date.now();
    beatRef.current = 0;
    chordBeatRef.current = 0;
    setCurrentChordIdx(0);

    // Play first chord immediately
    playChordSound(DEMO_CHORDS[0]);

    const beatsPerChord = pattern.beats.length; // change chord every full pattern
    const msPerBeat = ((60 / bpm) * 1000) / 2;

    intervalRef.current = setInterval(() => {
      const beat = beatRef.current % pattern.beats.length;
      setActiveBeat(beat);

      const currentBeat = pattern.beats[beat];

      // Play sound on downstrokes and upstrokes (not mutes)
      if (currentBeat === 'D') {
        playMetronomeClick(beat === 0); // accent on beat 1
        // Play chord strum sound every pattern cycle on beat 0
        if (beat === 0) {
          const chordIdx = Math.floor(beatRef.current / beatsPerChord) % DEMO_CHORDS.length;
          setCurrentChordIdx(chordIdx);
          playChordSound(DEMO_CHORDS[chordIdx]);
        }
      } else if (currentBeat === 'U') {
        // Softer upstroke click
        playMetronomeClick(false);
      }

      beatRef.current++;
    }, msPerBeat);

    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - startRef.current) / 1000));
    }, 1000);
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
            <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              🎸 {DEMO_CHORDS[currentChordIdx]}
            </div>
          </div>
        )}
      </div>

      {/* Beat visualizer */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {pattern.beats.map((beat, i) => (
          <StrumBeat key={i} beat={beat} active={playing && activeBeat === i} />
        ))}
        <div style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-body)' }}>
          {pattern.beats.join(' ')}
        </div>
      </div>

      {/* Demo chords */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Demo:</div>
        {DEMO_CHORDS.map((c, i) => (
          <div key={c} style={{
            padding: '4px 12px', borderRadius: 8,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18,
            background: playing && currentChordIdx === i ? 'var(--accent-dim)' : 'var(--bg-2)',
            color: playing && currentChordIdx === i ? 'var(--accent)' : 'var(--text-2)',
            border: `1px solid ${playing && currentChordIdx === i ? 'var(--border-accent)' : 'var(--border)'}`,
            transition: 'all 0.15s',
            cursor: 'pointer',
          }} onClick={() => playChordSound(c)}>
            {c}
          </div>
        ))}
      </div>

      {/* BPM */}
      <div style={{ marginBottom: 16 }}>
        <label className="form-label">Tempo: {bpm} BPM</label>
        <input type="range" min={40} max={160} value={bpm}
          onChange={e => { setBpm(Number(e.target.value)); if (playing) { stop(); } }}
          style={{ width: '100%', accentColor: 'var(--accent)' }} disabled={playing} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
          <span>40 (Slow)</span><span>100 (Medium)</span><span>160 (Fast)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {!playing ? (
          <button className="btn btn-primary" onClick={start}>▶ Play with Sound</button>
        ) : (
          <button className="btn btn-ghost" onClick={stop}>⏹ Stop</button>
        )}
        <button className="btn btn-secondary btn-sm" onClick={() => playChordSound('G')}>🔊 Test Sound</button>
      </div>
    </div>
  );
}

export default function Strumming() {
  return (
    <div>
      <h1 className="page-title">Strumming Lessons</h1>
      <p className="page-subtitle">Each pattern plays real chord sounds as you practice. Click any chord to hear it.</p>

      <div className="card" style={{ marginBottom: 24, background: 'var(--accent-dim)', borderColor: 'var(--border-accent)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>🎸 How to Practice</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.8 }}>
          1. Press <strong>▶ Play with Sound</strong> to hear the pattern with real chord sounds.<br/>
          2. Watch the beat indicators light up and strum along.<br/>
          3. Start slow — match the rhythm before increasing speed.<br/>
          4. Keep your wrist loose. Even muted strokes maintain timing.
        </div>
      </div>

      {STRUMMING_PATTERNS.map(p => (
        <PatternPlayer key={p.id} pattern={p} />
      ))}

      <div className="card">
        <h3 className="section-title">Pattern Legend</h3>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { beat: 'D', label: 'Downstroke — strum toward the floor', color: 'var(--accent)' },
            { beat: 'U', label: 'Upstroke — strum toward the ceiling', color: 'var(--gold)' },
            { beat: 'x', label: 'Muted strum — touch strings without sound', color: 'var(--text-3)' },
          ].map(({ beat, label, color }) => (
            <div key={beat} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-2)', border: `1px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 16, fontWeight: 700 }}>
                {beat === 'x' ? '×' : beat === 'D' ? '↓' : '↑'}
              </div>
              <span style={{ color: 'var(--text-2)' }}><strong>{beat}</strong> = {label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
