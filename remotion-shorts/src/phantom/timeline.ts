import {Easing} from 'remotion';
import raw from './words.json';

export interface Word {
  readonly text: string;
  readonly start: number; // Sekunden
  readonly end: number;
  readonly line: number; // Zeile im Voice-Skript (0-basiert)
}

export const WORDS: readonly Word[] = raw;
export const LINE_COUNT = Math.max(...WORDS.map((w) => w.line)) + 1;
const BY_LINE: readonly (readonly Word[])[] = Array.from({length: LINE_COUNT}, (_, i) =>
  WORDS.filter((w) => w.line === i),
);

export const lineStart = (i: number): number => BY_LINE[i][0].start;
export const lineEnd = (i: number): number => BY_LINE[i][BY_LINE[i].length - 1].end;
export const wordStart = (line: number, k: number): number =>
  BY_LINE[line][Math.min(k, BY_LINE[line].length - 1)].start;

export const TOTAL = WORDS[WORDS.length - 1].end + 0.6;

export type SimId = 'A' | 'B';
export interface SimPoint {
  readonly which: SimId;
  readonly time: number;
}

interface Segment {
  readonly from: number;
  readonly to: number;
  readonly which: SimId;
  readonly t0: number;
  readonly t1: number;
  readonly ease?: (x: number) => number;
}

/** Hook-Zustand: ausgewachsener Stau. Das Video endet wieder hier (Loop). */
export const HOOK_SIM_T = 160;
const REWIND = 1.1;
const BRAKE_T = 14;

const brakeWord = wordStart(4, 1); // "Jetzt BREMST eins"
const rewindStart = lineStart(2); // "Gleich siehst du es"

/** Abbildung Videozeit -> Simulationszeit. Alle Anker haengen an den Skriptzeilen. */
const SEGMENTS: readonly Segment[] = [
  {from: 0, to: rewindStart, which: 'A', t0: HOOK_SIM_T, t1: HOOK_SIM_T + rewindStart},
  {from: rewindStart, to: rewindStart + REWIND, which: 'A', t0: HOOK_SIM_T + rewindStart, t1: 0, ease: Easing.inOut(Easing.cubic)},
  {from: rewindStart + REWIND, to: brakeWord, which: 'A', t0: 0, t1: BRAKE_T},
  {from: brakeWord, to: lineStart(5), which: 'A', t0: BRAKE_T, t1: 18},
  {from: lineStart(5), to: lineEnd(7), which: 'A', t0: 18, t1: 75},
  {from: lineEnd(7), to: lineEnd(9), which: 'A', t0: 75, t1: 105},
  {from: lineEnd(9), to: lineStart(10), which: 'A', t0: 105, t1: 105},
  {from: lineStart(10), to: lineEnd(11), which: 'A', t0: 0, t1: 80},
  {from: lineEnd(11), to: lineStart(12), which: 'A', t0: 80, t1: 80},
  {from: lineStart(12), to: lineEnd(13), which: 'B', t0: 0, t1: 60},
  {from: lineEnd(13), to: lineStart(14), which: 'B', t0: 60, t1: 60},
  {from: lineStart(14), to: TOTAL, which: 'A', t0: 140, t1: HOOK_SIM_T},
];

export const simAt = (t: number): SimPoint => {
  const seg = SEGMENTS.find((s) => t >= s.from && t < s.to) ?? SEGMENTS[SEGMENTS.length - 1];
  const raw01 = seg.to > seg.from ? (t - seg.from) / (seg.to - seg.from) : 1;
  const x = Math.min(1, Math.max(0, raw01));
  const e = seg.ease ? seg.ease(x) : x;
  return {which: seg.which, time: seg.t0 + (seg.t1 - seg.t0) * e};
};
