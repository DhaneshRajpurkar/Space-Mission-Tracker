'use client';

export default function HUD() {
  return (
    <>
      {/* Bottom-left hint */}
      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 select-none pointer-events-none">
        <span
          className="text-[11px] text-slate-500 tracking-wide"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          Drag to rotate · Scroll to zoom
        </span>
      </div>

      {/* Top-right live indicator */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2 select-none pointer-events-none"
        style={{ right: '340px' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[11px] text-slate-500 tracking-wide">LIVE</span>
      </div>
    </>
  );
}
