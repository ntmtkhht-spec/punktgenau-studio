/**
 * Ulam-Spirale: 1 in der Mitte, 2 rechts daneben, dann gegen den Uhrzeigersinn.
 * Koordinaten: x nach rechts, y nach unten (Bildschirm), Mitte = (0, 0).
 */
export const SIZE = 141; // ungerade -> Mitte ist ein Gitterpunkt
export const HALF = (SIZE - 1) / 2;
export const MAXN = SIZE * SIZE;

const MIN_LINE_CELLS = 40;
/**
 * Eine Diagonale gilt als "heiss", wenn ihr Primzahlanteil mindestens das 3,2-fache der Gesamtdichte ist
 * (141x141: 10 Linien, ca. 18 % aller Primzahlen). Mit 2,7-fach (frueher) waren es 29 Linien und fast
 * die Haelfte aller Primzahlen, dann faellt keine Linie mehr auf (siehe research/ulam_render.py).
 */
const MIN_LINE_MULT = 3.2;

const sieve = (limit: number): Uint8Array => {
  const prime = new Uint8Array(limit + 1).fill(1);
  prime[0] = 0;
  prime[1] = 0;
  for (let i = 2; i * i <= limit; i++) {
    if (prime[i]) for (let j = i * i; j <= limit; j += i) prime[j] = 0;
  }
  return prime;
};

export const PRIME = sieve(MAXN);
export const GX = new Int16Array(MAXN + 1);
export const GY = new Int16Array(MAXN + 1);
/** Gitterzelle -> Zahl n (0 = ausserhalb). Index: (y + HALF) * SIZE + (x + HALF). */
export const CELL = new Int32Array(SIZE * SIZE);
/** 1 = Primzahl auf einer primzahlreichen Diagonale (wird spaeter hervorgehoben). */
export const HOT = new Uint8Array(MAXN + 1);

const build = (): void => {
  const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
  let x = 0;
  let y = 0;
  let dir = 0;
  let len = 1;
  let n = 1;
  GX[1] = 0;
  GY[1] = 0;
  CELL[HALF * SIZE + HALF] = 1;
  while (n < MAXN) {
    for (let rep = 0; rep < 2 && n < MAXN; rep++) {
      for (let s = 0; s < len && n < MAXN; s++) {
        x += dirs[dir][0];
        y += dirs[dir][1];
        n++;
        GX[n] = x;
        GY[n] = y;
        CELL[(y + HALF) * SIZE + (x + HALF)] = n;
      }
      dir = (dir + 1) % 4;
    }
    len++;
  }
};

const markHotLines = (): void => {
  const stats = [new Map<number, [number, number]>(), new Map<number, [number, number]>()];
  const keys = (n: number): [number, number] => [GX[n] - GY[n], GX[n] + GY[n]];
  for (let n = 1; n <= MAXN; n++) {
    keys(n).forEach((k, f) => {
      const e = stats[f].get(k) ?? [0, 0];
      e[0] += 1;
      e[1] += PRIME[n];
      stats[f].set(k, e);
    });
  }
  const baseDensity = PRIME.reduce((a, b) => a + b, 0) / MAXN;
  for (let n = 1; n <= MAXN; n++) {
    if (!PRIME[n]) continue;
    const hot = keys(n).some((k, f) => {
      const [cells, primes] = stats[f].get(k) ?? [0, 0];
      return cells >= MIN_LINE_CELLS && primes / cells >= MIN_LINE_MULT * baseDensity;
    });
    if (hot) HOT[n] = 1;
  }
};

build();
markHotLines();
