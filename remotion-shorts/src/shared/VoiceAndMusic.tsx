import React from 'react';
import {Audio, staticFile} from 'remotion';
import {FPS} from '../knn/theme';
import type {Timeline} from './words';

const MUSIC_LOUD = 0.16; // in Sprechpausen
const MUSIC_DUCKED = 0.06; // unter der Stimme

/**
 * Stimme + eigener Klangteppich, Musik wird unter gesprochenen Saetzen abgesenkt.
 * Dateien liegen in public/<slug>/voice.wav und public/<slug>/music.wav (erzeugt von `npm run pg -- voice <slug>`).
 * Soundeffekte gibt es bewusst nicht (Kanal-Regel).
 */
export const VoiceAndMusic: React.FC<{slug: string; hasVoice: boolean; hasMusic: boolean; timeline: Timeline}> = ({slug, hasVoice, hasMusic, timeline}) => {
  const lines = timeline.words[timeline.words.length - 1].line + 1;
  const speech = Array.from({length: lines}, (_, i) => [timeline.lineStart(i), timeline.lineEnd(i)] as const);
  const musicVolume = (f: number): number => {
    const t = f / FPS;
    const dist = speech.reduce((best, [a, b]) => Math.min(best, t < a ? a - t : t > b ? t - b : 0), Infinity);
    return MUSIC_DUCKED + (MUSIC_LOUD - MUSIC_DUCKED) * Math.min(1, dist / 0.4);
  };
  return (
    <>
      {hasVoice && <Audio src={staticFile(`${slug}/voice.wav`)} />}
      {hasMusic && <Audio src={staticFile(`${slug}/music.wav`)} volume={musicVolume} />}
    </>
  );
};
