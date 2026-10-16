import React from 'react';
import {Sequence} from 'remotion';

/**
 * Ein Abschnitt eines Longform-Videos als eigener Clip im Remotion Studio:
 * zeigt das ganze Video, nur um `from` Bilder nach vorne verschoben.
 * So bleibt der Szenen-Code an einer Stelle, und jede Szene ist einzeln abspiel- und einstellbar.
 */
export const sectionClip = <P extends Record<string, unknown>>(Comp: React.FC<P>, from: number): React.FC<P> => {
  const Clip: React.FC<P> = (props) => (
    <Sequence from={-from} layout="none">
      <Comp {...props} />
    </Sequence>
  );
  Clip.displayName = `SectionClip(${from})`;
  return Clip;
};
