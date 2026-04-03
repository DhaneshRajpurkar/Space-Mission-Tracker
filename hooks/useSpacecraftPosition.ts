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

export function useSpacecraftPosition(
  mission: Mission,
  progress: number
): SpacecraftPositionData {
  return useMemo(() => {
    const curve = buildTrajectory(mission.trajectory);
    const position = curve.getPoint(Math.max(0, Math.min(1, progress)));

    const distFromEarthUnits = position.length();
    const distFromMoonUnits = position.distanceTo(MOON_POSITION);

    const distanceFromEarth = sceneUnitToMiles(mission.trajectory, distFromEarthUnits);
    const distanceFromMoon = sceneUnitToMiles(mission.trajectory, distFromMoonUnits);

    // Approximate speed: sample nearby positions
    const dt = 0.001;
    const p1 = curve.getPoint(Math.max(0, progress - dt));
    const p2 = curve.getPoint(Math.min(1, progress + dt));
    const dUnits = p1.distanceTo(p2);
    const dMiles = sceneUnitToMiles(mission.trajectory, dUnits);
    const dTime = mission.duration * 2 * dt * 86400; // seconds
    const speedMph = dTime > 0 ? (dMiles / dTime) * 3600 : 0;

    return { position, distanceFromEarth, distanceFromMoon, speedMph };
  }, [mission, progress]);
}
