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
    heoRadius: [8, 5],
    // Free-return figure-8, post-TLI only.
    // Tangent-guide points near Earth ([20,0,±x]) prevent the loop
    // artifact at the crossing. Moon flyby is a multi-point arc so the
    // craft visibly swings around the Moon rather than just touching a
    // point. Max Z spread ±20 (was ±38) to avoid giant-oval appearance.
    waypoints: [
      [  5,  0,   0],   // TLI departure
      [ 20,  0,  -5],   // tangent guide — controls Earth-exit angle
      [ 70,  0, -16],   // outbound coast
      [150,  0, -20],   // mid-outbound (peak -Z)
      [220,  0, -13],   // converging on Moon
      [255,  0,  -7],   // Moon approach
      [266,  0,  -6],   // pre-flyby — closest pass (~5,300 mi from Moon)
      [272,  0,  -1],   // flyby apex
      [272,  0,   5],   // post-flyby, swinging to +Z
      [258,  0,  10],   // leaving Moon vicinity
      [210,  0,  17],   // return leg broadening
      [140,  0,  20],   // mid-return (peak +Z)
      [ 70,  0,  15],   // return approach
      [ 20,  0,   4],   // tangent guide — controls Earth-return angle
      [  5,  0,   0],   // splashdown
    ],
  },
};
