// Small, pure helpers for the study-rooms UI (kept separate from the data
// fetching in campus.ts so they're easy to unit test).

/** A library's LibCal name, trimmed for a compact filter chip. */
export function shortLibraryName(name: string): string {
  return name
    .replace(/\s+in\s+.*$/i, "")
    .replace(/^Michelle Smith\s+/i, "")
    .replace(/\s+Library$/i, "");
}
