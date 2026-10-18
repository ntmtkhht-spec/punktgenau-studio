import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React, {useLayoutEffect, useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {RoleText} from '../shared/typography';

const GRID = 25; // 25 x 25 = 625 Figuren
const SPACING = 1.7;

const pawnGeometry = (): THREE.LatheGeometry => {
  const profile = [
    [0, 0], [0.45, 0], [0.45, 0.12], [0.32, 0.18], [0.22, 0.52], [0.18, 0.8],
    [0.28, 0.85], [0.16, 0.94], [0.26, 1.1], [0.26, 1.2], [0.22, 1.32], [0.12, 1.4], [0, 1.42],
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
        const dist = Math.hypot(i, j);
        const grow = i === 0 && j === 0 ? 1 : Math.min(1, Math.max(0, reveal * (center * 1.4 + 2) - dist));
        if (grow <= 0) return null;
        return (
          <mesh key={`${i}:${j}`} geometry={geometry} position={[i * SPACING, 0, j * SPACING]} scale={[1, grow, 1]}>
            <meshToonMaterial color={i === 0 && j === 0 ? '#e38450' : '#ece4d0'} />
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
    camera.lookAt(0, 0.7, 0);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, zoom, invalidate]);
  return null;
};

export const DeepBlueIso: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames, fps} = useVideoConfig();
  const holdEnd = Math.round(fps * 1.1);

  const t = interpolate(frame, [holdEnd, durationInFrames - 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const short = Math.min(width, height);
  const zStart = (0.42 * short) / 1.4;
  const zEnd = Math.min(width, height) / (GRID * SPACING * 1.55);
  const push = interpolate(frame, [0, holdEnd], [1.1, 1], {extrapolateRight: 'clamp'});
  const zoom = zStart * Math.pow(zEnd / zStart, t) * push;

  const labelOpacity = interpolate(frame, [4, 14, holdEnd + 6, holdEnd + 16], [0, 1, 1, 0], {extrapolateRight: 'clamp'});
  const bruteOpacity = interpolate(frame, [durationInFrames - 45, durationInFrames - 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#2b2d30'}}>
      <ThreeCanvas width={width} height={height} flat orthographic camera={{position: [600, 600, 600], near: 0.1, far: 4000}}>
        <CameraRig zoom={zoom} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[8, 14, 5]} intensity={2.3} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[1400, 1400]} />
          <meshToonMaterial color="#3e4144" />
        </mesh>
        <Pawns reveal={t} />
      </ThreeCanvas>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)'}} />
      <div style={{position: 'absolute', width: '100%', textAlign: 'center', top: height * 0.18, opacity: labelOpacity}}>
        <RoleText role="editorial-didone" style={{fontSize: short * 0.075}}>Intuition</RoleText>
      </div>
      <div style={{position: 'absolute', width: '100%', textAlign: 'center', bottom: height * (width < height ? 0.24 : 0.08), opacity: bruteOpacity}}>
        <RoleText role="tall-condensed-serif" style={{fontSize: short * 0.125}}>BRUTE FORCE</RoleText>
      </div>
    </AbsoluteFill>
  );
};
