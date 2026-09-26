// A tiny hand-written GTFS feed (not real Shuttle-UM data) covering the
// cases that matter: weekday service, a one-day event route, a removed
// holiday, trips past midnight, and final stops.

import { describe, expect, it } from "vitest";
import { nearestStops, nextDepartures, parseGtfs, routeMap, routesOn, servicesOn } from "../src/buses.ts";
import { SourceError } from "../src/http.ts";

const feed = parseGtfs({
  "routes.txt": [
    "route_id,route_short_name,route_long_name,route_color,route_text_color",
    "118,118,Gold,FFD200,000000",
    "CP,CP,Football Quickbus,,",
  ].join("\n"),
  "stops.txt": [
    "stop_id,stop_name,stop_lat,stop_lon",
    "STAMP,Stamp Student Union,38.98820,-76.94450",
    "MCK,McKeldin Library,38.98600,-76.94500",
    "METRO,College Park Metro,38.97800,-76.92800",
  ].join("\n"),
  "trips.txt": [
    "route_id,service_id,trip_id,trip_headsign,shape_id",
    "118,WEEKDAY,g1,Metro,shp118",
    "118,WEEKDAY,g2,Metro,shp118",
    "118,WEEKDAY,late,Metro,shp118",
    "CP,GAMEDAY,fb1,Stadium,",
  ].join("\n"),
  "stop_times.txt": [
    "trip_id,arrival_time,departure_time,stop_id,stop_sequence",
    "g1,08:00:00,08:00:00,STAMP,1",
    "g1,08:05:00,08:05:00,MCK,2",
    "g1,08:15:00,08:15:00,METRO,3",
    "g2,09:00:00,09:00:00,STAMP,1",
    "g2,09:15:00,09:15:00,METRO,2",
    "late,24:30:00,24:30:00,STAMP,1",
    "late,24:45:00,24:45:00,METRO,2",
    "fb1,10:00:00,10:00:00,METRO,1",
    "fb1,10:20:00,10:20:00,STAMP,2",
  ].join("\n"),
  // Points are out of order on purpose, to prove routeMap sorts by shape_pt_sequence.
  "shapes.txt": [
    "shape_id,shape_pt_sequence,shape_pt_lat,shape_pt_lon",
    "shp118,2,38.97800,-76.92800",
    "shp118,0,38.98820,-76.94450",
    "shp118,1,38.98600,-76.94500",
  ].join("\n"),
  "calendar.txt": [
    "service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date",
    "WEEKDAY,1,1,1,1,1,0,0,20260801,20261224",
  ].join("\n"),
  "calendar_dates.txt": [
    "service_id,date,exception_type",
    "GAMEDAY,20260926,1",
    "WEEKDAY,20261126,2",
  ].join("\n"),
  "feed_info.txt": "feed_publisher_name,feed_end_date\nTest,20261224",
});

describe("service calendar", () => {
  it("runs weekday service on weekdays only", () => {
    expect(servicesOn(feed, "2026-09-25")).toEqual(new Set(["WEEKDAY"])); // Friday
    expect(servicesOn(feed, "2026-09-27").size).toBe(0); // Sunday
  });

  it("adds event service and removes holidays", () => {
    expect(servicesOn(feed, "2026-09-26")).toEqual(new Set(["GAMEDAY"])); // Saturday game
    expect(servicesOn(feed, "2026-11-26").size).toBe(0); // Thanksgiving
  });

  it("shows event routes only on their day", () => {
    expect(routesOn(feed, "2026-09-25").map((r) => r.shortName)).toEqual(["118"]);
    expect(routesOn(feed, "2026-09-26").map((r) => r.shortName)).toEqual(["CP"]);
  });

  it("reads route colors and the feed's end date", () => {
    expect(feed.routes.get("118")).toMatchObject({ color: "#FFD200", textColor: "#000000" });
    expect(feed.routes.get("CP")!.color).toBe("#6E6E73");
    expect(feed.validUntil).toBe("2026-12-24");
  });
});

describe("nextDepartures", () => {
  it("lists upcoming departures in order", () => {
    const deps = nextDepartures(feed, "STAMP", "2026-09-25", 7 * 60);
    expect(deps.map((d) => [d.tripId, d.minutes])).toEqual([
      ["g1", 480],
      ["g2", 540],
      ["late", 1470],
    ]);
    expect(deps[0]).toMatchObject({ headsign: "Metro", scheduled: true });
  });

  it("skips departures that already left", () => {
    expect(nextDepartures(feed, "STAMP", "2026-09-25", 8 * 60 + 1).map((d) => d.tripId)).toEqual(["g2", "late"]);
  });

  it("includes the previous day's after-midnight trips", () => {
    // Saturday 00:10: Friday's 24:30 trip leaves at 00:30.
    const deps = nextDepartures(feed, "STAMP", "2026-09-26", 10);
    expect(deps[0]).toMatchObject({ tripId: "late", minutes: 30 });
  });

  it("doesn't list a trip's final stop as a departure", () => {
    expect(nextDepartures(feed, "METRO", "2026-09-25", 0)).toEqual([]);
  });
});

describe("nearestStops", () => {
  it("sorts stops by distance", () => {
    const [first, second] = nearestStops(feed, 38.9881, -76.9444, 2);
    expect(first!.id).toBe("STAMP");
    expect(second!.id).toBe("MCK");
    expect(first!.meters).toBeLessThan(20);
  });
});

it("rejects a feed missing required files", () => {
  expect(() => parseGtfs({ "routes.txt": "route_id\n1" })).toThrow(SourceError);
});

describe("routeMap", () => {
  it("builds a route's line from shapes.txt, sorted by shape_pt_sequence, as [lon, lat] pairs", () => {
    const { routes } = routeMap(feed, "2026-09-25");
    const r118 = routes.find((r) => r.id === "118")!;
    expect(r118.lines).toEqual([
      [
        [-76.9445, 38.9882],
        [-76.945, 38.986],
        [-76.928, 38.978],
      ],
    ]);
  });

  it("lists every stop a route visits", () => {
    const { routes } = routeMap(feed, "2026-09-25");
    const r118 = routes.find((r) => r.id === "118")!;
    expect(r118.stopIds.sort()).toEqual(["MCK", "METRO", "STAMP"]);
  });

  it("falls back to the trip's stop order when it has no shape", () => {
    const { routes } = routeMap(feed, "2026-09-26"); // gameday: CP's fb1 trip has no shape_id
    const cp = routes.find((r) => r.id === "CP")!;
    expect(cp.lines).toEqual([
      [
        [-76.928, 38.978], // METRO
        [-76.9445, 38.9882], // STAMP
      ],
    ]);
  });

  it("indexes which routes serve each stop, for the day requested", () => {
    expect(routeMap(feed, "2026-09-25").stopRoutes["STAMP"]).toEqual(["118"]);
    expect(routeMap(feed, "2026-09-26").stopRoutes["METRO"]).toEqual(["CP"]);
  });
});
