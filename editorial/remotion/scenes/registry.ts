import React from 'react';
import {MeepleIso} from './MeepleIso';
import {ThumbEinerGegen961} from './ThumbEinerGegen961';

// Alle Remotion-Szenenkomponenten. storyboard.json verweist per "component" darauf.
// Neue Szene: Datei in scenes/ anlegen und hier eintragen.
export const SCENES: Record<string, React.FC> = {
  MeepleIso,
  ThumbEinerGegen961,
};
