'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect } from 'react';
import { useMissionStore } from '@/store/missionStore';
import { useMissionClock } from '@/hooks/useMissionClock';
import { useSpacecraftPosition } from '@/hooks/useSpacecraftPosition';
import { missions } from '@/data/missions';
import MissionSelector from '@/components/ui/MissionSelector';
import HUD from '@/components/ui/HUD';
import SidePanel from '@/components/panel/SidePanel';

const SpaceScene = dynamic(() => import('@/components/scene/SpaceScene'), { ssr: false });

export default function MissionTracker({ missionId }: { missionId: string }) {
  const { activeMission, setActiveMission } = useMissionStore();
  const clock = useMissionClock(activeMission);
  const positionData = useSpacecraftPosition(activeMission, clock.progress);

  // Set active mission from URL on mount
  useEffect(() => {
    const found = missions.find((m) => m.id === missionId);
    if (found) setActiveMission(found);
  }, [missionId, setActiveMission]);

  return (
    <main className="relative w-full h-full bg-black overflow-hidden">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-5 right-5 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-200"
        style={{
          background: 'rgba(10,18,35,0.85)',
          border: '1px solid rgba(133,183,235,0.2)',
          color: '#85b7eb',
          backdropFilter: 'blur(8px)',
        }}
      >
        ← All Missions
      </Link>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <SpaceScene
          mission={activeMission}
          progress={clock.progress}
          spacecraftPosition={positionData.position}
        />
      </div>

      <MissionSelector />
      <HUD />
      <SidePanel mission={activeMission} clock={clock} position={positionData} />
    </main>
  );
}
