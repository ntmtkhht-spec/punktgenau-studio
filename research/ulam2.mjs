const SIZE = 401, MAXN = SIZE * SIZE;
const isPrime = new Uint8Array(MAXN + 2).fill(1); isPrime[0] = isPrime[1] = 0;
for (let i = 2; i * i <= MAXN; i++) if (isPrime[i]) for (let j = i * i; j <= MAXN; j += i) isPrime[j] = 0;

const grid = Array.from({length: SIZE}, () => new Int32Array(SIZE));
const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
let x = (SIZE - 1) / 2, y = x, n = 1, dir = 0, len = 1;
grid[y][x] = 1;
while (n < MAXN) {
  for (let rep = 0; rep < 2 && n < MAXN; rep++) {
    for (let s = 0; s < len && n < MAXN; s++) {
      x += dirs[dir][0]; y += dirs[dir][1]; n++; grid[y][x] = n;
    }
    dir = (dir + 1) % 4;
  }
  len++;
}
const mid = (SIZE - 1) / 2;
// 1) Paritaet entlang der Diagonalen (x - y = const bzw. x + y = const)
const parityOK = (key) => {
  const m = new Map();
  for (let yy = 0; yy < SIZE; yy++) for (let xx = 0; xx < SIZE; xx++) {
    const v = grid[yy][xx]; if (!v) continue;
    const k = key(xx, yy); const p = v % 2;
    if (!m.has(k)) m.set(k, new Set()); m.get(k).add(p);
  }
  return [...m.values()].filter((s) => s.size > 1).length;
};
console.log('Diagonalen (x-y) mit gemischter Paritaet:', parityOK((a, b) => a - b));
console.log('Diagonalen (x+y) mit gemischter Paritaet:', parityOK((a, b) => a + b));
// 2) Laengste Primzahlkette entlang einer Diagonalen
let best = {len: 0};
for (const [dx, dy] of [[1, 1], [1, -1]]) {
  for (let sy = 0; sy < SIZE; sy++) for (let sx = 0; sx < SIZE; sx++) {
    let px = sx - dx, py = sy - dy;
    if (px >= 0 && px < SIZE && py >= 0 && py < SIZE) continue; // nur Startpunkte am Rand
    let run = 0, startVal = 0, cx = sx, cy = sy;
    while (cx >= 0 && cx < SIZE && cy >= 0 && cy < SIZE) {
      const v = grid[cy][cx];
      if (v && isPrime[v]) { if (run === 0) startVal = v; run++; if (run > best.len) best = {len: run, start: startVal, dx, dy}; }
      else run = 0;
      cx += dx; cy += dy;
    }
  }
}
console.log('Laengste Primzahlkette auf einer Diagonale:', best);
// 3) Anteil Primzahlen auf Diagonalen mit ungerader Paritaet vs. Zufall
let primes = 0, onOddDiag = 0;
for (let yy = 0; yy < SIZE; yy++) for (let xx = 0; xx < SIZE; xx++) { const v = grid[yy][xx]; if (v && isPrime[v]) primes++; }
console.log('Primzahlen im Gitter (401x401):', primes, 'von', MAXN, 'Zahlen =', (100 * primes / MAXN).toFixed(1) + '%');
// 4) Euler: n^2+n+41 prim fuer n=0..39
const pr = (k) => { if (k < 2) return false; for (let d = 2; d * d <= k; d++) if (k % d === 0) return false; return true; };
let ok = 0; for (let k = 0; k < 60; k++) { if (pr(k * k + k + 41)) ok++; else { console.log('Euler bricht bei n =', k, 'ab (Wert', k*k+k+41, ')'); break; } }
console.log('Euler-Kette:', ok);
