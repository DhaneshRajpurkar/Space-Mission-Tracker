'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { Mission } from '@/data/missions/types';
import { buildTrajectory, sceneUnitToMiles } from '@/lib/trajectory';

export interface SpacecraftPositionData {
  position: THREE.Vector3;
  distanceFromEarth: number; // miles
  distanceFromMoon: number;  // miles
  speedMph: number;
}

const MOON_POSITION = new THREE.Vector3(270, 0, 0);
const HEO_END_PROGRESS = 0.95 / 9.5; // matches Trajectory.tsx

function getHeoPosition(mission: Mission, progress: number): THREE.Vector3 {
  const [a, b] = mission.trajectory.heoRadius ?? [18, 10];
  const angle = (progress / HEO_END_PROGRESS) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(angle) * a, 0, Math.sin(angle) * b);
}

export function useSpacecraftPosition(
  mission: Mission,
  progress: number
): SpacecraftPositionData {
  return useMemo(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const isHeo = clampedProgress < HEO_END_PROGRESS;

    let position: THREE.Vector3;
    let speedMph = 0;

    if (isHeo) {
      // On HEO ellipse
      position = getHeoPosition(mission, clampedProgress);
      const prev = getHeoPosition(mission, Math.max(0, clampedProgress - 0.001));
      const next = getHeoPosition(mission, Math.min(HEO_END_PROGRESS, clampedProgress + 0.001));
      const dUnits = prev.distanceTo(next);
      const dMiles = sceneUnitToMiles(mission.trajectory, dUnits);
      const dTime = mission.duration * 0.002 * 86400;
      speedMph = dTime > 0 ? (dMiles / dTime) * 3600 : 0;
    } else {
      // Remap to free-return curve — same as Trajectory.tsx trail
      const curveProgress = (clampedProgress - HEO_END_PROGRESS) / (1 - HEO_END_PROGRESS);
      const curve = buildTrajectory(mission.trajectory);
      position = curve.getPoint(curveProgress);

      const dt = 0.001;
      const p1 = curve.getPoint(Math.max(0, curveProgress - dt));
      const p2 = curve.getPoint(Math.min(1, curveProgress + dt));
      const dUnits = p1.distanceTo(p2);
      const dMiles = sceneUnitToMiles(mission.trajectory, dUnits);
      const dTime = mission.duration * (1 - HEO_END_PROGRESS) * 2 * dt * 86400;
      speedMph = dTime > 0 ? (dMiles / dTime) * 3600 : 0;
    }

    const distFromEarthUnits = position.length();
    const distFromMoonUnits = position.distanceTo(MOON_POSITION);
    const distanceFromEarth = sceneUnitToMiles(mission.trajectory, distFromEarthUnits);
    const distanceFromMoon = sceneUnitToMiles(mission.trajectory, distFromMoonUnits);

    return { position, distanceFromEarth, distanceFromMoon, speedMph };
  }, [mission, progress]);
}
