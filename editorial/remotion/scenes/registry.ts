import React from 'react';
import {MeepleIso} from './MeepleIso';

// Alle Remotion-Szenenkomponenten. storyboard.json verweist per "component" darauf.
// Neue Szene: Datei in scenes/ anlegen und hier eintragen.
export const SCENES: Record<string, React.FC> = {
  MeepleIso,
};
