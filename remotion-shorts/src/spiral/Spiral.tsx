import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {kf, ramp} from '../knn/anim';
import {FONT} from '../knn/font';
import {COLORS, H, W} from '../knn/theme';
import {Captions} from '../phantom/Captions';
import {makeTimeline} from '../shared/words';
import {MAXN} from './data';
import {SpiralCanvas, type SpiralView} from './SpiralCanvas';
import raw from './words.json';

const TL = makeTimeline(raw);
export const SPIRAL_TOTAL = TL.total;

/** Safe Zone: Spirale links von den Plattform-Buttons, ueber dem Caption-Bereich. */
const SX = 500;
const SY = 680;
const FIT = 874;
const PARITY_CELL = 28;
const N_FULL = MAXN;
const N_FIRST = 49; // so viele Zahlen werden einzeln gezaehlt

const ease = Easing.inOut(Easing.cubic);
const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const cFit = (n: number): number => Math.min(90, FIT / Math.sqrt(Math.max(n, 1)));

const HALO = {stroke: COLORS.bg, strokeWidth: 26, paintOrder: 'stroke', strokeLinejoin: 'round'} as const;

export const Spiral: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {lineStart: ls, lineEnd: le, wordStart: ws, total} = TL;

  // ---- wie viele Zahlen sind gesetzt? --------------------------------
  const rewE = ls(2);
  const rewS = rewE - 1.3;
  const countS = ls(2) + 0.3;
  const countE = le(2) - 0.3;
  const growS = ls(3) + 0.2;
  const growE = le(3) - 0.6;

  let nVis = N_FULL;
  if (t >= rewS && t < rewE) nVis = Math.exp(Math.log(N_FULL) * (1 - ease(clamp01((t - rewS) / (rewE - rewS)))));
  else if (t >= rewE && t < countS) nVis = 1;
  else if (t >= countS && t < countE) nVis = 1 + (N_FIRST - 1) * clamp01((t - countS) / (countE - countS));
  else if (t >= countE && t < growS) nVis = N_FIRST;
  else if (t >= growS && t < growE) nVis = N_FIRST * Math.pow(N_FULL / N_FIRST, ease(clamp01((t - growS) / (growE - growS))));

  // ---- Kamera --------------------------------------------------------
  const push = kf(frame, [0, rewS, rewS + 0.2, total - 1.5, total], [1, 1.08, 1, 1, 1]);
  const wZoom = kf(frame, [ws(5, 5), ws(5, 5) + 1.0, le(5) - 0.8, le(5) + 0.3], [0, 1, 1, 0]);
  const cBase = cFit(nVis) * push;
  const c = Math.exp(Math.log(cBase) * (1 - wZoom) + Math.log(PARITY_CELL) * wZoom);

  // ---- Faerbung / Einblendungen ---------------------------------------
  const wHot = kf(
    frame,
    // Start = Ende (Loop): Linien sind im ersten und im letzten Bild eingefaerbt
    [0, ls(1) + 0.3, ls(1) + 1.0, le(3) - 1.0, le(3) + 0.6, ls(5) + 0.2, ls(5) + 1.0, ls(6) + 0.2, ls(6) + 0.9],
    [1, 1, 0, 0, 1, 1, 0, 0, 1],
  );
  const wPar = kf(frame, [ws(5, 10), ws(5, 10) + 0.9, le(5) - 0.8, le(5) + 0.1], [0, 1, 1, 0]);
  const fade = kf(frame, [ls(7) + 0.3, ls(7) + 0.9, le(7) + 0.2, le(7) + 0.8], [1, 0.12, 0.12, 1]);
  const pathAlpha = kf(frame, [ls(2) + 0.2, ls(2) + 0.6, le(2) - 0.3, le(2) + 0.5], [0, 0.5, 0.5, 0]);

  const view: SpiralView = {nVis, c, sx: SX, sy: SY, wHot, wPar, fade, pathAlpha};

  const ulam = kf(frame, [ls(4) + 0.3, ls(4) + 0.8, le(4) - 0.2, le(4) + 0.3], [0, 1, 1, 0]);
  const question = kf(frame, [ws(6, 9), ws(6, 9) + 0.4, le(6) + 0.2, le(6) + 0.7], [0, 1, 1, 0]);
  const euler = kf(frame, [ws(7, 6), ws(7, 6) + 0.4, le(7) + 0.1, le(7) + 0.6], [0, 1, 1, 0]);
  const rowStart = ws(7, 15);
  const rowDone = ramp(frame, rowStart + 1.8, rowStart + 2.3);

  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      <SpiralCanvas view={view} />
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, fontFamily: FONT}} textAnchor="middle">
        {ulam > 0.01 && (
          <g opacity={ulam}>
            <text x={SX} y={SY + 40} fontSize={230} fontWeight={800} fill={COLORS.text} {...HALO}>1963</text>
            <text x={SX} y={SY + 40} fontSize={230} fontWeight={800} fill={COLORS.text}>1963</text>
            <text x={SX} y={SY + 120} fontSize={64} fontWeight={800} fill={COLORS.muted} {...HALO}>Stanislaw Ulam</text>
            <text x={SX} y={SY + 120} fontSize={64} fontWeight={800} fill={COLORS.muted}>Stanislaw Ulam</text>
          </g>
        )}
        {question > 0.01 && (
          <g opacity={question}>
            <text x={SX} y={SY + 110} fontSize={340} fontWeight={800} fill={COLORS.accent} {...HALO}>?</text>
            <text x={SX} y={SY + 110} fontSize={340} fontWeight={800} fill={COLORS.accent}>?</text>
          </g>
        )}
        {euler > 0.01 && (
          <g opacity={euler}>
            <text x={SX} y={SY - 150} fontSize={104} fontWeight={800} fill={COLORS.text} {...HALO}>n² + n + 41</text>
            <text x={SX} y={SY - 150} fontSize={104} fontWeight={800} fill={COLORS.text}>n² + n + 41</text>
            <text x={SX} y={SY - 84} fontSize={46} fontWeight={800} fill={COLORS.muted} {...HALO}>n = 0 bis 39</text>
            <text x={SX} y={SY - 84} fontSize={46} fontWeight={800} fill={COLORS.muted}>n = 0 bis 39</text>
            {Array.from({length: 40}, (_, i) =>
              t >= rowStart + (i * 1.8) / 40 ? (
                <circle key={i} cx={SX + (i - 19.5) * 20} cy={SY + 10} r={8} fill={COLORS.blue} />
              ) : null,
            )}
            <g opacity={rowDone}>
              <text x={SX} y={SY + 170} fontSize={150} fontWeight={800} fill={COLORS.accent} {...HALO}>40 von 40</text>
              <text x={SX} y={SY + 170} fontSize={150} fontWeight={800} fill={COLORS.accent}>40 von 40</text>
            </g>
          </g>
        )}
      </svg>
      <Captions words={TL.words} />
    </AbsoluteFill>
  );
};
