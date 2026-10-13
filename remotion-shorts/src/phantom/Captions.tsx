import React, {useMemo} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../knn/font';
import {COLORS} from '../knn/theme';
import type {Word} from '../shared/words';

const MAX_CHARS = 16;
const MAX_WORDS = 3;
const CENTER_X = 540; // mittig
const CENTER_Y = 1360; // tiefer, aber noch ueber dem Beschreibungsbereich der Plattformen
const MAX_WIDTH = 800;

interface Chunk {
  readonly words: readonly Word[];
  readonly start: number;
  readonly end: number;
}

const endsSentence = (w: Word): boolean => /[.?!:,][“”"]?$/.test(w.text);

/** Wort-Gruppen: max. 3 Woerter / 16 Zeichen, Umbruch an Satzzeichen. */
const buildChunks = (words: readonly Word[]): readonly Chunk[] => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    const chars = [...cur, w].map((x) => x.text).join(' ').length;
    if (cur.length > 0 && (cur.length >= MAX_WORDS || chars > MAX_CHARS)) {
      chunks.push(cur);
      cur = [];
    }
    cur = [...cur, w];
    if (endsSentence(w)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length > 0) chunks.push(cur);
  return chunks.map((ws, i) => {
    const next = chunks[i + 1]?.[0];
    const last = ws[ws.length - 1];
    return {words: ws, start: ws[0].start, end: next ? Math.min(next.start, last.end + 0.35) : last.end + 0.4};
  });
};

export const Captions: React.FC<{words: readonly Word[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chunks = useMemo(() => buildChunks(words), [words]);
  const t = frame / fps;
  const chunk = chunks.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;

  const text = chunk.words.map((w) => w.text).join(' ');
  const fontSize = Math.min(112, MAX_WIDTH / (text.length * 0.56));
  const pop = spring({frame: frame - chunk.start * fps, fps, config: {damping: 14, stiffness: 260}, durationInFrames: 8});

  return (
    <div
      style={{
        position: 'absolute',
        left: CENTER_X - 500,
        width: 1000,
        top: CENTER_Y - 90,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: fontSize * 0.28,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize,
        letterSpacing: -1,
        whiteSpace: 'nowrap',
        // Flache weisse Kontur (kein Schatten): trennt die Schrift vom Punktraster
        WebkitTextStroke: `${Math.round(fontSize * 0.2)}px ${COLORS.bg}`,
        paintOrder: 'stroke fill',
        transform: `scale(${0.88 + 0.12 * pop})`,
      }}
    >
      {chunk.words.map((w, i) => {
        const active = t >= w.start && (i === chunk.words.length - 1 || t < chunk.words[i + 1].start);
        const spoken = t >= w.start;
        return (
          <span
            key={`${w.start}-${i}`}
            style={{
              color: active ? COLORS.accent : spoken ? COLORS.text : '#b4b4b4',
              display: 'inline-block',
              transform: active ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {w.text.replace(/[.,](?=[“”"]?$)/, '')}
          </span>
        );
      })}
    </div>
  );
};
