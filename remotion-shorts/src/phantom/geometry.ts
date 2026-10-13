import {ROAD, type State} from './sim';

export const CX = 540;
export const CY = 610;
export const R = 340;

export interface Pt {
  readonly x: number;
  readonly y: number;
}

export const angleOf = (x: number): number => (2 * Math.PI * x) / ROAD - Math.PI / 2;

export const ringPoint = (x: number, r: number = R): Pt => {
  const a = angleOf(x);
  return {x: CX + r * Math.cos(a), y: CY + r * Math.sin(a)};
};

const wrap = (d: number): number => ((((d + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

export interface Jam {
  readonly angle: number; // Mittelpunkt des Staus (Winkel)
  readonly span: number; // halbe Breite (Winkel)
  readonly count: number;
}

/** Findet den Stau: Kreismittel aller (fast) stehenden Autos. */
export const findJam = (st: State, slowBelow = 0.6): Jam | null => {
  const slow = st.x.filter((_, i) => st.v[i] < slowBelow).map(angleOf);
  if (slow.length < 2) return null;
  const mean = Math.atan2(
    slow.reduce((s, a) => s + Math.sin(a), 0),
    slow.reduce((s, a) => s + Math.cos(a), 0),
  );
  const span = Math.max(...slow.map((a) => Math.abs(wrap(a - mean))));
  return {angle: mean, span, count: slow.length};
};

export const arcPath = (center: number, span: number, r: number): string => {
  const a0 = center - span;
  const a1 = center + span;
  const large = span * 2 > Math.PI ? 1 : 0;
  const p = (a: number) => `${(CX + r * Math.cos(a)).toFixed(1)} ${(CY + r * Math.sin(a)).toFixed(1)}`;
  return `M ${p(a0)} A ${r} ${r} 0 ${large} 1 ${p(a1)}`;
};

export const lerpPt = (a: Pt, b: Pt, w: number): Pt => ({x: a.x + (b.x - a.x) * w, y: a.y + (b.y - a.y) * w});
