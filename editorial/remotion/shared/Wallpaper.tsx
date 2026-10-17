import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {baseColor, Motif, WallpaperSpec} from './theme';

// Ton-in-Ton-Tapete: ein Motiv, zwei Zustaende (These farbig / Kritik dunkel).
// Bewegt sich immer leicht (Drift + Licht), damit nie ein Standbild entsteht.

const TILE = 160;

const MotifTile: React.FC<{motif: Motif}> = ({motif}) => {
  const s = {fill: 'none', stroke: 'currentColor', strokeWidth: 3} as const;
  switch (motif) {
    case 'arkaden':
      return (
        <g {...s}>
          <path d="M10 160 V70 A70 70 0 0 1 150 70 V160" />
          <path d="M28 160 V76 A52 52 0 0 1 132 76 V160" />
          <circle cx="80" cy="96" r="18" />
          <path d="M80 114 V160 M62 140 H98" />
        </g>
      );
    case 'blaetter':
      return (
        <g {...s}>
          <path d="M40 120 C20 80 40 40 80 30 C90 70 80 105 40 120 Z" />
          <path d="M40 120 L80 30" />
          <path d="M120 150 C100 120 110 90 150 80 C155 115 150 135 120 150 Z" />
          <path d="M115 40 C125 20 150 15 160 20 C150 40 135 48 115 40 Z" />
        </g>
      );
    case 'birken':
      return (
        <g {...s}>
          <path d="M30 0 V160 M34 30 H44 M28 90 H20 M34 130 H40" />
          <path d="M100 0 V160 M104 55 H116 M98 115 H88" />
          <circle cx="66" cy="40" r="2" fill="currentColor" />
          <circle cx="140" cy="100" r="2" fill="currentColor" />
          <circle cx="70" cy="140" r="1.5" fill="currentColor" />
        </g>
      );
    case 'damast':
    default:
      return (
        <g {...s}>
          <path d="M80 10 C110 40 110 70 80 90 C50 70 50 40 80 10 Z" />
          <path d="M80 90 C120 100 140 130 150 160 M80 90 C40 100 20 130 10 160" />
          <path d="M80 90 V160" />
          <circle cx="80" cy="50" r="10" />
          <path d="M0 0 C20 20 20 40 0 60 M160 0 C140 20 140 40 160 60" />
        </g>
      );
  }
};

export const Wallpaper: React.FC<{spec: WallpaperSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, TILE * 0.35]);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.04]);
  const base = baseColor(spec);
  const ink = spec.mode === 'kritik' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.13)';
  const id = `wp-${spec.motif}`;

  return (
    <AbsoluteFill style={{backgroundColor: base, overflow: 'hidden'}}>
      <svg width={width} height={height} style={{position: 'absolute', transform: `scale(${zoom})`}}>
        <defs>
          <pattern id={id} width={TILE} height={TILE} patternUnits="userSpaceOnUse" patternTransform={`translate(${drift} ${drift * 0.4})`}>
            <g style={{color: ink}}>
              <MotifTile motif={spec.motif} />
            </g>
          </pattern>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={3} />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0" />
          </filter>
        </defs>
        <rect width={width} height={height} fill={`url(#${id})`} />
        <rect width={width} height={height} filter="url(#grain)" />
      </svg>
      <LightLayer spec={spec} />
    </AbsoluteFill>
  );
};

const LightLayer: React.FC<{spec: WallpaperSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  if (spec.light === 'none') return null;

  if (spec.light === 'sunburst') {
    const rot = interpolate(frame, [0, durationInFrames], [0, 12]);
    const r = Math.hypot(width, height);
    const rays = Array.from({length: 24}, (_, i) => {
      const a0 = (i * 2 * Math.PI) / 24;
      const a1 = a0 + Math.PI / 24;
      return `M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} L${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`;
    });
    return (
      <svg width={width} height={height} style={{position: 'absolute'}}>
        <g transform={`translate(${width / 2} ${height / 2}) rotate(${rot})`} fill="rgba(255,255,255,0.06)">
          {rays.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>
    );
  }

  if (spec.light === 'spotlight') {
    const sway = interpolate(frame, [0, durationInFrames], [-0.04, 0.04]) * width;
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 34% 60% at ${width / 2 + sway}px 55%, rgba(255,244,214,0.22), rgba(0,0,0,0) 70%), radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)`,
        }}
      />
    );
  }

  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)'}} />;
};
