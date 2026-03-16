// src/pages/Practice.jsx - V2 with chord accuracy detection
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CHORDS } from '../data/chords';
import { useAuth } from '../services/AuthContext';
import { logPracticeSession } from '../services/userService';
import { playChordSound, playMetronomeClick } from '../services/audioEngine';
import { XPToast } from '../components/XPToast';
import ChordDiagram from '../components/ChordDiagram';

// --- Pitch Detection (autocorrelation) ---
function autocorrelate(buf, sampleRate) {
  let SIZE = buf.length, rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.015) return -1;
  let r1 = 0, r2 = SIZE - 1;
  for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < 0.2) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < 0.2) { r2 = SIZE - i; break; }
  buf = buf.slice(r1, r2); SIZE = buf.length;
  const c = new Float32Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE - i; j++) c[i] += buf[j] * buf[j + i];
  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  let T0 = maxpos;
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);
  return sampleRate / T0;
}

function freqMatchesChord(detectedFreqs, targetChord) {
  if (!detectedFreqs.length || !targetChord?.frequencies?.length) return 0;
  const chordFreqs = targetChord.frequencies;
  let matches = 0;
  for (const cf of chordFreqs) {
    for (const df of detectedFreqs) {
      const ratio = df / cf;
      // Allow harmonic matches (octave equivalents)
      const normalized = ratio > 2 ? ratio / 2 : ratio < 0.5 ? ratio * 2 : ratio;
      if (Math.abs(normalized - 1) < 0.06) { matches++; break; }
    }
  }
  return Math.round((matches / chordFreqs.length) * 100);
}

function Metronome({ bpm, setBpm, active, beat }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'var(--bg-2)', borderRadius: 12 }}>
      <div style={{
        width: 14, height: 14, borderRadius: '50%',
        background: active && beat ? 'var(--accent)' : 'var(--bg-3)',
        boxShadow: active && beat ? '0 0 16px var(--accent-glow)' : 'none',
        transition: 'all 0.05s', flexShrink: 0,
      }} />
      <div style={{ flex: 1 }}>
        <input type="range" min={40} max={200} value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginTop: 2, fontFamily: 'var(--font-display)' }}>
          <span>40</span><span style={{ color: 'var(--accent)', fontWeight: 700 }}>{bpm} BPM</span><span>200</span>
        </div>
      </div>
    </div>
  );
}

export default function Practice() {
  const { currentUser, refreshProfile } = useAuth();
  const [phase, setPhase] = useState('setup');
  const [selectedChords, setSelectedChords] = useState([]);
  const [intervalSec, setIntervalSec] = useState(4);
  const [bpm, setBpm] = useState(80);
  const [enableMic, setEnableMic] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [switchCount, setSwitchCount] = useState(0);
  const [beat, setBeat] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [chordAccuracies, setChordAccuracies] = useState({});
  const [feedback, setFeedback] = useState(null); // 'correct'|'incorrect'|null
  const [xpToast, setXpToast] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const timerRef = useRef(null);
  const switchRef = useRef(null);
  const metroRef = useRef(null);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const currentIdxRef = useRef(0);
  const accuracyHistRef = useRef({});
  const countdownRef = useRef(null);

  const stopAll = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(switchRef.current);
    clearInterval(metroRef.current);
    clearInterval(countdownRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (audioRef.current) audioRef.current.getTracks().forEach(t => t.stop());
  }, []);

  useEffect(() => () => stopAll(), [stopAll]);

  const detectPitch = useCallback(() => {
    if (!analyserRef.current) return;
    const buf = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buf);
    const ctx = analyserRef.current.context;
    const freq = autocorrelate(buf, ctx.sampleRate);
    if (freq > 0) {
      const targetChord = CHORDS.find(c => c.id === selectedChords[currentIdxRef.current]);
      if (targetChord) {
        const acc = freqMatchesChord([freq, freq * 2, freq * 3], targetChord);
        setAccuracy(acc);
        setFeedback(acc > 55 ? 'correct' : acc > 25 ? 'partial' : null);
        accuracyHistRef.current[targetChord.id] = acc;
      }
    }
    rafRef.current = requestAnimationFrame(detectPitch);
  }, [selectedChords]);

  const startSession = async () => {
    if (selectedChords.length < 2) return;
    setPhase('playing');
    setCurrentIdx(0);
    currentIdxRef.current = 0;
    setElapsed(0);
    setSwitchCount(0);
    accuracyHistRef.current = {};
    startTimeRef.current = Date.now();

    // Mic setup
    if (enableMic) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioRef.current = stream;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;
        audioCtx.createMediaStreamSource(stream).connect(analyser);
        rafRef.current = requestAnimationFrame(detectPitch);
      } catch {}
    }

    // Timers
    timerRef.current = setInterval(() => setElapsed(Math.round((Date.now() - startTimeRef.current) / 1000)), 1000);

    let beat = 0;
    metroRef.current = setInterval(() => {
      setBeat(b => !b);
      playMetronomeClick(beat % 4 === 0);
      beat++;
    }, (60 / bpm) * 1000);

    // Chord switch with countdown
    let cdVal = intervalSec;
    setCountdown(cdVal);
    countdownRef.current = setInterval(() => {
      cdVal--;
      if (cdVal <= 0) {
        cdVal = intervalSec;
        setCurrentIdx(i => {
          const next = (i + 1) % selectedChords.length;
          currentIdxRef.current = next;
          return next;
        });
        setSwitchCount(c => c + 1);
        setAccuracy(null);
        setFeedback(null);
      }
      setCountdown(cdVal);
    }, 1000);
  };

  const endSession = async () => {
    stopAll();
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    setElapsed(duration);
    setChordAccuracies({ ...accuracyHistRef.current });
    setPhase('summary');
    if (currentUser) {
      const avgAcc = Object.values(accuracyHistRef.current);
      const perfect = avgAcc.length > 0 && avgAcc.every(a => a >= 70);
      const result = await logPracticeSession(currentUser.uid, {
        chords: selectedChords, duration, switchCount,
        chordAccuracy: accuracyHistRef.current, perfect,
      });
      await refreshProfile();
      if (result?.xpResult) setXpToast({ xp: result.xpResult.xpGained, message: 'Session complete!' });
    }
  };

  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const currentChord = CHORDS.find(c => c.id === selectedChords[currentIdx]);

  // ── SETUP ──────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div>
        <h1 className="page-title">Practice Mode</h1>
        <p className="page-subtitle">Select chords, configure your session, and start playing.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <div className="card">
            <h2 className="section-title">Select Chords (2–4)</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {CHORDS.map(chord => (
                <button key={chord.id}
                  className={`btn ${selectedChords.includes(chord.id) ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setSelectedChords(prev => prev.includes(chord.id) ? prev.filter(c => c !== chord.id) : prev.length < 4 ? [...prev, chord.id] : prev)}
                  style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic' }}
                >
                  {chord.id}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
              {selectedChords.length < 2 ? `Select ${2 - selectedChords.length} more chord${selectedChords.length === 1 ? '' : 's'}` : `✓ ${selectedChords.join(' → ')}`}
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Session Settings</h2>
            <div className="form-group">
              <label className="form-label">Switch Every: {intervalSec}s</label>
              <input type="range" min={2} max={16} value={intervalSec}
                onChange={e => setIntervalSec(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Metronome</label>
              <Metronome bpm={bpm} setBpm={setBpm} active={false} beat={false} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'var(--bg-2)', borderRadius: 10, marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}>
                <div style={{
                  width: 40, height: 22, borderRadius: 11, background: enableMic ? 'var(--accent)' : 'var(--bg-3)',
                  position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0,
                }} onClick={() => setEnableMic(m => !m)}>
                  <div style={{
                    position: 'absolute', top: 2, left: enableMic ? 20 : 2, width: 18, height: 18,
                    borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
                  }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>🎤 Chord Detection</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Use microphone to detect your playing accuracy</div>
                </div>
              </label>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={startSession} disabled={selectedChords.length < 2}>
              ▶ Start Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────
  if (phase === 'playing') {
    const feedbackColor = feedback === 'correct' ? 'var(--green)' : feedback === 'partial' ? 'var(--gold)' : 'var(--accent)';

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 className="page-title" style={{ margin: 0 }}>Practicing</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--gold)' }}>{fmt(elapsed)}</div>
            <button className="btn btn-ghost" onClick={endSession}>End Session</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
          {/* Main chord display */}
          <div className="card" style={{ textAlign: 'center', gridColumn: 'span 1' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Play this chord
            </div>
            <div className="chord-prompt" key={currentIdx} style={{ color: feedbackColor, fontSize: 80, padding: '30px 0' }}>
              {selectedChords[currentIdx]}
            </div>
            {currentChord && <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 12 }}>{currentChord.name}</div>}

            {/* Countdown ring */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `conic-gradient(var(--accent) ${(countdown / intervalSec) * 360}deg, var(--bg-3) 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.3s',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--text-1)' }}>{countdown}</span>
                </div>
              </div>
            </div>

            {enableMic && (
              <div style={{ padding: '8px 16px', background: 'var(--bg-2)', borderRadius: 10, marginBottom: 8 }}>
                {accuracy !== null ? (
                  <div style={{ color: feedbackColor, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                    {feedback === 'correct' ? '✓ Sounds right!' : feedback === 'partial' ? '≈ Getting closer' : '× Try again'} — {accuracy}%
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-3)', fontSize: 13 }}>🎤 Listening for your chord...</div>
                )}
              </div>
            )}

            <button className="btn btn-ghost btn-sm" onClick={() => playChordSound(selectedChords[currentIdx])}>
              🔊 Hear Reference
            </button>
          </div>

          {/* Chord diagram */}
          {currentChord && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Fingering</div>
              <div className="chord-svg-wrap">
                <ChordDiagram chord={currentChord} size={1.1} />
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-2)', textAlign: 'center' }}>{currentChord.tips}</div>
            </div>
          )}
        </div>

        {/* Queue & Metronome */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            {selectedChords.map((id, i) => (
              <div key={id} style={{
                padding: '8px 20px', borderRadius: 10,
                fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic',
                background: i === currentIdx ? 'var(--accent-dim)' : 'var(--bg-2)',
                color: i === currentIdx ? 'var(--accent)' : 'var(--text-3)',
                border: `1px solid ${i === currentIdx ? 'var(--border-accent)' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}>{id}</div>
            ))}
          </div>
          <Metronome bpm={bpm} setBpm={setBpm} active={true} beat={beat} />
        </div>
      </div>
    );
  }

  // ── SUMMARY ────────────────────────────────────────────────────────
  if (phase === 'summary') {
    const accVals = Object.values(chordAccuracies);
    const avgAcc = accVals.length ? Math.round(accVals.reduce((a, b) => a + b, 0) / accVals.length) : null;

    return (
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎸</div>
        <h1 className="page-title">Session Complete!</h1>
        <p className="page-subtitle">Great work. Every rep builds muscle memory.</p>

        <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
            {[
              { v: fmt(elapsed), l: 'Time', c: 'var(--gold)' },
              { v: switchCount, l: 'Switches', c: 'var(--accent)' },
              { v: selectedChords.length, l: 'Chords', c: 'var(--green)' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div className="stat-value" style={{ color: s.c, fontSize: 28 }}>{s.v}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>

          {enableMic && Object.keys(chordAccuracies).length > 0 && (
            <>
              <div className="divider" />
              <div style={{ marginBottom: 8, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Chord Accuracy</div>
              {Object.entries(chordAccuracies).map(([chord, acc]) => (
                <div key={chord} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 18, width: 40, flexShrink: 0 }}>{chord}</div>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${acc}%`, background: acc >= 70 ? 'var(--green)' : acc >= 40 ? 'var(--gold)' : 'var(--red)' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, width: 36, color: acc >= 70 ? 'var(--green)' : acc >= 40 ? 'var(--gold)' : 'var(--red)' }}>{acc}%</div>
                </div>
              ))}
              {avgAcc !== null && (
                <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--text-2)', fontSize: 13 }}>
                  Average accuracy: <strong style={{ color: 'var(--accent)' }}>{avgAcc}%</strong>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => { setPhase('setup'); setAccuracy(null); setFeedback(null); }}>
            Practice Again
          </button>
        </div>

        {xpToast && <XPToast {...xpToast} onDone={() => setXpToast(null)} />}
      </div>
    );
  }
}
