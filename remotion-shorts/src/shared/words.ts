export interface Word {
  readonly text: string;
  readonly start: number; // Sekunden
  readonly end: number;
  readonly line: number; // Zeile im Voice-Skript (0-basiert)
}

export interface Timeline {
  readonly words: readonly Word[];
  readonly lineStart: (i: number) => number;
  readonly lineEnd: (i: number) => number;
  readonly wordStart: (line: number, k: number) => number;
  readonly total: number;
}

/** Timeline aus Wortzeiten (geschaetzt oder aus Whisper), Szenen haengen an Skriptzeilen. */
export const makeTimeline = (words: readonly Word[]): Timeline => {
  const count = Math.max(...words.map((w) => w.line)) + 1;
  const byLine = Array.from({length: count}, (_, i) => words.filter((w) => w.line === i));
  return {
    words,
    lineStart: (i) => byLine[i][0].start,
    lineEnd: (i) => byLine[i][byLine[i].length - 1].end,
    wordStart: (line, k) => byLine[line][Math.min(k, byLine[line].length - 1)].start,
    total: words[words.length - 1].end + 0.6,
  };
};
