// Videoformate der Editorial-Pipeline. Pro Video in storyboard.json gewaehlt.
export const FORMATS = {
  '16x9': {width: 1920, height: 1080},
  '9x16': {width: 1080, height: 1920},
} as const;

export type FormatKey = keyof typeof FORMATS;
export const FPS = 30;

export const isPortrait = (format: FormatKey) => format === '9x16';
