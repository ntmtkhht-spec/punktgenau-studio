// Ulam-Spirale: 1 in der Mitte, 2 rechts daneben, dann gegen den Uhrzeigersinn.
const SIZE = 401; // ungerade
const MAXN = SIZE * SIZE;
const sieve = new Uint8Array(MAXN + 2).fill(1); sieve[0] = sieve[1] = 0;
for (let i = 2; i * i <= MAXN; i++) if (sieve[i]) for (let j = i * i; j <= MAXN; j += i) sieve[j] = 0;

const grid = Array.from({length: SIZE}, () => new Array(SIZE).fill(0));
let x = (SIZE - 1) / 2, y = x, n = 1, step = 1;
const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]]; // rechts, hoch, links, runter
grid[y][x] = 1;
outer: for (let d = 0; ; d++) {
  for (let rep = 0; rep < 2; rep++) {
    const [dx, dy] = dirs[(2 * d + rep) % 4];
    for (let s = 0; s < step; s++) {
      x += dx; y += dy; n++;
      if (n > MAXN) break outer;
      grid[y][x] = n;
    }
    if (rep === 1 || rep === 0) {}
    if (rep === 0 && false) {}
  }
  step++;
}
// Spirale korrekt: Schritte 1,1,2,2,3,3,... -> d-Schleife oben liefert (2d, 2d+1) mit gleicher Laenge; fix:
