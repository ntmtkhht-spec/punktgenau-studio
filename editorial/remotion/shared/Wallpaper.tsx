import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {baseColor, Motif, WallpaperSpec} from './theme';

// Authentische historische Tapeten aus gemeinfreien Museums- und Archivbeständen (Wikimedia Commons):
// - damast: Historischer Seidendamast-Stoff (Metropolitan Museum of Art)
// - blaetter: William Morris "Willow Bough", 1887 (Victoria and Albert Museum)
// - birken: Alphonse Legros "Les Bouleaux", 19. Jh. Radierung (National Gallery of Art)
// - arkaden: Giovanni Battista Piranesi "Carceri d'invenzione", 18. Jh. Kupferstich (Rijksmuseum)
//
// Ultralativ-Reinheitsgebot:
// Keine KI-generierten Texturen, keine prozeduralen SVG-Zeichnungen. Ausschließlich echte Digitalisate.

const WALLPAPER_FILES: Record<Motif, string> = {
  damast: 'wallpapers/damast.jpg',
  blaetter: 'wallpapers/blaetter.jpg',
  birken: 'wallpapers/birken.jpg',
  arkaden: 'wallpapers/arkaden.jpg',
  botanisch: 'wallpapers/botanisch.jpg',
  farne: 'wallpapers/farne.jpg',
  urne: 'wallpapers/urne.jpg',
};

const IS_TILED: Record<Motif, boolean> = {
  damast: true,
  blaetter: true,
  birken: false,
  arkaden: false,
  botanisch: true,
  farne: false,
  urne: false,
};

export const Wallpaper: React.FC<{spec: WallpaperSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  // Subtile, unmerkliche Kamerabewegung (Drift + minimaler Push-In), damit der Raum lebendig bleibt
  const driftX = interpolate(frame, [0, durationInFrames], [0, 24]);
  const driftY = interpolate(frame, [0, durationInFrames], [0, -14]);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.03]);

  const base = baseColor(spec);
  const isKritik = spec.mode === 'kritik';
  const fileUrl = staticFile(WALLPAPER_FILES[spec.motif]);
  const isTiled = IS_TILED[spec.motif];

  return (
    <AbsoluteFill style={{backgroundColor: base, overflow: 'hidden'}}>
      {/* Tapeten-Textur-Ebene mit authentischem Museums-Scan */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `scale(${zoom}) translate(${driftX}px, ${driftY}px)`,
          backgroundImage: `url(${fileUrl})`,
          backgroundRepeat: isTiled ? 'repeat' : 'no-repeat',
          backgroundSize: isTiled ? '440px auto' : 'cover',
          backgroundPosition: 'center center',
          filter: isKritik
            ? 'grayscale(100%) contrast(1.25) brightness(0.65)'
            : 'grayscale(30%) contrast(1.15) brightness(0.9)',
          mixBlendMode: isKritik ? 'luminosity' : 'multiply',
          opacity: isKritik ? 0.35 : 0.65,
        }}
      />

      {/* Feine authentische Papier-/Filmkörnung */}
      <svg
        width={width}
        height={height}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18}}
      >
        <filter id="wallpaper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed={7} />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" />
        </filter>
        <rect width={width} height={height} filter="url(#wallpaper-grain)" />
      </svg>

      {/* Licht- und Schattierungsebene */}
      <LightLayer spec={spec} />
    </AbsoluteFill>
  );
};

const LightLayer: React.FC<{spec: WallpaperSpec}> = ({spec}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  if (spec.light === 'none') return null;

  if (spec.light === 'sunburst') {
    const rot = interpolate(frame, [0, durationInFrames], [0, 10]);
    const r = Math.hypot(width, height);
    const rays = Array.from({length: 24}, (_, i) => {
      const a0 = (i * 2 * Math.PI) / 24;
      const a1 = a0 + Math.PI / 24;
      return `M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} L${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`;
    });
    return (
      <svg
        width={width}
        height={height}
        style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
      >
        <g
          transform={`translate(${width / 2} ${height / 2}) rotate(${rot})`}
          fill={spec.mode === 'kritik' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)'}
        >
          {rays.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>
    );
  }

  if (spec.light === 'spotlight') {
    const sway = interpolate(frame, [0, durationInFrames], [-0.03, 0.03]) * width;
    return (
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 36% 65% at ${width / 2 + sway}px 52%, rgba(255,246,220,0.24), rgba(0,0,0,0) 72%), radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.72) 100%)`,
        }}
      />
    );
  }

  // vignette (Standard)
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
      }}
    />
  );
};
