import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Captions, COLORS, DotBackground, FONT, kf, makeTimeline, VoiceAndMusic} from '../../shared';
import meta from './meta.json';
import raw from './words.json';

const TL = makeTimeline(raw);
export const DURATION = TL.total;

/**
 * __TITLE__
 *
 * Regeln (siehe CLAUDE.md): Punktraster ist die Leinwand, keine Kaestchen, Safe Zone beachten,
 * alle Zeitpunkte aus TL ableiten (TL.lineStart(i), TL.lineEnd(i), TL.wordStart(i, k)), nie feste Sekunden.
 * Diese Platzhalter-Szene durch die eigentliche Visualisierung ersetzen.
 */
export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = kf(frame, [0, 0.6], [0, 1]);

  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      <DotBackground />
      <VoiceAndMusic slug="__SLUG__" hasVoice={meta.hasVoice} hasMusic={meta.hasMusic} timeline={TL} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 400, fontFamily: FONT, fontWeight: 800, fontSize: 84, textAlign: 'center', color: COLORS.text, opacity: intro}}>
        __TITLE__
      </AbsoluteFill>
      <Captions words={TL.words} />
    </AbsoluteFill>
  );
};
