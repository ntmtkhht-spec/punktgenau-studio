import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {kf} from '../knn/anim';
import {FONT} from '../knn/font';
import {COLORS} from '../knn/theme';
import {DotBackground} from '../shared/DotBackground';
import {Captions} from './Captions';
import {arcPath, CX, CY, findJam, lerpPt, R, ringPoint, type Pt} from './geometry';
import {N, runSim, stateAt} from './sim';
import {SpaceTime} from './SpaceTime';
import {lineEnd, lineStart, simAt, WORDS, wordStart} from './timeline';

const SIM_A = runSim({a: 1.0, brakeAt: 14, brakeLen: 1.5, brakeV: 0.35, duration: 260});
const SIM_B = runSim({a: 2.6, brakeAt: 14, brakeLen: 1.5, brakeV: 0.35, duration: 120});

const CAR_R = 17;
const SLOW = COLORS.accent;
const FAST = COLORS.blue;

const carColor = (v: number): string =>
  interpolateColors(Math.min(1, Math.max(0, (v - 0.1) / 0.75)), [0, 1], [SLOW, FAST]);

const clock = (simSeconds: number): string => {
  const s = Math.floor(simSeconds * 3);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export const Phantom: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const sp = simAt(t);
  const st = stateAt(sp.which === 'A' ? SIM_A : SIM_B, sp.time);
  const jam = sp.which === 'A' ? findJam(st) : null;

  // ---- Zeitpunkte aus dem Skript ------------------------------------
  const brake = wordStart(4, 1);
  const rewind = lineStart(2);
  const dStart = lineStart(9) + 0.2;
  const dEnd = lineEnd(9) + 0.1;

  // ---- Kamera ---------------------------------------------------------
  const wJam = kf(frame, [0, rewind - 0.2, rewind + 0.5], [1, 1, 0]);
  const wCar = kf(frame, [brake - 1.4, brake - 0.4, lineStart(5) + 0.2, lineStart(5) + 1.0], [0, 1, 1, 0]);
  const center: Pt = {x: CX, y: CY};
  const focus = lerpPt(center, ringPoint(st.x[0]), wCar);
  // Hook: leicht herangezoomt, bleibt aber in der Safe Zone (x 130-950, y < 1060)
  const scale = 1 + 0.2 * wJam + 0.85 * wCar;

  // Ring schrumpft nach oben, wenn das Raumzeit-Diagramm erscheint
  const ringK = kf(frame, [dStart, dStart + 0.7, dEnd, dEnd + 0.6], [1, 0.56, 0.56, 1]);
  const ringY = kf(frame, [dStart, dStart + 0.7, dEnd, dEnd + 0.6], [CY, 400, 400, CY]);

  // ---- Einblendungen ---------------------------------------------------
  const wTrig = kf(frame, [brake - 1.0, brake - 0.1, brake + 2.6, brake + 3.4], [0, 1, 1, 0]);
  const wArcHook = kf(frame, [0, rewind - 0.3, rewind + 0.2], [1, 1, 0]);
  const wArcExplain = kf(frame, [lineStart(8) - 0.3, lineStart(8) + 0.3, dEnd, dEnd + 0.4], [0, 1, 1, 0]);
  const wArc = Math.max(wArcHook, wArcExplain);
  const n22 = kf(frame, [lineStart(3) + 0.1, lineStart(3) + 0.5, lineEnd(3) - 0.3, lineEnd(3) + 0.3], [0, 1, 1, 0]);
  const dirTexts = kf(frame, [wordStart(8, 8), wordStart(8, 8) + 0.3, dStart, dStart + 0.3], [0, 1, 1, 0]);
  const stopwatch = kf(frame, [lineStart(10), lineStart(10) + 0.4, lineEnd(11), lineEnd(11) + 0.4], [0, 1, 1, 0]);
  const noJam = kf(frame, [wordStart(13, 10), wordStart(13, 10) + 0.3, lineEnd(13) + 0.2, lineEnd(13) + 0.7], [0, 1, 1, 0]);
  const diagReveal = kf(frame, [dStart + 0.9, dEnd - 0.2], [0, 1]);
  const diagOpacity = kf(frame, [dStart + 0.5, dStart + 0.9, dEnd, dEnd + 0.4], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      <DotBackground />
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, fontFamily: FONT}}>
        <g transform={`translate(${CX} ${ringY}) scale(${ringK}) translate(${-CX} ${-CY})`}>
          <g transform={`translate(${CX} ${CY}) scale(${scale}) translate(${-focus.x} ${-focus.y})`}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={COLORS.grid} strokeWidth={5} />

            {jam && wArc > 0.01 && (
              <path d={arcPath(jam.angle, jam.span + 0.14, R + 40)} fill="none" stroke={COLORS.accent} strokeWidth={12} strokeLinecap="butt" opacity={wArc} />
            )}

            {Array.from({length: N}, (_, i) => {
              const p = ringPoint(st.x[i]);
              const trigger = i === 0 && wTrig > 0.5;
              return (
                <circle key={i} cx={p.x} cy={p.y} r={CAR_R} fill={trigger ? COLORS.orange : carColor(st.v[i])} stroke={COLORS.bg} strokeWidth={3} />
              );
            })}

            {wTrig > 0.01 && (() => {
              const p = ringPoint(st.x[0]);
              return <circle cx={p.x} cy={p.y} r={CAR_R + 16} fill="none" stroke={COLORS.orange} strokeWidth={5} strokeDasharray="10 8" opacity={wTrig} />;
            })()}
          </g>

          {n22 > 0.01 && (
            <g opacity={n22} textAnchor="middle">
              <text x={CX} y={CY + 40} fontSize={200} fontWeight={800} fill={COLORS.text}>22</text>
              <text x={CX} y={CY + 100} fontSize={46} fontWeight={800} fill={COLORS.muted}>Autos</text>
            </g>
          )}

          {dirTexts > 0.01 && (
            <g opacity={dirTexts} textAnchor="middle" fontSize={68} fontWeight={800}>
              <text x={CX} y={CY - 10} fill={COLORS.blue}>Autos →</text>
              <text x={CX} y={CY + 70} fill={COLORS.accent}>← Stau</text>
            </g>
          )}

          {stopwatch > 0.01 && (
            <g opacity={stopwatch} textAnchor="middle">
              <text x={CX} y={CY - 60} fontSize={44} fontWeight={800} fill={COLORS.muted}>Experiment</text>
              <text x={CX} y={CY + 50} fontSize={128} fontWeight={800} fill={COLORS.text} style={{fontVariantNumeric: 'tabular-nums'}}>{clock(sp.time)}</text>
            </g>
          )}

          {noJam > 0.01 && (
            <text x={CX} y={CY + 30} textAnchor="middle" fontSize={96} fontWeight={800} fill={COLORS.blue} opacity={noJam}>kein Stau</text>
          )}
        </g>

        <SpaceTime reveal={diagReveal} opacity={diagOpacity} />
      </svg>
      <Captions words={WORDS} />
    </AbsoluteFill>
  );
};
