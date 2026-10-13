import React, {useLayoutEffect, useRef} from 'react';
import {FONT} from '../knn/font';
import {COLORS, H, W} from '../knn/theme';
import {CELL, GX, GY, HALF, HOT, PRIME, SIZE} from './data';

export interface SpiralView {
  readonly nVis: number; // Zahlen 1..nVis sind "gesetzt"
  readonly c: number; // Zellengroesse in Pixel
  readonly sx: number; // Bildschirmposition der Eins
  readonly sy: number;
  readonly wHot: number; // 0..1: primzahlreiche Linien einfaerben
  readonly wPar: number; // 0..1: gerade/ungerade Zahlen unterscheiden
  readonly fade: number; // Deckkraft der Primzahlen
  readonly pathAlpha: number; // Spiralpfad 1 -> 2 -> 3 ...
}

const NUMERAL_MIN_CELL = 30;
const DENSE_CELL = 12; // darunter: Quadrate statt Punkte, damit sich Diagonalen zu Linien schliessen
const MUTED_BLUE = '#bfcde2'; // gedaempfte Primzahlen, waehrend die Linien hervorgehoben sind
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const mix = (a: string, b: string, w: number): string => {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const k = clamp(w, 0, 1);
  return `rgb(${Math.round(r1 + (r2 - r1) * k)},${Math.round(g1 + (g2 - g1) * k)},${Math.round(b1 + (b2 - b1) * k)})`;
};

/** Eine Farbe pro Batch -> ein fill() pro Gruppe statt tausender Einzelaufrufe. */
const fillBatch = (ctx: CanvasRenderingContext2D, pts: readonly number[], r: number, color: string, alpha = 1): void => {
  if (pts.length === 0) return;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < pts.length; i += 2) {
    ctx.moveTo(pts[i] + r, pts[i + 1]);
    ctx.arc(pts[i], pts[i + 1], r, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.globalAlpha = 1;
};

const fillSquares = (ctx: CanvasRenderingContext2D, pts: readonly number[], side: number, color: string, alpha = 1): void => {
  if (pts.length === 0) return;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < pts.length; i += 2) ctx.rect(pts[i] - side / 2, pts[i + 1] - side / 2, side, side);
  ctx.fill();
  ctx.globalAlpha = 1;
};

const draw = (ctx: CanvasRenderingContext2D, v: SpiralView): void => {
  const {c, sx, sy, nVis} = v;
  const nInt = Math.floor(nVis);
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W, H);

  const bgR = clamp(c * 0.1, 0.8, 2.6);
  const primeR = clamp(c * 0.36, 2.1, 28);
  const plainColor = c < 12 ? '#dcdcdc' : COLORS.grid; // bei kleinen Zellen heller, damit die Primzahlen dominieren
  const showNum = c >= NUMERAL_MIN_CELL;
  const plain: number[] = [];
  const even: number[] = [];
  const odd: number[] = [];
  const primes: number[] = [];
  const hot: number[] = [];

  const gx0 = Math.floor(-sx / c) - 1;
  const gx1 = Math.ceil((W - sx) / c) + 1;
  const gy0 = Math.floor(-sy / c) - 1;
  const gy1 = Math.ceil((H - sy) / c) + 1;

  for (let gy = gy0; gy <= gy1; gy++) {
    for (let gx = gx0; gx <= gx1; gx++) {
      const x = sx + gx * c;
      const y = sy + gy * c;
      const inside = Math.abs(gx) <= HALF && Math.abs(gy) <= HALF;
      const n = inside ? CELL[(gy + HALF) * SIZE + (gx + HALF)] : 0;
      if (n === 0 || n > nInt) {
        plain.push(x, y);
      } else if (PRIME[n]) {
        if (!showNum) (HOT[n] && v.wHot > 0 ? hot : primes).push(x, y);
      } else if (!showNum) {
        (v.wPar > 0 ? (n % 2 === 0 ? even : odd) : plain).push(x, y);
      }
    }
  }

  fillBatch(ctx, plain, bgR, plainColor);
  fillBatch(ctx, even, bgR * (1 - 0.35 * v.wPar), mix(plainColor, '#ececec', v.wPar));
  fillBatch(ctx, odd, bgR * (1 + 1.1 * v.wPar), mix(plainColor, '#4d4d4d', v.wPar));
  const primeColor = mix(COLORS.blue, MUTED_BLUE, v.wHot); // Linien-Phase: uebrige Primzahlen treten zurueck
  const hotColor = mix(COLORS.blue, COLORS.accent, v.wHot);
  if (c < DENSE_CELL) {
    fillSquares(ctx, primes, Math.max(c * 0.9, 2.4), primeColor, v.fade);
    fillSquares(ctx, hot, Math.max(c * 0.95, 2.6), hotColor, v.fade);
  } else {
    fillBatch(ctx, primes, primeR, primeColor, v.fade);
    fillBatch(ctx, hot, primeR * (1 + 0.2 * v.wHot), hotColor, v.fade);
  }

  if (!showNum) return;

  // Grosse Ansicht: Spiralpfad und Zahlen statt Punkten
  if (v.pathAlpha > 0 && nInt > 1) {
    ctx.globalAlpha = v.pathAlpha;
    ctx.strokeStyle = COLORS.muted;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let n = 1; n <= nInt; n++) {
      const x = sx + GX[n] * c;
      const y = sy + GY[n] * c;
      if (n === 1) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let n = 1; n <= nInt; n++) {
    const x = sx + GX[n] * c;
    const y = sy + GY[n] * c;
    if (x < -c || x > W + c || y < -c || y > H + c) continue;
    if (PRIME[n]) {
      ctx.globalAlpha = v.fade;
      ctx.fillStyle = COLORS.blue;
      ctx.beginPath();
      ctx.arc(x, y, c * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLORS.bg;
      ctx.font = `800 ${c * 0.36}px ${FONT}`;
      ctx.fillText(String(n), x, y + c * 0.02);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = COLORS.muted;
      ctx.font = `500 ${c * 0.3}px ${FONT}`;
      ctx.fillText(String(n), x, y + c * 0.02);
    }
  }

  // Marker an der zuletzt gesetzten Zahl
  if (nInt >= 1 && nInt < 400) {
    ctx.strokeStyle = COLORS.accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(sx + GX[nInt] * c, sy + GY[nInt] * c, c * 0.44, 0, Math.PI * 2);
    ctx.stroke();
  }
};

export const SpiralCanvas: React.FC<{view: SpiralView}> = ({view}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (ctx) draw(ctx, view);
  });
  return <canvas ref={ref} width={W} height={H} style={{position: 'absolute', left: 0, top: 0}} />;
};
