// Typed exports fuer das Vorlagen-Font-System
import catalogJson from './catalog.json';

export type FontRole =
  | 'editorial-didone'
  | 'tall-condensed-serif'
  | 'heavy-plakat-grotesk'
  | 'literary-book-serif'
  | 'typewriter-archival'
  | 'retro-crt-terminal'
  | 'diegetic-ui-sans'
  | 'historical-fraktur';

export interface FontEntry {
  family: string;
  role: FontRole;
  file: string;
  format: string;
  weight: string;
  style: string;
  variable: boolean;
  designer: string;
  license: string;
  description: string;
  recommendedFor: string[];
}

export const FONT_CATALOG: FontEntry[] = catalogJson.fonts as FontEntry[];

export const LOCAL_FONT_FAMILIES = {
  playfair: 'Playfair Display',
  bodoni: 'Bodoni Moda',
  instrumentSerif: 'Instrument Serif',
  dmSerif: 'DM Serif Display',
  cinzel: 'Cinzel',
  anton: 'Anton',
  bebas: 'Bebas Neue',
  rubik: 'Rubik',
  cormorant: 'Cormorant Garamond',
  fraunces: 'Fraunces',
  specialElite: 'Special Elite',
  courierPrime: 'Courier Prime',
  vt323: 'VT323',
  ibmPlexMono: 'IBM Plex Mono',
  inter: 'Inter',
  fraktur: 'UnifrakturMaguntia',
} as const;
