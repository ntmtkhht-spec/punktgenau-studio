import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import React, {useLayoutEffect, useMemo} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {COLORS, H, W} from '../knn/theme';

/**
 * Hook-Szene: Ein einfaches Klotz-Maennchen (Farbe des Kanals) laeuft von uns weg auf eine Tuer zu.
 * Die Kamera kommt von hinten ins Bild, die Tuer weicht vor ihm zurueck.
 * Flacher Look: flache Flaechen, keine Schattenwuerfe, keine Verlaeufe.
 */
const WALK_SPEED = 1.1; // Einheiten pro Sekunde
const DOOR_START = -7;

const ease = Easing.inOut(Easing.cubic);

const useDotTexture = (): THREE.CanvasTexture => useMemo(() => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = COLORS.grid;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace; // sonst wirkt der weisse Boden grau
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(120, 600);
  tex.anisotropy = 8;
  return tex;
}, []);

const Block: React.FC<{size: [number, number, number]; position: [number, number, number]; color: string}> = ({size, position, color}) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshLambertMaterial color={color} flatShading />
  </mesh>
);

/** Arm/Bein, das um den oberen Endpunkt schwingt. */
const Limb: React.FC<{size: [number, number, number]; pivot: [number, number, number]; swing: number; color: string}> = ({size, pivot, swing, color}) => (
  <group position={pivot} rotation={[swing, 0, 0]}>
    <Block size={size} position={[0, -size[1] / 2, 0]} color={color} />
  </group>
);

const Figure: React.FC<{z: number; phase: number; amp: number; color: string}> = ({z, phase, amp, color}) => {
  const c = color;
  const legSwing = Math.sin(phase) * 0.55 * amp;
  const armSwing = Math.sin(phase) * 0.45 * amp;
  const bob = Math.abs(Math.cos(phase)) * 0.05 * amp;
  return (
    <group position={[0, bob, z]}>
      <Limb size={[0.3, 0.8, 0.3]} pivot={[-0.17, 0.8, 0]} swing={legSwing} color={c} />
      <Limb size={[0.3, 0.8, 0.3]} pivot={[0.17, 0.8, 0]} swing={-legSwing} color={c} />
      <Block size={[0.72, 0.9, 0.42]} position={[0, 1.25, 0]} color={c} />
      <Block size={[0.52, 0.52, 0.52]} position={[0, 1.98, 0]} color={c} />
      <Limb size={[0.22, 0.8, 0.22]} pivot={[-0.49, 1.65, 0]} swing={-armSwing} color={c} />
      <Limb size={[0.22, 0.8, 0.22]} pivot={[0.49, 1.65, 0]} swing={armSwing} color={c} />
    </group>
  );
};

const Door: React.FC<{z: number; color: string}> = ({z, color}) => (
  <group position={[0, 0, z]}>
    <Block size={[0.16, 2.6, 0.2]} position={[-0.75, 1.3, 0]} color={COLORS.text} />
    <Block size={[0.16, 2.6, 0.2]} position={[0.75, 1.3, 0]} color={COLORS.text} />
    <Block size={[1.66, 0.16, 0.2]} position={[0, 2.6, 0]} color={COLORS.text} />
    <Block size={[1.34, 2.5, 0.06]} position={[0, 1.25, -0.04]} color={color} />
  </group>
);

const STOP_LEN = 0.8;

/**
 * Kamera relativ zum Maennchen: Start dicht hinter ihm (er ragt ins Bild), Rueckfahrt,
 * dann ueber die Schulter nach vorn, bis nur noch die Tuer zu sehen ist.
 */
const Rig: React.FC<{t: number; end: number; stop: number; walkerZ: number; doorZ: number}> = ({t, end, stop, walkerZ, doorZ}) => {
  const {camera} = useThree();
  const times = [0, Math.min(1.8, stop - 0.2), stop + 0.3, stop + 1.6, Math.max(end, stop + 1.7)];
  const opts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease} as const;
  const offX = interpolate(t, times, [0.8, 0.3, 0.3, 0.75, 0.15], opts);
  const offY = interpolate(t, times, [2.3, 3.6, 3.6, 2.4, 2.0], opts);
  const offZ = interpolate(t, times, [1.7, 8.5, 8.5, 1.1, -0.7], opts); // zuletzt vor ihm -> nur noch die Tuer
  const lookY = interpolate(t, times, [1.6, -1.6, -1.6, 1.4, 1.3], opts); // tiefer Blickpunkt -> Figur ueber den Captions
  useLayoutEffect(() => {
    camera.position.set(offX, offY, walkerZ + offZ);
    camera.lookAt(0, lookY, Math.min(walkerZ - 3, (walkerZ + doorZ) / 2));
    camera.updateProjectionMatrix();
  });
  return null;
};

interface Hook3DProps {
  readonly end: number;
  readonly stop: number; // hier bleibt er stehen (Sekunden)
  readonly doorSpeed: number; // Tuer weicht schneller zurueck, als er geht
  readonly figureColor: string;
  readonly doorColor: string;
  readonly atTime?: number; // fester Zeitpunkt (z. B. 0 fuer den Loop am Videoende)
}

export const Hook3D: React.FC<Hook3DProps> = ({end, stop, doorSpeed, figureColor, doorColor, atTime}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = atTime ?? frame / fps;
  const tex = useDotTexture();
  // Gehen, dann sanft abbremsen und stehen bleiben
  const brake = Math.min(1, Math.max(0, (t - stop) / STOP_LEN));
  const walked = Math.min(t, stop) + STOP_LEN * 0.5 * (1 - (1 - brake) ** 2);
  const walkerZ = -WALK_SPEED * walked;
  const amp = 1 - brake;
  // Tuer weicht zurueck, nach dem Stehenbleiben immer schneller
  const sinceStop = Math.max(0, t - stop);
  const doorZ = DOOR_START - doorSpeed * t - 3 * (2 ** (sinceStop * 1.3) - 1);

  return (
    // flat: kein Tone-Mapping, damit Weiss weiss bleibt und die Farben dem 2D-Teil entsprechen
    <ThreeCanvas flat width={W} height={H} camera={{fov: 42, position: [0.8, 2.3, 1.7]}} style={{position: 'absolute', left: 0, top: 0}}>
      <color attach="background" args={[COLORS.bg]} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -280]}>
        <planeGeometry args={[120, 600]} />
        <meshBasicMaterial map={tex} />
      </mesh>
      <Figure z={walkerZ} phase={walked * Math.PI * 2 * 1.4 / WALK_SPEED} amp={amp} color={figureColor} />
      <Door z={doorZ} color={doorColor} />
      <Rig t={t} end={end} stop={stop} walkerZ={walkerZ} doorZ={doorZ} />
    </ThreeCanvas>
  );
};
