import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React, {useLayoutEffect, useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {RoleText} from '../shared/typography';

// Archetyp 3d-isometric-diorama: eine Spielfigur im Fokus, dann exponentieller Zoom-out
// auf ein Raster aus vielen Figuren (Referenz: kUuwvJfQfIk 00:44-01:00).

const GRID = 31; // 31 x 31 = 961 Figuren, Mitte = Index 480
const SPACING = 1.6;

const pawnGeometry = (): THREE.LatheGeometry => {
  const profile = [
    [0, 0], [0.42, 0], [0.42, 0.1], [0.3, 0.16], [0.2, 0.5], [0.16, 0.78],
    [0.26, 0.82], [0.14, 0.9], [0.24, 1.05], [0.25, 1.15], [0.2, 1.28], [0.1, 1.35], [0, 1.37],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(profile, 32);
};

const Pawns: React.FC<{reveal: number}> = ({reveal}) => {
  const geometry = useMemo(pawnGeometry, []);
  const center = Math.floor(GRID / 2);
  const cells = useMemo(
    () => Array.from({length: GRID * GRID}, (_, idx) => ({i: Math.floor(idx / GRID) - center, j: (idx % GRID) - center})),
    [center],
  );
  return (
    <>
      {cells.map(({i, j}) => {
        // Welle von der Mitte nach aussen: Figuren wachsen aus dem Boden, sobald die Kamera zurueckfaehrt.
        const dist = Math.hypot(i, j);
        const grow = i === 0 && j === 0 ? 1 : Math.min(1, Math.max(0, reveal * (center * 1.5 + 2) - dist));
        if (grow <= 0) return null;
        return (
        <mesh key={`${i}:${j}`} geometry={geometry} position={[i * SPACING, 0, j * SPACING]} scale={[1, grow, 1]}>
          <meshToonMaterial color={i === 0 && j === 0 ? '#e38450' : '#efe6cf'} />
        </mesh>
        );
      })}
    </>
  );
};

const CameraRig: React.FC<{zoom: number}> = ({zoom}) => {
  const camera = useThree((st) => st.camera);
  const invalidate = useThree((st) => st.invalidate);
  useLayoutEffect(() => {
    camera.position.set(600, 600, 600);
    camera.lookAt(0, 0.6, 0);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, zoom, invalidate]);
  return null;
};

export const MeepleIso: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames, fps} = useVideoConfig();
  const holdEnd = Math.round(fps * 1.2);
  // Exponentieller Zoom-out: von einer Figur auf das ganze Raster.
  const t = interpolate(frame, [holdEnd, durationInFrames - 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  // Orthografischer Zoom = Pixel pro Welteinheit. Start: Figur fuellt ~40 % der kurzen Seite.
  const short = Math.min(width, height);
  const zStart = (0.4 * short) / 1.4;
  const zEnd = Math.min(width, height) / (GRID * SPACING * 1.6);
  const push = interpolate(frame, [0, holdEnd], [1.12, 1], {extrapolateRight: 'clamp'});
  const zoom = zStart * Math.pow(zEnd / zStart, t) * push;
  const labelOpacity = interpolate(frame, [6, 16, holdEnd + 8, holdEnd + 20], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
  const countOpacity = interpolate(frame, [durationInFrames - 40, durationInFrames - 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#2f3133'}}>
      <ThreeCanvas width={width} height={height} flat orthographic camera={{position: [600, 600, 600], near: 0.1, far: 4000}}>
        <CameraRig zoom={zoom} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[8, 14, 4]} intensity={2.2} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[1400, 1400]} />
          <meshToonMaterial color="#45484b" />
        </mesh>
        <Pawns reveal={t} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)'}} />
      <div style={{position: 'absolute', width: '100%', textAlign: 'center', top: height * 0.2, opacity: labelOpacity}}>
        <RoleText role="editorial-didone" style={{fontSize: short * 0.075}}>Schöpfer</RoleText>
      </div>
      <div style={{position: 'absolute', width: '100%', textAlign: 'center', bottom: height * (width < height ? 0.26 : 0.06), opacity: countOpacity}}>
        <RoleText role="tall-condensed-serif" style={{fontSize: short * 0.12}}>961 Figuren</RoleText>
      </div>
    </AbsoluteFill>
  );
};
