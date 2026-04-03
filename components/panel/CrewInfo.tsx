'use client';
import { CrewMember } from '@/data/missions/types';

interface CrewInfoProps {
  crew: CrewMember[];
}

const ROLE_COLORS: Record<string, string> = {
  'Commander':          '#85b7eb',
  'Pilot':             '#a0c8f0',
  'Mission Specialist': '#5dcaa5',
};

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

export default function CrewInfo({ crew }: CrewInfoProps) {
  return (
    <div className="space-y-2.5">
      {crew.map((member) => {
        const roleColor = ROLE_COLORS[member.role] ?? '#85b7eb';
        return (
          <div
            key={member.name}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{
                background: roleColor + '18',
                color: roleColor,
                border: `1px solid ${roleColor}35`,
              }}
            >
              {initials(member.name)}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-white leading-tight truncate">
                {member.name}
              </div>
              <div className="text-[11px] mt-0.5 truncate" style={{ color: '#556677' }}>
                {member.role}{member.agency ? ` · ${member.agency}` : ''}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
