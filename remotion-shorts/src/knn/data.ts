export type Cls = 0 | 1; // 0 = blau, 1 = orange

export interface Pt {
  readonly x: number;
  readonly y: number;
  readonly c: Cls;
}

export interface Cell extends Pt {
  readonly conf: number;
}

export const PLOT_SIZE = 900;
export const MAP_STEP = 18;
export const KS = [1, 3, 25] as const;

const mulberry32 = (seed: number) => {
  let a = seed;
  return (): number => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const gauss = (rand: () => number): number => {
  const u = Math.max(rand(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
};

const clamp = (v: number): number => Math.min(PLOT_SIZE - 60, Math.max(60, v));

const cluster = (
  rand: () => number,
  n: number,
  cx: number,
  cy: number,
  sd: number,
  c: Cls,
): readonly Pt[] =>
  Array.from({length: n}, () => ({
    x: clamp(cx + gauss(rand) * sd),
    y: clamp(cy + gauss(rand) * sd),
    c,
  }));

export const dist = (a: {x: number; y: number}, b: {x: number; y: number}) =>
  Math.hypot(a.x - b.x, a.y - b.y);

/** Indizes der k naechsten Punkte, aufsteigend nach Abstand. */
export const neighbors = (
  pts: readonly Pt[],
  p: {x: number; y: number},
  k: number,
): readonly number[] =>
  pts
    .map((q, i) => ({i, d: dist(p, q)}))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((o) => o.i);

export const vote = (pts: readonly Pt[], idx: readonly number[]) => {
  const orange = idx.filter((i) => pts[i].c === 1).length;
  return {orange, blue: idx.length - orange, winner: (orange > idx.length / 2 ? 1 : 0) as Cls};
};

const classify = (pts: readonly Pt[], p: {x: number; y: number}, k: number) =>
  vote(pts, neighbors(pts, p, k)).winner;

const buildPoints = (): readonly Pt[] => {
  const rand = mulberry32(7);
  return [
    ...cluster(rand, 30, 290, 320, 90, 0),
    ...cluster(rand, 16, 620, 600, 85, 1),
    // zwei blaue "Ausreisser" im orangen Gebiet -> k=1 liegt daneben
    {x: 505, y: 505, c: 0},
    {x: 560, y: 440, c: 0},
  ];
};

const findQuery = (pts: readonly Pt[]): Pt => {
  const found: {x: number; y: number; score: number}[] = [];
  for (let x = 380; x <= 560; x += 4) {
    for (let y = 380; y <= 560; y += 4) {
      const p = {x, y};
      const idx = neighbors(pts, p, 4);
      const d = idx.map((i) => dist(p, pts[i]));
      const ok =
        classify(pts, p, 1) === 0 &&
        classify(pts, p, 3) === 1 &&
        classify(pts, p, 25) === 0 &&
        d[0] > 28 &&
        d[2] > 60 &&
        d[2] < 135 &&
        d[3] - d[2] > 12 &&
        d[1] - d[0] > 10;
      if (ok) found.push({x, y, score: Math.hypot(x - 450, y - 450)});
    }
  }
  if (found.length === 0) {
    throw new Error('Kein passender Query-Punkt fuer die Geschichte gefunden');
  }
  const best = found.reduce((a, b) => (a.score <= b.score ? a : b));
  return {x: best.x, y: best.y, c: 0};
};

const buildMap = (pts: readonly Pt[], k: number): readonly Cell[] => {
  const cells: Cell[] = [];
  for (let x = 0; x < PLOT_SIZE; x += MAP_STEP) {
    for (let y = 0; y < PLOT_SIZE; y += MAP_STEP) {
      const p = {x: x + MAP_STEP / 2, y: y + MAP_STEP / 2};
      const v = vote(pts, neighbors(pts, p, k));
      cells.push({x, y, c: v.winner, conf: Math.max(v.orange, v.blue) / k});
    }
  }
  return cells;
};

export const POINTS = buildPoints();
export const QUERY = findQuery(POINTS);
export const NEIGHBORS: Readonly<Record<number, readonly number[]>> = Object.fromEntries(
  KS.map((k) => [k, neighbors(POINTS, QUERY, k)]),
);
export const RADII: Readonly<Record<number, number>> = Object.fromEntries(
  KS.map((k) => [k, dist(QUERY, POINTS[NEIGHBORS[k][k - 1]])]),
);
export const MAPS: Readonly<Record<number, readonly Cell[]>> = Object.fromEntries(
  KS.map((k) => [k, buildMap(POINTS, k)]),
);
