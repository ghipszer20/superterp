// Server-side access to campus data. Each source is cached at its own
// refresh rate, so we're polite to UMD's servers and pages load instantly.
//
//   source      refresh (revalidate)   why
//   dining      30 min                 menus change during the day
//   libraries   3 h                    hours rarely change within a day
//   recwell     6 h                    sheet is edited occasionally
//   room list   1 day                  rooms almost never change
//   room slots  5 min                  bookings happen constantly
//   buses       1 day (in memory)      the GTFS feed changes a few times a term

import { cacheLife } from "next/cache";
import {
  addDays,
  DINING_HALLS,
  fetchCategoryAvailability,
  fetchDiningMenu,
  fetchLibraryHours,
  fetchRecWellAreas,
  fetchRoomCatalog,
  fetchShuttleFeed,
  nextDepartures,
  routesOn,
  type Feed,
} from "@superterp/campus-data";

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/** Never let one broken source take down a page. */
export async function safe<T>(load: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await load() };
  } catch (err) {
    console.error(err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function getLibraryHours() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3 * 3600, expire: 2 * 86400 });
  return fetchLibraryHours(2);
}

export async function getRecWellAreas() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 6 * 3600, expire: 3 * 86400 });
  return fetchRecWellAreas();
}

export async function getDiningMenu(hallId: number, isoDate: string) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 1800, expire: 86400 });
  return fetchDiningMenu(hallId, isoDate);
}

export async function getAllDiningMenus(isoDate: string) {
  return Promise.all(DINING_HALLS.map((h) => safe(() => getDiningMenu(h.id, isoDate))));
}

export async function getRoomCatalog() {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 86400, expire: 7 * 86400 });
  return fetchRoomCatalog();
}

export async function getRoomAvailability(locationId: number, categoryId: number, isoDate: string) {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  const { rooms } = await getRoomCatalog();
  return fetchCategoryAvailability(rooms, locationId, categoryId, isoDate, addDays(isoDate, 1));
}

// ---- buses ----
// The parsed feed is big (≈100k stop times), so it lives in server memory
// and is refreshed daily; only small derived answers go through 'use cache'.

let feed: { loadedAt: number; promise: Promise<Feed> } | null = null;

function loadFeed(): Promise<Feed> {
  if (!feed || Date.now() - feed.loadedAt > 86_400_000) {
    const promise = fetchShuttleFeed();
    feed = { loadedAt: Date.now(), promise };
    promise.catch(() => {
      feed = null; // retry on the next request instead of caching the failure
    });
  }
  return feed.promise;
}

export type BusStop = { id: string; name: string; lat: number; lon: number; departuresToday: number };

/** Stops with service on a date, busiest first. */
export async function getBusStops(isoDate: string): Promise<BusStop[]> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 86400, expire: 2 * 86400 });
  const f = await loadFeed();
  const counts = new Map<string, number>();
  for (const [stopId] of f.stopTimesByStop) {
    counts.set(stopId, nextDepartures(f, stopId, isoDate, 0, 1000).length);
  }
  return [...f.stops.values()]
    .map((s) => ({ ...s, departuresToday: counts.get(s.id) ?? 0 }))
    .filter((s) => s.departuresToday > 0)
    .sort((a, b) => b.departuresToday - a.departuresToday);
}

export async function getRoutesOn(isoDate: string) {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 86400, expire: 2 * 86400 });
  const f = await loadFeed();
  return {
    routes: routesOn(f, isoDate).sort((a, b) => a.shortName.localeCompare(b.shortName, "en", { numeric: true })),
    validUntil: f.validUntil,
  };
}

export async function getDepartures(stopIds: string[], isoDate: string, fromMinutes: number, perStop = 4) {
  const f = await loadFeed();
  return stopIds.map((id) => ({
    stopId: id,
    departures: nextDepartures(f, id, isoDate, fromMinutes, perStop).map((d) => ({
      tripId: d.tripId,
      route: d.route.shortName,
      routeName: d.route.longName,
      color: d.route.color,
      textColor: d.route.textColor,
      headsign: d.headsign,
      minutes: d.minutes,
    })),
  }));
}
