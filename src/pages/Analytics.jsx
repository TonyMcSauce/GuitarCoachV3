// src/pages/Analytics.jsx - V2
import React from 'react';
import { useAuth } from '../services/AuthContext';
import { CHORDS } from '../data/chords';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, LineChart, Line } from 'recharts';

const T = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
    {payload.map((p, i) => <div key={i} style={{ color: p.color || 'var(--accent)', fontSize: 13 }}>{p.value} {p.name}</div>)}
  </div>
) : null;

export default function Analytics() {
  const { userProfile } = useAuth();

  const history = userProfile?.practiceHistory || [];
  const knownChords = userProfile?.knownChords || [];
  const chordAcc = userProfile?.chordAccuracy || {};
  const focusAreas = userProfile?.focusAreas || [];
  const totalSec = userProfile?.totalPracticeTime || 0;
  const streak = userProfile?.practiceStreak || 0;

  // Last 14 days chart
  const dayData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const label = d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    const sessions = history.filter(s => new Date(s.date).toDateString() === d.toDateString());
    const minutes = sessions.reduce((a, s) => a + Math.round((s.duration || 0) / 60), 0);
    const switches = sessions.reduce((a, s) => a + (s.switchCount || 0), 0);
    return { day: label, minutes, switches };
  });

  // Chord accuracy radar (known chords only)
  const radarData = CHORDS.filter(c => knownChords.includes(c.id)).map(c => ({
    chord: c.id,
    accuracy: chordAcc[c.id] || (knownChords.includes(c.id) ? 70 : 0),
    fullMark: 100,
  })).slice(0, 8);

  // Most practiced chords
  const chordPracticeCount = {};
  history.forEach(s => (s.chords || []).forEach(c => { chordPracticeCount[c] = (chordPracticeCount[c] || 0) + 1; }));
  const topChords = Object.entries(chordPracticeCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([chord, count]) => ({ chord, count }));

  // Rhythm/switch speed from history
  const speedData = history.slice(-10).map((s, i) => ({
    session: `S${i + 1}`,
    switches: s.switchCount || 0,
    minutes: Math.round((s.duration || 0) / 60),
    speed: s.switchCount && s.duration ? Math.round(s.switchCount / (s.duration / 60)) : 0,
  }));

  const weakest = Object.entries(chordAcc).sort((a, b) => a[1] - b[1]).slice(0, 3);
  const strongest = Object.entries(chordAcc).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const avgAccuracy = Object.values(chordAcc).length ? Math.round(Object.values(chordAcc).reduce((a, b) => a + b, 0) / Object.values(chordAcc).length) : null;

  return (
    <div>
      <h1 className="page-title">Performance Analytics</h1>
      <p className="page-subtitle">Deep insights into your playing patterns and progress.</p>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { v: `${Math.round(totalSec / 60)}m`, l: 'Total Practice', e: '⏱', c: 'var(--text-1)' },
          { v: history.length, l: 'Sessions', e: '📅', c: 'var(--accent)' },
          { v: streak, l: 'Day Streak', e: '🔥', c: 'var(--gold)' },
          { v: avgAccuracy !== null ? `${avgAccuracy}%` : 'N/A', l: 'Avg Accuracy', e: '🎯', c: 'var(--green)' },
          { v: knownChords.length, l: 'Chords Learned', e: '🎸', c: 'var(--accent)' },
        ].map(s => (
          <div className="stat-card" key={s.l}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{s.e}</div>
            <div className="stat-value" style={{ color: s.c, fontSize: 26 }}>{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Weak/Strong chords */}
      {(weakest.length > 0 || focusAreas.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div className="card" style={{ borderColor: 'rgba(255,107,122,0.3)' }}>
            <h2 className="section-title" style={{ color: 'var(--red)' }}>⚠️ Focus Areas</h2>
            {(focusAreas.length > 0 ? focusAreas : weakest.map(([c]) => c)).map(chord => (
              <div key={chord} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-2)', borderRadius: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20 }}>{chord}</span>
                {chordAcc[chord] !== undefined && (
                  <span style={{ fontSize: 12, color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{chordAcc[chord]}% accuracy</span>
                )}
              </div>
            ))}
          </div>
          {strongest.length > 0 && (
            <div className="card" style={{ borderColor: 'rgba(96,212,160,0.3)' }}>
              <h2 className="section-title" style={{ color: 'var(--green)' }}>⭐ Strongest Chords</h2>
              {strongest.map(([chord, acc]) => (
                <div key={chord} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-2)', borderRadius: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20 }}>{chord}</span>
                  <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{acc}% accuracy</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Practice minutes chart */}
        <div className="card">
          <h2 className="section-title">Minutes Practiced (14 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dayData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-3)', fontSize: 9, fontFamily: 'var(--font-display)' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<T />} cursor={{ fill: 'rgba(162,120,255,0.05)' }} />
              <Bar dataKey="minutes" name="min" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chord accuracy radar */}
        {radarData.length >= 3 && (
          <div className="card">
            <h2 className="section-title">Chord Accuracy Radar</h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="chord" tick={{ fill: 'var(--text-2)', fontSize: 11, fontFamily: 'var(--font-display)' }} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Switch speed per session */}
        {speedData.length > 1 && (
          <div className="card">
            <h2 className="section-title">Switches Per Session</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={speedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="session" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<T />} />
                <Line type="monotone" dataKey="switches" stroke="var(--gold)" strokeWidth={2} dot={{ fill: 'var(--gold)', r: 4 }} name="switches" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Most practiced */}
        {topChords.length > 0 && (
          <div className="card">
            <h2 className="section-title">Most Practiced Chords</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topChords} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="chord" tick={{ fill: 'var(--text-2)', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<T />} cursor={{ fill: 'rgba(162,120,255,0.05)' }} />
                <Bar dataKey="count" name="sessions" fill="var(--green)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Chord accuracy list */}
      {Object.keys(chordAcc).length > 0 && (
        <div className="card">
          <h2 className="section-title">Chord Accuracy Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(chordAcc).sort((a, b) => b[1] - a[1]).map(([chord, acc]) => (
              <div key={chord} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, width: 40, flexShrink: 0 }}>{chord}</div>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${acc}%`, background: acc >= 70 ? 'var(--green)' : acc >= 40 ? 'var(--gold)' : 'var(--red)' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, width: 40, textAlign: 'right', color: acc >= 70 ? 'var(--green)' : acc >= 40 ? 'var(--gold)' : 'var(--red)' }}>{acc}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>
          Complete some practice sessions to see your analytics here!
        </div>
      )}
    </div>
  );
}
