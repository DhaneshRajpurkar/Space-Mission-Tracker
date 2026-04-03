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
    // CatmullRom waypoints matching the NASA free-return kidney shape.
    // Moon at [270, 0, 0]. Outbound leg arcs to -Z, return leg arcs to +Z.
    // Offsets are modest — the two legs stay close (like the NASA diagram),
    // not a bloated oval. Y gives slight ecliptic inclination for 3D depth.
    waypoints: [
      [  4,   0,   0],   // Earth departure
      [ 80,   6, -42],   // outbound coast (-Z side)
      [185,   4, -52],   // mid-outbound
      [260,   1, -18],   // approaching Moon
      [272,   0,   4],   // Moon flyby (closest approach)
      [258,  -1,  20],   // post-flyby
      [185,  -4,  52],   // mid-return (+Z side)
      [ 80,  -6,  42],   // return coast
      [  4,   0,   0],   // splashdown
    ],
  },
};
