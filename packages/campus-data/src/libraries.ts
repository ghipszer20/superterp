// Library hours from UMD Libraries' public LibCal hours feed
// (the same feed that powers umd.libcal.com/hours).

import { parseHours, type DayHours } from "./hours.ts";
import { fetchJson, SourceError } from "./http.ts";

const LIBCAL_INSTITUTION_ID = 1504;

type LibCalDay = {
  date: string;
  times: {
    status: "open" | "24hours" | "closed" | "text" | string;
    hours?: { from: string; to: string }[];
    text?: string;
  };
  rendered: string;
};

type LibCalLocation = {
  lid: number;
  name: string;
  category: "library" | "department" | string;
  url: string;
  weeks: Record<string, LibCalDay>[];
};

export type LibCalHoursFeed = { locations: LibCalLocation[] };

export type LibraryHours = {
  id: number;
  name: string;
  /** "library" for branches, "department" for units like Special Collections or the Makerspace. */
  kind: "library" | "department";
  url: string;
  /** Hours keyed by "YYYY-MM-DD". */
  days: Record<string, DayHours>;
};

function dayHours(day: LibCalDay): DayHours {
  const { status, hours } = day.times;
  if (status === "closed") return { kind: "closed", label: "Closed" };
  if (status === "24hours") return { kind: "24h", label: "Open 24 hours" };
  if (status === "open" && hours?.length) {
    return parseHours(hours.map((h) => `${h.from} - ${h.to}`).join(", "));
  }
  return parseHours(day.rendered);
}

export function parseLibCalHours(feed: LibCalHoursFeed): LibraryHours[] {
  if (!Array.isArray(feed.locations) || feed.locations.length === 0) {
    throw new SourceError("libcal-hours", "feed format changed: no locations");
  }
  return feed.locations.map((loc) => {
    const days: Record<string, DayHours> = {};
    for (const week of loc.weeks) {
      for (const day of Object.values(week)) days[day.date] = dayHours(day);
    }
    return {
      id: loc.lid,
      name: loc.name,
      kind: loc.category === "library" ? "library" : "department",
      url: loc.url,
      days,
    };
  });
}

export async function fetchLibraryHours(weeks = 2): Promise<LibraryHours[]> {
  const url = `https://umd.libcal.com/api_hours_grid.php?iid=${LIBCAL_INSTITUTION_ID}&format=json&weeks=${weeks}`;
  return parseLibCalHours(await fetchJson<LibCalHoursFeed>("libcal-hours", url));
}
