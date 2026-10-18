import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../../shared';

const INK = '#111111';
const BLUE = '#1f7ae0';
const ORANGE = '#f97316';
const MAGENTA = '#d61f69';
const GOLD = '#facc15';

const Stage: React.FC<React.PropsWithChildren> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: '#fbfbf8'}}>
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{fontFamily: FONT, fontWeight: 800, letterSpacing: '-.03em'}}
    >
      <defs>
        <radialGradient id="thumb-vignette" cx="50%" cy="46%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f1ec" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1080} height={1920} fill="url(#thumb-vignette)" />
      {children}
    </svg>
  </AbsoluteFill>
);

/**
 * Konzept A (visual-equation-diagram):
 * "WER GEWINNT?" (2 Woerter, 152 px) + riesige Relation 1,1^x > x^2 mit Krone auf 1,1^x
 * und steil aufsteigendem orangem Kurvenpfeil gegen flache blaue Kurve.
 */
export const ExponentiellThumbnailA: React.FC = () => (
  <Stage>
    <text x={540} y={420} fontSize={152} textAnchor="middle" fill={INK}>
      WER
    </text>
    <text x={540} y={595} fontSize={156} textAnchor="middle" fill={INK}>
      GEWINNT?
    </text>

    {/* Goldene Krone mit starker schwarzer Outline ueber 1,1^x */}
    <polygon
      points="155,795 188,695 252,752 310,675 368,752 432,695 465,795"
      fill={GOLD}
      stroke={INK}
      strokeWidth={8}
      strokeLinejoin="round"
    />

    {/* Riesige visuelle Relation: 1,1^x > x^2 mit echten <tspan>-Exponenten */}
    <text
      x={315}
      y={985}
      fontSize={205}
      textAnchor="middle"
      fill={ORANGE}
      stroke={INK}
      strokeWidth={10}
      style={{paintOrder: 'stroke', strokeLinejoin: 'round'}}
    >
      1,1<tspan dy={-78} fontSize={132}>x</tspan>
    </text>
    <text x={595} y={975} fontSize={175} textAnchor="middle" fill={INK}>
      &gt;
    </text>
    <text
      x={825}
      y={985}
      fontSize={205}
      textAnchor="middle"
      fill={BLUE}
      stroke={INK}
      strokeWidth={10}
      style={{paintOrder: 'stroke', strokeLinejoin: 'round'}}
    >
      x<tspan dy={-78} fontSize={132}>2</tspan>
    </text>

    {/* Dramatische Kurven-Miniatur darunter (y <= 1370, frei von der Sperrzone y > 1450) */}
    <path
      d="M 160 1330 Q 520 1290 900 1265"
      fill="none"
      stroke={INK}
      strokeWidth={28}
      strokeLinecap="round"
    />
    <path
      d="M 160 1330 Q 520 1290 900 1265"
      fill="none"
      stroke={BLUE}
      strokeWidth={16}
      strokeLinecap="round"
    />
    <path
      d="M 160 1330 C 520 1330, 720 1320, 865 1065"
      fill="none"
      stroke={INK}
      strokeWidth={28}
      strokeLinecap="round"
    />
    <path
      d="M 160 1330 C 520 1330, 720 1320, 865 1065"
      fill="none"
      stroke={ORANGE}
      strokeWidth={16}
      strokeLinecap="round"
    />
    <polygon
      points="885,1020 825,1075 895,1100"
      fill={ORANGE}
      stroke={INK}
      strokeWidth={8}
      strokeLinejoin="round"
    />
  </Stage>
);

export const ExponentiellThumbnailB: React.FC = () => (
  <Stage>
    <text x={540} y={420} fontSize={148} textAnchor="middle" fill={INK}>
      ZU
    </text>
    <text x={540} y={595} fontSize={152} textAnchor="middle" fill={ORANGE} stroke={INK} strokeWidth={8} style={{paintOrder: 'stroke'}}>
      LANGSAM?
    </text>

    <g fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={250} cy={955} r={58} fill="#ffffff" />
      <ellipse cx={265} cy={972} rx={13} ry={19} strokeWidth={6} />
      <path d="M 250 1013 L 250 1195 L 185 1330 M 250 1195 L 315 1330 M 250 1065 L 155 995 M 250 1065 L 365 985" />
    </g>

    <path d="M 390 1320 Q 640 1160 920 1120" fill="none" stroke={BLUE} strokeWidth={16} strokeLinecap="round" />
    <path d="M 390 1320 C 680 1320, 790 1290, 860 730" fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
    <path d="M 390 1320 C 680 1320, 790 1290, 860 730" fill="none" stroke={ORANGE} strokeWidth={16} strokeLinecap="round" />
    <circle cx={860} cy={730} r={24} fill={ORANGE} stroke={INK} strokeWidth={8} />
  </Stage>
);

export const ExponentiellThumbnailC: React.FC = () => (
  <Stage>
    <text x={540} y={510} fontSize={180} textAnchor="middle" fill={INK}>
      TAG 96
    </text>

    <path d="M 150 1310 Q 520 1060 930 1020" fill="none" stroke={BLUE} strokeWidth={18} strokeLinecap="round" />
    <path d="M 150 1320 C 510 1320, 620 1220, 860 690" fill="none" stroke={INK} strokeWidth={28} strokeLinecap="round" />
    <path d="M 150 1320 C 510 1320, 620 1220, 860 690" fill="none" stroke={ORANGE} strokeWidth={16} strokeLinecap="round" />

    <circle cx={675} cy={1055} r={54} fill={MAGENTA} stroke={INK} strokeWidth={8} />
    <circle cx={675} cy={1055} r={20} fill="#ffffff" stroke={INK} strokeWidth={6} />
  </Stage>
);
