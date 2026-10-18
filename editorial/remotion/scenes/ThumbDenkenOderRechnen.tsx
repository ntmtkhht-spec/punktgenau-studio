import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {RoleText} from '../shared/typography';

const PROFILE: [number, number][] = [
  [0, 0], [0.45, 0], [0.45, 0.12], [0.32, 0.18], [0.22, 0.52], [0.18, 0.8],
  [0.28, 0.85], [0.16, 0.94], [0.26, 1.1], [0.26, 1.2], [0.22, 1.32], [0.12, 1.4], [0, 1.42],
];

const pawnPath = (s: number): string => {
  const right = PROFILE.map(([x, y]) => `${x * s},${-y * s}`);
  const left = [...PROFILE].reverse().map(([x, y]) => `${-x * s},${-y * s}`);
  return `M${[...right, ...left].join(' L')} Z`;
};

export const ThumbDenkenOderRechnen: React.FC = () => {
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#0c0f0d'}}>
      <svg width={width} height={height} style={{position: 'absolute'}}>
        <defs>
          <clipPath id="rightHalfThumb">
            <rect x={0} y={-2000} width={2000} height={4000} />
          </clipPath>
          <filter id="thumbGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={12} />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0" />
          </filter>
          <radialGradient id="kingSpot" cx="0.74" cy="0.62" r="0.52">
            <stop offset="0" stopColor="rgba(255,246,220,0.88)" />
            <stop offset="1" stopColor="rgba(255,246,220,0)" />
          </radialGradient>
        </defs>

        {/* Diagonaler Split: Links Anthrazit/Kritik, Rechts warmes Karminrot/Kupfer */}
        <polygon points={`${width * 0.46},0 ${width},0 ${width},${height} ${width * 0.3},${height}`} fill="#c9311c" />

        {/* Links: Mechanisches Terminal-Gitter */}
        <g opacity={0.55}>
          {Array.from({length: 12}).map((_, i) => (
            <line key={`hl-${i}`} x1={0} y1={i * 90} x2={width * 0.44} y2={i * 90} stroke="#4eed8e" strokeWidth={1.5} strokeDasharray="4 8" />
          ))}
          {Array.from({length: 8}).map((_, i) => (
            <line key={`vl-${i}`} x1={i * 80 + 40} y1={0} x2={i * 80 + 40} y2={height} stroke="#4eed8e" strokeWidth={1.5} strokeDasharray="4 8" />
          ))}
        </g>

        {/* Rechter warmer Scheinwerfer */}
        <rect width={width} height={height} fill="url(#kingSpot)" />

        {/* Rechts: Große Königsfigur im Spotlight */}
        <g transform={`translate(${width * 0.74} ${height * 0.94})`}>
          <ellipse cx={0} cy={0} rx={220} ry={55} fill="rgba(0,0,0,0.5)" />
          <path d={pawnPath(430)} fill="#f39c63" />
          <path d={pawnPath(430)} fill="#c76d38" clipPath="url(#rightHalfThumb)" />
        </g>

        {/* Feines Papierkorn */}
        <rect width={width} height={height} filter="url(#thumbGrain)" />
      </svg>

      {/* Monumentale Typografie oben links: DENKEN ODER RECHNEN */}
      <div style={{position: 'absolute', left: width * 0.05, top: height * 0.04, width: width * 0.62}}>
        <RoleText
          role="tall-condensed-serif"
          style={{
            fontSize: 215,
            lineHeight: 0.86,
            textShadow: Array.from({length: 18}, (_, i) => `${i + 1}px ${i + 1}px 0 #080a08`).join(', '),
          }}
        >
          DENKEN ODER RECHNEN
        </RoleText>
      </div>
    </AbsoluteFill>
  );
};
