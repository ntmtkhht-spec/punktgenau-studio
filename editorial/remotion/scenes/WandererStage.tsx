import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FramedArtwork} from '../shared/FramedArtwork';
import {RoleText} from '../shared/typography';

export const WandererStage: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps, durationInFrames} = useVideoConfig();

  const short = Math.min(width, height);
  const scale = interpolate(frame, [0, durationInFrames], [0.98, 1.05], {
    easing: Easing.out(Easing.quad),
  });

  const textOpacity = interpolate(frame, [fps * 0.6, fps * 1.2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textOffset = interpolate(frame, [fps * 0.6, fps * 1.2], [24, 0], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const frameWidth = short * 0.46;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: height * 0.08,
          textAlign: 'center',
          opacity: textOpacity,
          transform: `translateY(${textOffset}px)`,
          zIndex: 10,
        }}
      >
        <RoleText role="tall-condensed-serif" style={{fontSize: short * 0.09, letterSpacing: '0.02em'}}>
          MUSTER STATT GEIST
        </RoleText>
      </div>

      <div
        style={{
          transform: `scale(${scale})`,
          marginTop: height * 0.1,
        }}
      >
        <FramedArtwork
          src="assets/friedrich-wanderer.jpg"
          caption="Caspar David Friedrich, ca. 1818"
          width={frameWidth}
          frame="gold"
          lit={true}
        />
      </div>
    </AbsoluteFill>
  );
};
