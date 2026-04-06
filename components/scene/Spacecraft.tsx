'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import { Vector3, Group } from 'three';

interface SpacecraftProps {
  position: Vector3;
  trailColor?: string;
  onFocus?: () => void;
}

useGLTF.preload('/models/Orion Capsule (no fbc).glb');

export default function Spacecraft({ position, trailColor = '#85b7eb', onFocus }: SpacecraftProps) {
  const groupRef = useRef<Group>(null!);
  const { scene } = useGLTF('/models/Orion Capsule (no fbc).glb');

  // Clone once — avoids per-render geometry duplication
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={position} onClick={onFocus}>
      {/* Orion capsule model */}
      <group scale={0.05}>
        <Center>
          <primitive object={clonedScene} />
        </Center>
      </group>
    </group>
  );
}
