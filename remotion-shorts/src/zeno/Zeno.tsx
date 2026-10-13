import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Easing, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {kf} from '../knn/anim';
import {FONT} from '../knn/font';
import {COLORS, H, W} from '../knn/theme';
import {Captions} from '../phantom/Captions';
import {DotBackground} from '../shared/DotBackground';
import {makeTimeline} from '../shared/words';
import {Hook3D} from './Hook3D';
import {ZenoSound, type SfxEvent} from './ZenoSound';
import type {ZenoProps} from './schema';
import raw from './words.json';

const TL = makeTimeline(raw);
export const ZENO_TOTAL = TL.total;

// Safe Zone: Inhalte zwischen x 120..920 und y 300..1100, Captions darunter
const X0 = 120;
const X1 = 880;
const TRACK_Y = 700;
const MAX_STEPS = 48;
const HALO = {stroke: COLORS.bg, strokeWidth: 22, paintOrder: 'stroke', strokeLinejoin: 'round'} as const;

/** Welt [viewA, viewB] -> Bildschirm [X0, X1]. */
const toScreen = (x: number, viewA: number, viewB: number): number => X0 + ((x - viewA) / (viewB - viewA)) * (X1 - X0);

const fracLabel = (k: number): string => {
  const special: Record<number, string> = {1: '½', 2: '¼', 3: '⅛'};
  return special[k] ?? `1/${(2 ** k).toLocaleString('de-DE')}`;
};

/** Bildschirm-x des Laeufers (gleiche Abbildung wie im Track), fuer die Kamera. */
const walkerScreenX = (q: number, z: number, walkerX: number | null): number => {
  const w = 2 ** -z;
  return toScreen(walkerX ?? 1 - 2 ** -q, 1 - w, 1 + 0.14 * w);
};

/** Halbierungs-Etappen: Etappe k reicht von 1 - 2^-(k-1) bis 1 - 2^-k. */
const Track: React.FC<{q: number; z: number; walkerX: number | null; timeRow: number; labelOpacity: number; colors: readonly string[]; laufzeit: number; doorLabel: number}> = ({q, z, walkerX, timeRow, labelOpacity, colors, laufzeit, doorLabel}) => {
  const w = 2 ** -z;
  const viewA = 1 - w;
  const viewB = 1 + 0.14 * w;
  const sx = (x: number) => toScreen(x, viewA, viewB);
  const doorX = sx(1);
  const steps = Array.from({length: MAX_STEPS}, (_, i) => i + 1);
  const walker = walkerX ?? 1 - 2 ** -q;

  return (
    <g>
      {/* Weg */}
      <line x1={X0 - 40} y1={TRACK_Y} x2={doorX} y2={TRACK_Y} stroke={COLORS.grid} strokeWidth={10} />
      {/* zurueckgelegte Etappen */}
      {steps.map((k) => {
        const a = 1 - 2 ** -(k - 1);
        const b = 1 - 2 ** -k;
        const done = Math.min(1, Math.max(0, q - (k - 1)));
        if (done <= 0) return null;
        const xa = sx(a);
        const xb = sx(a + (b - a) * done);
        if (xb < X0 - 60 || xb - xa < 0.3) return null;
        const width = sx(b) - xa;
        const color = colors[(k - 1) % 3];
        return (
          <g key={k}>
            <line x1={xa} y1={TRACK_Y} x2={xb} y2={TRACK_Y} stroke={color} strokeWidth={24} />
            <line x1={sx(b)} y1={TRACK_Y - 40} x2={sx(b)} y2={TRACK_Y + 40} stroke={COLORS.text} strokeWidth={3} opacity={done >= 1 ? 1 : 0} />
            {width > 70 && done > 0.6 && (xa + sx(b)) / 2 > X0 + 30 && (
              <text x={(xa + sx(b)) / 2} y={TRACK_Y - 66} textAnchor="middle" fontSize={Math.min(76, width * 0.34)} fontWeight={800} fill={color} opacity={labelOpacity}>
                {fracLabel(k)}
              </text>
            )}
            {timeRow > 0 && width > 70 && (xa + sx(b)) / 2 > X0 + 30 && (
              <text x={(xa + sx(b)) / 2} y={TRACK_Y + 110} textAnchor="middle" fontSize={Math.min(52, width * 0.26)} fontWeight={800} fill={COLORS.muted} opacity={timeRow}>
                {`${((laufzeit / 2) * 2 ** -(k - 1)).toLocaleString('de-DE')} s`}
              </text>
            )}
          </g>
        );
      })}
      {/* Tuer */}
      <rect x={doorX} y={TRACK_Y - 210} width={36} height={250} fill={COLORS.text} />
      <text x={doorX + 18} y={TRACK_Y + 100} textAnchor="middle" fontSize={46} fontWeight={800} fill={COLORS.text} opacity={timeRow > 0 ? 0 : doorLabel}>Tür</text>
      {/* Laeufer */}
      <circle cx={sx(walker)} cy={TRACK_Y} r={34} fill={COLORS.text} stroke={COLORS.bg} strokeWidth={6} />
    </g>
  );
};

/** Beweis ohne Worte: Ein Quadrat fuellt sich mit 1/2, 1/4, 1/8 ... */
const SquareProof: React.FC<{pieces: number; opacity: number; zoom: number; colors: readonly string[]}> = ({pieces, opacity, zoom, colors}) => {
  if (opacity <= 0.01) return null;
  const size = 640;
  const ox = 500 - size / 2;
  const oy = TRACK_Y - size / 2;
  // Die Reststuecke laufen in die Ecke unten rechts -> dorthin zoomen
  const cx = ox + size;
  const cy = oy + size;
  const rects: {x: number; y: number; w: number; h: number; k: number}[] = [];
  let r = {x: ox, y: oy, w: size, h: size};
  for (let k = 1; k <= 14; k++) {
    const vertical = k % 2 === 1;
    const piece = vertical ? {...r, w: r.w / 2} : {...r, h: r.h / 2};
    rects.push({...piece, k});
    r = vertical ? {...r, x: r.x + r.w / 2, w: r.w / 2} : {...r, y: r.y + r.h / 2, h: r.h / 2};
  }
  return (
    <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}>
      {rects.map((p) => {
        const show = Math.min(1, Math.max(0, pieces - (p.k - 1)));
        if (show <= 0) return null;
        const color = colors[(p.k - 1) % 3];
        const fs = Math.min(p.w, p.h) * 0.32;
        return (
          <g key={p.k} opacity={show}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={color} stroke={COLORS.bg} strokeWidth={3} />
            {fs > 22 && (
              <text x={p.x + p.w / 2} y={p.y + p.h / 2 + fs * 0.35} textAnchor="middle" fontSize={fs} fontWeight={800} fill={COLORS.bg}>
                {fracLabel(p.k)}
              </text>
            )}
          </g>
        );
      })}
      <rect x={ox} y={oy} width={size} height={size} fill="none" stroke={COLORS.text} strokeWidth={4} />
      <text x={500} y={oy - 30} textAnchor="middle" fontSize={52} fontWeight={800} fill={COLORS.text} opacity={Math.max(0, 1 - (zoom - 1) * 4)}>= 1 ganze Strecke</text>
    </g>
  );
};

export const Zeno: React.FC<ZenoProps> = (props) => {
  const colors = [props.etappenFarbe1, props.etappenFarbe2, props.etappenFarbe3];
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const {lineStart: ls, lineEnd: le, wordStart: ws, total} = TL;

  // ---- q: wie viele Halbierungs-Etappen sind geschafft, z: Zoom-Tiefe -----------
  // Hook (Zeile 1) ist die 3D-Szene; ab Zeile 2 laeuft die 2D-Strecke.
  const hookEnd = 5; // 3D-Tuer-Animation nur bis Sekunde 5
  // 3D-Animation wird gestreckt, damit der Schnitt immer auf den freigegebenen Frame (Animationszeit 3,6 s) faellt
  const HOOK_CUT_ANIM = 3.6;
  const hookCut = ws(0, 9); // "griechische": Zitat vorbei, Bueste kommt // Schnitt beim Wort "griechischer": Tuer noch gross, Maennchen schon hinter der Kamera
  // weicher Uebergang: 3D blendet aus, 2D blendet ein (statt hartem Schnitt)
  const BLEND = Math.max(0.01, props.uebergangSek);
  const blend = Math.min(1, Math.max(0, (t - hookCut) / BLEND));
  const inHook = t < hookCut + BLEND;
  const Q_TIMES = [0, ws(1, 12), le(1), ls(2) + 0.3, ws(2, 9), le(2), le(3), le(4)];
  const Q_VALUES = [0, 0, 1, 1, 2, 3, 10, 16];
  const q = kf(frame, Q_TIMES, Q_VALUES);
  const z = kf(frame, [0, le(2), le(3), le(4), ls(5) + 0.3, ls(5) + 1.3], [0, 0, 9, 15, 15, 0]);

  // ---- Phase: Quadrat-Beweis (Zeile 8) und Echtzeit-Lauf (Zeile 9) ----------
  const squareOn = kf(frame, [ls(7), ls(7) + 0.4, le(7) + 0.1, le(7) + 0.5], [0, 1, 1, 0]);
  const trackOff = kf(frame, [ls(7) - 0.4, ls(7), le(7) + 0.5, le(7) + 0.9], [1, 0, 0, 1]);
  const pieces = kf(frame, [ls(7) + 0.3, le(7) - 0.8], [0, 14], Easing.out(Easing.quad));
  const runStart = ls(8) + 0.3;
  const runEnd = le(8) - 0.8;
  const inRun = t >= ls(8) && t < le(8) + 0.3;
  const runX = kf(frame, [runStart, runEnd, runEnd + 0.6], [0, 1, 1.12], Easing.linear);

  // ---- Ton: Effekt-Zeitpunkte aus derselben Animation ableiten, die das Bild steuert -------
  const lineCount = TL.words[TL.words.length - 1].line + 1;
  const speech = useMemo(() => Array.from({length: lineCount}, (_, i) => [ls(i), le(i)] as const), [lineCount]);
  const sfxEvents = useMemo<SfxEvent[]>(() => {
    const ev: SfxEvent[] = [];
    // jede neue Halbierung (Zeilen 2 bis 5): Zupfton, im schnellen Zoom leiser
    let prev = 0;
    for (let f = 0; f <= Math.ceil(le(4) * fps); f++) {
      const qv = Math.floor(kf(f, Q_TIMES, Q_VALUES) + 1e-6);
      if (qv > prev && f / fps >= ls(1)) {
        ev.push({at: f / fps, file: qv % 2 === 1 ? 'pluck_001.ogg' : 'pluck_002.ogg', volume: qv <= 3 ? 0.5 : 0.28});
      }
      prev = Math.max(prev, qv);
    }
    // Echtzeit-Lauf (Zeile 9): Tick an jeder Halbierungsmarke
    for (let k = 1; k <= 6; k++) ev.push({at: runStart + (1 - 2 ** -k) * (runEnd - runStart), file: 'tick_001.ogg', volume: 0.45});
    // Quadrat-Beweis (Zeile 8): die ersten Stuecke ploppen ein
    for (let k = 0; k < 5; k++) ev.push({at: ls(7) + 0.3 + (k / 14) * (le(7) - 1.1 - ls(7)) , file: 'drop_002.ogg', volume: 0.4});
    ev.push({at: hookCut - 0.05, file: 'maximize_003.ogg', volume: 0.35}); // Uebergang 3D -> 2D
    ev.push({at: hookCut + 0.3, file: 'glass_001.ogg', volume: 0.3}); // Bueste erscheint
    ev.push({at: ls(4) + 0.2, file: 'select_001.ogg', volume: 0.35}); // Name Zenon
    ev.push({at: ls(5) + 1.2, file: 'question_001.ogg', volume: 0.45}); // Fragezeichen
    ev.push({at: ls(9) + 0.2, file: 'confirmation_002.ogg', volume: 0.45}); // Gleichung = 1
    return ev;
  }, []);
  const runQ = inRun ? (runX >= 1 ? MAX_STEPS : -Math.log2(Math.max(1 - runX, 2 ** -MAX_STEPS))) : q;
  // Leiste erst einblenden, wenn die Bueste weg ist
  const trackIntro = kf(frame, [ls(1), ls(1) + 0.4], [0, 1]);
  const trackOpacity = trackOff * trackIntro;

  const timeRow = kf(frame, [ls(6) + 0.3, ls(6) + 0.8, le(8), le(8) + 0.4], [0, 1, 1, 0]);
  const zenon = kf(frame, [ls(4) + 0.2, ls(4) + 0.6, le(4) - 0.2, le(4) + 0.2], [0, 1, 1, 0]);
  const counter = kf(frame, [le(2), le(2) + 0.3, le(4), le(4) + 0.3], [0, 1, 1, 0]);
  // Bueste: (A) mittig direkt nach der 3D-Szene bei "griechischer Philosoph", (B) links neben dem Namen in Zeile 5
  const bustA = kf(frame, [hookCut + 0.3, hookCut + 0.7, le(0) - 0.1, ls(1) + 0.2], [0, 1, 1, 0]);
  const bustB = zenon;
  const bustPopA = spring({frame: frame - (hookCut + 0.3) * fps, fps, config: {damping: 15, stiffness: 160}});
  const bustPopB = spring({frame: frame - (ls(4) + 0.2) * fps, fps, config: {damping: 15, stiffness: 160}});
  const squareZoom = kf(frame, [le(7) - 1.8, le(7) + 0.1], [1, props.quadratZoomEnde]);

  // ---- Kamera: Push-ins und Verfolgung des Laeufers ---------------------------
  const camS = kf(
    frame,
    [0, ls(1), ls(1) + 1.2, le(1), le(2), le(2) + 0.5, ls(5) + 1.3, le(5), ls(6) + 0.3, le(6), ls(8) + 0.3, ls(8) + 1.0, le(8), le(8) + 0.5],
    [1.0, 1.0, 1.0, 1.18, 1.18, 1.0, 1.0, 1.3, 1.0, 1.1, 1.0, props.kameraZoomLauf, props.kameraZoomLauf, 1.0],
  );
  // Satz 6 ("Denkfehler"): langsamer Push-in auf die Tuer, pulsierendes Fragezeichen, Frage oben
  const doubt = kf(frame, [ls(5) + 1.2, ls(5) + 1.6, le(5), le(5) + 0.4], [0, 1, 1, 0]);
  const doubtPulse = 1 + 0.08 * Math.sin(t * Math.PI * 2 * 1.2);
  const timer = kf(frame, [runStart - 0.2, runStart, le(8) + 0.1, le(8) + 0.4], [0, 1, 1, 0]);
  const equation = kf(frame, [ls(9) + 0.2, ls(9) + 0.7, total - 0.9, total - 0.5], [0, 1, 1, 0]);
  const eqPop = spring({frame: frame - (ls(9) + 0.2) * fps, fps, config: {damping: 14, stiffness: 180}});
  const runSeconds = Math.min(props.laufzeitSek, Math.max(0, ((t - runStart) / (runEnd - runStart)) * props.laufzeitSek));

  // Ende (Zeile 10): Punkt geht durch die Tuer, Kamera faehrt in die Tuer, dann Ueberblendung in den Hook (Loop)
  const inFinal = t >= ls(9);
  const finalWalk = kf(frame, [ls(9) + 0.6, ls(9) + 3.2], [1 - 2 ** -16, 1.6]);
  const finalPush = kf(frame, [ls(9) + 1.5, total - 0.4], [1, 2.6]);
  const loopBlend = kf(frame, [total - 0.6, total], [0, 1]);
  const trackQ = inRun ? runQ : inFinal ? MAX_STEPS : q;
  const trackZ = inRun ? 0 : z;
  const trackWalker = inRun ? runX : inFinal ? finalWalk : null;
  const follow = Math.min(1, Math.max(0, (camS - 1) / 0.25));
  const doorScreenX = toScreen(1, 0, 1.14) + 18;
  const fx = inFinal ? doorScreenX : 500 + (walkerScreenX(trackQ, trackZ, trackWalker) - 500) * follow;
  const camScale = inFinal ? finalPush : camS;
  const camera = `translate(500 ${TRACK_Y}) scale(${camScale}) translate(${-fx} ${-TRACK_Y})`;

  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      <DotBackground />
      <Audio src={staticFile('zenon-voice.wav')} />
      <ZenoSound events={[]} speech={speech} />{/* Soundeffekte bewusst entfernt (Nutzerwunsch); sfxEvents bleibt fuer spaeter berechnet */}
      {inHook && (
        <AbsoluteFill style={{opacity: 1 - blend, transform: `scale(${1 + 0.15 * blend})`}}>
          <Hook3D end={hookEnd} stop={props.hookStehenbleibenSek} doorSpeed={props.tuerTempo} figureColor={props.figurFarbe} doorColor={props.tuerFarbe} atTime={t * HOOK_CUT_ANIM / hookCut} />
        </AbsoluteFill>
      )}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, fontFamily: FONT, opacity: blend, transform: `scale(${1.12 - 0.12 * blend})`}}>
        <g opacity={trackOpacity} transform={camera}>
          <Track q={trackQ} z={trackZ} walkerX={trackWalker} timeRow={timeRow} labelOpacity={1 - kf(frame, [ls(5) + 0.2, ls(5) + 0.4, ls(5) + 1.2, ls(5) + 1.5], [0, 1, 1, 0])} colors={colors} laufzeit={props.laufzeitSek} doorLabel={1 - kf(frame, [ls(9) + 0.8, ls(9) + 1.4], [0, 1])} />
        </g>
        {doubt > 0.01 && (
          <g transform={camera} opacity={doubt}>
            <text x={toScreen(1, 0, 1.14) + 18} y={TRACK_Y - 250} textAnchor="middle" fontSize={200 * doubtPulse} fontWeight={800} fill={props.tuerFarbe} {...HALO}>?</text>
            <text x={toScreen(1, 0, 1.14) + 18} y={TRACK_Y - 250} textAnchor="middle" fontSize={200 * doubtPulse} fontWeight={800} fill={props.tuerFarbe}>?</text>
          </g>
        )}
        {doubt > 0.01 && (
          <g opacity={doubt}>
            <text x={540} y={TRACK_Y + 290} textAnchor="middle" fontSize={76} fontWeight={800} fill={COLORS.text} {...HALO}>Wo ist der Fehler?</text>
            <text x={540} y={TRACK_Y + 290} textAnchor="middle" fontSize={76} fontWeight={800} fill={COLORS.text}>Wo ist der Fehler?</text>
          </g>
        )}
        <SquareProof pieces={pieces} opacity={squareOn} zoom={squareZoom} colors={colors} />

        {counter > 0.01 && (
          <text x={500} y={TRACK_Y + 260} textAnchor="middle" fontSize={60} fontWeight={800} fill={COLORS.muted} opacity={counter}>
            {`Halbierung Nr. ${Math.max(1, Math.floor(q))}`}
          </text>
        )}
        {zenon > 0.01 && (
          <g opacity={zenon}>
            <text x={420} y={330} fontSize={66} fontWeight={800} fill={COLORS.text} {...HALO}>Zenon von Elea</text>
            <text x={420} y={330} fontSize={66} fontWeight={800} fill={COLORS.text}>Zenon von Elea</text>
            <text x={420} y={390} fontSize={42} fontWeight={800} fill={COLORS.muted} {...HALO}>ca. 450 v. Chr.</text>
            <text x={420} y={390} fontSize={42} fontWeight={800} fill={COLORS.muted}>ca. 450 v. Chr.</text>
          </g>
        )}
        {timer > 0.01 && (
          <text x={500} y={TRACK_Y + 340} textAnchor="middle" fontSize={120} fontWeight={800} fill={COLORS.text} opacity={timer} style={{fontVariantNumeric: 'tabular-nums'}}>
            {`${runSeconds.toFixed(2).replace('.', ',')} s`}
          </text>
        )}
        {equation > 0.01 && (
          <g opacity={equation} transform={`translate(500 ${TRACK_Y + 330}) scale(${0.85 + 0.15 * eqPop}) translate(-500 ${-(TRACK_Y + 330)})`}>
            <text x={500} y={TRACK_Y + 330} textAnchor="middle" fontSize={84} fontWeight={800} fill={COLORS.text} {...HALO}>½ + ¼ + ⅛ + … = 1</text>
            <text x={500} y={TRACK_Y + 330} textAnchor="middle" fontSize={84} fontWeight={800} fill={COLORS.text}>½ + ¼ + ⅛ + … = 1</text>
          </g>
        )}
      </svg>
      {bustA > 0.01 && (
        <Img
          src={staticFile('zenon-elea.png')}
          style={{
            position: 'absolute',
            left: '50%',
            top: 150,
            height: props.buesteHoeheAnfang,
            opacity: bustA,
            transform: `translateX(-55%) scale(${(0.9 + 0.1 * bustPopA) * kf(frame, [hookCut + 0.3, ls(1) + 0.2], [1, 1.12])})`, // langsamer Zoom, kein Standbild
            translate: '141.7px 314.8px',
            rotate: '3.4deg',
            scale: 1.719
          }}
        />
      )}
      {bustB > 0.01 && (
        <Img
          src={staticFile('zenon-elea.png')}
          style={{position: 'absolute', left: 110, top: 170, height: props.buesteHoeheZeile5, opacity: bustB, transform: `scale(${0.9 + 0.1 * bustPopB})`}}
        />
      )}
      {loopBlend > 0.001 && (
        <AbsoluteFill style={{opacity: loopBlend}}>
          <Hook3D end={hookEnd} stop={props.hookStehenbleibenSek} doorSpeed={props.tuerTempo} figureColor={props.figurFarbe} doorColor={props.tuerFarbe} atTime={0} />
        </AbsoluteFill>
      )}
      <Captions words={TL.words} />
    </AbsoluteFill>
  );
};
