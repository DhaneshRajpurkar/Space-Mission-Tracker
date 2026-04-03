'use client';
import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Mission } from '@/data/missions/types';
import { buildTrajectory, getTrailPoints } from '@/lib/trajectory';
import * as THREE from 'three';

interface TrajectoryProps {
  mission: Mission;
  progress: number; // 0..1
}

export default function Trajectory({ mission, progress }: TrajectoryProps) {
  const cfg = mission.trajectory;

  // Full planned path (dim)
  const fullPoints = useMemo(() => {
    const curve = buildTrajectory(cfg);
    return curve.getPoints(200);
  }, [cfg]);

  // Travelled trail (bright)
  const trailPoints = useMemo(() => {
    if (progress <= 0) return null;
    return getTrailPoints(cfg, progress, 200);
  }, [cfg, progress]);

  const trailColor = mission.trailColor;

  return (
    <>
      {/* Planned trajectory — dim */}
      <Line
        points={fullPoints}
        color="#334455"
        lineWidth={1}
        dashed={false}
        transparent
        opacity={0.4}
      />

      {/* Travelled trail — bright */}
      {trailPoints && trailPoints.length > 1 && (
        <Line
          points={trailPoints}
          color={trailColor}
          lineWidth={2}
          transparent
          opacity={0.85}
        />
      )}
    </>
  );
}
