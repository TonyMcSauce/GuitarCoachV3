// src/pages/PracticePlanner.jsx - V2
import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { generatePracticePlan } from '../services/userService';
import { Link } from 'react-router-dom';

const typeColors = {
  warmup: { bg: 'var(--green-dim)', border: 'var(--green)', text: 'var(--green)', icon: '🔥' },
  focus: { bg: 'var(--red-dim)', border: 'rgba(255,107,122,0.4)', text: 'var(--red)', icon: '⚠️' },
  new: { bg: 'var(--accent-dim)', border: 'var(--border-accent)', text: 'var(--accent)', icon: '✨' },
  endurance: { bg: 'var(--gold-dim)', border: 'rgba(240,192,96,0.4)', text: 'var(--gold)', icon: '💪' },
};

export default function PracticePlanner() {
  const { userProfile } = useAuth();
  const [goalMin, setGoalMin] = useState(15);
  const [plan, setPlan] = useState(null);

  const known = userProfile?.knownChords || [];
  const focusAreas = userProfile?.focusAreas || [];
  const streak = userProfile?.practiceStreak || 0;

  const generatePlan = () => {
    const base = generatePracticePlan(userProfile);
    // Adjust durations to fit goal
    const totalBase = base.reduce((a, s) => a + s.duration, 0);
    const scale = (goalMin * 60) / (totalBase || 1);
    setPlan(base.map(s => ({ ...s, duration: Math.round(s.duration * scale) })));
  };

  const fmt = s => {
    if (s >= 60) return `${Math.floor(s / 60)}m ${s % 60 > 0 ? `${s % 60}s` : ''}`.trim();
    return `${s}s`;
  };

  return (
    <div>
      <h1 className="page-title">Practice Planner</h1>
      <p className="page-subtitle">Get a personalized practice plan based on your weak spots and goals.</p>

      {/* Context card */}
      <div className="card" style={{ marginBottom: 24, background: 'var(--accent-dim)', borderColor: 'var(--border-accent)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>📊 Your Current Status</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-2)' }}>
          <span>🎸 {known.length} chords learned</span>
          <span>🔥 {streak}-day streak</span>
          {focusAreas.length > 0 && <span>⚠️ Weak: {focusAreas.slice(0, 3).join(', ')}</span>}
        </div>
      </div>

      {/* Goal setter */}
      <div className="card" style={{ marginBottom: 24, maxWidth: 480 }}>
        <h2 className="section-title">Set Your Goal</h2>
        <div className="form-group">
          <label className="form-label">Session Length: {goalMin} minutes</label>
          <input type="range" min={5} max={60} step={5} value={goalMin}
            onChange={e => setGoalMin(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
            <span>5 min (Quick)</span><span>30 min (Standard)</span><span>60 min (Deep)</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={generatePlan}>
          🧠 Generate My Plan
        </button>
      </div>

      {/* Generated plan */}
      {plan && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Your {goalMin}-Minute Plan</h2>
            <button className="btn btn-ghost btn-sm" onClick={generatePlan}>↻ Regenerate</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {plan.map((step, i) => {
              const style = typeColors[step.type] || typeColors.warmup;
              return (
                <div key={i} style={{ padding: '18px 20px', borderRadius: 14, background: style.bg, border: `1px solid ${style.border}`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{style.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>{step.title}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: style.text, fontSize: 14 }}>
                        ⏱ {fmt(step.duration)}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10 }}>{step.desc}</div>
                    {step.chords?.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {step.chords.map(c => (
                          <span key={c} style={{ padding: '3px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.2)', color: style.text, fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic', border: `1px solid ${style.border}` }}>{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/practice" className="btn btn-primary btn-lg">
              ▶ Start Practice
            </Link>
            <div style={{ padding: '14px 20px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-2)' }}>
              Total: <strong style={{ color: 'var(--accent)' }}>{goalMin} min</strong> · {plan.length} segments
            </div>
          </div>
        </div>
      )}

      {!plan && (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
            No plan generated yet
          </div>
          <div style={{ fontSize: 13 }}>Set your goal above and click "Generate My Plan"</div>
        </div>
      )}
    </div>
  );
}
