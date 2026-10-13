import {zColor} from '@remotion/zod-types';
import {z} from 'zod';

/** Im Remotion Studio (rechts im Inspector) einstellbare Werte fuer das Zenon-Video. */
export const zenoSchema = z.object({
  figurFarbe: zColor(),
  tuerFarbe: zColor(),
  etappenFarbe1: zColor(),
  etappenFarbe2: zColor(),
  etappenFarbe3: zColor(),
  hookStehenbleibenSek: z.number().min(0.5).max(3.5).step(0.1),
  tuerTempo: z.number().min(0.5).max(4).step(0.1),
  uebergangSek: z.number().min(0).max(2).step(0.1),
  buesteHoeheAnfang: z.number().min(200).max(700).step(10),
  buesteHoeheZeile5: z.number().min(200).max(600).step(10),
  quadratZoomEnde: z.number().min(1).max(8).step(0.5),
  kameraZoomLauf: z.number().min(1).max(2).step(0.05),
  laufzeitSek: z.number().min(1).max(10).step(0.5),
});

export type ZenoProps = z.infer<typeof zenoSchema>;

