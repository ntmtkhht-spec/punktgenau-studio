import React from 'react';
export {LocalFonts} from './fonts/LocalFonts';

// Die 7+ Schrift-Rollen aus dem Skill editorial-typography – zentraler Ort fuer alle Schriften.
// Alle Schriften liegen lokal im Repo (shared/fonts & public/fonts) – 100% offline-faehig.
// Szenen schreiben kein eigenes fontFamily, sondern nutzen <RoleText role=…> oder roleStyle(role).

export const FAMILY = {
  didone: "'Playfair Display', serif",
  didoneItalic: "'Playfair Display', serif",
  bodoni: "'Bodoni Moda', serif",
  tallSerif: "'DM Serif Display', 'Playfair Display', serif",
  instrumentSerif: "'Instrument Serif', serif",
  cinzel: "'Cinzel', serif",
  plakat: "'Anton', sans-serif",
  bebas: "'Bebas Neue', sans-serif",
  rubik: "'Rubik', sans-serif",
  book: "'Cormorant Garamond', serif",
  bookUpright: "'Cormorant Garamond', serif",
  fraunces: "'Fraunces', serif",
  typewriter: "'Special Elite', monospace",
  courierPrime: "'Courier Prime', monospace",
  terminal: "'IBM Plex Mono', monospace",
  vt323: "'VT323', monospace",
  ui: "'Inter', sans-serif",
  fraktur: "'UnifrakturMaguntia', serif",
};

export type FontRole =
  | 'editorial-didone'
  | 'tall-condensed-serif'
  | 'heavy-plakat-grotesk'
  | 'literary-book-serif'
  | 'typewriter-archival'
  | 'retro-crt-terminal'
  | 'diegetic-ui-sans'
  | 'historical-fraktur';

/** Signalfarben fuer genau ein hervorgehobenes Wort pro Zeile (Skill-Regel 2). */
export const ACCENT = {blau: '#0f5499', rot: '#c83e2b', orange: '#e06324'} as const;
export const CREAM = '#f5efe1';
export const INK = '#111111';

const ROLE_STYLES: Record<FontRole, React.CSSProperties> = {
  'editorial-didone': {fontFamily: FAMILY.didone, fontWeight: 400, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.65))'},
  'tall-condensed-serif': {
    fontFamily: FAMILY.tallSerif, textTransform: 'uppercase', letterSpacing: '-0.02em',
    textShadow: '4px 6px 0 #111, 0 12px 24px rgba(0,0,0,0.5)',
  },
  'heavy-plakat-grotesk': {
    fontFamily: FAMILY.plakat, textTransform: 'uppercase', lineHeight: 0.92, color: '#a51c1c',
    textShadow: [1, 2, 3, 4, 5, 6].map((i) => `${i}px ${i}px 0 #000`).join(', '),
  },
  'literary-book-serif': {fontFamily: FAMILY.book, fontStyle: 'italic', lineHeight: 1.38, textShadow: '0 2px 6px rgba(0,0,0,0.65)'},
  'typewriter-archival': {fontFamily: FAMILY.typewriter, color: '#1a1a18', lineHeight: 1.45},
  'retro-crt-terminal': {fontFamily: FAMILY.terminal, fontWeight: 500, color: '#f0f6f0', textShadow: '0 0 8px rgba(240,255,240,0.6)'},
  'diegetic-ui-sans': {fontFamily: FAMILY.ui, fontWeight: 400},
  'historical-fraktur': {fontFamily: FAMILY.fraktur, fontWeight: 400, letterSpacing: '0.04em', textShadow: '0 2px 6px rgba(0,0,0,0.85)'},
};

/** Neigung/Stauchung, die zur Rolle gehoert (auf einem inline-block-Kind anwenden). */
export const ROLE_TRANSFORM: Partial<Record<FontRole, string>> = {
  'tall-condensed-serif': 'rotate(-6deg) scaleX(0.74)',
  'heavy-plakat-grotesk': 'rotate(-6deg)',
};

export const roleStyle = (role: FontRole, extra: React.CSSProperties = {}): React.CSSProperties => ({
  color: CREAM,
  ...ROLE_STYLES[role],
  ...extra,
});

/** Kursive Didone fuer Dachzeilen ueber Rolle 2/3 (Gesetz der Schrift-Paarung). */
export const kickerStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FAMILY.didoneItalic, fontStyle: 'italic', color: INK, ...extra,
});

/** Aufrechte Buchschrift fuer Sprechblasen und die Quellenzeile unter Bilderrahmen. */
export const bookUprightStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FAMILY.bookUpright, fontWeight: 400, color: '#d0d0d0', ...extra,
});

/** Schlanke, moderne Editorial-Serife (Instrument Serif) fuer monumentale Raumtexte. */
export const instrumentSerifStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FAMILY.instrumentSerif, color: CREAM, letterSpacing: '-0.02em', ...extra,
});

/** Extrem kontrastreiche italienische Bodoni fuer Hero-Titel und Jahreszahlen. */
export const bodoniStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FAMILY.bodoni, fontWeight: 700, color: CREAM, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.7))', ...extra,
});

/** Monumentale roemische Inschrift-Kapitaelchen (Cinzel) fuer Epochen-Titel. */
export const cinzelStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FAMILY.cinzel, textTransform: 'uppercase', letterSpacing: '0.06em', color: CREAM, ...extra,
});

/** Warme, literarische Old-Style-Serife (Fraunces) fuer persoenliche Essays. */
export const frauncesStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FAMILY.fraunces, color: CREAM, lineHeight: 1.35, ...extra,
});

/** Historische deutsche Fraktur (UnifrakturMaguntia) fuer historische Erlasse & Zitate. */
export const frakturStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FAMILY.fraktur, color: CREAM, letterSpacing: '0.04em', textShadow: '0 2px 6px rgba(0,0,0,0.85)', ...extra,
});

/** Kraeftige Rubik fuer YouTube-Thumbnails (minFontPx >= 110) und laute Unterzeilen. */
export const rubikStyle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FAMILY.rubik, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', ...extra,
});

interface RoleTextProps {
  role: FontRole;
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** Rollen-typische Neigung anwenden (Standard: ja). */
  tilt?: boolean;
}

export const RoleText: React.FC<RoleTextProps> = ({role, children, style, tilt = true}) => {
  const transform = tilt ? ROLE_TRANSFORM[role] : undefined;
  return (
    <div style={roleStyle(role, style)}>
      <span style={{display: 'inline-block', transform}}>{children}</span>
    </div>
  );
};
