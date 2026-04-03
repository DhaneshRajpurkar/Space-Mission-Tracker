import { Mission } from './types';
import { artemis2 } from './artemis2';

// Mission registry — add new missions here only
export const missions: Mission[] = [artemis2];

export { artemis2 };
export type { Mission, Phase, CrewMember, TrajectoryConfig } from './types';
