'use client';
import { useMissionStore } from '@/store/missionStore';
import { MissionClockData } from '@/hooks/useMissionClock';
import { SpacecraftPositionData } from '@/hooks/useSpacecraftPosition';
import { Mission } from '@/data/missions/types';
import PhaseTimeline from './PhaseTimeline';
import CrewInfo from './CrewInfo';
import { formatMiles, formatMph, formatElapsed, formatCountdown } from '@/lib/utils';

interface SidePanelProps {
  mission: Mission;
  clock: MissionClockData;
  position: SpacecraftPositionData;
}

// Consistent padding — larger left so content breathes away from panel edge
const P: React.CSSProperties = { paddingLeft: 28, paddingRight: 20 };

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4a5a72', marginBottom: 10 }}>
      {children}
    </div>
  );
}

function StatRow({ label, value, color = '#cbd5e1' }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 13, color: '#64748b', flexShrink: 0, paddingRight: 12 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

const divider: React.CSSProperties = { borderBottom: '1px solid rgba(255,255,255,0.06)' };

export default function SidePanel({ mission, clock, position }: SidePanelProps) {
  const { panelOpen, togglePanel } = useMissionStore();
  const pct = (clock.progress * 100).toFixed(0) + '%';
  const launchLabel = mission.launch.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const endDate = new Date(mission.launch.getTime() + mission.duration * 86400 * 1000);
  const endLabel = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

  return (
    <>
      {/* Tab trigger */}
      <button
        onClick={togglePanel}
        style={{
          position: 'fixed',
          right: panelOpen ? 320 : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
          width: 20,
          height: 64,
          borderRadius: '6px 0 0 6px',
          background: 'rgba(12,20,38,0.95)',
          border: '1px solid rgba(133,183,235,0.18)',
          borderRight: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'right 0.3s ease',
        }}
        aria-label={panelOpen ? 'Close panel' : 'Open panel'}
      >
        <span style={{ color: '#85b7eb', fontSize: 11, userSelect: 'none' }}>{panelOpen ? '›' : '‹'}</span>
      </button>

      {/* Panel */}
      <aside
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          width: 320,
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
          transform: panelOpen ? 'translateX(0%)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          background: 'rgba(9,15,30,0.97)',
          borderLeft: '1px solid rgba(133,183,235,0.12)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ ...P, paddingTop: 20, paddingBottom: 16, flexShrink: 0, ...divider }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', flexShrink: 0, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5daa80' }}>
              {mission.name} · Live
            </span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{mission.craft}</div>
          <div suppressHydrationWarning style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
            {clock.now.toUTCString().replace(' GMT', ' UTC')}
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="scrollbar-thin">

          {/* MISSION PROGRESS */}
          <div style={{ ...P, paddingTop: 16, paddingBottom: 16, ...divider }}>
            <SectionLabel>Mission Progress</SectionLabel>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', marginBottom: 8 }}>
              <span>{launchLabel}</span>
              <span suppressHydrationWarning style={{ fontWeight: 600, color: '#85b7eb' }}>{pct}</span>
              <span>{endLabel}</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, overflow: 'hidden', background: 'rgba(133,183,235,0.1)' }}>
              <div
                suppressHydrationWarning
                style={{
                  height: '100%',
                  borderRadius: 4,
                  width: `${clock.progress * 100}%`,
                  background: 'linear-gradient(90deg, #3a7bd5, #5dcaa5)',
                  transition: 'width 1s linear',
                }}
              />
            </div>
          </div>

          {/* CURRENT PHASE */}
          <div style={{ ...P, paddingTop: 16, paddingBottom: 16, ...divider }}>
            <SectionLabel>Current Phase</SectionLabel>
            <div style={{ borderRadius: 12, padding: '12px 16px', background: 'rgba(133,183,235,0.07)', border: '1px solid rgba(133,183,235,0.14)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{clock.currentPhase.name}</div>
              {clock.currentPhase.description && (
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{clock.currentPhase.description}</div>
              )}
            </div>
          </div>

          {/* LOCATION */}
          <div style={{ ...P, paddingTop: 16, paddingBottom: 8, ...divider }}>
            <SectionLabel>Location</SectionLabel>
            <StatRow label="From Earth"      value={formatMiles(position.distanceFromEarth)} color="#5dcaa5" />
            <StatRow label="From Moon"       value={formatMiles(position.distanceFromMoon)} />
            <StatRow label="Speed"           value={formatMph(position.speedMph)} color="#5dcaa5" />
            <StatRow label="Record distance" value={formatMiles(mission.maxDist)} color="#e07030" />
          </div>

          {/* TIME */}
          <div style={{ ...P, paddingTop: 16, paddingBottom: 8, ...divider }}>
            <SectionLabel>Time</SectionLabel>
            <StatRow label="Elapsed"          value={formatElapsed(clock.elapsedSeconds)} />
            <StatRow label="Mission day"      value={`Day ${clock.missionDay} of ${Math.ceil(mission.duration)}`} />
            <StatRow label="Until splashdown" value={formatCountdown(clock.remainingSeconds)} color="#e0a030" />
          </div>

          {/* TIMELINE */}
          <div style={{ ...P, paddingTop: 16, paddingBottom: 16, ...divider }}>
            <SectionLabel>Timeline</SectionLabel>
            <PhaseTimeline mission={mission} clock={clock} />
          </div>

          {/* CREW */}
          <div style={{ ...P, paddingTop: 16, paddingBottom: 28 }}>
            <SectionLabel>Crew</SectionLabel>
            <CrewInfo crew={mission.crew} />
          </div>

        </div>
      </aside>
    </>
  );
}
