import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../knn/font';
import {COLORS} from '../knn/theme';

/** Punktraster wie in den Videos (SVG-Pattern, kein Verlauf). */
const Dots: React.FC<{step: number; r: number}> = ({step, r}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
    <defs>
      <pattern id={`dots-${step}`} width={step} height={step} patternUnits="userSpaceOnUse">
        <circle cx={step / 2} cy={step / 2} r={r} fill={COLORS.grid} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#dots-${step})`} />
  </svg>
);

/** Wortmarke "punktgenau." – der Schlusspunkt ist ein magentafarbenes Quadrat. */
const Wordmark: React.FC<{size: number; lines?: 1 | 2}> = ({size, lines = 1}) => {
  const dot = <span style={{display: 'inline-block', width: size * 0.24, height: size * 0.24, background: COLORS.accent, marginLeft: size * 0.06}} />;
  const text: React.CSSProperties = {fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03, color: COLORS.text, lineHeight: 0.92};
  return lines === 1 ? (
    <div style={text}>punktgenau{dot}</div>
  ) : (
    <div style={text}>
      <div>punkt</div>
      <div>genau{dot}</div>
    </div>
  );
};

/** YouTube-Profilbild 800x800 (wird rund angezeigt, teils nur 98 px gross). */
export const ProfileLogo: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg, alignItems: 'center', justifyContent: 'center'}}>
    <Wordmark size={170} lines={2} />
  </AbsoluteFill>
);

/** Wortmarke einzeilig, z. B. fuer Wasserzeichen und Abspann (transparenter Hintergrund). */
export const WordmarkWide: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Wordmark size={200} />
  </AbsoluteFill>
);

/** YouTube-Kanalbanner 2560x1440. Text nur im fuer alle Geraete sicheren Bereich 1546x423 (Mitte). */
export const ChannelBanner: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg}}>
    <Dots step={64} r={4} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 1546, height: 423, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.bg}}>
        <Wordmark size={190} />
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: COLORS.text, marginTop: 34, letterSpacing: -0.5}}>
          Physik, Informatik und Mathe <span style={{color: COLORS.accent}}>kurz und anschaulich erklärt</span>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
