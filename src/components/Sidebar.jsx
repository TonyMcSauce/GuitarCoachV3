// src/components/Sidebar.jsx - V2
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { getLevelFromXP } from '../services/userService';
import { LEVELS } from '../data/chords';

const I = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  tuner: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="9"/></svg>,
  chords: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="3" x2="8" y2="21"/><line x1="14" y1="3" x2="14" y2="21"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="2" y1="15" x2="22" y2="15"/></svg>,
  practice: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5,3 19,12 5,21"/></svg>,
  strum: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  songs: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  progress: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  trophy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  analytics: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  planner: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  recording: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const NavItem = ({ to, icon, label, exact }) => (
  <NavLink to={to} end={exact} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
    <span style={{ width: 18, height: 18, flexShrink: 0, display: 'flex' }}>{I[icon]}</span>
    {label}
  </NavLink>
);

export default function Sidebar() {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const xp = userProfile?.xp || 0;
  const levelInfo = getLevelFromXP(xp);
  const nextLevel = LEVELS.find(l => l.level === levelInfo.level + 1);
  const xpInLevel = xp - levelInfo.minXP;
  const xpForNext = nextLevel ? nextLevel.minXP - levelInfo.minXP : 1;
  const pct = nextLevel ? Math.round((xpInLevel / xpForNext) * 100) : 100;

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="url(#sg)" strokeWidth="2"/>
          <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a278ff"/><stop offset="100%" stopColor="#f0c060"/></linearGradient></defs>
        </svg>
        <span>GuitarCoach</span>
        <span style={{ marginLeft: 'auto', background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>V2</span>
      </div>

      <div className="sidebar-section">Main</div>
      <NavItem to="/" icon="dashboard" label="Dashboard" exact />
      <NavItem to="/tuner" icon="tuner" label="Tuner" />
      <NavItem to="/chords" icon="chords" label="Chord Library" />

      <div className="sidebar-section">Practice</div>
      <NavItem to="/practice" icon="practice" label="Practice Mode" />
      <NavItem to="/strumming" icon="strum" label="Strumming" />
      <NavItem to="/songs" icon="songs" label="Songs" />
      <NavItem to="/planner" icon="planner" label="Practice Planner" />
      <NavItem to="/recording" icon="recording" label="Recording Studio" />

      <div className="sidebar-section">Progress</div>
      <NavItem to="/progress" icon="progress" label="Progress" />
      <NavItem to="/analytics" icon="analytics" label="Analytics" />
      <NavItem to="/gamification" icon="trophy" label="Achievements" />

      <div className="sidebar-bottom">
        {/* XP bar */}
        <div style={{ padding: '10px 12px', marginBottom: 8, background: 'var(--bg-2)', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Lv.{levelInfo.level} {levelInfo.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{xp} XP</div>
          </div>
          <div className="progress-bar" style={{ height: 4 }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3 }}>
            {nextLevel ? `${nextLevel.minXP - xp} XP to Level ${levelInfo.level + 1}` : 'MAX LEVEL 🏆'}
          </div>
        </div>

        <div style={{ padding: '6px 12px', marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 1 }}>Signed in as</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{userProfile?.username || 'Guitarist'}</div>
        </div>
        <button className="nav-item btn-ghost" onClick={async () => { await logout(); navigate('/login'); }} style={{ width: '100%' }}>
          <span style={{ width: 18, height: 18 }}>{I.logout}</span> Log Out
        </button>
      </div>
    </nav>
  );
}
