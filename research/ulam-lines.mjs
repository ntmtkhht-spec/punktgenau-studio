const SIZE = 141, MAXN = SIZE * SIZE;
const isPrime = new Uint8Array(MAXN + 2).fill(1); isPrime[0] = isPrime[1] = 0;
for (let i = 2; i * i <= MAXN; i++) if (isPrime[i]) for (let j = i * i; j <= MAXN; j += i) isPrime[j] = 0;
const pos = [null];
let x = 0, y = 0, n = 1, dir = 0, len = 1; pos.push([0, 0]);
const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]];
while (n < MAXN) { for (let r = 0; r < 2 && n < MAXN; r++) { for (let s = 0; s < len && n < MAXN; s++) { x += dirs[dir][0]; y += dirs[dir][1]; n++; pos.push([x, y]); } dir = (dir + 1) % 4; } len++; }
const stat = (key) => {
  const m = new Map();
  for (let k = 1; k <= MAXN; k++) { const [px, py] = pos[k]; const id = key(px, py); const e = m.get(id) ?? {cells: 0, primes: 0}; e.cells++; if (isPrime[k]) e.primes++; m.set(id, e); }
  return m;
};
const fam = {d1: stat((a, b) => a - b), d2: stat((a, b) => a + b)};
for (const th of [0.15, 0.2, 0.25, 0.3]) {
  let lines = 0, hot = 0;
  for (const m of Object.values(fam)) for (const e of m.values()) if (e.cells >= 40 && e.primes / e.cells >= th) { lines++; hot += e.primes; }
  console.log('Dichte >=', th, 'Linien', lines, 'markierte Primzahlen', hot, 'von', isPrime.reduce((a, b) => a + b, 0));
}
console.log('Gesamtdichte', (isPrime.reduce((a, b) => a + b, 0) / MAXN).toFixed(3));
