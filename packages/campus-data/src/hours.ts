// Shared "hours of operation" model for libraries, RecWell and dining halls.

export type TimeRange = {
  /** Minutes after local midnight. */
  start: number;
  /** Minutes after local midnight; may exceed 1440 when a range runs past midnight. */
  end: number;
};

export type DayHours =
  | { kind: "closed"; label: string }
  | { kind: "24h"; label: string }
  | { kind: "ranges"; label: string; ranges: TimeRange[] }
  /** Free text we couldn't turn into times (e.g. "By appointment only"). */
  | { kind: "text"; label: string };

const TIME = /(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?|\b(noon|midnight)\b/i;
const RANGE = new RegExp(`(${TIME.source})\\s*(?:-|–|—|to)\\s*(${TIME.source})`, "gi");

function toMinutes(token: string): number | null {
  const m = TIME.exec(token);
  if (!m) return null;
  if (m[4]) return m[4].toLowerCase() === "noon" ? 720 : 0;
  let h = Number(m[1]) % 12;
  if (m[3]!.toLowerCase() === "p") h += 12;
  return h * 60 + Number(m[2] ?? 0);
}

/** Parse a human hours label such as "6am to 9pm", "11am - 12am", "24 Hours", "Closed". */
export function parseHours(raw: string): DayHours {
  const label = raw.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (label === "" || /^closed$/i.test(label)) return { kind: "closed", label: "Closed" };
  if (/^(open\s*)?24\s*(hours|hrs)$/i.test(label)) return { kind: "24h", label: "Open 24 hours" };

  const ranges: TimeRange[] = [];
  for (const m of label.matchAll(RANGE)) {
    const start = toMinutes(m[1]!);
    const endRaw = toMinutes(m[6]!);
    if (start === null || endRaw === null) continue;
    // "11am - 12am" and "8pm - 2am" run past midnight.
    const end = endRaw <= start ? endRaw + 1440 : endRaw;
    ranges.push({ start, end });
  }
  return ranges.length > 0 ? { kind: "ranges", label, ranges } : { kind: "text", label };
}

/** Is a place open at `minutes` after midnight on this day? `null` when unknown. */
export function isOpenAt(hours: DayHours, minutes: number): boolean | null {
  switch (hours.kind) {
    case "closed":
      return false;
    case "24h":
      return true;
    case "text":
      return null;
    case "ranges":
      return hours.ranges.some((r) => minutes >= r.start && minutes < r.end);
  }
}

/** Minutes until closing if open now, else null. */
export function minutesUntilClose(hours: DayHours, minutes: number): number | null {
  if (hours.kind !== "ranges") return null;
  const r = hours.ranges.find((x) => minutes >= x.start && minutes < x.end);
  return r ? r.end - minutes : null;
}

/** "9pm", "12:30am", "noon" style formatting for minutes-after-midnight. */
export function formatMinutes(total: number): string {
  const m = ((total % 1440) + 1440) % 1440;
  if (m === 720) return "noon";
  if (m === 0) return "midnight";
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}${min ? `:${String(min).padStart(2, "0")}` : ""}${h24 < 12 ? "am" : "pm"}`;
}
