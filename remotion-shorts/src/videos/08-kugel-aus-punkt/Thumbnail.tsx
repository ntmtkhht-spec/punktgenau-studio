import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../shared';

const INK='#111111', BLUE='#1f7ae0', ORANGE='#f97316';
const Sphere: React.FC<{cx:number;cy:number;r:number;id:string}> = ({cx,cy,r,id}) => <>
  <defs><radialGradient id={id} cx="30%" cy="25%" r="82%">
    <stop offset="0" stopColor="#64b1fb"/><stop offset=".34" stopColor={BLUE}/><stop offset="1" stopColor="#123b65"/>
  </radialGradient></defs>
  <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke={INK} strokeWidth={8}/>
</>;
const Stage: React.FC<React.PropsWithChildren> = ({children}) => <AbsoluteFill style={{backgroundColor:'#fbfbf8'}}>
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{fontFamily:FONT,fontWeight:800,letterSpacing:'-.03em'}}>{children}</svg>
</AbsoluteFill>;

export const KugelThumbnailA: React.FC = () => <Stage>
  <text x={540} y={495} fontSize={150} textAnchor="middle" fill={INK}>NUR EIN</text>
  <text x={540} y={690} fontSize={190} textAnchor="middle" fill={INK}>PUNKT?</text>
  <Sphere cx={325} cy={1045} r={230} id="sphere-a"/>
  <text x={630} y={1104} fontSize={180} textAnchor="middle" fill={INK}>=</text>
  <circle cx={820} cy={1045} r={40} fill={ORANGE} stroke={INK} strokeWidth={8}/>
</Stage>;

export const KugelThumbnailB: React.FC = () => <Stage>
  <text x={540} y={575} fontSize={150} textAnchor="middle" fill={INK}>ILLUSION</text>
  <Sphere cx={540} cy={1010} r={270} id="sphere-b"/>
  <path d="M 558 740 L 492 880 L 555 930 L 468 1090 L 536 1145 L 498 1276 L 581 1131 L 519 1073 L 606 924 L 548 875 L 602 747" fill="#fbfbf8" stroke={INK} strokeWidth={7} strokeLinejoin="round"/>
  <circle cx={538} cy={1010} r={24} fill={ORANGE} stroke={INK} strokeWidth={6}/>
</Stage>;

export const KugelThumbnailC: React.FC = () => <Stage>
  <text x={540} y={455} fontSize={132} textAnchor="middle" fill={INK}>WAS SIEHST</text>
  <text x={540} y={650} fontSize={190} textAnchor="middle" fill={INK}>DU?</text>
  <Sphere cx={685} cy={1040} r={220} id="sphere-c"/>
  <ellipse cx={685} cy={1040} rx={58} ry={220} fill="none" stroke={INK} strokeWidth={8}/>
  <g fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={235} cy={925} r={55} fill="#fbfbf8"/>
    <path d="M235 981 L235 1150 L170 1270 M235 1150 L300 1270 M235 1030 L145 970 L170 900 M235 1030 L335 965 L365 885"/>
    <path d="M220 901 L235 906 M250 902 L261 898" strokeWidth={5}/>
    <ellipse cx={245} cy={943} rx={12} ry={17} strokeWidth={5}/>
  </g>
</Stage>;
