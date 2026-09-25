// All campus data is in UMD's timezone, regardless of where the code runs.
export const CAMPUS_TZ = "America/New_York";

/** "YYYY-MM-DD" for the given instant, in campus time. */
export function campusDate(at: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CAMPUS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
}

/** Minutes since local midnight, in campus time. */
export function campusMinutes(at: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CAMPUS_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

/** Add whole days to a "YYYY-MM-DD" string. */
export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" → "M/D/YYYY" (the format nutrition.umd.edu and RecWell use). */
export function toUsDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${Number(m)}/${Number(d)}/${y}`;
}

/** "M/D/YYYY" → "YYYY-MM-DD", or null if it isn't a date. */
export function fromUsDate(us: string): string | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(us.trim());
  if (!m) return null;
  return `${m[3]}-${m[1]!.padStart(2, "0")}-${m[2]!.padStart(2, "0")}`;
}
