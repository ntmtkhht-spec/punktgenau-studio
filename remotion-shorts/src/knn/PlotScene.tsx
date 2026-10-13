import React from 'react';
import {Easing, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {kf, ramp} from './anim';
import {dist, MAP_STEP, MAPS, NEIGHBORS, POINTS, QUERY, RADII} from './data';
import {FONT} from './font';
import {BOX_OUTLINE, COLORS, FPS, PLOT} from './theme';

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const classColor = (c: number): string => (c === 1 ? COLORS.orange : COLORS.blue);
/** Flaechige, deckende Toene fuer die Entscheidungsgebiete (kein Alpha). */
const tint = (c: number, conf: number): string =>
  c === 1
    ? conf > 0.8 ? COLORS.tintOrange : COLORS.tintOrangeSoft
    : conf > 0.8 ? COLORS.tintBlue : COLORS.tintBlueSoft;

const MAP_LAYERS = [
  {k: 3, from: 33, to: 36},
  {k: 1, from: 36, to: 43},
  {k: 25, from: 43, to: 46.5},
] as const;

const BURSTS = [
  {t0: 30, color: COLORS.orange},
  {t0: 36, color: COLORS.blue},
  {t0: 46.2, color: COLORS.orange},
] as const;

const BADGES = [
  ...NEIGHBORS[3].map((idx, j) => ({idx, label: String(j + 1), from: 26.5 + j * 0.25, to: 35.2})),
  {idx: NEIGHBORS[1][0], label: '1', from: 36.3, to: 43.2},
];

const CAM_T = [0, 5, 7.5, 11, 12.5, 18, 20, 21, 24, 33, 35, 46, 53];

export const PlotScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const q = QUERY;
  const n1 = POINTS[NEIGHBORS[1][0]];
  const mid = {x: (q.x + n1.x) / 2, y: (q.y + n1.y) / 2};

  // ---- Kamera -----------------------------------------------------------
  const scale = kf(frame, CAM_T, [1, 1, 1.7, 1.7, 2.4, 2.4, 1.15, 1.15, 2, 2, 1, 1, 1.08]);
  const fx = kf(frame, CAM_T, [450, 450, q.x, q.x, mid.x, mid.x, q.x, q.x, q.x, q.x, 450, 450, 450]);
  const fy = kf(frame, CAM_T, [450, 450, q.y, q.y, mid.y, mid.y, q.y, q.y, q.y, q.y, 450, 450, 450]);
  const px = (v: number): number => v / scale; // konstante Bildschirmgroesse

  // ---- Fokus-Phase (k Nachbarn) ----------------------------------------
  const stageK = t < 35.6 ? 3 : t < 43 ? 1 : 25;
  const focusSet = new Set(NEIGHBORS[stageK]);
  const focusAmt = kf(frame, [24, 26, 46, 47], [0, 1, 1, 0]);
  const ringR = kf(
    frame,
    [24, 26.5, 35, 36.2, 43, 44.5, 46, 47],
    [0, RADII[3] + 6, RADII[3] + 6, RADII[1] + 6, RADII[1] + 6, RADII[25] + 6, RADII[25] + 6, 0],
  );
  const plotDim = 1 - 0.7 * ramp(frame, 46.3, 47.2);

  // ---- Abstand: Dreieck + Radar -----------------------------------------
  const corner = {x: n1.x, y: q.y};
  const triOut = 1 - ramp(frame, 17.5, 18.3);
  const p1 = ramp(frame, 11.3, 12.3);
  const p2 = ramp(frame, 12.3, 13.3);
  const p3 = ramp(frame, 13.3, 14.3);
  const sweepR = kf(frame, [18, 20.6], [0, 560], Easing.inOut(Easing.quad));
  const sweepFade = kf(frame, [20.6, 22], [1, 0]);
  const sweepRingOp = t >= 18 && t < 21 ? 0.7 * (1 - ramp(frame, 20.3, 20.9)) : 0;

  const qColor = interpolateColors(
    frame,
    [0, 29.8, 30.2, 35.8, 36.2, 46, 46.5, 53].map((s) => s * FPS),
    [
      COLORS.neutral, COLORS.neutral, COLORS.orange, COLORS.orange,
      COLORS.blue, COLORS.blue, COLORS.orange, COLORS.orange,
    ],
  );
  const qPop = spring({frame: frame - 2.4 * fps, fps, config: {damping: 11, stiffness: 160}});
  const legDx = corner.x - q.x;
  const legDy = n1.y - corner.y;
  const away = {x: mid.x - corner.x, y: mid.y - corner.y};
  const awayLen = Math.hypot(away.x, away.y) || 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        top: 230,
        width: PLOT,
        height: PLOT,
        overflow: 'hidden',
        background: COLORS.panel,
        outline: BOX_OUTLINE,
      }}
    >
      <svg width={PLOT} height={PLOT} viewBox={`0 0 ${PLOT} ${PLOT}`} style={{fontFamily: FONT}}>
        <g transform={`translate(450 450) scale(${scale}) translate(${-fx} ${-fy})`}>
          {/* Punktraster */}
          <defs>
            <pattern id="plot-dots" width={50} height={50} patternUnits="userSpaceOnUse">
              <circle cx={25} cy={25} r={2.2} fill={COLORS.grid} />
            </pattern>
          </defs>
          <rect x={0} y={0} width={PLOT} height={PLOT} fill="url(#plot-dots)" />

          {/* Entscheidungsgebiete */}
          {MAP_LAYERS.map((layer) => {
            const op = Math.min(
              ramp(frame, layer.from, layer.from + 0.35),
              1 - ramp(frame, layer.to, layer.to + 0.35),
            );
            if (op <= 0.001) return null;
            return (
              <g key={layer.k} opacity={op} shapeRendering="crispEdges">
                {MAPS[layer.k].map((c) => (
                  <rect
                    key={`${c.x}-${c.y}`}
                    x={c.x}
                    y={c.y}
                    width={MAP_STEP}
                    height={MAP_STEP}
                    fill={tint(c.c, c.conf)}
                  />
                ))}
              </g>
            );
          })}

          {/* Radar-Sweep: Linien zu allen Punkten */}
          {t >= 18 && t < 22.1 && (
            <g opacity={sweepFade}>
              {POINTS.map((p, i) => {
                const a = clamp01((sweepR - dist(q, p)) / 25) * 0.4;
                return a > 0 ? (
                  <line key={i} x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke={COLORS.accent} strokeWidth={1.5} vectorEffect="non-scaling-stroke" opacity={a} />
                ) : null;
              })}
              <circle cx={q.x} cy={q.y} r={sweepR} fill="none" stroke={COLORS.accent} strokeWidth={3} vectorEffect="non-scaling-stroke" opacity={sweepRingOp} />
            </g>
          )}

          {/* Pythagoras-Dreieck */}
          {t >= 11.3 && t < 18.4 && (
            <g opacity={triOut} strokeLinecap="round">
              <line x1={q.x} y1={q.y} x2={q.x + legDx * p1} y2={q.y} stroke={COLORS.muted} strokeWidth={3} strokeDasharray="8 6" vectorEffect="non-scaling-stroke" />
              <line x1={corner.x} y1={corner.y} x2={corner.x} y2={corner.y + legDy * p2} stroke={COLORS.muted} strokeWidth={3} strokeDasharray="8 6" vectorEffect="non-scaling-stroke" />
              <line x1={q.x} y1={q.y} x2={q.x + (n1.x - q.x) * p3} y2={q.y + (n1.y - q.y) * p3} stroke={COLORS.accent} strokeWidth={5} vectorEffect="non-scaling-stroke" />
              <text x={(q.x + corner.x) / 2} y={q.y + (n1.y > q.y ? -px(18) : px(34))} textAnchor="middle" fontSize={px(30)} fontWeight={800} fill={COLORS.muted} opacity={p1}>Δx</text>
              <text x={corner.x + (q.x < n1.x ? px(18) : -px(18))} y={(corner.y + n1.y) / 2 + px(10)} textAnchor={q.x < n1.x ? 'start' : 'end'} fontSize={px(30)} fontWeight={800} fill={COLORS.muted} opacity={p2}>Δy</text>
              <text x={mid.x + (away.x / awayLen) * px(30)} y={mid.y + (away.y / awayLen) * px(30) + px(10)} textAnchor="middle" fontSize={px(34)} fontWeight={800} fill={COLORS.accent} opacity={p3}>d</text>
            </g>
          )}

          {/* k-Ring */}
          {ringR > 0.5 && (
            <circle
              cx={q.x}
              cy={q.y}
              r={ringR}
              fill="none"
              stroke={COLORS.text}
              strokeWidth={3}
              strokeDasharray="12 9"
              strokeDashoffset={-frame * 0.8}
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Datenpunkte */}
          <g opacity={plotDim}>
            {POINTS.map((p, i) => {
              const pop = spring({frame: frame - (0.3 + i * 0.045) * fps, fps, config: {damping: 12, stiffness: 180}});
              const inSet = focusSet.has(i);
              const dim = inSet ? 1 : 1 - 0.78 * focusAmt;
              const grow = inSet ? 1 + (stageK <= 3 ? 0.3 : 0.12) * focusAmt : 1;
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={12 * Math.max(pop, 0) * grow}
                  fill={classColor(p.c)}
                  opacity={Math.min(1, pop * 2) * dim}
                  stroke={inSet && focusAmt > 0.5 ? COLORS.text : 'none'}
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>

          {/* Rang-Plaketten */}
          {BADGES.map((b) => {
            const o = Math.min(ramp(frame, b.from, b.from + 0.5), 1 - ramp(frame, b.to, b.to + 0.4));
            if (o <= 0.01) return null;
            const p = POINTS[b.idx];
            return (
              <g key={`${b.idx}-${b.from}`} opacity={o}>
                <circle cx={p.x} cy={p.y - 30} r={13} fill={COLORS.text} />
                <text x={p.x} y={p.y - 24} textAnchor="middle" fontSize={17} fontWeight={800} fill={COLORS.bg}>{b.label}</text>
              </g>
            );
          })}

          {/* Pulsierende Ringe um den unbekannten Punkt */}
          {t >= 2.4 && t < 24 &&
            [0, 0.6].map((off) => {
              const ph = ((((t - 2.4 + off) % 1.2) + 1.2) % 1.2) / 1.2;
              return <circle key={off} cx={q.x} cy={q.y} r={16 + 44 * ph} fill="none" stroke={COLORS.neutral} strokeWidth={3} vectorEffect="non-scaling-stroke" opacity={0.55 * (1 - ph)} />;
            })}

          {/* Ergebnis-Schockwellen */}
          {BURSTS.map((b) => {
            const p = (t - b.t0) / 0.9;
            if (p <= 0 || p >= 1) return null;
            const e = Easing.out(Easing.cubic)(p);
            return <circle key={b.t0} cx={q.x} cy={q.y} r={18 + 130 * e} fill="none" stroke={b.color} strokeWidth={5} vectorEffect="non-scaling-stroke" opacity={0.85 * (1 - p)} />;
          })}

          {/* Unbekannter Punkt */}
          <g opacity={clamp01(qPop * 2)}>
            <circle cx={q.x} cy={q.y} r={17 * Math.max(qPop, 0)} fill={qColor} stroke={COLORS.text} strokeWidth={3.5} vectorEffect="non-scaling-stroke" />
            {t < 30 && (
              <text x={q.x} y={q.y + 8} textAnchor="middle" fontSize={22} fontWeight={800} fill={COLORS.text} opacity={qPop}>?</text>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};
