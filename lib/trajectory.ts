import * as THREE from 'three';
import { TrajectoryConfig } from '@/data/missions/types';

/**
 * CatmullRom free-return trajectory.
 * Waypoints must start and end at Earth. The curve passes smoothly
 * through all waypoints including the Moon flyby point.
 * t=0 → Earth departure, t≈0.5 → Moon flyby, t=1 → Earth return.
 */
export function buildTrajectory(cfg: TrajectoryConfig): THREE.CatmullRomCurve3 {
  const points = cfg.waypoints.map(([x, y, z]) => new THREE.Vector3(x, y, z));
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
}

/**
 * Returns spacecraft position at mission progress [0..1].
 */
export function getSpacecraftPosition(
  cfg: TrajectoryConfig,
  progress: number,
  out: THREE.Vector3 = new THREE.Vector3()
): THREE.Vector3 {
  const curve = buildTrajectory(cfg);
  curve.getPoint(Math.max(0, Math.min(1, progress)), out);
  return out;
}

/**
 * Distance from Earth center (scene units → miles).
 * Scale: moonDistance scene units = 238,855 miles.
 */
export function sceneUnitToMiles(cfg: TrajectoryConfig, units: number): number {
  const scale = 238855 / cfg.moonDistance;
  return units * scale;
}

/**
 * Returns trail positions from t=0 to t=progress.
 */
export function getTrailPoints(
  cfg: TrajectoryConfig,
  progress: number,
  segments = 120
): THREE.Vector3[] {
  const curve = buildTrajectory(cfg);
  const points: THREE.Vector3[] = [];
  const steps = Math.max(2, Math.floor(segments * progress));
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * progress;
    points.push(curve.getPoint(t));
  }
  return points;
}
