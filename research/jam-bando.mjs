// Dimensionsloses Bando-Modell: dv/dt = a (V(h) - v), V(h) = tanh(h-2) + tanh(2).
// Instabil, wenn a < 2 V'(h); bei h = 2 ist V' = 1, also a < 2 (hier a = 1).
const N = 22, a = 1.0, h0 = 2.0, ROAD = N * h0, dt = 0.01;
const V = (h) => Math.tanh(h - 2) + Math.tanh(2);

const x = Array.from({length: N}, (_, i) => i * h0);
const v = Array.from({length: N}, () => V(h0));
x[0] -= 0.1; // winzige Stoerung

const headway = (i) => {
  let h = x[(i + 1) % N] - x[i];
  if (h <= 0) h += ROAD;
  return h;
};

const rows = [];
let lastSlowCenter = null;
for (let t = 0; t <= 400; t += dt) {
  if (Math.abs(t - Math.round(t / 20) * 20) < dt / 2) {
    const vmin = Math.min(...v), vmax = Math.max(...v);
    const iMin = v.indexOf(vmin);
    rows.push({t: Math.round(t), vmin: +vmin.toFixed(3), vmax: +vmax.toFixed(3), slowestCar: iMin, slowestPos: +x[iMin].toFixed(1)});
  }
  const acc = v.map((vi, i) => a * (V(headway(i)) - vi));
  for (let i = 0; i < N; i++) {
    v[i] = Math.max(0, v[i] + acc[i] * dt);
    x[i] = (x[i] + v[i] * dt) % ROAD;
  }
}
console.log('v_eq =', V(h0).toFixed(3));
console.table(rows);
