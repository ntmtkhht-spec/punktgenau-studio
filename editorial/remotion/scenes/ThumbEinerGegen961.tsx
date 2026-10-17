import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {RoleText} from '../shared/typography';

// Thumbnail 00-beweis, Archetyp symbolic-metaphor-contrast: diagonaler Rot/Schwarz-Split,
// links eine grosse orange Spielfigur, rechts die Masse – darueber "Einer gegen 961".

// Bauern-Silhouette aus demselben Profil wie die 3D-Figur in MeepleIso (gespiegelt).
const PROFILE: [number, number][] = [
  [0, 0], [0.42, 0], [0.42, 0.1], [0.3, 0.16], [0.2, 0.5], [0.16, 0.78],
  [0.26, 0.82], [0.14, 0.9], [0.24, 1.05], [0.25, 1.15], [0.2, 1.28], [0.1, 1.35], [0, 1.37],
];
const pawnPath = (s: number): string => {
  const right = PROFILE.map(([x, y]) => `${x * s},${-y * s}`);
  const left = [...PROFILE].reverse().map(([x, y]) => `${-x * s},${-y * s}`);
  return `M${[...right, ...left].join(' L')} Z`;
};

interface PawnProps {
  x: number;
  y: number;
  size: number;
  fill: string;
  shade: string;
}

const Pawn: React.FC<PawnProps> = ({x, y, size, fill, shade}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={size * 0.5} ry={size * 0.12} fill="rgba(0,0,0,0.45)" />
    <path d={pawnPath(size)} fill={fill} />
    {/* Toon-Schattenseite: rechte Haelfte dunkler */}
    <path d={pawnPath(size)} fill={shade} clipPath="url(#rightHalf)" transform="translate(0 0)" />
  </g>
);

export const ThumbEinerGegen961: React.FC = () => {
  const {width, height} = useVideoConfig();
  const crowd = Array.from({length: 7 * 9}, (_, i) => ({col: i % 9, row: Math.floor(i / 9)}));
  return (
    <AbsoluteFill style={{backgroundColor: "#0b0c0e"}}>
      <svg width={width} height={height} style={{position: 'absolute'}}>
        <defs>
          <clipPath id="rightHalf">
            <rect x={0} y={-2000} width={2000} height={4000} />
          </clipPath>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={7} />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0" />
          </filter>
          <radialGradient id="spot" cx="0.27" cy="0.62" r="0.42">
            <stop offset="0" stopColor="rgba(255,236,200,0.6)" />
            <stop offset="1" stopColor="rgba(255,236,200,0)" />
          </radialGradient>
        </defs>
        {/* Diagonaler Split: links Karmesin, rechts Schwarz */}
        <polygon points={`0,0 ${width * 0.62},0 ${width * 0.42},${height} 0,${height}`} fill="#a31621" />
        {/* Rechts: die Masse – viele kleine, gedaempfte Figuren */}
        {crowd.map(({col, row}) => (
          <Pawn key={`${col}-${row}`} x={width * 0.6 + col * 88 + (row % 2) * 44} y={150 + row * 118} size={82} fill="#efe6cf" shade="#bdb39b" />
        ))}
        <rect width={width} height={height} fill="url(#spot)" />
        {/* Links: die eine Figur, gross, im Licht */}
        <Pawn x={width * 0.25} y={height * 0.95} size={420} fill="#e38450" shade="#b9622f" />
        <rect width={width} height={height} filter="url(#grain)" />
      </svg>
      {/* Monumental-Typo oben links, weit weg von der Zeitstempel-Ecke */}
      <div style={{position: 'absolute', left: width * 0.04, top: height * 0.03, width: width * 0.6}}>
        <RoleText
          role="tall-condensed-serif"
          style={{fontSize: 230, lineHeight: 0.84, textShadow: Array.from({length: 18}, (_, i) => `${i + 1}px ${i + 1}px 0 #0a0a0c`).join(', ')}}
        >
          Einer gegen 961
        </RoleText>
      </div>
    </AbsoluteFill>
  );
};
