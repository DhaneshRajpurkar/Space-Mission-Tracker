'use client';

import Link from 'next/link';
import { missions } from '@/data/missions';
import { Mission } from '@/data/missions/types';

function getMissionStatus(mission: Mission): 'live' | 'upcoming' | 'completed' {
  const now = Date.now();
  const launch = mission.launch.getTime();
  const end = launch + mission.duration * 86400 * 1000;
  if (now < launch) return 'upcoming';
  if (now > end) return 'completed';
  return 'live';
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

function StatusBadge({ status }: { status: 'live' | 'upcoming' | 'completed' }) {
  const cfg = {
    live:      { label: '● LIVE',      color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.3)'  },
    upcoming:  { label: '◌ UPCOMING',  color: '#85b7eb', bg: 'rgba(133,183,235,0.1)', border: 'rgba(133,183,235,0.3)' },
    completed: { label: '✓ COMPLETED', color: '#5dcaa5', bg: 'rgba(93,202,165,0.1)',  border: 'rgba(93,202,165,0.3)'  },
  }[status];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
      padding: '3px 8px', borderRadius: 4,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
}

function MissionCard({ mission }: { mission: Mission }) {
  const status = getMissionStatus(mission);
  const progress = status === 'live'
    ? Math.min(1, (Date.now() - mission.launch.getTime()) / (mission.duration * 86400 * 1000))
    : status === 'completed' ? 1 : 0;

  return (
    <Link href={`/mission/${mission.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="group relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(12,20,38,0.8)',
          border: `1px solid rgba(133,183,235,0.12)`,
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(133,183,235,0.35)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(133,183,235,0.1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(133,183,235,0.12)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        {/* Accent line */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${mission.trailColor}, transparent)` }} />

        <div style={{ padding: '24px 28px 28px' }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#4a5a72', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                NASA · Artemis Program
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                {mission.name}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{mission.craft}</div>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, color: '#4a5a72', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Launch</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{formatDate(mission.launch)}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#4a5a72', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Duration</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{mission.duration} days</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#4a5a72', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Crew</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{mission.crew.length} astronauts</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#4a5a72', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Max Distance</div>
              <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{mission.maxDist.toLocaleString()} mi</div>
            </div>
          </div>

          {/* Progress bar */}
          {status !== 'upcoming' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#4a5a72', marginBottom: 6 }}>
                <span>Mission progress</span>
                <span style={{ color: mission.trailColor }}>{(progress * 100).toFixed(1)}%</span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, ${mission.trailColor}, #5dcaa5)`,
                }} />
              </div>
            </div>
          )}

          {/* Crew */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {mission.crew.map((member) => (
              <div key={member.name} style={{
                fontSize: 11, color: '#64748b', fontWeight: 500,
                padding: '4px 10px', borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {member.name}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            marginTop: 24, display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: mission.trailColor,
          }}>
            View Mission →
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        padding: '32px 48px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: 32,
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#4a5a72', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>
            Real-time 3D Visualization
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
              Space Mission Tracker
            </h1>
            <span style={{ fontSize: 13, color: '#4a5a72' }}>by NASA Artemis</span>
          </div>
        </div>
      </header>

      {/* Mission list */}
      <main style={{ flex: 1, padding: '48px 48px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 11, color: '#4a5a72', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 24 }}>
          {missions.length} Mission{missions.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {missions.map((m) => (
            <MissionCard key={m.id} mission={m} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '24px 48px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: '#2a3a50' }}>All trajectory data is simulated · Times in UTC</span>
      </footer>
    </div>
  );
}
