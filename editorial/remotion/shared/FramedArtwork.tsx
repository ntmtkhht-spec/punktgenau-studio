import React from 'react';
import {Img, staticFile} from 'remotion';
import {bookUprightStyle} from './typography';

// Asset-Klasse archiv-werk: Echtes historisches Werk im physischen Museums-Rahmen.
// Quellenzeile darunter ist Pflicht (Reinheitsgebot).
// Orientiert sich 1:1 am Referenzvideo kUuwvJfQfIk:
// - gold / gold-klassisch: Schlanke Galerie-Goldleiste (frame_0055.jpg)
// - silber / silber-antik: Antikes Silber-/Zinn-Profil (frame_0120.jpg)
// - holz / holz-dunkel: Edles Mahagoni/Nussbaum mit Gold-Sichtleiste
// - david-gold / prunk: Authentischer Empire-Prunkrahmen von 1824 (Jacques-Louis David) als transparenter PNG-Overlay

export type FrameStyle =
  | 'gold'
  | 'gold-klassisch'
  | 'silber'
  | 'silber-antik'
  | 'holz'
  | 'holz-dunkel'
  | 'david-gold'
  | 'prunk';

interface FramedArtworkProps {
  src: string;
  /** Quellenzeile, z. B. "Caspar David Friedrich, ca. 1818" – ohne sie wird nicht gerendert. */
  caption: string;
  width: number;
  /** Optionale Höhe – falls nicht angegeben, passt sich der Rahmen dem Bildinhalt an. */
  height?: number;
  frame?: FrameStyle;
  /** Inaktive Werke im Vergleich abdunkeln (Spotlight-Regie). */
  lit?: boolean;
  style?: React.CSSProperties;
}

export const FramedArtwork: React.FC<FramedArtworkProps> = ({
  src,
  caption,
  width,
  height,
  frame = 'gold',
  lit = true,
  style,
}) => {
  if (!caption?.trim()) {
    throw new Error(`FramedArtwork ${src}: Quellenzeile fehlt (Reinheitsgebot)`);
  }

  const isOrnateDavid = frame === 'david-gold' || frame === 'prunk';
  const isSilber = frame === 'silber' || frame === 'silber-antik';
  const isHolz = frame === 'holz' || frame === 'holz-dunkel';

  const imageSrc =
    src.startsWith('http') || src.startsWith('data:') || src.startsWith('/')
      ? src
      : staticFile(src);

  // Leistenbreite: ca. 5.2% der Bildbreite, mindestens 14px
  const bw = Math.max(14, Math.round(width * 0.052));

  return (
    <div
      style={{
        width,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: lit ? 'none' : 'brightness(0.38) saturate(0.65)',
        transition: 'filter 0.3s ease',
        ...style,
      }}
    >
      {isOrnateDavid ? (
        // Authentischer 1824 David-Prunkrahmen (PNG-Overlay)
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '2111 / 2393',
            boxShadow: '0 24px 50px rgba(0,0,0,0.7), 0 8px 18px rgba(0,0,0,0.45)',
          }}
        >
          {/* Eingefasstes Kunstwerk im transparenten Bildausschnitt */}
          <div
            style={{
              position: 'absolute',
              top: '8.8%',
              left: '8.8%',
              width: '82.4%',
              height: '84.6%',
              overflow: 'hidden',
              backgroundColor: '#111',
            }}
          >
            <Img
              src={imageSrc}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Falz-Schatten */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow:
                  'inset 0 8px 20px rgba(0,0,0,0.85), inset 0 0 6px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Physischer Goldrahmen-Overlay */}
          <Img
            src={staticFile('frames/david_gold.png')}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          />
        </div>
      ) : (
        // Direktionales 4-Leisten-Profil mit 45°-Gehrungsfugen (Ultralativ-Standard)
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: height ?? 'auto',
            boxSizing: 'border-box',
            boxShadow: '0 22px 48px rgba(0,0,0,0.65), 0 6px 16px rgba(0,0,0,0.4)',
            backgroundColor: '#0a0a0a',
          }}
        >
          {/* Kunstwerk im Falz */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              padding: bw,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <Img
              src={imageSrc}
              style={{
                display: 'block',
                width: '100%',
                height: height ? `calc(${height}px - ${bw * 2}px)` : 'auto',
                objectFit: 'cover',
              }}
            />
            {/* Tiefer Falz-Schatten: Das Bild liegt physisch im Holzfalz vertieft */}
            <div
              style={{
                position: 'absolute',
                top: bw,
                left: bw,
                right: bw,
                bottom: bw,
                boxShadow:
                  'inset 0 6px 14px rgba(0,0,0,0.85), inset 0 0 4px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Die 4 direktionalen Profilleisten mit Gehrungsschnitt */}
          <MouldingRails bw={bw} mode={isSilber ? 'silber' : isHolz ? 'holz' : 'gold'} />
        </div>
      )}

      {/* Museums-Quellenzeile (Pflicht nach Reinheitsgebot) */}
      <div
        style={bookUprightStyle({
          fontSize: Math.max(13, Math.round(width * 0.046)),
          marginTop: Math.round(width * 0.035),
          color: '#e8e4dc',
          letterSpacing: '0.02em',
          opacity: lit ? 0.9 : 0.35,
          textAlign: 'center',
          maxWidth: width * 1.15,
        })}
      >
        {caption}
      </div>
    </div>
  );
};

interface MouldingRailsProps {
  bw: number;
  mode: 'gold' | 'silber' | 'holz';
}

const MouldingRails: React.FC<MouldingRailsProps> = ({bw, mode}) => {
  // Exakt abgestimmte Profil-Verläufe je Himmelsrichtung (Lichtquelle oben links):
  // Jede Leiste besitzt ein mehrstufiges Profil: Außenkante -> Wulst (Torus) -> Kehle (Cove) -> Sichtkante (Fillet)
  const profiles = {
    gold: {
      top: 'linear-gradient(180deg, #fff4cc 0%, #ecd07a 14%, #fffae0 30%, #cca03c 45%, #6a4a14 62%, #987224 80%, #f4dc8c 90%, #462c08 100%)',
      bottom: 'linear-gradient(0deg, #a4802c 0%, #825e1a 14%, #9a7424 30%, #765014 45%, #422a08 62%, #5e3e10 80%, #9e7e2c 90%, #261604 100%)',
      left: 'linear-gradient(90deg, #fae8be 0%, #dfbe64 14%, #fff4d2 30%, #be9434 45%, #5e4010 62%, #8c6620 80%, #e6cc7a 90%, #3e2606 100%)',
      right: 'linear-gradient(270deg, #967426 0%, #765416 14%, #8c6620 30%, #684610 45%, #3a2206 62%, #52340c 80%, #8e6e24 90%, #201202 100%)',
    },
    silber: {
      top: 'linear-gradient(180deg, #ffffff 0%, #d8d4cb 14%, #f8f8fa 30%, #aba498 45%, #48443e 62%, #767066 80%, #dedad2 90%, #32302c 100%)',
      bottom: 'linear-gradient(0deg, #8a847a 0%, #6e6860 14%, #847e74 30%, #645e56 45%, #34302c 62%, #4e4a44 80%, #8c867c 90%, #1e1c1a 100%)',
      left: 'linear-gradient(90deg, #f4f2ee 0%, #ccc8be 14%, #f6f4f0 30%, #9e988c 45%, #403c36 62%, #6c665e 80%, #d2cec6 90%, #2a2826 100%)',
      right: 'linear-gradient(270deg, #7e7870 0%, #645e56 14%, #78726a 30%, #58524a 45%, #2c2824 62%, #44403a 80%, #7e7870 90%, #181614 100%)',
    },
    holz: {
      top: 'linear-gradient(180deg, #9c603a 0%, #683a1e 14%, #864e2c 30%, #522c14 45%, #261206 62%, #42200e 80%, #e0bc68 90%, #1c0a02 100%)',
      bottom: 'linear-gradient(0deg, #583018 0%, #40200c 14%, #4e2812 30%, #361a08 45%, #180a04 62%, #2a1206 80%, #9a7c36 90%, #100602 100%)',
      left: 'linear-gradient(90deg, #8e5430 0%, #5e3218 14%, #7c4424 30%, #4a2410 45%, #200e04 62%, #381a0a 80%, #cca658 90%, #160802 100%)',
      right: 'linear-gradient(270deg, #4e2a14 0%, #381a0a 14%, #44220e 30%, #2e1406 45%, #140802 62%, #220e04 80%, #886c2e 90%, #0c0402 100%)',
    },
  }[mode];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Obere Leiste */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: bw,
          background: profiles.top,
          clipPath: `polygon(0 0, 100% 0, calc(100% - ${bw}px) 100%, ${bw}px 100%)`,
        }}
      />
      {/* Untere Leiste */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: bw,
          background: profiles.bottom,
          clipPath: `polygon(${bw}px 0, calc(100% - ${bw}px) 0, 100% 100%, 0 100%)`,
        }}
      />
      {/* Linke Leiste */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: bw,
          background: profiles.left,
          clipPath: `polygon(0 0, 100% ${bw}px, 100% calc(100% - ${bw}px), 0 100%)`,
        }}
      />
      {/* Rechte Leiste */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: bw,
          background: profiles.right,
          clipPath: `polygon(0 ${bw}px, 100% 0, 100% 100%, 0 calc(100% - ${bw}px))`,
        }}
      />

      {/* 45°-Gehrungsfugen (feine Tiefenkerbe an allen 4 Ecken) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <line x1="0" y1="0" x2={bw} y2={bw} stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
        <line
          x1="100%"
          y1="0"
          x2={`calc(100% - ${bw}px)`}
          y2={bw}
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="100%"
          x2={bw}
          y2={`calc(100% - ${bw}px)`}
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1"
        />
        <line
          x1="100%"
          y1="100%"
          x2={`calc(100% - ${bw}px)`}
          y2={`calc(100% - ${bw}px)`}
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};
