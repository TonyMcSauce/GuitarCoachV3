// src/components/XPToast.jsx - V2
import React, { useEffect } from 'react';

export function XPToast({ xp, message, leveledUp, newLevel, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 10000,
      background: 'var(--surface)', border: '1px solid var(--gold)',
      borderRadius: 16, padding: '16px 22px',
      boxShadow: '0 8px 32px rgba(240,192,96,0.25)',
      animation: 'xpSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      minWidth: 220,
    }}>
      {leveledUp ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--gold)' }}>LEVEL UP!</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-1)', marginTop: 2 }}>Level {newLevel?.level} · {newLevel?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>+{xp} XP</div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>⭐</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--gold)', fontSize: 18 }}>+{xp} XP</div>
            {message && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{message}</div>}
          </div>
        </div>
      )}
      <style>{`@keyframes xpSlide { from { transform: translateY(20px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
