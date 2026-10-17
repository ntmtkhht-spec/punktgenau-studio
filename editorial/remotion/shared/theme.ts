// Farb- und Lichtmodi, gemessen am Referenzvideo (research/ultralativ-editorial-pipeline-spec.md, 2.1).

export type Mode = 'these' | 'kritik';
export type Motif = 'damast' | 'arkaden' | 'blaetter' | 'birken';
export type Light = 'none' | 'vignette' | 'spotlight' | 'sunburst';

/** Farbiger These-Modus: eine Grundfarbe pro Kapitel. */
export const THESE_COLORS = {
  tiefblau: '#235097',
  orange: '#e38450',
  kupfer: '#713f23',
  petrol: '#1380a4',
  lachs: '#c37664',
} as const;
export type TheseColor = keyof typeof THESE_COLORS;

/** Abgedunkelter Kritik-/Analyse-Modus (Luminanz ca. 52-76). */
export const KRITIK_BASE = '#3e3e3e';

export const PAPER = '#f5efe1';
export const INK = '#151515';

// Schriften: ausschliesslich ueber ./typography.tsx (7 Rollen aus Skill editorial-typography).

export type WallpaperSpec = {
  motif: Motif;
  mode: Mode;
  color: TheseColor;
  light: Light;
};

export const baseColor = (w: WallpaperSpec) => (w.mode === 'kritik' ? KRITIK_BASE : THESE_COLORS[w.color]);
