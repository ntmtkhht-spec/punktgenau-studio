import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS} from '../knn/theme';

export interface SfxEvent {
  readonly at: number; // Sekunden
  readonly file: string; // Datei in public/sfx (Kenney Interface Sounds, CC0)
  readonly volume: number;
}

const MUSIC_LOUD = 0.16; // zwischen den Saetzen
const MUSIC_DUCKED = 0.06; // unter der Stimme

/** Musik-Lautstaerke: unter gesprochenen Saetzen abgesenkt, in Pausen etwas lauter. */
const musicVolume = (t: number, speech: readonly (readonly [number, number])[]): number => {
  const dist = speech.reduce((best, [a, b]) => {
    const d = t < a ? a - t : t > b ? t - b : 0;
    return Math.min(best, d);
  }, Infinity);
  const k = Math.min(1, dist / 0.4);
  return MUSIC_DUCKED + (MUSIC_LOUD - MUSIC_DUCKED) * k;
};

export const ZenoSound: React.FC<{events: readonly SfxEvent[]; speech: readonly (readonly [number, number])[]}> = ({events, speech}) => (
  <>
    <Audio src={staticFile('zenon-music.wav')} volume={(f) => musicVolume(f / FPS, speech)} />
    {events.map((e, i) => (
      <Sequence key={`${e.file}-${i}`} from={Math.max(0, Math.round(e.at * FPS))} durationInFrames={FPS * 2} layout="none">
        <Audio src={staticFile(`sfx/${e.file}`)} volume={e.volume} />
      </Sequence>
    ))}
  </>
);
