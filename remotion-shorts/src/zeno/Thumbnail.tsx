import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../knn/font';
import {COLORS} from '../knn/theme';
import {Hook3D} from './Hook3D';

/** Shorts-Thumbnail 1080x1920: Szene aus dem Hook + grosse Schlagzeile (flach, weisse Kontur statt Schatten). */
const HALO: React.CSSProperties = {WebkitTextStroke: '22px #ffffff', paintOrder: 'stroke fill'};

export const ZenoThumbnail: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg}}>
    <AbsoluteFill style={{transform: 'translateY(500px)'}}>
      <Hook3D end={5} stop={2.2} doorSpeed={1.6} figureColor={COLORS.blue} doorColor={COLORS.accent} atTime={1.6} />
    </AbsoluteFill>
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 150, fontFamily: FONT, fontWeight: 800, textAlign: 'center'}}>
      <div style={{fontSize: 140, lineHeight: 1.0, letterSpacing: -4, color: COLORS.text, ...HALO}}>
        Du erreichst
        <br />
        diese Tür
        <br />
        <span style={{color: COLORS.accent}}>nie.</span>
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 230, fontFamily: FONT, fontWeight: 800}}>
      <div style={{fontSize: 92, color: COLORS.text, letterSpacing: -2, ...HALO}}>½ + ¼ + ⅛ + … = ?</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
