'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
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

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef} position={position} scale={0.012} onClick={onFocus}>
      <primitive object={scene.clone()} />
      <pointLight color={trailColor} intensity={1.2} distance={30} />
    </group>
  );
}
