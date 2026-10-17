import React from 'react';
import {Img, staticFile} from 'remotion';
import {bookUprightStyle} from './typography';

// Asset-Klasse archiv-werk: echtes Werk im Gold-/Holzrahmen, Quellenzeile darunter ist Pflicht.
// src zeigt auf eine Datei aus assets-manifest.json (visuallyChecked: true).

interface FramedArtworkProps {
  src: string;
  /** Quellenzeile, z. B. "Caspar David Friedrich, ca. 1818" – ohne sie wird nicht gerendert. */
  caption: string;
  width: number;
  frame?: 'gold' | 'holz';
  /** Inaktive Werke im Vergleich abdunkeln (Spotlight-Regie). */
  lit?: boolean;
  style?: React.CSSProperties;
}

const FRAMES = {
  gold: {border: '#b8892d', inner: '#e4c46a'},
  holz: {border: '#5a3b22', inner: '#8a613d'},
};

export const FramedArtwork: React.FC<FramedArtworkProps> = ({src, caption, width, frame = 'gold', lit = true, style}) => {
  if (!caption.trim()) throw new Error(`FramedArtwork ${src}: Quellenzeile fehlt (Reinheitsgebot)`);
  const f = FRAMES[frame];
  const bw = Math.max(6, width * 0.045);
  return (
    <div style={{width, textAlign: 'center', ...style}}>
      <div
        style={{
          border: `${bw}px solid ${f.border}`,
          outline: `${bw * 0.25}px solid ${f.inner}`,
          outlineOffset: -bw * 0.6,
          boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
          filter: lit ? 'none' : 'brightness(0.35) saturate(0.6)',
        }}
      >
        <Img src={src.startsWith('http') ? src : staticFile(src)} style={{display: 'block', width: '100%'}} />
      </div>
      <div style={bookUprightStyle({fontSize: Math.max(14, width * 0.055), marginTop: width * 0.04, opacity: lit ? 1 : 0.4})}>{caption}</div>
    </div>
  );
};
