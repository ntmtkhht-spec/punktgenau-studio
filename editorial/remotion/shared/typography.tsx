import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadCormorant} from '@remotion/google-fonts/CormorantGaramond';
import {loadFont as loadDMSerif} from '@remotion/google-fonts/DMSerifDisplay';
import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexMono';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadSpecialElite} from '@remotion/google-fonts/SpecialElite';
import React from 'react';

// Die 7 Schrift-Rollen aus dem Skill editorial-typography – einziger Ort, an dem Schriften gesetzt werden.
// Szenen schreiben kein eigenes fontFamily, sondern nutzen <RoleText role=…> oder roleStyle(role).

const SUBSETS = {subsets: ['latin', 'latin-ext'] as ('latin' | 'latin-ext')[]};
const FAMILY = {
  didone: loadPlayfair('normal', {weights: ['400', '700', '900'], ...SUBSETS}).fontFamily,
  didoneItalic: loadPlayfair('italic', {weights: ['400'], ...SUBSETS}).fontFamily,
  tallSerif: loadDMSerif('normal', {weights: ['400'], ...SUBSETS}).fontFamily,
  plakat: loadAnton('normal', {weights: ['400'], ...SUBSETS}).fontFamily,
  book: loadCormorant('italic', {weights: ['400'], ...SUBSETS}).fontFamily,
  bookUpright: loadCormorant('normal', {weights: ['400', '500'], ...SUBSETS}).fontFamily,
  typewriter: loadSpecialElite('normal', {weights: ['400'], ...SUBSETS}).fontFamily,
  terminal: loadPlex('normal', {weights: ['500'], ...SUBSETS}).fontFamily,
  ui: loadInter('normal', {weights: ['400', '600'], ...SUBSETS}).fontFamily,
};

export type FontRole =
  | 'editorial-didone'
  | 'tall-condensed-serif'
  | 'heavy-plakat-grotesk'
  | 'literary-book-serif'
  | 'typewriter-archival'
  | 'retro-crt-terminal'
  | 'diegetic-ui-sans';

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
