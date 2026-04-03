'use client';
import { missions } from '@/data/missions';
import { useMissionStore } from '@/store/missionStore';

export default function MissionSelector() {
  const { activeMission, setActiveMission } = useMissionStore();

  return (
    <div className="fixed top-6 left-6 z-50 flex flex-col gap-3">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5 px-1">Mission</div>
      {missions.map((m) => {
        const isActive = m.id === activeMission.id;
        return (
          <button
            key={m.id}
            onClick={() => setActiveMission(m)}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all duration-200 min-w-[140px]"
            style={{
              background: isActive
                ? 'rgba(133,183,235,0.18)'
                : 'rgba(10,18,35,0.8)',
              border: isActive
                ? '1px solid rgba(133,183,235,0.5)'
                : '1px solid rgba(133,183,235,0.12)',
              color: isActive ? '#85b7eb' : '#4a6080',
              boxShadow: isActive ? '0 0 12px rgba(133,183,235,0.15)' : 'none',
            }}
          >
            {m.name}
          </button>
        );
      })}
    </div>
  );
}
