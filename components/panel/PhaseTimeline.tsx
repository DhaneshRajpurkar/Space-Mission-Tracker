'use client';
import { Mission } from '@/data/missions/types';
import { MissionClockData } from '@/hooks/useMissionClock';

interface PhaseTimelineProps {
  mission: Mission;
  clock: MissionClockData;
}

function phaseDate(launch: Date, dayStart: number, nextDayStart?: number): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

  const start = new Date(launch.getTime() + dayStart * 86400 * 1000);
  if (nextDayStart !== undefined) {
    const end = new Date(launch.getTime() + nextDayStart * 86400 * 1000);
    const s = fmt(start);
    const e = fmt(end);
    if (s === e) return s;
    // Abbreviate: "Apr 1–2" if same month
    const sMonth = start.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    const eMonth = end.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    const sDay = start.getUTCDate();
    const eDay = end.getUTCDate();
    if (sMonth === eMonth) return `${sMonth} ${sDay}–${eDay}`;
    return `${s} – ${e}`;
  }
  return fmt(start);
}

export default function PhaseTimeline({ mission, clock }: PhaseTimelineProps) {
  const { elapsedDays, currentPhase } = clock;
  const phases = mission.phases;

  return (
    <div className="space-y-2.5">
      {phases.map((phase, i) => {
        const nextPhase = phases[i + 1];
        const isActive = phase.name === currentPhase.name;
        const isPast = nextPhase ? elapsedDays > nextPhase.dayStart : clock.isComplete;
        const dateLabel = phaseDate(mission.launch, phase.dayStart, nextPhase?.dayStart);

        return (
          <div key={phase.name} className="flex items-start gap-3">
            {/* Dot */}
            <div className="mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: isActive ? '#85b7eb' : isPast ? '#5dcaa5' : '#2a3a52',
                boxShadow: isActive ? '0 0 5px #85b7eb' : 'none',
              }}
            />
            {/* Label */}
            <div className="flex-1 min-w-0">
              <span className="text-[12px]" style={{ color: '#556677' }}>
                {dateLabel}
              </span>
              <span className="text-[12px] mx-1.5" style={{ color: '#2e3e52' }}>—</span>
              <span
                className="text-[12px]"
                style={{
                  color: isActive ? '#c8dff5' : isPast ? '#5dcaa5' : '#3a4e65',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {phase.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
