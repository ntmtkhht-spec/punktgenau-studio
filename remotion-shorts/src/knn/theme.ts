export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const PLOT = 900;

/** Weiss, flache Farben, eckige Kaestchen, keine Effekte. */
export const COLORS = {
  bg: '#ffffff',
  panel: '#ffffff',
  grid: '#c4c4c4',
  blue: '#1f7ae0',
  orange: '#f97316',
  neutral: '#9ca3af',
  accent: '#d61f69',
  text: '#000000',
  muted: '#555555',
  tintBlue: '#d3e4fb',
  tintBlueSoft: '#e9f1fd',
  tintOrange: '#fddcc4',
  tintOrangeSoft: '#feeee0',
  pill: '#ffffff',
} as const;

/** Duenner schwarzer Rahmen fuer alle Kaestchen (Outline: aendert das Layout nicht). */
export const BOX_OUTLINE = `3px solid ${COLORS.text}`;

export const sec = (s: number): number => Math.round(s * FPS);
