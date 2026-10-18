import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, DotBackground, FONT} from '../../shared';

export const DURATION = 28;
const FIRST = 1.051380023747277, CROSS = 95.71683016840512;
const L = 190, R = 920, TOP = 540, BOTTOM = 1135;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v: number) => {const u = clamp(v); return u * u * (3 - 2 * u);};
// Central choreography for the approved silent film. Events depend on reached x.
const KEYS = [[0, 0.10], [0.155, FIRST], [0.30, 3.4], [0.48, 14.2],
  [0.565, 37], [0.65, 73], [0.715, CROSS], [0.82, 147],
  [0.87, 170], [0.935, 175]];
const logs = KEYS.map(([, x]) => Math.log(x));
const slopes = KEYS.map((k, i) => i === 0
  ? (logs[1] - logs[0]) / (KEYS[1][0] - k[0])
  : i === KEYS.length - 1 ? 0
  : 2 / (1 / ((logs[i] - logs[i - 1]) / (k[0] - KEYS[i - 1][0]))
    + 1 / ((logs[i + 1] - logs[i]) / (KEYS[i + 1][0] - k[0]))));

export const plotState = (progress: number) => {
  const returning = progress >= 0.935;
  let tip: number;
  if (returning) {
    const u = smooth((progress - 0.935) / 0.065);
    tip = Math.exp(Math.log(175) * (1 - u) + Math.log(0.1) * u);
  } else {
    const i = Math.max(0, KEYS.findIndex((k, n) => n < KEYS.length - 1 && progress >= k[0] && progress < KEYS[n + 1][0]));
    const h = KEYS[i + 1][0] - KEYS[i][0], u = clamp((progress - KEYS[i][0]) / h);
    const a = 2*u*u*u-3*u*u+1, b = u*u*u-2*u*u+u;
    const c = -2*u*u*u+3*u*u, d = u*u*u-u*u;
    tip = Math.exp(a*logs[i]+b*h*slopes[i]+c*logs[i+1]+d*h*slopes[i+1]);
  }
  const quad = tip * tip, exp = 1.1 ** tip;
  const high = Math.pow(quad ** 8 + exp ** 8, 1/8);
  const xmax = Math.max(1.16, tip * 1.18), ymax = Math.max(1.35, high * 1.24);
  const px = L + tip / xmax * (R-L);
  const qy = BOTTOM - quad/ymax*(BOTTOM-TOP), ey = BOTTOM - exp/ymax*(BOTTOM-TOP);
  const avoidance = smooth((130-Math.abs(qy-ey))/60);
  const labelQ = clamp(qy - 32, TOP-25, BOTTOM-28);
  const labelE = clamp(ey - 32, TOP-25, BOTTOM-28);
  const labelQX = Math.max(L+140,px-14-210*avoidance);
  return {tip, quad, exp, xmax, ymax, px, qy, ey, labelQ, labelE, labelQX, returning};
};
// Adjacent tick families crossfade; no abrupt tick density changes.
const ticks = (max: number) => {
  const base = 10 ** Math.floor(Math.log10(max / 3));
  const candidates = [base, 2*base, 5*base, 10*base], ideal = max/3;
  const j = Math.min(2, Math.max(0, candidates.findIndex((v,i) => i<3 && ideal>=v && ideal<candidates[i+1])));
  const lo = candidates[j], hi = candidates[j+1];
  const blend = smooth((Math.log(ideal/lo)/Math.log(hi/lo) - 0.2)/0.6);
  const result = new Map<string, {value:number; opacity:number}>();
  for (const [step, weight] of [[lo,1-blend],[hi,blend]]) {
    for (let v=step; v < max*0.98; v+=step) {
      const key=v.toPrecision(8), opacity=weight*clamp((max-v)/max/0.08);
      result.set(key,{value:v,opacity:Math.min(1,(result.get(key)?.opacity??0)+opacity)});
    }
  }
  return [...result.values()].filter(t => t.opacity>0.01);
};
const number = (v: number) => v >= 1e6 ? `${(v/1e6).toLocaleString('de-DE',{maximumFractionDigits:1})} Mio.`
  : v >= 1000 ? `${(v/1000).toLocaleString('de-DE',{maximumFractionDigits:1})} Tsd.`
  : v.toLocaleString('de-DE',{maximumFractionDigits:2});
const textStroke = {paintOrder:'stroke' as const, stroke:COLORS.bg, strokeWidth:11, strokeLinejoin:'round' as const};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const s = plotState(frame / durationInFrames);
  const x = (v:number) => L+v/s.xmax*(R-L), y = (v:number) => BOTTOM-v/s.ymax*(BOTTOM-TOP);
  const path = (fn:(v:number)=>number) => Array.from({length:801},(_,i)=>{
    const v=s.tip*i/800;
    return `${i?'L':'M'}${x(v).toFixed(3)},${y(fn(v)).toFixed(3)}`;
  }).join(' ');
  const firstAlpha = s.returning ? 0 : smooth((s.tip-FIRST)/0.12) * (1-smooth((s.tip-5)/10));
  const crossAlpha = s.returning ? 0 : smooth((s.tip-CROSS)/1.5)*(1-smooth((s.tip-115)/35));
  const message = s.returning || s.tip<FIRST ? ''
    : s.tip<8 ? 'Blau zieht weit davon.'
    : s.tip<50 ? 'Orange wächst um 10 % pro Schritt.'
    : s.tip<CROSS ? 'Kann Orange noch aufholen?'
    : s.tip<170 ? 'Bei x ≈ 95,72 zieht Orange vorbei.'
    : 'Bei x = 170: 10,9 Millionen gegen 28.900.';
  return <AbsoluteFill style={{backgroundColor:COLORS.bg,fontFamily:FONT}}>
    <Audio src={staticFile('09-exponentiell-gewinnt/cornfield-chase.wav')}/>
    <DotBackground/>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position:'absolute',left:0,top:0,fontFamily:FONT}}>
      <defs><clipPath id="growth-plot"><rect x={L-7} y={TOP-30} width={R-L+20} height={BOTTOM-TOP+38}/></clipPath></defs>
      <text x={530} y={315} textAnchor="middle" fontSize={62} fontWeight={800} fill={COLORS.text} {...textStroke}>Wer gewinnt</text>
      <text x={530} y={388} textAnchor="middle" fontSize={62} fontWeight={800} fill={COLORS.text} {...textStroke}>auf Dauer?</text>
      <g fill={COLORS.muted} fontSize={28} fontWeight={500}>
        {ticks(s.xmax).map(t=><g key={`x${t.value}`} opacity={t.opacity}><path d={`M${x(t.value)},${BOTTOM}v10`} stroke={COLORS.text} strokeWidth={2}/><text x={x(t.value)} y={BOTTOM+44} textAnchor="middle" {...textStroke}>{number(t.value)}</text></g>)}
        {ticks(s.ymax).map(t=><g key={`y${t.value}`} opacity={t.opacity}><path d={`M${L-9},${y(t.value)}h9`} stroke={COLORS.text} strokeWidth={2}/><text x={L-18} y={y(t.value)+9} textAnchor="end" {...textStroke}>{number(t.value)}</text></g>)}
        <text x={L-13} y={BOTTOM+40} textAnchor="end" {...textStroke}>0</text>
      </g>
      <path d={`M${L},${TOP-15}V${BOTTOM}H${R+12}`} stroke={COLORS.text} strokeWidth={3} fill="none"/>
      <path d={`M${L},${TOP-25}l-7,15h14Z M${R+22},${BOTTOM}l-15,-7v14Z`} fill={COLORS.text}/>
      <g clipPath="url(#growth-plot)" fill="none">
        <path d={`M${x(FIRST)},${y(FIRST*FIRST)}V${BOTTOM}`} opacity={firstAlpha} stroke={COLORS.muted} strokeWidth={2} strokeDasharray="8 9"/>
        <path d={`M${x(CROSS)},${y(CROSS*CROSS)}V${BOTTOM}`} opacity={crossAlpha} stroke={COLORS.accent} strokeWidth={3} strokeDasharray="9 10"/>
        <path d={path(v=>v*v)} stroke={COLORS.blue} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"/>
        <path d={path(v=>1.1**v)} stroke={COLORS.orange} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx={s.px} cy={s.qy} r={8} fill={COLORS.blue}/>
        <circle cx={s.px} cy={s.ey} r={8} fill={COLORS.orange}/>
        <circle cx={x(CROSS)} cy={y(CROSS*CROSS)} r={16} stroke={COLORS.accent} strokeWidth={3} opacity={crossAlpha}/>
      </g>
      <g fontWeight={800} fontSize={39}>
        <text x={s.labelQX} y={s.labelQ} textAnchor="end" fill={COLORS.blue} {...textStroke}>y = x<tspan baselineShift="super" fontSize={26}>2</tspan></text>
        <text x={Math.max(L+180,s.px-14)} y={s.labelE} textAnchor="end" fill={COLORS.orange} {...textStroke}>y = 1,1<tspan baselineShift="super" fontSize={26}>x</tspan></text>
      </g>
      <text x={530} y={1320} textAnchor="middle" fontSize={40} fontWeight={800} fill={COLORS.text} {...textStroke}>
        {s.tip>=170 && !s.returning ? <><tspan x={530}>Bei x = 170:</tspan><tspan x={530} dy={58}>10,9 Millionen gegen 28.900.</tspan></> : message}
      </text>
    </svg>
  </AbsoluteFill>;
};
