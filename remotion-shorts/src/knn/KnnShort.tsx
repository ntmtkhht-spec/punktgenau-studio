import React from 'react';
import {AbsoluteFill} from 'remotion';
import {DotBackground} from '../shared/DotBackground';
import {CUES} from './cues';
import {Header, Hud, Recap} from './Hud';
import {PlotScene} from './PlotScene';
import {Subtitles} from './Subtitles';
import {COLORS} from './theme';

export const KnnShort: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg}}>
    <DotBackground />
    <Header />
    <PlotScene />
    <Recap />
    <Hud />
    <Subtitles cues={CUES} />
  </AbsoluteFill>
);
