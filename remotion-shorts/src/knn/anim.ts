import {Easing, interpolate} from 'remotion';
import {FPS} from './theme';

/** Stueckweise Interpolation ueber Sekunden-Keyframes, easing pro Segment. */
export const kf = (
  frame: number,
  times: readonly number[],
  values: readonly number[],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
): number =>
  interpolate(
    frame,
    times.map((t) => t * FPS),
    [...values],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing},
  );

/** 0 -> 1 zwischen zwei Zeitpunkten (Sekunden). */
export const ramp = (frame: number, from: number, to: number): number =>
  kf(frame, [from, to], [0, 1], Easing.out(Easing.cubic));
