// src/components/ChordDiagram.jsx
import React from 'react';

/**
 * Renders a guitar chord diagram as SVG.
 * frets: array of 6 values (string 6 to 1), 'x' = muted, 0 = open, int = fret
 * fingers: [{str, fret, finger}] - str is 1-6
 */
export default function ChordDiagram({ chord, size = 1 }) {
  if (!chord?.svgData) return null;

  const { frets, fingers = [], startFret = 0 } = chord.svgData;

  // Layout constants
  const W = 140 * size;
  const H = 170 * size;
  const STRINGS = 6;
  const FRET_ROWS = 5;
  const leftPad = 30 * size;
  const rightPad = 14 * size;
  const topPad = 40 * size;
  const bottomPad = 20 * size;

  const gridW = W - leftPad - rightPad;
  const gridH = H - topPad - bottomPad;
  const strGap = gridW / (STRINGS - 1);
  const fretGap = gridH / FRET_ROWS;

  const dotR = 9 * size;

  const strX = (i) => leftPad + i * strGap; // i: 0 = string 6, 5 = string 1
  const fretY = (f) => topPad + f * fretGap; // f: 0 = nut

  // Determine if barre
  const numericFrets = frets.filter(f => typeof f === 'number' && f > 0);
  const minFret = numericFrets.length ? Math.min(...numericFrets) : 0;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* Chord name */}
      <text x={W / 2} y={18 * size} textAnchor="middle"
        fontFamily="'Fraunces', serif"
        fontSize={16 * size}
        fontStyle="italic"
        fill="var(--text-1)">
        {chord.name}
      </text>

      {/* Nut / top line */}
      <rect x={leftPad} y={topPad} width={gridW} height={3 * size}
        fill={startFret > 0 ? 'none' : 'var(--text-1)'} />

      {/* Fret lines */}
      {Array.from({ length: FRET_ROWS + 1 }).map((_, i) => (
        <line key={i}
          x1={leftPad} y1={topPad + i * fretGap}
          x2={leftPad + gridW} y2={topPad + i * fretGap}
          stroke="var(--border)" strokeWidth={i === 0 ? 1 : 1.5 * size}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: STRINGS }).map((_, i) => (
        <line key={i}
          x1={strX(i)} y1={topPad}
          x2={strX(i)} y2={topPad + gridH}
          stroke="var(--text-3)" strokeWidth={1 * size}
        />
      ))}

      {/* Fret position label */}
      {startFret > 0 && (
        <text x={leftPad - 8 * size} y={topPad + fretGap * 0.7}
          textAnchor="end"
          fontSize={10 * size}
          fill="var(--text-2)"
          fontFamily="'DM Mono', monospace">
          {startFret}fr
        </text>
      )}

      {/* Open / muted indicators */}
      {frets.map((f, i) => {
        const strIdx = STRINGS - 1 - i; // frets[0] = string 6 = leftmost
        const cx = strX(strIdx);
        const cy = topPad - 12 * size;
        if (f === 'x') {
          return (
            <g key={i}>
              <line x1={cx - 5 * size} y1={cy - 5 * size} x2={cx + 5 * size} y2={cy + 5 * size} stroke="var(--red)" strokeWidth={1.5 * size} />
              <line x1={cx + 5 * size} y1={cy - 5 * size} x2={cx - 5 * size} y2={cy + 5 * size} stroke="var(--red)" strokeWidth={1.5 * size} />
            </g>
          );
        }
        if (f === 0) {
          return (
            <circle key={i} cx={cx} cy={cy} r={5 * size}
              fill="none" stroke="var(--text-2)" strokeWidth={1.5 * size} />
          );
        }
        return null;
      })}

      {/* Finger dots */}
      {fingers.map((d, i) => {
        // d.str: 1 = high e (right), 6 = low E (left)
        const strIdx = STRINGS - d.str;
        const cx = strX(strIdx);
        const cy = fretY(d.fret) - fretGap / 2;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={dotR}
              fill="var(--accent)" />
            <text x={cx} y={cy + 4 * size}
              textAnchor="middle"
              fontSize={9 * size}
              fill="#fff"
              fontFamily="'Syne', sans-serif"
              fontWeight="700">
              {d.finger}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
