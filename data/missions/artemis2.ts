import { Mission } from './types';

export const artemis2: Mission = {
  id: 'artemis-ii',
  name: 'Artemis II',
  craft: 'Orion / SLS',
  launch: new Date('2026-04-01T22:35:00Z'),
  duration: 9.5,
  trailColor: '#85b7eb',
  maxDist: 252000,
  phases: [
    { name: 'Launch & ascent',   dayStart: 0,    description: 'SLS launch from LC-39B, Kennedy Space Center.' },
    { name: 'High Earth orbit',  dayStart: 0.04, description: 'Orion checkout in a high elliptical orbit.' },
    { name: 'Trans-lunar injection', dayStart: 0.95, description: 'Upper stage burn sends crew toward the Moon.' },
    { name: 'Outbound coast',    dayStart: 1.1,  description: '4-day coast. Deep-space systems tests.' },
    { name: 'Lunar SOI',         dayStart: 4.6,  description: 'Entering the Moon\'s sphere of influence.' },
    { name: 'Lunar flyby',       dayStart: 5.0,  description: 'Free-return flyby at ~7,400 km altitude.' },
    { name: 'Return coast',      dayStart: 5.2,  description: '3-day coast back to Earth.' },
    { name: 'Splashdown',        dayStart: 8.7,  description: 'Pacific Ocean reentry and recovery.' },
  ],
  crew: [
    { name: 'Reid Wiseman',   role: 'Commander',          agency: 'NASA' },
    { name: 'Victor Glover',  role: 'Pilot',              agency: 'NASA' },
    { name: 'Christina Koch', role: 'Mission Specialist', agency: 'NASA' },
    { name: 'Jeremy Hansen',  role: 'Mission Specialist', agency: 'CSA'  },
  ],
  trajectory: {
    moonDistance: 270,
    heoRadius: [18, 10], // HEO ellipse: semi-major 18 units, semi-minor 10 units
    // HEO ellipse rendered separately in Trajectory.tsx.
    // These waypoints are the free-return figure-8 only (post-TLI).
    // Legs are close together (narrow shape like NASA diagram).
    // Z offset ~18 units max — legs nearly parallel, spread only near Moon.
    waypoints: [
      [  5,   0,   0],   // TLI departure
      [ 60,   0, -35],   // outbound bows hard LEFT (-Z)
      [160,   0, -38],   // mid-outbound, still left
      [250,   0, -12],   // converging toward Moon
      [272,   0,   0],   // Moon flyby apex
      [250,   0,  12],   // post-flyby, crossing over
      [160,   0,  38],   // mid-return bows hard RIGHT (+Z)
      [ 60,   0,  35],   // return leg, right side
      [  5,   0,   0],   // splashdown — crosses outbound = figure-8
    ],
  },
};
