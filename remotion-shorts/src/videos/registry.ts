import type React from 'react';

/**
 * Alle Videos, die mit `npm run pg -- new <slug> "<Titel>"` angelegt wurden.
 * Diese Datei wird vom Werkzeug automatisch erweitert (Marker nicht entfernen).
 */
export interface VideoEntry {
  readonly id: string; // Kompositions-ID im Studio, z. B. "V04MontyHall"
  readonly slug: string; // Ordnername, z. B. "04-monty-hall"
  readonly component: React.FC;
  readonly durationSec: number;
  readonly width?: number; // Longform: 1920
  readonly height?: number; // Longform: 1080
  /** Longform: Bildbereiche [von, bis] je Abschnitt – jeder wird im Studio ein eigener Clip "<id>-Szene01" … */
  readonly sections?: readonly (readonly [number, number])[];
  /** Longform mit eigenen Szenen-Clips (Regler je Szene): ersetzt die automatischen Clips. */
  readonly scenes?: React.FC;
}

// <pg:imports>
// </pg:imports>

export const VIDEOS: readonly VideoEntry[] = [
  // <pg:entries>
  // </pg:entries>
];
