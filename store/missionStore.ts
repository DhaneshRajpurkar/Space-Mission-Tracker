import { create } from 'zustand';
import { Mission } from '@/data/missions/types';
import { missions } from '@/data/missions';

interface MissionStore {
  activeMission: Mission;
  panelOpen: boolean;
  setActiveMission: (mission: Mission) => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
}

export const useMissionStore = create<MissionStore>((set) => ({
  activeMission: missions[0],
  panelOpen: true,
  setActiveMission: (mission) => set({ activeMission: mission }),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
  setPanelOpen: (open) => set({ panelOpen: open }),
}));
