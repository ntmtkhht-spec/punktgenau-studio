// Bando "Optimal Velocity Model" auf dem Ring. Auto i faehrt hinter Auto i+1.
const N = 22, ROAD = 230, dt = 0.02;
const A = +process.argv[2] || 0.9;
const V = (h) => 6.75 + 7.91 * Math.tanh(0.13 * (h - 5) - 1.57);

const x = Array.from({length: N}, (_, i) => (i * ROAD) / N);
const v = Array.from({length: N}, () => V(ROAD / N));
x[0] -= 0.5; // minimale Stoerung

const headway = (i) => {
  let h = x[(i + 1) % N] - x[i];
  if (h <= 0) h += ROAD;
  return h;
};

const rows = [];
for (let t = 0; t <= 120; t += dt) {
  if (Math.abs(t - Math.round(t / 10) * 10) < dt / 2) {
    const vmin = Math.min(...v), vmax = Math.max(...v);
    const slow = v.map((vi, i) => (vi < 1.5 ? i : -1)).filter((i) => i >= 0);
    rows.push({t: Math.round(t), vminKmh: +(vmin * 3.6).toFixed(1), vmaxKmh: +(vmax * 3.6).toFixed(1), stoppedCars: slow.length, slowIdx: slow.join(',')});
  }
  const acc = v.map((vi, i) => A * (V(headway(i)) - vi));
  for (let i = 0; i < N; i++) {
    v[i] = Math.max(0, v[i] + acc[i] * dt);
    x[i] = (x[i] + v[i] * dt) % ROAD;
  }
}
console.log('a =', A, ' v_eq =', (V(ROAD / N) * 3.6).toFixed(1), 'km/h');
console.table(rows);
