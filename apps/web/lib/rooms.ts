// Small, pure helpers for the study-rooms UI (kept separate from the data
// fetching in campus.ts so they're easy to unit test).

/** A library's LibCal name, trimmed for a compact filter chip. */
export function shortLibraryName(name: string): string {
  return name
    .replace(/\s+in\s+.*$/i, "")
    .replace(/^Michelle Smith\s+/i, "")
    .replace(/\s+Library$/i, "");
}

/**
 * Whether a room fits a group of `size`. A solo student (size 1) fits any
 * room -- every room seats at least one person, and LibCal's data has no
 * per-room minimum occupancy to rule one out. Larger sizes need a known
 * capacity at least that big; a room with unknown capacity doesn't qualify.
 */
export function roomFitsSize(capacity: number | null, size: number): boolean {
  if (size <= 1) return true;
  return capacity !== null && capacity >= size;
}
