import React from 'react';
import {COLORS, H, W} from '../knn/theme';

const DOT_STEP = 45;

/** Gleichmaessiges Punktraster ueber die ganze Leinwand (SVG-Pattern, kein Verlauf). */
export const DotBackground: React.FC = () => (
  <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <pattern id="bg-dots" width={DOT_STEP} height={DOT_STEP} patternUnits="userSpaceOnUse">
        <circle cx={DOT_STEP / 2} cy={DOT_STEP / 2} r={2.5} fill={COLORS.grid} />
      </pattern>
    </defs>
    <rect width={W} height={H} fill="url(#bg-dots)" />
  </svg>
);
