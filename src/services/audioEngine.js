// src/services/audioEngine.js
// Real-time chord audio synthesis using Web Audio API
// Simulates guitar tone with oscillators, envelope shaping, and harmonics

let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/**
 * Creates a guitar-like tone for a single string frequency
 * Uses sawtooth + triangle oscillator blend with pluck envelope
 */
function playString(ctx, frequency, startTime, duration = 1.8, gain = 0.18) {
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // Pluck envelope: fast attack, long natural decay
  masterGain.gain.setValueAtTime(0, startTime);
  masterGain.gain.linearRampToValueAtTime(gain, startTime + 0.005);
  masterGain.gain.exponentialRampToValueAtTime(gain * 0.6, startTime + 0.05);
  masterGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  // Primary tone - sawtooth (rich harmonics like guitar)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = frequency;

  // Body resonance - triangle wave (warm body)
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.value = frequency * 2; // Octave up

  // Slight detuning for natural guitar sound
  osc1.detune.value = Math.random() * 4 - 2;
  osc2.detune.value = Math.random() * 4 - 2;

  // Filter to shape guitar tone (reduce harsh highs)
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = frequency * 8;
  filter.Q.value = 0.8;

  // Mix: mostly fundamental, some octave
  const osc1Gain = ctx.createGain();
  osc1Gain.gain.value = 0.7;
  const osc2Gain = ctx.createGain();
  osc2Gain.gain.value = 0.3;

  osc1.connect(osc1Gain);
  osc2.connect(osc2Gain);
  osc1Gain.connect(filter);
  osc2Gain.connect(filter);
  filter.connect(masterGain);

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration + 0.1);
  osc2.stop(startTime + duration + 0.1);
}

/**
 * Plays a full chord by strumming strings sequentially (not all at once)
 * This gives it that natural guitar strum feel
 */
export function playChord(chord, options = {}) {
  if (!chord?.frequencies?.length) return;

  const ctx = getCtx();
  const now = ctx.currentTime;
  const strumDelay = options.strumDelay ?? 0.025; // 25ms between strings
  const duration = options.duration ?? 2.0;
  const volume = options.volume ?? 0.18;

  chord.frequencies.forEach((freq, i) => {
    const t = now + i * strumDelay;
    playString(ctx, freq, t, duration, volume);
  });
}

/**
 * Plays a single note (for tuner reference tones, metronome, etc.)
 */
export function playNote(frequency, duration = 0.5, volume = 0.2) {
  const ctx = getCtx();
  const now = ctx.currentTime;
  playString(ctx, frequency, now, duration, volume);
}

/**
 * Plays metronome click
 */
export function playClick(isAccent = false) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.frequency.value = isAccent ? 1200 : 800;
  gainNode.gain.setValueAtTime(0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.start(now);
  osc.stop(now + 0.06);
}

/**
 * Frequency detection via autocorrelation for tuner
 */
export function autocorrelate(buf, sampleRate) {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.008) return -1;

  let r1 = 0, r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

  const slice = buf.slice(r1, r2);
  const len = slice.length;
  const c = new Float32Array(len).fill(0);
  for (let i = 0; i < len; i++)
    for (let j = 0; j < len - i; j++)
      c[i] += slice[j] * slice[j + i];

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < len; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }
  let T0 = maxpos;
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);
  return sampleRate / T0;
}

/**
 * Detect dominant chord from microphone frequencies using FFT
 * Compares detected peaks against chord frequency profiles
 */
export function detectChordFromFrequencies(detectedFreqs, chords) {
  if (!detectedFreqs?.length) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const chord of chords) {
    if (!chord.frequencies) continue;
    let score = 0;
    let matched = 0;

    for (const detFreq of detectedFreqs) {
      for (const chordFreq of chord.frequencies) {
        // Check across octaves
        for (let oct = -2; oct <= 2; oct++) {
          const octaveFreq = chordFreq * Math.pow(2, oct);
          const ratio = detFreq / octaveFreq;
          if (ratio > 0.95 && ratio < 1.05) {
            score += 1 / (Math.abs(ratio - 1) + 0.01);
            matched++;
            break;
          }
        }
      }
    }

    if (matched === 0) continue;
    const coverage = matched / chord.frequencies.length;
    const finalScore = score * coverage;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestMatch = { chord, score: Math.min(100, Math.round(coverage * 100)), matched };
    }
  }

  return bestScore > 0.5 ? bestMatch : null;
}

/**
 * Extract dominant frequency peaks from FFT data
 */
export function extractFrequencyPeaks(analyser, sampleRate) {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  const peaks = [];
  const minHz = 60;
  const maxHz = 1400;
  const binSize = sampleRate / (analyser.fftSize);

  for (let i = Math.floor(minHz / binSize); i < Math.min(bufferLength, Math.ceil(maxHz / binSize)); i++) {
    if (dataArray[i] > 100) {
      const freq = i * binSize;
      // Only keep local maxima
      if (dataArray[i] >= (dataArray[i - 1] || 0) && dataArray[i] >= (dataArray[i + 1] || 0)) {
        peaks.push({ freq, magnitude: dataArray[i] });
      }
    }
  }

  return peaks
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 8)
    .map(p => p.freq);
}

// ── V2 ALIASES ─────────────────────────────────────────────────────
// These match what pages/components import

const CHORD_VOICINGS = {
  'C':  [null, 3, 2, 0, 1, 0],
  'D':  [null, null, 0, 2, 3, 2],
  'E':  [0, 2, 2, 1, 0, 0],
  'G':  [3, 2, 0, 0, 0, 3],
  'A':  [null, 0, 2, 2, 2, 0],
  'Am': [null, 0, 2, 2, 1, 0],
  'Em': [0, 2, 2, 0, 0, 0],
  'Dm': [null, null, 0, 2, 3, 1],
  'F':  [1, 1, 2, 3, 3, 1],
  'Bm': [null, 2, 4, 4, 3, 2],
  'B':  [null, 2, 4, 4, 4, 2],
  'C7': [null, 3, 2, 3, 1, 0],
  'D7': [null, null, 0, 2, 1, 2],
  'E7': [0, 2, 0, 1, 0, 0],
  'G7': [3, 2, 0, 0, 0, 1],
  'A7': [null, 0, 2, 0, 2, 0],
  'B7': [null, 2, 1, 2, 0, 2],
  'Dsus2': [null, null, 0, 2, 3, 0],
  'Dsus4': [null, null, 0, 2, 3, 3],
  'Asus2': [null, 0, 2, 2, 0, 0],
  'Asus4': [null, 0, 2, 2, 3, 0],
};

const BASE_FREQS = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
const semi = (n) => Math.pow(2, n / 12);

export function playChordSound(chordId) {
  const ctx = getCtx();
  const voicing = CHORD_VOICINGS[chordId];
  if (!voicing) return;
  const now = ctx.currentTime;
  voicing.forEach((fret, i) => {
    if (fret === null) return;
    const freq = BASE_FREQS[i] * semi(fret);
    playString(ctx, freq, now + i * 0.03, 2.2, 0.16);
  });
}

export function playMetronomeClick(accent = false) {
  playClick(accent);
}

export function playXPSound() {
  const ctx = getCtx();
  [523, 659, 784, 1047].forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.1;
    playString(ctx, freq, t, 0.3, 0.15);
  });
}

export function playLevelUpSound() {
  const ctx = getCtx();
  [523, 659, 784, 1047, 1318].forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.12;
    playString(ctx, freq, t, 0.5, 0.2);
  });
}
