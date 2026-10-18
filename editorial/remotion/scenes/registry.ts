import React from 'react';
import {DeepBlueIso} from './DeepBlueIso';
import {FontSpecimen} from './FontSpecimen';
import {KasparowStage} from './KasparowStage';
import {MeepleIso} from './MeepleIso';
import {ThumbDenkenOderRechnen} from './ThumbDenkenOderRechnen';
import {ThumbEinerGegen961} from './ThumbEinerGegen961';
import {WandererStage} from './WandererStage';

// Alle Remotion-Szenenkomponenten. storyboard.json verweist per "component" darauf.
// Neue Szene: Datei in scenes/ anlegen und hier eintragen.
export const SCENES: Record<string, React.FC> = {
  FontSpecimen,
  MeepleIso,
  ThumbEinerGegen961,
  ThumbDenkenOderRechnen,
  KasparowStage,
  DeepBlueIso,
  WandererStage,
};
