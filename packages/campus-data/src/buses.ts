// Shuttle-UM schedules from its public GTFS feed. Static schedules only:
// real-time positions aren't public (DOTS uses Swiftly), so every time we
// show is labeled "scheduled".
//
// GTFS reference: https://gtfs.org/documentation/schedule/reference/

import { unzipSync, strFromU8 } from "fflate";
import { parseCsvRecords } from "./csv.ts";
import { addDays } from "./dates.ts";
import { fetchBytes, SourceError } from "./http.ts";

export const SHUTTLE_UM_GTFS_URL = "https://feed.actionfigure.ai/university-of-maryland-shuttle-um.zip";

export type Route = { id: string; shortName: string; longName: string; color: string; textColor: string };
export type Stop = { id: string; name: string; lat: number; lon: number };

type Trip = { id: string; routeId: string; serviceId: string; headsign: string };
type StopTime = { tripId: string; departure: number; sequence: number };
type Service = { days: boolean[]; start: string; end: string };

export type Feed = {
  routes: Map<string, Route>;
  stops: Map<string, Stop>;
  trips: Map<string, Trip>;
  /** stop_id → departures at that stop, sorted by time. */
  stopTimesByStop: Map<string, StopTime[]>;
  /** trip_id → its last stop sequence, to skip "departures" that are really arrivals. */
  lastSequence: Map<string, number>;
  services: Map<string, Service>;
  /** service_id → date → 1 (added) | 2 (removed). */
  exceptions: Map<string, Map<string, 1 | 2>>;
  /** Last date covered by the feed ("YYYY-MM-DD"). */
  validUntil: string | null;
};

export type Departure = {
  tripId: string;
  route: Route;
  headsign: string;
  /** Minutes after midnight of the requested date (can exceed 1440). */
  minutes: number;
  scheduled: true;
};

/** "25:10:00" → 1510 (GTFS times can pass midnight). */
function gtfsMinutes(time: string): number | null {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(time.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

/** "20260519" → "2026-05-19" */
function gtfsDate(d: string): string {
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

function color(hex: string | undefined, fallback: string): string {
  return hex && /^[0-9a-f]{6}$/i.test(hex) ? `#${hex.toUpperCase()}` : fallback;
}

export function unzipGtfs(zip: Uint8Array): Record<string, string> {
  const files = unzipSync(zip, { filter: (f) => f.name.endsWith(".txt") });
  return Object.fromEntries(Object.entries(files).map(([name, bytes]) => [name.split("/").pop()!, strFromU8(bytes)]));
}

export function parseGtfs(files: Record<string, string>): Feed {
  const need = (name: string) => {
    const text = files[name];
    if (text === undefined) throw new SourceError("buses", `GTFS feed is missing ${name}`);
    return parseCsvRecords(text);
  };

  const routes = new Map<string, Route>();
  for (const r of need("routes.txt")) {
    routes.set(r.route_id!, {
      id: r.route_id!,
      shortName: r.route_short_name ?? "",
      longName: r.route_long_name ?? "",
      color: color(r.route_color, "#6E6E73"),
      textColor: color(r.route_text_color, "#FFFFFF"),
    });
  }

  const stops = new Map<string, Stop>();
  for (const s of need("stops.txt")) {
    stops.set(s.stop_id!, { id: s.stop_id!, name: s.stop_name ?? "", lat: Number(s.stop_lat), lon: Number(s.stop_lon) });
  }

  const trips = new Map<string, Trip>();
  for (const t of need("trips.txt")) {
    trips.set(t.trip_id!, {
      id: t.trip_id!,
      routeId: t.route_id!,
      serviceId: t.service_id!,
      headsign: t.trip_headsign ?? "",
    });
  }

  const stopTimesByStop = new Map<string, StopTime[]>();
  const lastSequence = new Map<string, number>();
  for (const st of need("stop_times.txt")) {
    const departure = gtfsMinutes(st.departure_time || st.arrival_time || "");
    if (departure === null) continue; // untimed stop (interpolated); skip
    const sequence = Number(st.stop_sequence);
    const list = stopTimesByStop.get(st.stop_id!) ?? [];
    list.push({ tripId: st.trip_id!, departure, sequence });
    stopTimesByStop.set(st.stop_id!, list);
    lastSequence.set(st.trip_id!, Math.max(lastSequence.get(st.trip_id!) ?? 0, sequence));
  }
  for (const list of stopTimesByStop.values()) list.sort((a, b) => a.departure - b.departure);

  const services = new Map<string, Service>();
  const dayCols = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  for (const c of files["calendar.txt"] ? parseCsvRecords(files["calendar.txt"]) : []) {
    services.set(c.service_id!, {
      days: dayCols.map((d) => c[d] === "1"),
      start: gtfsDate(c.start_date!),
      end: gtfsDate(c.end_date!),
    });
  }

  const exceptions = new Map<string, Map<string, 1 | 2>>();
  for (const e of files["calendar_dates.txt"] ? parseCsvRecords(files["calendar_dates.txt"]) : []) {
    const byDate = exceptions.get(e.service_id!) ?? new Map<string, 1 | 2>();
    byDate.set(gtfsDate(e.date!), e.exception_type === "1" ? 1 : 2);
    exceptions.set(e.service_id!, byDate);
  }

  const feedInfo = files["feed_info.txt"] ? parseCsvRecords(files["feed_info.txt"])[0] : undefined;
  const validUntil = feedInfo?.feed_end_date ? gtfsDate(feedInfo.feed_end_date) : null;

  return { routes, stops, trips, stopTimesByStop, lastSequence, services, exceptions, validUntil };
}

/** Service ids running on a date, applying calendar.txt then calendar_dates.txt. */
export function servicesOn(feed: Feed, isoDate: string): Set<string> {
  const weekday = (new Date(`${isoDate}T12:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0
  const active = new Set<string>();
  for (const [id, s] of feed.services) {
    if (s.days[weekday] && isoDate >= s.start && isoDate <= s.end) active.add(id);
  }
  for (const [id, byDate] of feed.exceptions) {
    const e = byDate.get(isoDate);
    if (e === 1) active.add(id);
    if (e === 2) active.delete(id);
  }
  return active;
}

/** Routes with at least one trip on this date. Event routes (football, Commencement) appear only on their days. */
export function routesOn(feed: Feed, isoDate: string): Route[] {
  const active = servicesOn(feed, isoDate);
  const ids = new Set<string>();
  for (const t of feed.trips.values()) if (active.has(t.serviceId)) ids.add(t.routeId);
  return [...ids].map((id) => feed.routes.get(id)!).filter(Boolean);
}

/** Next scheduled departures from a stop, including late trips from the previous service day. */
export function nextDepartures(
  feed: Feed,
  stopId: string,
  isoDate: string,
  fromMinutes: number,
  limit = 5,
): Departure[] {
  const times = feed.stopTimesByStop.get(stopId) ?? [];
  const today = servicesOn(feed, isoDate);
  const yesterday = servicesOn(feed, addDays(isoDate, -1));
  const out: Departure[] = [];

  for (const st of times) {
    const trip = feed.trips.get(st.tripId);
    if (!trip) continue;
    if (st.sequence === feed.lastSequence.get(st.tripId)) continue; // final stop: nothing departs
    let minutes: number | null = null;
    if (today.has(trip.serviceId) && st.departure >= fromMinutes) minutes = st.departure;
    else if (yesterday.has(trip.serviceId) && st.departure - 1440 >= fromMinutes) minutes = st.departure - 1440;
    if (minutes === null) continue;
    const route = feed.routes.get(trip.routeId);
    if (!route) continue;
    out.push({ tripId: trip.id, route, headsign: trip.headsign, minutes, scheduled: true });
  }
  return out.sort((a, b) => a.minutes - b.minutes).slice(0, limit);
}

/** Great-circle distance in meters. */
export function distanceMeters(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLon = (bLon - aLon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(h));
}

export function nearestStops(feed: Feed, lat: number, lon: number, limit = 5): (Stop & { meters: number })[] {
  return [...feed.stops.values()]
    .map((s) => ({ ...s, meters: distanceMeters(lat, lon, s.lat, s.lon) }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, limit);
}

export async function fetchShuttleFeed(): Promise<Feed> {
  return parseGtfs(unzipGtfs(await fetchBytes("buses", SHUTTLE_UM_GTFS_URL)));
}
