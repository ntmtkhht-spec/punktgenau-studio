import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FramedArtwork} from '../shared/FramedArtwork';
import {RoleText} from '../shared/typography';

export const KasparowStage: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps, durationInFrames} = useVideoConfig();

  const short = Math.min(width, height);
  const scale = interpolate(frame, [0, durationInFrames], [0.96, 1.04], {
    easing: Easing.out(Easing.quad),
  });

  const titleOpacity = interpolate(frame, [fps * 0.4, fps * 1.0], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const spotlightOpacity = interpolate(frame, [0, fps * 0.8], [0.3, 1], {
    extrapolateRight: 'clamp',
  });

  const frameWidth = short * 0.52;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: height * 0.08,
          textAlign: 'center',
          opacity: titleOpacity,
          zIndex: 10,
        }}
      >
        <RoleText role="editorial-didone" style={{fontSize: short * 0.065, letterSpacing: '0.08em'}}>
          1996: KASPAROW
        </RoleText>
        <div style={{marginTop: 6}}>
          <RoleText role="literary-book-serif" style={{fontSize: short * 0.032, opacity: 0.85}}>
            Philadelphia, 10. Februar 1996
          </RoleText>
        </div>
      </div>

      <div
        style={{
          transform: `scale(${scale})`,
          opacity: spotlightOpacity,
          marginTop: height * 0.08,
        }}
      >
        <FramedArtwork
          src="assets/kasparov-chess.jpg"
          caption="Garri Kasparow, 1996"
          width={frameWidth}
          frame="gold"
          lit={true}
        />
      </div>
    </AbsoluteFill>
  );
};
