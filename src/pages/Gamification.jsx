// src/pages/Gamification.jsx - V2
import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { ACHIEVEMENTS, LEVELS, DAILY_CHALLENGES, XP_ACTIONS } from '../data/chords';
import { getLevelFromXP } from '../services/userService';

export default function Gamification() {
  const { userProfile } = useAuth();
  const [tab, setTab] = useState('achievements');

  const xp = userProfile?.xp || 0;
  const earned = userProfile?.achievements || [];
  const streak = userProfile?.practiceStreak || 0;
  const levelInfo = getLevelFromXP(xp);
  const nextLevel = LEVELS.find(l => l.level === levelInfo.level + 1);
  const xpInLevel = xp - levelInfo.minXP;
  const xpForNext = nextLevel ? nextLevel.minXP - levelInfo.minXP : 1;
  const pct = nextLevel ? Math.round((xpInLevel / xpForNext) * 100) : 100;

  // Today's challenge (deterministic by day)
  const dayIdx = Math.floor(Date.now() / 86400000) % DAILY_CHALLENGES.length;
  const todayChallenge = DAILY_CHALLENGES[dayIdx];

  return (
    <div>
      <h1 className="page-title">Achievements & XP</h1>
      <p className="page-subtitle">Level up, earn badges, complete daily challenges.</p>

      {/* Level card */}
      <div className="card" style={{
        marginBottom: 28,
        background: 'linear-gradient(135deg, var(--surface), var(--bg-2))',
        border: '1px solid var(--border-accent)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'var(--accent-dim)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', position: 'relative' }}>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{levelInfo.level}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Level</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{levelInfo.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>{xp.toLocaleString()} total XP</div>
            <div className="progress-bar" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
              <span>{xpInLevel} XP earned</span>
              {nextLevel ? <span>{nextLevel.minXP - xp} XP to Level {levelInfo.level + 1} · {nextLevel.name}</span> : <span>🏆 Maximum Level!</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { v: streak, l: 'Day Streak', e: '🔥', c: 'var(--gold)' },
          { v: earned.length, l: 'Badges Earned', e: '🏅', c: 'var(--accent)' },
          { v: `${pct}%`, l: 'Level Progress', e: '⬆️', c: 'var(--green)' },
          { v: xp, l: 'Total XP', e: '⭐', c: 'var(--text-1)' },
        ].map(s => (
          <div className="stat-card" key={s.l}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.e}</div>
            <div className="stat-value" style={{ color: s.c, fontSize: 26 }}>{s.v}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Daily Challenge */}
      <div className="card" style={{ marginBottom: 24, borderColor: 'var(--gold-dim)', background: 'linear-gradient(135deg, var(--surface), rgba(240,192,96,0.03))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>🎯</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>Daily Challenge</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Resets at midnight · {todayChallenge.xp} XP reward</div>
          </div>
          <span className="badge badge-gold" style={{ marginLeft: 'auto' }}>+{todayChallenge.xp} XP</span>
        </div>
        <div style={{ fontSize: 15, color: 'var(--text-1)', marginBottom: 12, fontFamily: 'var(--font-display)', fontWeight: 600 }}>
          {todayChallenge.desc}
        </div>
        {todayChallenge.chords?.length > 0 && (
          <div style={{ display: 'flex', gap: 6 }}>
            {todayChallenge.chords.map(c => (
              <span key={c} style={{ padding: '3px 10px', borderRadius: 6, background: 'var(--gold-dim)', color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, border: '1px solid rgba(240,192,96,0.3)' }}>{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['achievements', '🏅 Achievements'], ['levels', '📊 All Levels'], ['xp', '⭐ XP Guide']].map(([k, l]) => (
          <button key={k} className={`btn btn-sm ${tab === k ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'achievements' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {ACHIEVEMENTS.map(a => {
            const done = earned.includes(a.id);
            return (
              <div key={a.id} style={{
                padding: '16px 18px', borderRadius: 14,
                background: done ? 'var(--surface)' : 'var(--bg-1)',
                border: `1px solid ${done ? 'var(--gold)' : 'var(--border)'}`,
                opacity: done ? 1 : 0.5,
                transition: 'all 0.2s',
                display: 'flex', gap: 14, alignItems: 'center',
              }}>
                <div style={{ fontSize: 32, filter: done ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{a.desc}</div>
                  <div style={{ fontSize: 11, color: done ? 'var(--gold)' : 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                    {done ? `✓ Earned · +${a.xp} XP` : `+${a.xp} XP`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'levels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LEVELS.map(l => {
            const isCurrentLevel = l.level === levelInfo.level;
            const isPast = l.level < levelInfo.level;
            return (
              <div key={l.level} style={{
                padding: '14px 18px', borderRadius: 12,
                background: isCurrentLevel ? 'var(--accent-dim)' : 'var(--surface)',
                border: `1px solid ${isCurrentLevel ? 'var(--border-accent)' : isPast ? 'var(--green)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: isCurrentLevel ? 'var(--accent)' : isPast ? 'var(--green)' : 'var(--text-3)', width: 32 }}>
                  {l.level}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{l.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{l.minXP.toLocaleString()} – {l.maxXP === Infinity ? '∞' : l.maxXP.toLocaleString()} XP</div>
                </div>
                {isPast && <span className="badge badge-green">✓ Completed</span>}
                {isCurrentLevel && <span className="badge badge-accent">← You are here</span>}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'xp' && (
        <div className="card">
          <h2 className="section-title">How to Earn XP</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(XP_ACTIONS).map(([action, pts]) => (
              <div key={action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 10 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>
                  {action.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                </div>
                <span className="badge badge-gold">+{pts} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
