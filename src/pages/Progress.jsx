// src/pages/Progress.jsx - V2
import React from 'react';
import { useAuth } from '../services/AuthContext';
import { CHORDS, SONGS } from '../data/chords';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

const CT = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
    {payload.map((p, i) => <div key={i} style={{ color: p.color || 'var(--accent)', fontSize: 13 }}>{p.value} {p.name}</div>)}
  </div>
) : null;

export default function Progress() {
  const { userProfile } = useAuth();
  const knownChords = userProfile?.knownChords || [];
  const practiceHistory = userProfile?.practiceHistory || [];
  const totalSec = userProfile?.totalPracticeTime || 0;
  const streak = userProfile?.practiceStreak || 0;
  const songsCompleted = userProfile?.songsCompleted || [];
  const xp = userProfile?.xp || 0;
  const earned = userProfile?.achievements || [];

  const dayData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const sessions = practiceHistory.filter(s => new Date(s.date).toDateString() === d.toDateString());
    return { day: label, minutes: sessions.reduce((a, s) => a + Math.round((s.duration || 0) / 60), 0) };
  });

  return (
    <div>
      <h1 className="page-title">Progress</h1>
      <p className="page-subtitle">Your complete guitar learning journey at a glance.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { v: streak, l: 'Day Streak', e: '🔥', c: 'var(--gold)' },
          { v: `${knownChords.length}/${CHORDS.length}`, l: 'Chords', e: '🎸', c: 'var(--accent)' },
          { v: `${songsCompleted.length}/${SONGS.length}`, l: 'Songs', e: '🎵', c: 'var(--green)' },
          { v: `${Math.round(totalSec / 60)}m`, l: 'Practiced', e: '⏱', c: 'var(--text-1)' },
          { v: xp, l: 'Total XP', e: '⭐', c: 'var(--gold)' },
          { v: earned.length, l: 'Badges', e: '🏅', c: 'var(--accent)' },
        ].map(s => (
          <div className="stat-card" key={s.l}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{s.e}</div>
            <div className="stat-value" style={{ color: s.c, fontSize: 24 }}>{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 22, marginBottom: 24 }}>
        {/* Weekly chart */}
        <div className="card">
          <h2 className="section-title">This Week</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-3)', fontSize: 10, fontFamily: 'var(--font-display)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} cursor={{ fill: 'rgba(162,120,255,0.05)' }} />
              <Bar dataKey="minutes" name="min" fill="var(--accent)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          {practiceHistory.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 13, marginTop: 8 }}>
              Start practicing to see your chart. <Link to="/practice" style={{ color: 'var(--accent)' }}>Practice now →</Link>
            </div>
          )}
        </div>

        {/* Chord grid */}
        <div className="card">
          <h2 className="section-title">Chord Mastery ({Math.round((knownChords.length / CHORDS.length) * 100)}%)</h2>
          <div className="progress-bar" style={{ marginBottom: 14 }}>
            <div className="progress-fill" style={{ width: `${(knownChords.length / CHORDS.length) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CHORDS.map(c => (
              <div key={c.id} style={{
                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                background: knownChords.includes(c.id) ? 'var(--green-dim)' : 'var(--bg-2)',
                color: knownChords.includes(c.id) ? 'var(--green)' : 'var(--text-3)',
                border: `1px solid ${knownChords.includes(c.id) ? 'var(--green)' : 'var(--border)'}`,
                position: 'relative',
              }}>
                {c.id.length > 2 ? c.id.slice(0,2) : c.id}
                {knownChords.includes(c.id) && <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, borderRadius: '50%', background: 'var(--green)', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700 }}>✓</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card">
        <h2 className="section-title">Practice History</h2>
        {practiceHistory.length === 0 ? (
          <div style={{ color: 'var(--text-3)', fontSize: 13 }}>No sessions yet. <Link to="/practice" style={{ color: 'var(--accent)' }}>Start practicing →</Link></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...practiceHistory].reverse().slice(0, 10).map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-2)', borderRadius: 10, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>Practice Session</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.chords?.join(' · ')}</div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{Math.round((s.duration || 0) / 60)} min</div>
                  {s.switchCount && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.switchCount} switches</div>}
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{new Date(s.date).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
