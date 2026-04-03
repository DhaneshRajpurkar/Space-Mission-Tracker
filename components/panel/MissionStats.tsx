'use client';
import { MissionClockData } from '@/hooks/useMissionClock';
import { SpacecraftPositionData } from '@/hooks/useSpacecraftPosition';
import { formatMiles, formatMph, formatElapsed, formatCountdown, formatUTC } from '@/lib/utils';

interface MissionStatsProps {
  clock: MissionClockData;
  position: SpacecraftPositionData;
}

function StatRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-1 border-b border-white/5">
      <span className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</span>
      <span
        className="text-sm font-mono font-semibold"
        style={{ color: accent ? '#5dcaa5' : '#85b7eb' }}
      >
        {value}
      </span>
    </div>
  );
}

export default function MissionStats({ clock, position }: MissionStatsProps) {
  return (
    <div className="space-y-0.5">
      <StatRow label="UTC Time"       value={formatUTC(clock.now)} />
      <StatRow label="Mission Day"    value={`Day ${clock.missionDay}`} />
      <StatRow label="Elapsed"        value={formatElapsed(clock.elapsedSeconds)} />
      <StatRow label="To Splashdown"  value={formatCountdown(clock.remainingSeconds)} />
      <StatRow label="Dist from Earth" value={formatMiles(position.distanceFromEarth)} />
      <StatRow label="Dist from Moon"  value={formatMiles(position.distanceFromMoon)} />
      <StatRow label="Speed"           value={formatMph(position.speedMph)} accent />
    </div>
  );
}
