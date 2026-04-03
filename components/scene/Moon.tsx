'use client';
import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh } from 'three';

interface MoonProps {
  onFocus?: () => void;
}

export default function Moon({ onFocus }: MoonProps) {
  const meshRef = useRef<Mesh>(null!);
  const moonMap = useLoader(TextureLoader, '/textures/moon.jpg');

  useFrame(() => {
    // Slow Moon rotation
    meshRef.current.rotation.y += 0.0001;
  });

  return (
    // Moon at 270 units along X axis (roughly to scale relative to Earth's 3-unit radius)
    <mesh ref={meshRef} position={[270, 0, 0]} onClick={onFocus}>
      <sphereGeometry args={[0.82, 48, 48]} />
      <meshStandardMaterial
        map={moonMap}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
