// src/pages/AuthPage.jsx - V2
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

function PasswordInput({ value, onChange, placeholder, label }) {
  const [show, setShow] = useState(false);
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="form-input"
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          style={{ paddingRight: 44 }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: show ? 'var(--accent)' : 'var(--text-3)',
            display: 'flex', alignItems: 'center', padding: 0,
            transition: 'color 0.2s',
          }}
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'var(--red)', 'var(--gold)', 'var(--accent)', 'var(--green)'];
  return (
    <div style={{ marginTop: -12, marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= strength ? colors[strength] : 'var(--bg-3)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: colors[strength], fontFamily: 'var(--font-display)', fontWeight: 600 }}>
        {labels[strength]}
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(email, password, username);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('email-already-in-use')) setError('That email is already registered. Try logging in.');
      else if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) setError('Invalid email or password.');
      else if (msg.includes('too-many-requests')) setError('Too many attempts. Please wait a moment.');
      else setError(msg.replace('Firebase: ', '').replace(/\(.*\)/, '') || 'Something went wrong.');
    }
    setLoading(false);
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 25% 35%, rgba(162,120,255,0.12) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(240,192,96,0.07) 0%, transparent 50%)',
      }} />

      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="auth-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="url(#ag)" strokeWidth="2"/>
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a278ff"/>
                <stop offset="100%" stopColor="#f0c060"/>
              </linearGradient>
            </defs>
          </svg>
          GuitarCoach
        </div>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            {mode === 'login' ? 'Welcome back 👋' : 'Start your journey 🎸'}
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 13 }}>
            {mode === 'login' ? 'Pick up where you left off' : 'Create a free account to track your progress'}
          </p>
        </div>

        {error && (
          <div className="error-msg" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="Your guitarist name"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <PasswordInput
            label="Password"
            placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {mode === 'signup' && (
            <>
              <PasswordStrength password={password} />
              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && password !== confirmPassword && (
                <div style={{ fontSize: 12, color: 'var(--red)', marginTop: -12, marginBottom: 12 }}>
                  ✗ Passwords don't match
                </div>
              )}
              {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                <div style={{ fontSize: 12, color: 'var(--green)', marginTop: -12, marginBottom: 12 }}>
                  ✓ Passwords match
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: 8 }}
            disabled={loading || (mode === 'signup' && password !== confirmPassword && confirmPassword.length > 0)}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                Loading...
              </span>
            ) : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={switchMode}>
            {mode === 'login' ? 'Sign up free' : 'Log in'}
          </button>
        </div>

        {mode === 'login' && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Forgot your password? Contact support.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
