// src/pages/RecordingStudio.jsx - V2
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { saveRecording } from '../services/userService';
import { XPToast } from '../components/XPToast';

export default function RecordingStudio() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [status, setStatus] = useState('idle'); // idle | recording | stopped
  const [recordings, setRecordings] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [xpToast, setXpToast] = useState(null);
  const [recordingName, setRecordingName] = useState('');

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const waveRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const savedRecordings = userProfile?.recordingHistory || [];

  useEffect(() => () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(data);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#a278ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sliceW = canvas.width / data.length;
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceW;
    }
    ctx.stroke();
    rafRef.current = requestAnimationFrame(drawWaveform);
  };

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      waveRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      audioCtx.createMediaStreamSource(stream).connect(analyser);

      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordings(prev => [...prev, { url, blob, date: new Date().toISOString(), duration: elapsed, name: recordingName || `Recording ${prev.length + 1}` }]);
        setStatus('stopped');
      };
      mr.start();
      setStatus('recording');
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      drawWaveform();
    } catch {
      setError('Microphone access denied. Please allow mic access.');
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    if (mediaRef.current?.state !== 'inactive') mediaRef.current?.stop();
    waveRef.current?.getTracks().forEach(t => t.stop());
  };

  const saveToProfile = async (rec) => {
    if (!currentUser) return;
    const result = await saveRecording(currentUser.uid, { name: rec.name, duration: rec.duration });
    await refreshProfile();
    setXpToast({ xp: result.xpGained, message: 'Recording saved!' });
  };

  const deleteLocal = (i) => setRecordings(prev => prev.filter((_, idx) => idx !== i));

  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div>
      <h1 className="page-title">Recording Studio</h1>
      <p className="page-subtitle">Record your practice, play it back, and track your improvement.</p>

      {/* Recorder */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="section-title">New Recording</h2>

        {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}

        {status === 'idle' && (
          <div>
            <div className="form-group">
              <label className="form-label">Recording Name (optional)</label>
              <input className="form-input" placeholder="e.g. G to D practice" value={recordingName} onChange={e => setRecordingName(e.target.value)} style={{ maxWidth: 300 }} />
            </div>
            <button className="btn btn-primary btn-lg" onClick={startRecording}>
              🎙 Start Recording
            </button>
          </div>
        )}

        {status === 'recording' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--red)', animation: 'pulse 1s infinite' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--red)' }}>{fmt(elapsed)}</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Recording...</div>
            </div>
            <canvas ref={canvasRef} width={500} height={60} style={{ width: '100%', maxWidth: 500, height: 60, background: 'var(--bg-2)', borderRadius: 8, marginBottom: 16, display: 'block' }} />
            <button className="btn btn-ghost" onClick={stopRecording}>⏹ Stop Recording</button>
          </div>
        )}

        {status === 'stopped' && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => { setStatus('idle'); setRecordingName(''); }}>+ New Recording</button>
          </div>
        )}
      </div>

      {/* Local recordings */}
      {recordings.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 className="section-title">This Session</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recordings.map((rec, i) => (
              <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-2)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{rec.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{fmt(rec.duration)} · {new Date(rec.date).toLocaleTimeString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-success btn-sm" onClick={() => saveToProfile(rec)}>💾 Save +75 XP</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => deleteLocal(i)}>🗑</button>
                  </div>
                </div>
                <audio controls src={rec.url} style={{ width: '100%', height: 36 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved recordings from profile */}
      {savedRecordings.length > 0 && (
        <div className="card">
          <h2 className="section-title">Saved Recordings ({savedRecordings.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...savedRecordings].reverse().map((rec, i) => (
              <div key={i} style={{ padding: '12px 16px', background: 'var(--bg-2)', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>{rec.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{fmt(rec.duration || 0)} · {new Date(rec.date).toLocaleDateString()}</div>
                </div>
                <span className="badge badge-green">✓ Saved</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-3)' }}>
            Note: Audio files are stored locally in your browser session. Only metadata (name, duration) is saved to your profile.
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
      {xpToast && <XPToast {...xpToast} onDone={() => setXpToast(null)} />}
    </div>
  );
}
