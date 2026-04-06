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
    // No heoRadius — the Earth arc is baked into the waypoints below.
    //
    // Shape (top-down view):
    //   • Waypoints 0-3:  HEO arc — goes BEHIND Earth (neg-X), creating
    //                     the upper loop with Earth inside it.
    //   • Waypoints 3-10: figure-8 waist → outbound coast on +Z side.
    //   • Waypoints 10-15: Moon flyby arc — loops around Moon with Moon
    //                      inside, going from +Z to -Z.
    //   • Waypoints 15-22: return coast on -Z side → back to Earth.
    //   The outbound (+Z) and return (-Z) legs cross each other
    //   between Earth and Moon (~X=40-60), forming the figure-8 waist.
    waypoints: [
      [  5,  0,   0],  // [0]  launch / HEO start
      [ -5,  0, -14],  // [1]  arc behind Earth, -Z side
      [-12,  0,   0],  // [2]  directly behind Earth (Earth loop apex)
      [ -5,  0,  14],  // [3]  arc behind Earth, +Z side
      [ 25,  0,  22],  // [4]  sweeping out toward crossing, +Z
      [ 55,  0,  16],  // [5]  crossing zone (outbound, +Z)
      [ 90,  0,  20],  // [6]  outbound coast
      [145,  0,  18],  // [7]
      [200,  0,  12],  // [8]
      [240,  0,   7],  // [9]
      [256,  0,   4],  // [10] approaching Moon
      [264,  0,   5],  // [11] Moon approach +Z
      [270,  0,   7],  // [12] Moon flyby +Z (closest on +Z side)
      [276,  0,   1],  // [13] going around Moon front
      [271,  0,  -6],  // [14] Moon flyby -Z
      [257,  0,  -7],  // [15] leaving Moon vicinity
      [215,  0, -14],  // [16] return coast, -Z side
      [160,  0, -18],  // [17]
      [110,  0, -18],  // [18]
      [ 65,  0, -15],  // [19] crossing zone (return, -Z)
      [ 28,  0, -10],  // [20] approaching Earth
      [ 10,  0,  -4],  // [21] near Earth
      [  5,  0,   0],  // [22] splashdown
    ],
  },
};
