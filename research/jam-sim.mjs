// Car-following (IDM) on a ring: does a phantom jam emerge, how fast does the wave move?
const N = 22, ROAD = 230, L = 4.5;
const v0 = 16.7, T = 1.0, s0 = 2, a = 1.0, b = 1.5, dt = 0.05;

const x = Array.from({length: N}, (_, i) => (i * ROAD) / N); // Position; Auto i faehrt hinter Auto i+1
const eq = () => {
  const gap = ROAD / N - L;
  let v = 0;
  for (let k = 0; k < 200; k++) {
    const sStar = s0 + v * T;
    v = v0 * Math.pow(1 - Math.pow(sStar / gap, 2), 0.25) || 0;
    if (!Number.isFinite(v)) v = 0;
  }
  return v;
};
const veq = eq();
const v = Array.from({length: N}, () => veq);
x[0] -= 0.5; // kleine Stoerung: ein Auto ist 0,5 m weiter hinten

const step = () => {
  const acc = x.map((xi, i) => {
    const j = (i + 1) % N;
    let gap = x[j] - xi - L;
    if (gap < 0) gap += ROAD;
    const dv = v[i] - v[j];
    const sStar = s0 + v[i] * T + (v[i] * dv) / (2 * Math.sqrt(a * b));
    return a * (1 - Math.pow(v[i] / v0, 4) - Math.pow(sStar / Math.max(gap, 0.1), 2));
  });
  for (let i = 0; i < N; i++) {
    v[i] = Math.max(0, v[i] + acc[i] * dt);
    x[i] = (x[i] + v[i] * dt) % ROAD;
  }
};

const log = [];
for (let t = 0; t <= 240; t += dt) {
  if (Math.abs(t % 10) < dt / 2) {
    const vmin = Math.min(...v), vmax = Math.max(...v);
    const iMin = v.indexOf(vmin);
    log.push({t: Math.round(t), vmin: +vmin.toFixed(2), vmax: +vmax.toFixed(2), xMin: +x[iMin].toFixed(1), iMin});
  }
  step();
}
console.log('v_eq =', veq.toFixed(2), 'm/s =', (veq * 3.6).toFixed(1), 'km/h');
console.table(log.filter((_, i) => i % 2 === 0));
