# 🎸 GuitarCoach — V1

> Learn guitar chords, practice songs, and track your progress.

---

## ✅ Features

| Feature | Status |
|---|---|
| Email/password auth | ✅ |
| User profile (streak, chords, history) | ✅ |
| Real-time guitar tuner (mic pitch detection) | ✅ |
| Interactive chord library (C D E G A Am Em Dm) | ✅ |
| Chord practice mode with metronome | ✅ |
| Strumming pattern lessons | ✅ |
| Song library (15 songs) | ✅ |
| Smart song recommendations | ✅ |
| Progress dashboard with charts | ✅ |
| Mobile-responsive dark UI | ✅ |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/guitarcoach.git
cd guitarcoach
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Create a **Firestore Database** (start in test mode)
5. Go to Project Settings → Add Web App → copy config

### 3. Configure Environment

```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`.

### 4. Run Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Static Site
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Publish directory: `build`
6. Add environment variables (your Firebase config)
7. Deploy!

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx        # Navigation sidebar
│   ├── ChordDiagram.jsx   # SVG chord diagram renderer
│   └── Toast.jsx          # Notification toast
├── pages/
│   ├── AuthPage.jsx       # Login/Signup
│   ├── Dashboard.jsx      # Home dashboard
│   ├── Tuner.jsx          # Guitar tuner (mic pitch detection)
│   ├── Chords.jsx         # Chord library
│   ├── Practice.jsx       # Chord switching practice mode
│   ├── Strumming.jsx      # Strumming pattern lessons
│   ├── Songs.jsx          # Song library
│   └── Progress.jsx       # Progress charts and history
├── services/
│   ├── firebase.js        # Firebase app config
│   ├── AuthContext.js     # Auth state provider
│   └── userService.js     # Firestore CRUD operations
├── data/
│   └── chords.js          # Chord + song + strumming data
└── index.css              # Global styles (dark theme)
```

---

## 🔐 Firestore Security Rules (Recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🛠 Tech Stack

- **React 18** — Frontend
- **Firebase 10** — Auth + Firestore
- **React Router v6** — Navigation
- **Recharts** — Progress charts
- **Web Audio API** — Microphone pitch detection
- **Google Fonts** — Syne + Fraunces + DM Mono

---

## 🗺 V2 Roadmap

- [ ] AI chord recognition (listen & detect)
- [ ] Video lessons
- [ ] Community song uploads
- [ ] Advanced chord library (barre chords, 7ths)
- [ ] Subscription tier
- [ ] Mobile app (React Native)
