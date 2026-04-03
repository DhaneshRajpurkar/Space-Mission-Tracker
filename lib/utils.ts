/** Format miles with commas, e.g. 123,456 mi */
export function formatMiles(miles: number): string {
  return `${Math.round(miles).toLocaleString()} mi`;
}

/** Format mph with commas */
export function formatMph(mph: number): string {
  return `${Math.round(mph).toLocaleString()} mph`;
}

/** Format elapsed time as Xd Xh Xm */
export function formatElapsed(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** Format countdown as Xd Xh Xm */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Complete';
  return formatElapsed(seconds);
}

/** Pad number to 2 digits */
function pad(n: number) { return String(n).padStart(2, '0'); }

/** UTC time string HH:MM:SS */
export function formatUTC(date: Date): string {
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}

/** UTC date string */
export function formatUTCDate(date: Date): string {
  return date.toUTCString().replace(' GMT', ' UTC');
}

/** Linear interpolate */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Clamp */
export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
