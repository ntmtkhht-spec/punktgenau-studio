import React from 'react';
import {COLORS} from '../knn/theme';
import {ROAD, runSim, stateAt, N} from './sim';

/** Raumzeit-Diagramm: Ort nach rechts, Zeit nach unten. Stau = dunkles Band. */
export const DIAGRAM = {x: 150, y: 690, w: 760, h: 420};
const BINS_X = N;
const BINS_T = 84;
const T_START = 55;
const BIN_W = ROAD / BINS_X;

const buildCells = (): readonly {xi: number; ti: number}[] => {
  const sim = runSim({a: 1.0, brakeAt: 14, brakeLen: 1.5, brakeV: 0.35, duration: T_START + BINS_T + 2});
  const cells: {xi: number; ti: number}[] = [];
  for (let ti = 0; ti < BINS_T; ti++) {
    const st = stateAt(sim, T_START + ti);
    const counts = new Array<number>(BINS_X).fill(0);
    st.x.forEach((x) => {
      const bin = Math.floor((((x % ROAD) + ROAD) % ROAD) / BIN_W) % BINS_X;
      counts[bin] += 1;
    });
    counts.forEach((c, xi) => {
      if (c >= 2) cells.push({xi, ti});
    });
  }
  return cells;
};

const CELLS = buildCells();
const CELL_W = DIAGRAM.w / BINS_X;
const CELL_H = DIAGRAM.h / BINS_T;

export const SpaceTime: React.FC<{reveal: number; opacity: number}> = ({reveal, opacity}) => {
  if (opacity <= 0.001) return null;
  const {x, y, w, h} = DIAGRAM;
  return (
    <g opacity={opacity}>
      <clipPath id="st-reveal">
        <rect x={x} y={y} width={w} height={h * reveal} />
      </clipPath>
      <g clipPath="url(#st-reveal)">
        {CELLS.map((c) => (
          <rect key={`${c.xi}-${c.ti}`} x={x + c.xi * CELL_W} y={y + c.ti * CELL_H} width={CELL_W + 0.5} height={CELL_H + 0.5} fill={COLORS.accent} />
        ))}
      </g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={COLORS.text} strokeWidth={3} />
      <line x1={x} y1={y} x2={x} y2={y + h} stroke={COLORS.text} strokeWidth={3} />
      <text x={x + w} y={y - 14} textAnchor="end" fontSize={34} fontWeight={800} fill={COLORS.muted}>Ort →</text>
      <text x={x + 14} y={y + 42} fontSize={34} fontWeight={800} fill={COLORS.muted}>Zeit ↓</text>
    </g>
  );
};
