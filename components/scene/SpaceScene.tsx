'use client';
import { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import Stars from './Stars';
import Sun from './Sun';
import Earth from './Earth';
import Moon from './Moon';
import Spacecraft from './Spacecraft';
import Trajectory from './Trajectory';
import { Mission } from '@/data/missions/types';

interface SpaceSceneProps {
  mission: Mission;
  progress: number;
  spacecraftPosition: THREE.Vector3;
}

// Lerps OrbitControls target toward focusTarget each frame
function CameraRig({
  controlsRef,
  focusTarget,
}: {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  focusTarget: THREE.Vector3 | null;
}) {
  useFrame((_, delta) => {
    const ctrl = controlsRef.current;
    if (!ctrl || !focusTarget) return;
    ctrl.target.lerp(focusTarget, Math.min(1, delta * 4));
    ctrl.update();
  });
  return null;
}

function SceneContent({
  mission,
  progress,
  spacecraftPosition,
  controlsRef,
  onFocus,
}: SpaceSceneProps & {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  onFocus: (pos: THREE.Vector3) => void;
}) {
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);

  const handleFocus = useCallback((pos: THREE.Vector3) => {
    setFocusTarget(pos.clone());
    onFocus(pos);
  }, [onFocus]);

  return (
    <>
      <CameraRig controlsRef={controlsRef} focusTarget={focusTarget} />
      <Stars />
      <Sun />
      <Earth onFocus={() => handleFocus(new THREE.Vector3(0, 0, 0))} />
      <Moon onFocus={() => handleFocus(new THREE.Vector3(270, 0, 0))} />
      <Trajectory mission={mission} progress={progress} />
      <Spacecraft
        position={spacecraftPosition}
        trailColor={mission.trailColor}
        onFocus={() => handleFocus(spacecraftPosition.clone())}
      />
    </>
  );
}

export default function SpaceScene({ mission, progress, spacecraftPosition }: SpaceSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const handleFocus = useCallback((pos: THREE.Vector3) => {
    // also zoom camera toward the focused object
    // nothing extra needed — CameraRig handles target lerp
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 40, 120], fov: 45, near: 0.1, far: 5000 }}
      style={{ background: '#000000', cursor: 'grab' }}
      gl={{ antialias: true, alpha: false }}
    >
      <Suspense fallback={null}>
        <SceneContent
          mission={mission}
          progress={progress}
          spacecraftPosition={spacecraftPosition}
          controlsRef={controlsRef}
          onFocus={handleFocus}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={4}
        maxDistance={700}
        dampingFactor={0.08}
        enableDamping
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
