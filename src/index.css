/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');

:root {
  --bg-0: #0a0a0f;
  --bg-1: #11111a;
  --bg-2: #18182a;
  --bg-3: #20203a;
  --surface: #1c1c2e;
  --surface-hover: #252540;
  --border: rgba(255,255,255,0.07);
  --border-accent: rgba(162, 120, 255, 0.3);

  --text-1: #f0eeff;
  --text-2: #b0a8d0;
  --text-3: #6b648a;

  --accent: #a278ff;
  --accent-glow: rgba(162, 120, 255, 0.35);
  --accent-dim: rgba(162, 120, 255, 0.12);
  --gold: #f0c060;
  --gold-dim: rgba(240, 192, 96, 0.15);
  --green: #60d4a0;
  --green-dim: rgba(96, 212, 160, 0.12);
  --red: #ff6b7a;
  --red-dim: rgba(255, 107, 122, 0.12);

  --radius: 12px;
  --radius-lg: 20px;
  --shadow: 0 8px 32px rgba(0,0,0,0.4);
  --shadow-accent: 0 0 40px rgba(162,120,255,0.2);
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Mono', monospace;
  --font-serif: 'Fraunces', serif;
  --sidebar-w: 240px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { height: 100%; }

body {
  background: var(--bg-0);
  color: var(--text-1);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  height: 100%;
  overflow-x: hidden;
}

/* Noise texture overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}

#root { height: 100%; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bg-3); border-radius: 4px; }

/* Layout */
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  background: var(--bg-0);
}

/* Sidebar */
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg-1);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  gap: 8px;
  flex-shrink: 0;
}

.sidebar-logo {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  color: var(--accent);
  padding: 8px 12px 24px;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-logo span {
  background: linear-gradient(135deg, var(--accent), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-2);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.18s ease;
  letter-spacing: 0.2px;
}

.nav-item:hover {
  background: var(--surface-hover);
  color: var(--text-1);
}

.nav-item.active {
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--border-accent);
}

.nav-item svg { width: 18px; height: 18px; flex-shrink: 0; }

.sidebar-section {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-3);
  padding: 12px 12px 4px;
  font-family: var(--font-display);
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

/* Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: border-color 0.2s;
}

.card:hover { border-color: var(--border-accent); }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Typography */
.page-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 6px;
}

.page-subtitle {
  color: var(--text-2);
  margin-bottom: 32px;
  font-size: 14px;
}

.section-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.3px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius);
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.18s ease;
  letter-spacing: 0.2px;
  text-decoration: none;
}

.btn-primary {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 0 24px var(--accent-glow);
}

.btn-primary:hover {
  background: #b890ff;
  transform: translateY(-1px);
  box-shadow: 0 0 32px var(--accent-glow);
}

.btn-secondary {
  background: var(--surface-hover);
  color: var(--text-1);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  border-color: var(--border-accent);
  color: var(--accent);
}

.btn-ghost {
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--border);
}

.btn-ghost:hover { color: var(--text-1); border-color: var(--text-3); }

.btn-sm { padding: 6px 14px; font-size: 13px; }
.btn-lg { padding: 14px 28px; font-size: 16px; }
.btn-full { width: 100%; justify-content: center; }

.btn-success {
  background: var(--green);
  color: #0a1a12;
}
.btn-success:hover { background: #80e4b8; }

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-display);
  letter-spacing: 0.5px;
}

.badge-accent { background: var(--accent-dim); color: var(--accent); }
.badge-gold { background: var(--gold-dim); color: var(--gold); }
.badge-green { background: var(--green-dim); color: var(--green); }
.badge-red { background: var(--red-dim); color: var(--red); }

/* Form */
.form-group { margin-bottom: 20px; }
.form-label {
  display: block;
  font-size: 12px;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  color: var(--text-1);
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  transition: border-color 0.18s;
}

.form-input:focus { border-color: var(--accent); }
.form-input::placeholder { color: var(--text-3); }

/* Stat */
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1.5px;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 6px;
  font-family: var(--font-display);
  font-weight: 600;
}

/* Chord diagram */
.chord-svg-wrap {
  background: var(--bg-2);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  justify-content: center;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background: var(--surface);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius);
  padding: 14px 20px;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--accent);
  box-shadow: var(--shadow);
  z-index: 10000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Progress bar */
.progress-bar {
  height: 6px;
  background: var(--bg-3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--gold));
  border-radius: 3px;
  transition: width 0.6s ease;
}

/* Auth page */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 30% 40%, rgba(162,120,255,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 70%, rgba(240,192,96,0.05) 0%, transparent 50%),
              var(--bg-0);
}

.auth-card {
  width: 420px;
  max-width: 90vw;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 40px;
  box-shadow: var(--shadow);
}

.auth-logo {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 32px;
  text-align: center;
}

.auth-switch {
  text-align: center;
  margin-top: 24px;
  color: var(--text-3);
  font-size: 13px;
}

.auth-switch button {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 13px;
  margin-left: 4px;
}

.error-msg {
  background: var(--red-dim);
  border: 1px solid rgba(255,107,122,0.3);
  color: var(--red);
  padding: 10px 14px;
  border-radius: var(--radius);
  font-size: 13px;
  margin-bottom: 16px;
}

/* Chord library */
.chord-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.chord-card:hover {
  border-color: var(--border-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-accent);
}

.chord-card.learned {
  border-color: var(--green);
  background: linear-gradient(135deg, var(--surface), rgba(96,212,160,0.05));
}

.chord-name {
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 300;
  font-style: italic;
  letter-spacing: -1px;
  color: var(--text-1);
}

/* Tuner */
.tuner-display {
  text-align: center;
  padding: 40px;
}

.tuner-note {
  font-family: var(--font-serif);
  font-size: 120px;
  font-weight: 600;
  font-style: italic;
  line-height: 1;
  letter-spacing: -4px;
}

.tuner-freq {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-3);
  margin-top: 8px;
}

.tuner-meter {
  width: 100%;
  max-width: 400px;
  margin: 32px auto;
  height: 8px;
  background: var(--bg-3);
  border-radius: 4px;
  position: relative;
}

.tuner-needle {
  position: absolute;
  top: -4px;
  width: 16px;
  height: 16px;
  background: var(--accent);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: left 0.1s;
  box-shadow: 0 0 12px var(--accent-glow);
}

.tuner-in-tune .tuner-needle { background: var(--green); box-shadow: 0 0 12px rgba(96,212,160,0.5); }
.tuner-note.in-tune { color: var(--green); }

/* Practice mode */
.chord-prompt {
  font-family: var(--font-serif);
  font-size: 100px;
  font-weight: 300;
  font-style: italic;
  text-align: center;
  letter-spacing: -3px;
  line-height: 1;
  padding: 60px 0;
  color: var(--accent);
  animation: chordFade 0.2s ease;
}

@keyframes chordFade {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar { display: none; }
  .main-content { padding: 20px 16px; }
  .card-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 24px; }
  .chord-prompt { font-size: 64px; }
  .tuner-note { font-size: 80px; }
}

/* Divider */
.divider {
  height: 1px;
  background: var(--border);
  margin: 24px 0;
}

/* Flex utils */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 4px; }
.gap-8 { gap: 8px; }
.gap-12 { gap: 12px; }
.gap-16 { gap: 16px; }
.gap-24 { gap: 24px; }
.mb-8 { margin-bottom: 8px; }
.mb-16 { margin-bottom: 16px; }
.mb-24 { margin-bottom: 24px; }
.mb-32 { margin-bottom: 32px; }
.mt-auto { margin-top: auto; }
.text-accent { color: var(--accent); }
.text-gold { color: var(--gold); }
.text-green { color: var(--green); }
.text-muted { color: var(--text-2); }
.text-dim { color: var(--text-3); }
.text-center { text-align: center; }
.font-display { font-family: var(--font-display); }
.w-full { width: 100%; }

/* ── V2 ADDITIONS ────────────────────────────────────────── */

/* Mobile sidebar toggle */
.sidebar-mobile-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 500;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  cursor: pointer;
  font-size: 22px;
  box-shadow: 0 4px 20px var(--accent-glow);
}

@media (max-width: 768px) {
  .sidebar-mobile-toggle { display: flex; align-items: center; justify-content: center; }
}

/* Level badge in nav */
.level-badge {
  background: linear-gradient(135deg, var(--accent), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: var(--font-display);
  font-weight: 800;
}

/* Song player chord highlight */
.chord-active {
  transform: scale(1.1);
  box-shadow: var(--shadow-accent);
}

/* Waveform canvas */
canvas.waveform {
  background: var(--bg-2);
  border-radius: 8px;
  display: block;
  width: 100%;
}

/* Achievement unlock animation */
@keyframes achievementPop {
  0% { transform: scale(0) rotate(-10deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(3deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.achievement-unlock {
  animation: achievementPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Countdown ring */
.countdown-ring {
  transition: background 0.3s ease;
}

/* Accuracy feedback */
.feedback-correct { color: var(--green) !important; }
.feedback-partial { color: var(--gold) !important; }
.feedback-wrong { color: var(--red) !important; }

/* Toggle switch */
.toggle {
  width: 40px; height: 22px; border-radius: 11px;
  position: relative; cursor: pointer; transition: background 0.2s;
  flex-shrink: 0;
}
.toggle-thumb {
  position: absolute; top: 2px; width: 18px; height: 18px;
  border-radius: 50%; background: #fff; transition: left 0.2s;
}

/* Recording pulse */
@keyframes recPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

/* Improved card hover */
.card { transition: border-color 0.2s, box-shadow 0.2s; }

/* Radar chart text */
.recharts-polar-angle-axis-tick-value { font-family: var(--font-display) !important; }

/* Song chord sheet */
.chord-sheet-chord {
  transition: all 0.15s ease;
}
.chord-sheet-chord:hover {
  border-color: var(--accent) !important;
  color: var(--accent) !important;
}

/* Planner step icons */
.plan-step { transition: transform 0.2s; }
.plan-step:hover { transform: translateX(4px); }
