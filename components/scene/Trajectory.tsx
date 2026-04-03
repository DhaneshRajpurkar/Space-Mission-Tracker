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

// Mission phase fractions — HEO ends at TLI (dayStart 0.95 / duration 9.5)
const HEO_END_PROGRESS = 0.95 / 9.5; // ~0.1

function buildHeoPoints(semiMajor: number, semiMinor: number, segments = 120): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    // Ellipse in XZ plane (flat, like an equatorial orbit viewed from above)
    pts.push(new THREE.Vector3(
      Math.cos(angle) * semiMajor,
      0,
      Math.sin(angle) * semiMinor,
    ));
  }
  return pts;
}

export default function Trajectory({ mission, progress }: TrajectoryProps) {
  const cfg = mission.trajectory;

  // ── HEO ellipse ──
  const heoPoints = useMemo(() => {
    if (!cfg.heoRadius) return null;
    return buildHeoPoints(cfg.heoRadius[0], cfg.heoRadius[1]);
  }, [cfg.heoRadius]);

  // Progress within HEO phase (0→1 while in HEO)
  const heoProgress = Math.min(1, progress / HEO_END_PROGRESS);

  // Travelled HEO arc
  const heoTrailPoints = useMemo(() => {
    if (!cfg.heoRadius || progress <= 0) return null;
    const total = buildHeoPoints(cfg.heoRadius[0], cfg.heoRadius[1], 120);
    // Arc covers heoProgress fraction of the ellipse
    const count = Math.max(2, Math.floor(total.length * Math.min(1, heoProgress)));
    return total.slice(0, count);
  }, [cfg.heoRadius, heoProgress, progress]);

  // ── Free-return trajectory ──
  const fullPoints = useMemo(() => {
    const curve = buildTrajectory(cfg);
    return curve.getPoints(300);
  }, [cfg]);

  // Travelled trail on free-return (starts after HEO ends)
  const trailPoints = useMemo(() => {
    if (progress <= HEO_END_PROGRESS) return null;
    // Remap progress from [HEO_END_PROGRESS..1] → [0..1] for the curve
    const curveProgress = (progress - HEO_END_PROGRESS) / (1 - HEO_END_PROGRESS);
    return getTrailPoints(cfg, curveProgress, 300);
  }, [cfg, progress]);

  const trailColor = mission.trailColor;

  return (
    <>
      {/* ── HEO ellipse — planned (gold, dim) ── */}
      {heoPoints && (
        <Line
          points={heoPoints}
          color="#8a6a00"
          lineWidth={1}
          transparent
          opacity={0.35}
        />
      )}

      {/* ── HEO ellipse — travelled arc (gold, bright) ── */}
      {heoTrailPoints && heoTrailPoints.length > 1 && (
        <Line
          points={heoTrailPoints}
          color="#f0c040"
          lineWidth={2}
          transparent
          opacity={0.9}
        />
      )}

      {/* ── Free-return — planned path (green, dim) ── */}
      <Line
        points={fullPoints}
        color="#1a4a3a"
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      {/* ── Free-return — travelled trail (mission color, bright) ── */}
      {trailPoints && trailPoints.length > 1 && (
        <Line
          points={trailPoints}
          color={trailColor}
          lineWidth={2}
          transparent
          opacity={0.9}
        />
      )}
    </>
  );
}
