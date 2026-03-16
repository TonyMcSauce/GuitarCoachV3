// src/pages/Tuner.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

const NOTE_STRINGS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

function freqToNote(freq) {
  if (!freq || freq < 20) return null;
  const noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
  const rounded = Math.round(noteNum);
  const note = NOTE_STRINGS[(rounded % 12 + 12) % 12];
  const cents = (noteNum - rounded) * 100;
  return { note, cents, freq };
}

const GUITAR_STRINGS = [
  { name: 'E2', freq: 82.41, string: 6 },
  { name: 'A2', freq: 110.0, string: 5 },
  { name: 'D3', freq: 146.83, string: 4 },
  { name: 'G3', freq: 196.0, string: 3 },
  { name: 'B3', freq: 246.94, string: 2 },
  { name: 'E4', freq: 329.63, string: 1 },
];

function autocorrelate(buf, sampleRate) {
  let SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;
  let r1 = 0, r2 = SIZE - 1;
  for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < 0.2) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < 0.2) { r2 = SIZE - i; break; }
  buf = buf.slice(r1, r2);
  SIZE = buf.length;
  const c = new Float32Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE - i; j++)
      c[i] += buf[j] * buf[j + i];
  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }
  let T0 = maxpos;
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);
  return sampleRate / T0;
}

export default function Tuner() {
  const [listening, setListening] = useState(false);
  const [noteInfo, setNoteInfo] = useState(null);
  const [error, setError] = useState('');
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const detect = useCallback(() => {
    if (!analyserRef.current) return;
    const buf = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buf);
    const freq = autocorrelate(buf, audioCtxRef.current.sampleRate);
    if (freq !== -1) setNoteInfo(freqToNote(freq));
    rafRef.current = requestAnimationFrame(detect);
  }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      ctx.createMediaStreamSource(stream).connect(analyser);
      setListening(true);
      setError('');
      rafRef.current = requestAnimationFrame(detect);
    } catch {
      setError('Microphone access denied. Please allow mic access and try again.');
    }
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
    setListening(false);
    setNoteInfo(null);
  };

  useEffect(() => () => stop(), []);

  const cents = noteInfo?.cents || 0;
  const inTune = Math.abs(cents) < 8;
  const needlePos = Math.min(Math.max(50 + (cents / 50) * 40, 5), 95);

  const closestString = noteInfo
    ? GUITAR_STRINGS.reduce((best, s) =>
        Math.abs(s.freq - noteInfo.freq) < Math.abs(best.freq - noteInfo.freq) ? s : best
      , GUITAR_STRINGS[0])
    : null;

  return (
    <div>
      <h1 className="page-title">Guitar Tuner</h1>
      <p className="page-subtitle">Use your microphone to tune each string in real time.</p>

      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* String reference */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {GUITAR_STRINGS.map(s => (
            <div key={s.name} style={{
              padding: '6px 14px', borderRadius: 8, textAlign: 'center',
              background: closestString?.name === s.name && listening ? 'var(--accent-dim)' : 'var(--bg-2)',
              border: `1px solid ${closestString?.name === s.name && listening ? 'var(--accent)' : 'var(--border)'}`,
              transition: 'all 0.2s',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: closestString?.name === s.name && listening ? 'var(--accent)' : 'var(--text-1)' }}>
                {s.name.charAt(0)}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-3)' }}>String {s.string}</div>
            </div>
          ))}
        </div>

        {/* Note display */}
        <div className="tuner-display">
          <div className="tuner-note" style={{ color: noteInfo ? (inTune ? 'var(--green)' : cents < 0 ? 'var(--red)' : 'var(--gold)') : 'var(--text-3)' }}>
            {noteInfo?.note || '—'}
          </div>
          <div className="tuner-freq">
            {noteInfo ? `${noteInfo.freq.toFixed(1)} Hz` : 'Waiting for signal...'}
          </div>

          {/* Meter */}
          <div style={{ maxWidth: 360, margin: '28px auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
              <span>♭ Flat</span>
              <span style={{ color: inTune && noteInfo ? 'var(--green)' : 'var(--text-3)' }}>In Tune</span>
              <span>Sharp ♯</span>
            </div>
            <div style={{ height: 8, background: 'linear-gradient(90deg, var(--red), var(--green) 50%, var(--gold))', borderRadius: 4, opacity: 0.4 }} />
            <div style={{ position: 'relative', height: 20, marginTop: -14 }}>
              <div style={{
                position: 'absolute',
                left: `${noteInfo ? needlePos : 50}%`,
                top: 0,
                transform: 'translateX(-50%)',
                width: 16, height: 16, borderRadius: '50%',
                background: inTune && noteInfo ? 'var(--green)' : 'var(--accent)',
                boxShadow: `0 0 12px ${inTune && noteInfo ? 'rgba(96,212,160,0.6)' : 'var(--accent-glow)'}`,
                transition: 'left 0.1s ease, background 0.3s',
              }} />
            </div>
          </div>

          {noteInfo && (
            <div style={{ marginTop: 20, fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: inTune ? 'var(--green)' : cents < 0 ? 'var(--red)' : 'var(--gold)' }}>
              {inTune ? '✓ In Tune!' : cents < 0 ? `${Math.abs(cents.toFixed(0))}¢ Flat — tune up` : `${cents.toFixed(0)}¢ Sharp — tune down`}
            </div>
          )}
        </div>

        {error && <div className="error-msg" style={{ margin: '16px 0' }}>{error}</div>}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          {!listening ? (
            <button className="btn btn-primary btn-lg" onClick={start}>🎤 Start Tuning</button>
          ) : (
            <button className="btn btn-ghost btn-lg" onClick={stop}>⏹ Stop</button>
          )}
        </div>

        <div className="divider" />
        <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
          Standard EADGBE tuning · Click a string above for reference
        </div>
      </div>
    </div>
  );
}
