// src/pages/Dashboard.jsx - V2
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { CHORDS, SONGS, ACHIEVEMENTS } from '../data/chords';
import { getLevelFromXP, getSmartRecommendations } from '../services/userService';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const knownChords = userProfile?.knownChords || [];
  const practiceHistory = userProfile?.practiceHistory || [];
  const totalMin = Math.round((userProfile?.totalPracticeTime || 0) / 60);
  const streak = userProfile?.practiceStreak || 0;
  const songsCompleted = userProfile?.songsCompleted || [];
  const xp = userProfile?.xp || 0;
  const earned = userProfile?.achievements || [];
  const focusAreas = userProfile?.focusAreas || [];

  const levelInfo = getLevelFromXP(xp);
  const progressPct = Math.round((knownChords.length / CHORDS.length) * 100);
  const recommended = getSmartRecommendations(userProfile, SONGS).slice(0, 3);
  const recentAchievements = earned.slice(-3).map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
  const recentSessions = [...practiceHistory].reverse().slice(0, 3);

  // Today's challenge
  const dayIdx = Math.floor(Date.now() / 86400000) % 7;
  const challengeDescs = ['Practice C → G 20 times', 'Play for 10 minutes straight', 'Learn a new chord', 'Practice Am → E 15 times', 'Complete a song', 'Practice 3 chords for 5 min', 'Try a barre chord'];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="page-title">Hey, {userProfile?.username || 'Guitarist'} 👋</h1>
            <p style={{ color: 'var(--text-2)', marginBottom: 8 }}>
              {streak > 0 ? `🔥 ${streak}-day streak — you're on fire!` : 'Ready to practice today?'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700, border: '1px solid var(--border-accent)' }}>
                ⭐ Level {levelInfo.level} · {levelInfo.name}
              </span>
              <span style={{ color: 'var(--text-3)', fontSize: 12 }}>{xp.toLocaleString()} XP</span>
            </div>
          </div>
          <Link to="/practice" className="btn btn-primary btn-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5,3 19,12 5,21"/></svg>
            Start Practicing
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { v: streak, l: 'Day Streak', c: 'var(--gold)', e: '🔥' },
          { v: knownChords.length, l: 'Chords', c: 'var(--accent)', e: '🎸' },
          { v: songsCompleted.length, l: 'Songs Done', c: 'var(--green)', e: '🎵' },
          { v: `${totalMin}m`, l: 'Practiced', c: 'var(--text-1)', e: '⏱' },
          { v: xp, l: 'Total XP', c: 'var(--gold)', e: '⭐' },
        ].map(s => (
          <div className="stat-card" key={s.l}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>{s.e}</div>
            <div className="stat-value" style={{ color: s.c, fontSize: 24 }}>{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Daily challenge */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--surface), rgba(240,192,96,0.04))', borderColor: 'rgba(240,192,96,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🎯</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: 2 }}>Daily Challenge</div>
            <div style={{ color: 'var(--text-2)', fontSize: 13 }}>{challengeDescs[dayIdx]}</div>
          </div>
          <Link to="/gamification" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
        {/* Chord progress */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Chord Progress</h2>
            <Link to="/chords" className="btn btn-ghost btn-sm">All →</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', minWidth: 36 }}>{progressPct}%</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CHORDS.slice(0, 12).map(c => (
              <div key={c.id} style={{
                padding: '2px 10px', borderRadius: 16, fontSize: 12,
                fontFamily: 'var(--font-display)', fontWeight: 700,
                background: knownChords.includes(c.id) ? 'var(--green-dim)' : 'var(--bg-2)',
                color: knownChords.includes(c.id) ? 'var(--green)' : 'var(--text-3)',
                border: `1px solid ${knownChords.includes(c.id) ? 'var(--green)' : 'var(--border)'}`,
              }}>
                {c.id} {knownChords.includes(c.id) && '✓'}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 className="section-title" style={{ margin: 0 }}>Ready to Play</h2>
            <Link to="/songs" className="btn btn-ghost btn-sm">All →</Link>
          </div>
          {recommended.length === 0 ? (
            <div style={{ color: 'var(--text-3)', fontSize: 13 }}>
              Learn a few chords to get song recommendations!
              <br /><Link to="/chords" style={{ color: 'var(--accent)' }}>Browse chords →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recommended.map(song => (
                <Link to="/songs" key={song.id} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{song.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{song.artist} · {song.chords.join(', ')}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Focus areas */}
        {focusAreas.length > 0 && (
          <div className="card" style={{ borderColor: 'rgba(255,107,122,0.25)' }}>
            <h2 className="section-title" style={{ color: 'var(--red)' }}>⚠️ Focus Areas</h2>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>These chords need more practice based on your sessions:</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {focusAreas.map(c => (
                <Link key={c} to="/practice" style={{
                  padding: '6px 16px', borderRadius: 8, background: 'var(--red-dim)', color: 'var(--red)',
                  border: '1px solid rgba(255,107,122,0.3)', fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic',
                  textDecoration: 'none', transition: 'background 0.2s',
                }}>{c}</Link>
              ))}
            </div>
            <Link to="/practice" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>Practice these →</Link>
          </div>
        )}

        {/* Recent achievements */}
        {recentAchievements.length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 className="section-title" style={{ margin: 0 }}>Recent Badges</h2>
              <Link to="/gamification" className="btn btn-ghost btn-sm">All →</Link>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {recentAchievements.map(a => (
                <div key={a.id} style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-2)', borderRadius: 12, flex: 1, border: '1px solid var(--gold-dim)' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{a.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11 }}>{a.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent sessions */}
        <div className="card">
          <h2 className="section-title">Recent Sessions</h2>
          {recentSessions.length === 0 ? (
            <div style={{ color: 'var(--text-3)', fontSize: 13 }}>
              No sessions yet. <Link to="/practice" style={{ color: 'var(--accent)' }}>Start one →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentSessions.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>Practice</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.chords?.join(', ')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{Math.round((s.duration || 0) / 60)}m</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{new Date(s.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h2 className="section-title">Quick Start</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link to="/tuner" className="btn btn-secondary">🎵 Tune Guitar</Link>
          <Link to="/chords" className="btn btn-secondary">📖 Learn Chords</Link>
          <Link to="/strumming" className="btn btn-secondary">🤘 Strumming</Link>
          <Link to="/songs" className="btn btn-secondary">🎶 Songs</Link>
          <Link to="/recording" className="btn btn-secondary">🎙 Record</Link>
          <Link to="/planner" className="btn btn-secondary">📅 Plan Session</Link>
        </div>
      </div>
    </div>
  );
}
