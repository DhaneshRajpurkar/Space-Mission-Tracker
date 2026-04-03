export interface CrewMember {
  name: string;
  role: string;
  agency?: string;
  bio?: string;
}

export interface Phase {
  name: string;
  dayStart: number;    // days since launch
  description?: string;
}

export interface Mission {
  id: string;
  name: string;
  craft: string;
  launch: Date;
  duration: number; // days
  trailColor: string; // hex
  maxDist: number; // miles from Earth
  phases: Phase[];
  crew: CrewMember[];
  trajectory: TrajectoryConfig;
}

export interface TrajectoryConfig {
  // CatmullRom waypoints in scene units — must start and end near Earth.
  // Earth is at origin, Moon is at ~[270, 0, 0].
  // Scale: 270 scene units = 238,855 miles (Earth–Moon distance).
  moonDistance: number; // scene units to Moon (for mile conversion)
  waypoints: [number, number, number][]; // free-return curve waypoints
  heoRadius?: [number, number]; // [semiMajor, semiMinor] of HEO ellipse in scene units
}
