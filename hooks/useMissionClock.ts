'use client';
import { useEffect, useState } from 'react';
import { Mission, Phase } from '@/data/missions/types';

export interface MissionClockData {
  now: Date;
  elapsedSeconds: number;
  elapsedDays: number;
  progress: number;         // 0..1 over full duration
  missionDay: number;       // integer mission day
  remainingSeconds: number; // seconds until splashdown
  currentPhase: Phase;
  nextPhase: Phase | null;
  phaseProgress: number;    // 0..1 within current phase
  isComplete: boolean;
}

export function useMissionClock(mission: Mission): MissionClockData {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const launchMs = mission.launch.getTime();
  const durationMs = mission.duration * 86400 * 1000;
  const elapsedMs = Math.max(0, now.getTime() - launchMs);
  const elapsedSeconds = elapsedMs / 1000;
  const elapsedDays = elapsedMs / (86400 * 1000);
  const progress = Math.min(1, elapsedMs / durationMs);
  const missionDay = Math.floor(elapsedDays) + 1;
  const remainingSeconds = Math.max(0, (durationMs - elapsedMs) / 1000);
  const isComplete = progress >= 1;

  // Find current phase
  let currentPhase = mission.phases[0];
  let nextPhase: Phase | null = null;
  for (let i = 0; i < mission.phases.length; i++) {
    if (elapsedDays >= mission.phases[i].dayStart) {
      currentPhase = mission.phases[i];
      nextPhase = mission.phases[i + 1] ?? null;
    }
  }

  // Phase progress
  let phaseProgress = 0;
  if (nextPhase) {
    const phaseLen = nextPhase.dayStart - currentPhase.dayStart;
    phaseProgress = Math.min(1, (elapsedDays - currentPhase.dayStart) / phaseLen);
  } else {
    phaseProgress = 1;
  }

  return {
    now,
    elapsedSeconds,
    elapsedDays,
    progress,
    missionDay,
    remainingSeconds,
    currentPhase,
    nextPhase,
    phaseProgress,
    isComplete,
  };
}
