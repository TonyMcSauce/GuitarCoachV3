// src/data/chords.js - V2 Complete Chord Database

export const CHORDS = [
  // ── BEGINNER OPEN CHORDS ──────────────────────────────────────────
  {
    id: 'C', name: 'C Major', type: 'major', category: 'open', difficulty: 'beginner',
    notes: ['C', 'E', 'G'],
    frequencies: [261.63, 329.63, 392.00, 523.25, 659.25],
    fingers: [{ string: 2, fret: 1, finger: 1 }, { string: 4, fret: 2, finger: 2 }, { string: 5, fret: 3, finger: 3 }],
    openStrings: [1, 3], mutedStrings: [6],
    tips: 'Curl your fingers and press just behind the frets. Keep your thumb behind the neck.',
    svgData: { frets: ['x', 3, 2, 0, 1, 0], startFret: 0, fingers: [{ str: 2, fret: 1, finger: 1 }, { str: 3, fret: 2, finger: 2 }, { str: 4, fret: 3, finger: 3 }] }
  },
  {
    id: 'D', name: 'D Major', type: 'major', category: 'open', difficulty: 'beginner',
    notes: ['D', 'F#', 'A'],
    frequencies: [293.66, 369.99, 440.00, 587.33],
    fingers: [{ string: 1, fret: 2, finger: 1 }, { string: 2, fret: 3, finger: 3 }, { string: 3, fret: 2, finger: 2 }],
    openStrings: [4], mutedStrings: [5, 6],
    tips: 'This chord can feel cramped at first. Keep your wrist relaxed and fingers arched.',
    svgData: { frets: ['x', 'x', 0, 2, 3, 2], startFret: 0, fingers: [{ str: 1, fret: 2, finger: 1 }, { str: 3, fret: 2, finger: 2 }, { str: 2, fret: 3, finger: 3 }] }
  },
  {
    id: 'E', name: 'E Major', type: 'major', category: 'open', difficulty: 'beginner',
    notes: ['E', 'G#', 'B'],
    frequencies: [82.41, 164.81, 246.94, 329.63, 415.30, 493.88],
    fingers: [{ string: 3, fret: 1, finger: 1 }, { string: 5, fret: 2, finger: 2 }, { string: 4, fret: 2, finger: 3 }],
    openStrings: [1, 2, 6], mutedStrings: [],
    tips: 'All 6 strings ring out. One of the easiest and most powerful chords.',
    svgData: { frets: [0, 2, 2, 1, 0, 0], startFret: 0, fingers: [{ str: 4, fret: 1, finger: 1 }, { str: 3, fret: 2, finger: 3 }, { str: 2, fret: 2, finger: 2 }] }
  },
  {
    id: 'G', name: 'G Major', type: 'major', category: 'open', difficulty: 'beginner',
    notes: ['G', 'B', 'D'],
    frequencies: [98.00, 196.00, 246.94, 293.66, 392.00, 783.99],
    fingers: [{ string: 6, fret: 3, finger: 2 }, { string: 5, fret: 2, finger: 1 }, { string: 1, fret: 3, finger: 3 }],
    openStrings: [2, 3, 4], mutedStrings: [],
    tips: 'Stretch your fingers wide. The G chord has a big, full sound.',
    svgData: { frets: [3, 2, 0, 0, 0, 3], startFret: 0, fingers: [{ str: 2, fret: 2, finger: 1 }, { str: 6, fret: 3, finger: 2 }, { str: 1, fret: 3, finger: 4 }] }
  },
  {
    id: 'A', name: 'A Major', type: 'major', category: 'open', difficulty: 'beginner',
    notes: ['A', 'C#', 'E'],
    frequencies: [110.00, 220.00, 277.18, 329.63, 440.00],
    fingers: [{ string: 4, fret: 2, finger: 1 }, { string: 3, fret: 2, finger: 2 }, { string: 2, fret: 2, finger: 3 }],
    openStrings: [1, 5], mutedStrings: [6],
    tips: 'Three fingers on the 2nd fret. Try to keep them from touching other strings.',
    svgData: { frets: ['x', 0, 2, 2, 2, 0], startFret: 0, fingers: [{ str: 4, fret: 2, finger: 1 }, { str: 3, fret: 2, finger: 2 }, { str: 2, fret: 2, finger: 3 }] }
  },
  {
    id: 'Am', name: 'A Minor', type: 'minor', category: 'open', difficulty: 'beginner',
    notes: ['A', 'C', 'E'],
    frequencies: [110.00, 220.00, 261.63, 329.63, 440.00],
    fingers: [{ string: 4, fret: 2, finger: 2 }, { string: 3, fret: 2, finger: 3 }, { string: 2, fret: 1, finger: 1 }],
    openStrings: [1, 5], mutedStrings: [6],
    tips: 'Very similar to E major — just moved over one string.',
    svgData: { frets: ['x', 0, 2, 2, 1, 0], startFret: 0, fingers: [{ str: 3, fret: 1, finger: 1 }, { str: 4, fret: 2, finger: 2 }, { str: 3, fret: 2, finger: 3 }] }
  },
  {
    id: 'Em', name: 'E Minor', type: 'minor', category: 'open', difficulty: 'beginner',
    notes: ['E', 'G', 'B'],
    frequencies: [82.41, 164.81, 246.94, 329.63, 392.00, 493.88],
    fingers: [{ string: 5, fret: 2, finger: 1 }, { string: 4, fret: 2, finger: 2 }],
    openStrings: [1, 2, 3, 6], mutedStrings: [],
    tips: 'The easiest chord on guitar. Only 2 fingers. Play all 6 strings.',
    svgData: { frets: [0, 2, 2, 0, 0, 0], startFret: 0, fingers: [{ str: 3, fret: 2, finger: 1 }, { str: 2, fret: 2, finger: 2 }] }
  },
  {
    id: 'Dm', name: 'D Minor', type: 'minor', category: 'open', difficulty: 'beginner',
    notes: ['D', 'F', 'A'],
    frequencies: [293.66, 349.23, 440.00, 587.33],
    fingers: [{ string: 1, fret: 1, finger: 1 }, { string: 3, fret: 2, finger: 2 }, { string: 2, fret: 3, finger: 3 }],
    openStrings: [4], mutedStrings: [5, 6],
    tips: 'Similar shape to D major but sadder sounding.',
    svgData: { frets: ['x', 'x', 0, 2, 3, 1], startFret: 0, fingers: [{ str: 2, fret: 1, finger: 1 }, { str: 3, fret: 2, finger: 2 }, { str: 1, fret: 3, finger: 3 }] }
  },
  // ── BARRE CHORDS ─────────────────────────────────────────────────
  {
    id: 'F', name: 'F Major', type: 'major', category: 'barre', difficulty: 'intermediate',
    notes: ['F', 'A', 'C'],
    frequencies: [87.31, 174.61, 220.00, 261.63, 349.23, 698.46],
    fingers: [{ string: 6, fret: 1, finger: 1 }, { string: 4, fret: 3, finger: 3 }, { string: 3, fret: 2, finger: 2 }, { string: 2, fret: 3, finger: 4 }],
    openStrings: [], mutedStrings: [],
    tips: 'The infamous barre chord! Press your index finger flat across all 6 strings at fret 1. Roll slightly toward the nut.',
    svgData: { frets: [1, 1, 2, 3, 3, 1], startFret: 1, fingers: [{ str: 6, fret: 1, finger: 1 }, { str: 1, fret: 1, finger: 1 }, { str: 3, fret: 2, finger: 2 }, { str: 4, fret: 3, finger: 3 }, { str: 2, fret: 3, finger: 4 }] }
  },
  {
    id: 'Bm', name: 'B Minor', type: 'minor', category: 'barre', difficulty: 'intermediate',
    notes: ['B', 'D', 'F#'],
    frequencies: [123.47, 185.00, 246.94, 293.66, 369.99],
    fingers: [{ string: 5, fret: 2, finger: 1 }, { string: 4, fret: 4, finger: 3 }, { string: 3, fret: 4, finger: 4 }, { string: 2, fret: 3, finger: 2 }],
    openStrings: [], mutedStrings: [6, 1],
    tips: 'Barre strings 1-5 at fret 2 with your index finger.',
    svgData: { frets: ['x', 2, 4, 4, 3, 2], startFret: 2, fingers: [{ str: 5, fret: 2, finger: 1 }, { str: 2, fret: 3, finger: 2 }, { str: 4, fret: 4, finger: 3 }, { str: 3, fret: 4, finger: 4 }] }
  },
  {
    id: 'Cadd9', name: 'C Add9', type: 'major', category: 'open', difficulty: 'intermediate',
    notes: ['C', 'D', 'E', 'G'],
    frequencies: [261.63, 293.66, 329.63, 392.00, 523.25],
    fingers: [{ string: 5, fret: 3, finger: 3 }, { string: 4, fret: 2, finger: 2 }, { string: 2, fret: 3, finger: 4 }],
    openStrings: [1, 3], mutedStrings: [6],
    tips: 'A beautiful variation of C major. The open D string adds richness.',
    svgData: { frets: ['x', 3, 2, 0, 3, 0], startFret: 0, fingers: [{ str: 4, fret: 2, finger: 2 }, { str: 5, fret: 3, finger: 3 }, { str: 2, fret: 3, finger: 4 }] }
  },
  // ── DOMINANT 7TH CHORDS ───────────────────────────────────────────
  {
    id: 'G7', name: 'G Dominant 7th', type: 'dominant7', category: 'seventh', difficulty: 'intermediate',
    notes: ['G', 'B', 'D', 'F'],
    frequencies: [98.00, 196.00, 246.94, 293.66, 349.23, 392.00],
    fingers: [{ string: 6, fret: 3, finger: 3 }, { string: 5, fret: 2, finger: 2 }, { string: 1, fret: 1, finger: 1 }],
    openStrings: [2, 3, 4], mutedStrings: [],
    tips: 'Like G major but add your index on the 1st string fret 1. Common in blues!',
    svgData: { frets: [3, 2, 0, 0, 0, 1], startFret: 0, fingers: [{ str: 1, fret: 1, finger: 1 }, { str: 5, fret: 2, finger: 2 }, { str: 6, fret: 3, finger: 3 }] }
  },
  {
    id: 'D7', name: 'D Dominant 7th', type: 'dominant7', category: 'seventh', difficulty: 'intermediate',
    notes: ['D', 'F#', 'A', 'C'],
    frequencies: [293.66, 261.63, 369.99, 440.00, 587.33],
    fingers: [{ string: 3, fret: 2, finger: 2 }, { string: 1, fret: 2, finger: 3 }, { string: 2, fret: 1, finger: 1 }],
    openStrings: [4], mutedStrings: [5, 6],
    tips: 'Like D major but with a C note added. Creates delicious tension.',
    svgData: { frets: ['x', 'x', 0, 2, 1, 2], startFret: 0, fingers: [{ str: 2, fret: 1, finger: 1 }, { str: 3, fret: 2, finger: 2 }, { str: 1, fret: 2, finger: 3 }] }
  },
  {
    id: 'A7', name: 'A Dominant 7th', type: 'dominant7', category: 'seventh', difficulty: 'intermediate',
    notes: ['A', 'C#', 'E', 'G'],
    frequencies: [110.00, 220.00, 261.63, 329.63, 392.00],
    fingers: [{ string: 4, fret: 2, finger: 2 }, { string: 2, fret: 2, finger: 3 }],
    openStrings: [1, 3, 5], mutedStrings: [6],
    tips: 'A major with the middle string open. Simple and bluesy.',
    svgData: { frets: ['x', 0, 2, 0, 2, 0], startFret: 0, fingers: [{ str: 4, fret: 2, finger: 2 }, { str: 2, fret: 2, finger: 3 }] }
  },
  {
    id: 'E7', name: 'E Dominant 7th', type: 'dominant7', category: 'seventh', difficulty: 'beginner',
    notes: ['E', 'G#', 'B', 'D'],
    frequencies: [82.41, 164.81, 246.94, 293.66, 329.63, 415.30],
    fingers: [{ string: 5, fret: 2, finger: 2 }, { string: 4, fret: 2, finger: 3 }],
    openStrings: [1, 2, 3, 6], mutedStrings: [],
    tips: 'E major without the 3rd-string finger. Very common in blues and rock.',
    svgData: { frets: [0, 2, 0, 1, 0, 0], startFret: 0, fingers: [{ str: 4, fret: 1, finger: 1 }, { str: 3, fret: 2, finger: 2 }] }
  },
  // ── SUSPENDED CHORDS ──────────────────────────────────────────────
  {
    id: 'Dsus2', name: 'D Suspended 2nd', type: 'sus2', category: 'suspended', difficulty: 'intermediate',
    notes: ['D', 'E', 'A'],
    frequencies: [293.66, 329.63, 440.00, 587.33],
    fingers: [{ string: 3, fret: 2, finger: 1 }, { string: 2, fret: 3, finger: 3 }],
    openStrings: [1, 4], mutedStrings: [5, 6],
    tips: 'Remove your index from D major for a more open, floaty sound.',
    svgData: { frets: ['x', 'x', 0, 2, 3, 0], startFret: 0, fingers: [{ str: 3, fret: 2, finger: 1 }, { str: 2, fret: 3, finger: 3 }] }
  },
  {
    id: 'Dsus4', name: 'D Suspended 4th', type: 'sus4', category: 'suspended', difficulty: 'intermediate',
    notes: ['D', 'G', 'A'],
    frequencies: [293.66, 392.00, 440.00, 587.33],
    fingers: [{ string: 3, fret: 2, finger: 1 }, { string: 2, fret: 3, finger: 2 }, { string: 1, fret: 3, finger: 3 }],
    openStrings: [4], mutedStrings: [5, 6],
    tips: 'Dsus4 → D is one of the most satisfying transitions. The tension resolves beautifully.',
    svgData: { frets: ['x', 'x', 0, 2, 3, 3], startFret: 0, fingers: [{ str: 3, fret: 2, finger: 1 }, { str: 2, fret: 3, finger: 2 }, { str: 1, fret: 3, finger: 3 }] }
  },
  {
    id: 'Asus2', name: 'A Suspended 2nd', type: 'sus2', category: 'suspended', difficulty: 'intermediate',
    notes: ['A', 'B', 'E'],
    frequencies: [110.00, 220.00, 246.94, 329.63, 440.00],
    fingers: [{ string: 4, fret: 2, finger: 1 }, { string: 3, fret: 2, finger: 2 }],
    openStrings: [1, 2, 5], mutedStrings: [6],
    tips: 'Beautiful open sound. Often used in ambient and folk music.',
    svgData: { frets: ['x', 0, 2, 2, 0, 0], startFret: 0, fingers: [{ str: 4, fret: 2, finger: 1 }, { str: 3, fret: 2, finger: 2 }] }
  },
  {
    id: 'Asus4', name: 'A Suspended 4th', type: 'sus4', category: 'suspended', difficulty: 'intermediate',
    notes: ['A', 'D', 'E'],
    frequencies: [110.00, 220.00, 293.66, 329.63, 440.00],
    fingers: [{ string: 4, fret: 2, finger: 1 }, { string: 3, fret: 2, finger: 2 }, { string: 2, fret: 3, finger: 3 }],
    openStrings: [1, 5], mutedStrings: [6],
    tips: 'Very common in rock. Try Asus4 → A for a classic effect.',
    svgData: { frets: ['x', 0, 2, 2, 3, 0], startFret: 0, fingers: [{ str: 4, fret: 2, finger: 1 }, { str: 3, fret: 2, finger: 2 }, { str: 2, fret: 3, finger: 3 }] }
  },
];

// ── GAMIFICATION ──────────────────────────────────────────────────
export const XP_ACTIONS = {
  CHORD_LEARNED: 50,
  PRACTICE_SESSION: 30,
  SONG_COMPLETED: 100,
  DAILY_CHALLENGE: 75,
  STREAK_DAY: 20,
  PERFECT_SESSION: 150,
  FIRST_BARRE: 200,
  RECORDING: 75,
};

export const LEVELS = [
  { level: 1, name: 'Total Beginner', minXP: 0, maxXP: 200 },
  { level: 2, name: 'String Picker', minXP: 200, maxXP: 500 },
  { level: 3, name: 'Open Chord Hero', minXP: 500, maxXP: 1000 },
  { level: 4, name: 'Rhythm Guitarist', minXP: 1000, maxXP: 2000 },
  { level: 5, name: 'Chord Master', minXP: 2000, maxXP: 3500 },
  { level: 6, name: 'Barre Conqueror', minXP: 3500, maxXP: 5500 },
  { level: 7, name: 'Song Slinger', minXP: 5500, maxXP: 8000 },
  { level: 8, name: 'Stage Ready', minXP: 8000, maxXP: 11000 },
  { level: 9, name: 'Guitar Wizard', minXP: 11000, maxXP: 15000 },
  { level: 10, name: 'Legendary Axeman', minXP: 15000, maxXP: Infinity },
];

export const ACHIEVEMENTS = [
  { id: 'first_chord', name: 'First Chord!', desc: 'Learn your first chord', icon: '🎸', xp: 50 },
  { id: 'five_chords', name: 'Handful of Chords', desc: 'Learn 5 chords', icon: '✋', xp: 100 },
  { id: 'all_open', name: 'Open Book', desc: 'Learn all 8 open chords', icon: '📖', xp: 200 },
  { id: 'first_barre', name: 'Barre Breaker', desc: 'Learn your first barre chord', icon: '💪', xp: 200 },
  { id: 'first_song', name: 'Songwriter', desc: 'Complete your first song', icon: '🎵', xp: 100 },
  { id: 'five_songs', name: 'Setlist', desc: 'Complete 5 songs', icon: '📋', xp: 250 },
  { id: 'streak_3', name: 'On a Roll', desc: '3-day practice streak', icon: '🔥', xp: 75 },
  { id: 'streak_7', name: 'Week Warrior', desc: '7-day practice streak', icon: '⚡', xp: 200 },
  { id: 'streak_30', name: 'Monthly Master', desc: '30-day practice streak', icon: '👑', xp: 1000 },
  { id: 'hour_practice', name: 'Hour Power', desc: 'Practice for 60 total minutes', icon: '⏱', xp: 150 },
  { id: 'perfect_session', name: 'Flawless', desc: 'Complete a perfect practice session', icon: '⭐', xp: 150 },
  { id: 'all_chords', name: 'Chord Encyclopedia', desc: 'Learn every chord in the library', icon: '🏆', xp: 500 },
  { id: 'recording', name: 'Studio Session', desc: 'Make your first recording', icon: '🎙', xp: 75 },
  { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete 50 chord switches in one session', icon: '🏎', xp: 100 },
];

export const DAILY_CHALLENGES = [
  { id: 'dc1', desc: 'Practice C → G transition 20 times', chords: ['C', 'G'], target: 20, xp: 75 },
  { id: 'dc2', desc: 'Practice Am → E transition 15 times', chords: ['Am', 'E'], target: 15, xp: 75 },
  { id: 'dc4', desc: 'Play through a full song without stopping', chords: [], target: 1, xp: 100 },
  { id: 'dc5', desc: 'Practice for 10 minutes straight', chords: [], target: 600, xp: 75 },
  { id: 'dc7', desc: 'Practice G → D → Em → C progression 10 times', chords: ['G', 'D', 'Em', 'C'], target: 10, xp: 100 },
  { id: 'dc8', desc: 'Learn a chord in the barre or 7th category', chords: [], target: 1, xp: 100 },
  { id: 'dc9', desc: 'Practice any 3 chords for 5 minutes', chords: [], target: 300, xp: 60 },
];

export const SONGS = [
  { id: 1, title: "Knockin' on Heaven's Door", artist: "Bob Dylan", difficulty: "Beginner", chords: ["G", "D", "Am"], capo: null, bpm: 72, progression: [{ section: "Verse", chords: ["G", "D", "Am", "Am"] }, { section: "Chorus", chords: ["G", "D", "G", "G"] }], description: "Classic 3-chord song with a slow, easy tempo." },
  { id: 2, title: "Horse With No Name", artist: "America", difficulty: "Beginner", chords: ["Em", "D"], capo: null, bpm: 80, progression: [{ section: "Verse", chords: ["Em", "D", "Em", "D"] }], description: "Only 2 chords! Perfect for total beginners." },
  { id: 3, title: "Wonderwall", artist: "Oasis", difficulty: "Beginner", chords: ["Em", "G", "D", "A"], capo: 2, bpm: 87, progression: [{ section: "Verse", chords: ["Em", "G", "D", "A"] }, { section: "Chorus", chords: ["G", "D", "Em", "G"] }], description: "One of the most iconic beginner songs ever written." },
  { id: 4, title: "Brown Eyed Girl", artist: "Van Morrison", difficulty: "Beginner", chords: ["G", "C", "D", "Em"], capo: null, bpm: 148, progression: [{ section: "Verse", chords: ["G", "C", "G", "D"] }, { section: "Chorus", chords: ["G", "C", "G", "D"] }], description: "A timeless feel-good song with classic chord changes." },
  { id: 5, title: "House of the Rising Sun", artist: "The Animals", difficulty: "Beginner", chords: ["Am", "C", "D", "Em"], capo: null, bpm: 96, progression: [{ section: "Verse", chords: ["Am", "C", "D", "D", "Am", "Am", "E", "E"] }], description: "Minor chord progression with a haunting feel." },
  { id: 6, title: "Stand By Me", artist: "Ben E. King", difficulty: "Beginner", chords: ["G", "Em", "C", "D"], capo: null, bpm: 120, progression: [{ section: "Verse", chords: ["G", "G", "Em", "Em", "C", "D", "G", "G"] }], description: "Classic 4-chord pop progression." },
  { id: 7, title: "Let Her Go", artist: "Passenger", difficulty: "Beginner", chords: ["G", "D", "Em", "C"], capo: null, bpm: 100, progression: [{ section: "Verse", chords: ["G", "D", "Em", "C"] }], description: "Modern acoustic classic." },
  { id: 8, title: "Take Me Home, Country Roads", artist: "John Denver", difficulty: "Beginner", chords: ["G", "Em", "D", "C"], capo: null, bpm: 120, progression: [{ section: "Verse", chords: ["G", "G", "Em", "D", "D", "C", "G", "G"] }, { section: "Chorus", chords: ["G", "D", "Em", "C", "G", "D", "G"] }], description: "Beloved folk anthem." },
  { id: 9, title: "Leaving on a Jet Plane", artist: "John Denver", difficulty: "Beginner", chords: ["G", "C", "D"], capo: null, bpm: 76, progression: [{ section: "Verse", chords: ["G", "C", "G", "C", "G", "D"] }], description: "3 chords, slow tempo." },
  { id: 10, title: "Wish You Were Here", artist: "Pink Floyd", difficulty: "Beginner", chords: ["Em", "G", "A", "C"], capo: null, bpm: 63, progression: [{ section: "Intro", chords: ["Em", "G", "Em", "G"] }, { section: "Verse", chords: ["C", "D", "Am", "G"] }], description: "Iconic song with a legendary intro." },
  { id: 11, title: "Love Yourself", artist: "Justin Bieber", difficulty: "Beginner", chords: ["C", "G", "Am", "Em", "D"], capo: null, bpm: 96, progression: [{ section: "Verse", chords: ["C", "G", "Am", "Em"] }, { section: "Chorus", chords: ["G", "D", "C", "G"] }], description: "Modern pop with clean chord progressions." },
  { id: 12, title: "Zombie", artist: "The Cranberries", difficulty: "Beginner", chords: ["Am", "C", "G", "Em"], capo: null, bpm: 95, progression: [{ section: "Verse/Chorus", chords: ["Am", "C", "G", "Em"] }], description: "Powerful song with a simple 4-chord loop." },
  { id: 13, title: "Hallelujah", artist: "Leonard Cohen", difficulty: "Beginner", chords: ["C", "Am", "G", "Em"], capo: null, bpm: 68, progression: [{ section: "Verse", chords: ["C", "Am", "C", "Am"] }, { section: "Chorus", chords: ["G", "Em", "G", "C"] }], description: "One of the most beautiful songs ever written." },
  { id: 14, title: "Fast Car", artist: "Tracy Chapman", difficulty: "Beginner", chords: ["C", "G", "Am", "Em"], capo: null, bpm: 112, progression: [{ section: "Verse", chords: ["C", "G", "Am", "Em"] }], description: "Timeless acoustic classic." },
  { id: 15, title: "Counting Stars", artist: "OneRepublic", difficulty: "Beginner", chords: ["Am", "C", "G", "Em"], capo: null, bpm: 122, progression: [{ section: "Verse", chords: ["Am", "C", "G", "Em"] }], description: "Hugely popular 4-chord loop." },
  { id: 16, title: "Let It Be", artist: "The Beatles", difficulty: "Intermediate", chords: ["C", "G", "Am", "F"], capo: null, bpm: 75, progression: [{ section: "Verse", chords: ["C", "G", "Am", "F"] }, { section: "Chorus", chords: ["F", "C", "G", "C"] }], description: "Beautiful Beatles classic — introduces the F barre chord." },
  { id: 17, title: "Hotel California", artist: "Eagles", difficulty: "Intermediate", chords: ["Bm", "F", "A", "E", "G", "D", "Em"], capo: null, bpm: 74, progression: [{ section: "Verse", chords: ["Bm", "F", "A", "E"] }, { section: "Chorus", chords: ["G", "D", "Em", "Em"] }], description: "Classic with barre chords and a legendary progression." },
  { id: 18, title: "No Woman No Cry", artist: "Bob Marley", difficulty: "Intermediate", chords: ["C", "G", "Am", "F"], capo: null, bpm: 70, progression: [{ section: "Verse", chords: ["C", "G", "Am", "F"] }], description: "Reggae classic with F barre chord." },
  { id: 19, title: "The Joker", artist: "Steve Miller Band", difficulty: "Intermediate", chords: ["G", "C", "D7", "G7"], capo: null, bpm: 98, progression: [{ section: "Verse", chords: ["G", "C", "G", "D7"] }], description: "Introduces dominant 7th chords in a fun context." },
  { id: 20, title: "Blackbird", artist: "The Beatles", difficulty: "Intermediate", chords: ["G", "Am", "G7", "C", "D"], capo: null, bpm: 92, progression: [{ section: "Verse", chords: ["G", "Am", "G7", "C"] }, { section: "Bridge", chords: ["D", "G", "C", "Am"] }], description: "Fingerpicking masterpiece with 7th chords." },
];

export const STRUMMING_PATTERNS = [
  { id: 'downstrokes', name: 'Downstrokes Only', difficulty: 'Beginner', description: 'The most fundamental strumming pattern.', beats: ['D', 'D', 'D', 'D'], bpm: 60 },
  { id: 'down-up', name: 'Down-Up Pattern', difficulty: 'Beginner', description: 'The bread-and-butter of rhythm guitar.', beats: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'], bpm: 70 },
  { id: 'pop-rhythm', name: 'Pop Rhythm', difficulty: 'Intermediate', description: 'A syncopated pattern used in countless pop songs.', beats: ['D', 'D', 'U', 'U', 'D', 'U'], bpm: 80 },
  { id: 'folk-pattern', name: 'Folk Pattern', difficulty: 'Intermediate', description: 'Classic folk/country feel.', beats: ['D', 'D', 'U', 'D', 'U'], bpm: 90 },
  { id: 'reggae', name: 'Reggae Skank', difficulty: 'Intermediate', description: 'Play upstrokes on the offbeats.', beats: ['x', 'U', 'x', 'U', 'x', 'U', 'x', 'U'], bpm: 80 },
];
