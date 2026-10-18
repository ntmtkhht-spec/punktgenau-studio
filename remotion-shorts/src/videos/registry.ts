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
import {Video as KugelAusPunkt, DURATION as KUGEL_DURATION} from './08-kugel-aus-punkt/Video';
import {DURATION as V09ExponentiellGewinnt_DUR, Video as V09ExponentiellGewinnt} from './09-exponentiell-gewinnt/Video';
import {DURATION as V10DrehenderKopf_DUR, Video as V10DrehenderKopf} from './10-drehender-kopf/Video';
// </pg:imports>

export const VIDEOS: readonly VideoEntry[] = [
  // <pg:entries>
  {id: 'V08KugelAusPunkt', slug: '08-kugel-aus-punkt', component: KugelAusPunkt, durationSec: KUGEL_DURATION},
  {id: 'V09ExponentiellGewinnt', slug: '09-exponentiell-gewinnt', component: V09ExponentiellGewinnt, durationSec: V09ExponentiellGewinnt_DUR},
  {id: 'V10DrehenderKopf', slug: '10-drehender-kopf', component: V10DrehenderKopf, durationSec: V10DrehenderKopf_DUR},
  // </pg:entries>
];
