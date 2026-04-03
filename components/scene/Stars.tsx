'use client';
import { Stars as DreiStars } from '@react-three/drei';

export default function Stars() {
  return (
    <DreiStars
      radius={800}
      depth={60}
      count={8000}
      factor={4}
      saturation={0.1}
      fade
      speed={0.3}
    />
  );
}
