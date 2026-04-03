'use client';
import { useRef } from 'react';
import { DirectionalLight, Mesh } from 'three';
import { useHelper } from '@react-three/drei';

// Sun is far away along +X axis; acts as directional light source
export default function Sun() {
  const lightRef = useRef<DirectionalLight>(null!);

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[800, 200, 0]}
        intensity={2.5}
        color="#fff8e7"
        castShadow={false}
      />
      {/* Ambient fill so night side isn't pure black in scene */}
      <ambientLight intensity={0.04} color="#1a2040" />

      {/* Visual sun disk — very far, small apparent size */}
      <mesh position={[800, 200, 0]}>
        <sphereGeometry args={[18, 16, 16]} />
        <meshBasicMaterial color="#fff8c0" />
      </mesh>
    </>
  );
}
