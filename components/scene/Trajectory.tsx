'use client';
import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Mission } from '@/data/missions/types';
import { buildTrajectory, getTrailPoints } from '@/lib/trajectory';
import * as THREE from 'three';

interface TrajectoryProps {
  mission: Mission;
  progress: number;
}

function buildHeoPoints(semiMajor: number, semiMinor: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * semiMajor, 0, Math.sin(a) * semiMinor));
  }
  return pts;
}

export default function Trajectory({ mission, progress }: TrajectoryProps) {
  const cfg = mission.trajectory;

  // HEO ellipse — purely decorative, static
  const heoPoints = useMemo(() => {
    if (!cfg.heoRadius) return null;
    return buildHeoPoints(cfg.heoRadius[0], cfg.heoRadius[1]);
  }, [cfg.heoRadius]);

  // Full planned free-return path
  const fullPoints = useMemo(() => buildTrajectory(cfg).getPoints(300), [cfg]);

  // Travelled trail — raw progress, same as spacecraft position
  const trailPoints = useMemo(() => {
    if (progress <= 0) return null;
    return getTrailPoints(cfg, progress, 300);
  }, [cfg, progress]);

  return (
    <>
      {/* HEO ellipse — static gold ring around Earth */}
      {heoPoints && (
        <Line points={heoPoints} color="#f0c040" lineWidth={1.5} transparent opacity={0.5} />
      )}

      {/* Full planned free-return path */}
      <Line points={fullPoints} color="#1a4a3a" lineWidth={1} transparent opacity={0.5} />

      {/* Travelled trail */}
      {trailPoints && trailPoints.length > 1 && (
        <Line points={trailPoints} color={mission.trailColor} lineWidth={2} transparent opacity={0.9} />
      )}
    </>
  );
}
