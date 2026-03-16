// src/services/userService.js - V2
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { LEVELS, ACHIEVEMENTS, XP_ACTIONS } from '../data/chords';

export const createUserProfile = async (uid, data) => {
  const userRef = doc(db, 'users', uid);
  const defaults = {
    username: data.username || data.email?.split('@')[0] || 'Guitarist',
    email: data.email || '',
    skillLevel: 'Beginner',
    knownChords: [],
    practiceHistory: [],
    totalPracticeTime: 0,
    practiceStreak: 0,
    lastPracticeDate: null,
    songsCompleted: [],
    createdAt: new Date().toISOString(),
    xp: 0, level: 1, achievements: [],
    weakChords: [], chordAccuracy: {},
    chordSwitchSpeeds: {}, practiceGoals: [],
    recordingHistory: [], dailyChallengeDate: null,
    dailyChallengeId: null, dailyChallengeCompleted: false, focusAreas: [],
  };
  await setDoc(userRef, defaults, { merge: true });
  return defaults;
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), data);
};

export const getLevelFromXP = (xp) =>
  LEVELS.slice().reverse().find(l => xp >= l.minXP) || LEVELS[0];

export const addXP = async (uid, amount) => {
  const snap = await getDoc(doc(db, 'users', uid));
  const user = snap.data();
  const oldXP = user.xp || 0;
  const newXP = oldXP + amount;
  const oldLevel = getLevelFromXP(oldXP);
  const newLevel = getLevelFromXP(newXP);
  await updateDoc(doc(db, 'users', uid), { xp: newXP, level: newLevel.level });
  return { newXP, newLevel, leveledUp: newLevel.level > oldLevel.level, xpGained: amount };
};

export const checkAndGrantAchievements = async (uid, userProfile) => {
  const newAchievements = [];
  const existing = userProfile.achievements || [];
  const known = userProfile.knownChords || [];
  const songs = userProfile.songsCompleted || [];
  const streak = userProfile.practiceStreak || 0;
  const totalMin = Math.round((userProfile.totalPracticeTime || 0) / 60);
  const recordings = userProfile.recordingHistory || [];

  const check = (id, cond) => { if (cond && !existing.includes(id)) newAchievements.push(id); };
  check('first_chord', known.length >= 1);
  check('five_chords', known.length >= 5);
  check('all_open', ['C','D','E','G','A','Am','Em','Dm'].every(c => known.includes(c)));
  check('first_barre', known.some(c => ['F','Bm'].includes(c)));
  check('first_song', songs.length >= 1);
  check('five_songs', songs.length >= 5);
  check('streak_3', streak >= 3);
  check('streak_7', streak >= 7);
  check('streak_30', streak >= 30);
  check('hour_practice', totalMin >= 60);
  check('all_chords', known.length >= 19);
  check('recording', recordings.length >= 1);

  if (newAchievements.length > 0) {
    await updateDoc(doc(db, 'users', uid), { achievements: [...existing, ...newAchievements] });
    let xp = 0;
    for (const id of newAchievements) {
      const a = ACHIEVEMENTS.find(x => x.id === id);
      if (a) xp += a.xp;
    }
    if (xp > 0) await addXP(uid, xp);
  }
  return newAchievements.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean);
};

export const markChordLearned = async (uid, chord) => {
  await updateDoc(doc(db, 'users', uid), { knownChords: arrayUnion(chord) });
  return addXP(uid, XP_ACTIONS.CHORD_LEARNED);
};

export const logPracticeSession = async (uid, session) => {
  const snap = await getDoc(doc(db, 'users', uid));
  const user = snap.data();
  const today = new Date().toDateString();
  const lastDate = user.lastPracticeDate ? new Date(user.lastPracticeDate).toDateString() : null;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  let streak = user.practiceStreak || 0;
  if (lastDate !== today) streak = lastDate === yesterday ? streak + 1 : 1;

  let focusAreas = user.focusAreas || [];
  if (session.chordAccuracy) {
    const weak = Object.entries(session.chordAccuracy).filter(([,a]) => a < 60).map(([c]) => c);
    focusAreas = [...new Set([...focusAreas, ...weak])].slice(0, 5);
  }

  const chordAccuracy = { ...(user.chordAccuracy || {}) };
  if (session.chordAccuracy) {
    for (const [chord, acc] of Object.entries(session.chordAccuracy)) {
      const prev = chordAccuracy[chord];
      chordAccuracy[chord] = prev ? Math.round((prev + acc) / 2) : acc;
    }
  }

  await updateDoc(doc(db, 'users', uid), {
    practiceHistory: arrayUnion({ ...session, date: new Date().toISOString() }),
    totalPracticeTime: (user.totalPracticeTime || 0) + (session.duration || 0),
    practiceStreak: streak,
    lastPracticeDate: new Date().toISOString(),
    focusAreas, chordAccuracy,
  });

  const xpResult = await addXP(uid, XP_ACTIONS.PRACTICE_SESSION + (session.perfect ? XP_ACTIONS.PERFECT_SESSION : 0));
  return { streak, xpResult };
};

export const markSongCompleted = async (uid, songId) => {
  await updateDoc(doc(db, 'users', uid), { songsCompleted: arrayUnion(songId) });
  return addXP(uid, XP_ACTIONS.SONG_COMPLETED);
};

export const saveRecording = async (uid, recording) => {
  const recData = {
    id: Date.now().toString(),
    name: recording.name || `Recording ${new Date().toLocaleDateString()}`,
    chords: recording.chords || [],
    duration: recording.duration || 0,
    date: new Date().toISOString(),
  };
  await updateDoc(doc(db, 'users', uid), { recordingHistory: arrayUnion(recData) });
  return addXP(uid, XP_ACTIONS.RECORDING);
};

export const getSmartRecommendations = (userProfile, songs) => {
  const known = userProfile?.knownChords || [];
  const completed = userProfile?.songsCompleted || [];
  const accuracy = userProfile?.chordAccuracy || {};
  const practiceHistory = userProfile?.practiceHistory || [];
  const practiceCount = {};
  practiceHistory.forEach(s => (s.chords || []).forEach(c => { practiceCount[c] = (practiceCount[c] || 0) + 1; }));

  return songs.filter(s => !completed.includes(s.id)).map(song => {
    const unknownChords = song.chords.filter(c => !known.includes(c));
    const chordReadiness = song.chords.reduce((sum, c) => sum + (accuracy[c] || (known.includes(c) ? 70 : 0)), 0) / song.chords.length;
    let score = unknownChords.length === 0 ? 100 : unknownChords.length === 1 ? 60 : 0;
    score += chordReadiness * 0.5 - unknownChords.length * 20;
    score += song.chords.filter(c => practiceCount[c] > 0).length * 10;
    return { ...song, score, unknownChords, readiness: Math.round(chordReadiness) };
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
};

export const generatePracticePlan = (userProfile) => {
  const known = userProfile?.knownChords || [];
  const focusAreas = userProfile?.focusAreas || [];
  const plan = [];
  if (known.length > 0) plan.push({ type: 'warmup', title: 'Warm Up', desc: 'Start with 2 familiar chords for 2 minutes', chords: known.slice(0, 2), duration: 120 });
  if (focusAreas.length > 0) plan.push({ type: 'focus', title: 'Weak Chord Drill', desc: `Practice your problem chords: ${focusAreas.slice(0,2).join(', ')}`, chords: focusAreas.slice(0, 2), duration: 300 });
  const unlearned = ['C','G','D','Em','Am','E','A','Dm','F','Bm'].filter(c => !known.includes(c));
  if (unlearned.length > 0) plan.push({ type: 'new', title: 'Learn Something New', desc: `Try ${unlearned[0]} for the first time`, chords: [unlearned[0]], duration: 300 });
  if (known.length >= 2) plan.push({ type: 'endurance', title: 'Endurance Round', desc: 'Switch between 3 chords for 5 minutes straight', chords: known.slice(0, 3), duration: 300 });
  return plan;
};
