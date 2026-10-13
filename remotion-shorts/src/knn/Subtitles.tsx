import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Cue} from './cues';
import {FONT} from './font';
import {BOX_OUTLINE, COLORS} from './theme';

const renderText = (text: string) =>
  text.split('*').map((part, i) => (
    <span key={i} style={i % 2 === 1 ? {color: COLORS.accent} : undefined}>
      {part}
    </span>
  ));

export const Subtitles: React.FC<{cues: readonly Cue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cue = cues.find((c) => frame >= c.from * fps && frame < c.to * fps);
  if (!cue) return null;

  const local = frame - cue.from * fps;
  const remaining = cue.to * fps - frame;
  const enter = spring({frame: local, fps, config: {damping: 16, stiffness: 220}, durationInFrames: 12});
  const exit = interpolate(remaining, [0, 5], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 1480,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 24}px) scale(${0.96 + enter * 0.04})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.18,
          color: COLORS.text,
          textAlign: 'center',
          padding: '18px 34px',
          background: COLORS.pill,
          outline: BOX_OUTLINE,
        }}
      >
        {renderText(cue.text)}
      </div>
    </div>
  );
};
