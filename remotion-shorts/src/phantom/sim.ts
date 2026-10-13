/**
 * Dimensionsloses Bando-Modell (Optimal Velocity) auf einem Ring.
 * dv/dt = a (V(h) - v),  V(h) = tanh(h - 2) + tanh(2)
 * Instabil (Stau entsteht von selbst), wenn a < 2 V'(h); bei h = 2 gilt a < 2.
 * Auto i faehrt hinter Auto i+1. Positionen werden unwrapped gespeichert.
 */
export const N = 22;
export const H0 = 2;
export const ROAD = N * H0;
export const STORE_DT = 0.1;
const SUB = 10; // Integrationsschritte pro gespeichertem Schritt (dt = 0.01)

export interface SimParams {
  readonly a: number;
  readonly brakeAt: number;
  readonly brakeLen: number;
  readonly brakeV: number;
  readonly duration: number;
}

export interface Sim {
  readonly steps: number;
  readonly duration: number;
  readonly x: Float32Array; // [step * N + i]
  readonly v: Float32Array;
}

const V = (h: number): number => Math.tanh(h - 2) + Math.tanh(2);
export const V_EQ = V(H0);

export const runSim = (p: SimParams): Sim => {
  const steps = Math.round(p.duration / STORE_DT) + 1;
  const xs = new Float32Array(steps * N);
  const vs = new Float32Array(steps * N);
  const x = Array.from({length: N}, (_, i) => i * H0);
  const v = Array.from({length: N}, () => V_EQ);
  const dt = STORE_DT / SUB;

  for (let s = 0; s < steps; s++) {
    for (let i = 0; i < N; i++) {
      xs[s * N + i] = x[i];
      vs[s * N + i] = v[i];
    }
    for (let k = 0; k < SUB; k++) {
      const t = s * STORE_DT + k * dt;
      const acc = v.map((vi, i) => {
        const ahead = i === N - 1 ? x[0] + ROAD : x[i + 1];
        return p.a * (V(ahead - x[i]) - vi);
      });
      for (let i = 0; i < N; i++) {
        v[i] = Math.max(0, v[i] + acc[i] * dt);
        x[i] += v[i] * dt;
      }
      if (t >= p.brakeAt && t < p.brakeAt + p.brakeLen) {
        v[0] = Math.min(v[0], p.brakeV);
      }
    }
  }
  return {steps, duration: p.duration, x: xs, v: vs};
};

export interface State {
  readonly x: readonly number[];
  readonly v: readonly number[];
}

/** Linear interpolierter Zustand zur Simulationszeit t (Sekunden). */
export const stateAt = (sim: Sim, t: number): State => {
  const f = Math.min(Math.max(t, 0), sim.duration) / STORE_DT;
  const s0 = Math.min(Math.floor(f), sim.steps - 2);
  const w = f - s0;
  const x: number[] = [];
  const v: number[] = [];
  for (let i = 0; i < N; i++) {
    x.push(sim.x[s0 * N + i] * (1 - w) + sim.x[(s0 + 1) * N + i] * w);
    v.push(sim.v[s0 * N + i] * (1 - w) + sim.v[(s0 + 1) * N + i] * w);
  }
  return {x, v};
};
