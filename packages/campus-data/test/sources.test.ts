// Parsers tested against trimmed snapshots of the real sources (test/fixtures).
// These never touch the network; `npm run smoke` checks the live sites.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseDiningMenu } from "../src/dining.ts";
import { parseLibCalHours, type LibCalHoursFeed } from "../src/libraries.ts";
import { parseRecWellTab, recWellOnDate } from "../src/recwell.ts";
import { applyAvailability, parseRoomCategories, parseRoomLocations, parseRooms } from "../src/rooms.ts";
import { SourceError } from "../src/http.ts";

const fixture = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");

describe("RecWell sheet", () => {
  const areas = parseRecWellTab(fixture("recwell-eppley.csv"), "indoor");

  it("reads each area with its group and link", () => {
    expect(areas.map((a) => a.name)).toEqual([
      "Eppley Recreation Center",
      "Bouldering Zone",
      "Member Services Desk",
      "Adventure Program Rental Desk",
      "Sneakers Cafe",
    ]);
    expect(areas[0]).toMatchObject({
      group: "Eppley Recreation Center",
      url: "https://recwell.umd.edu/eppley-recreation-center-0",
      setting: "indoor",
    });
  });

  it("maps sheet columns to ISO dates", () => {
    const monday = recWellOnDate(areas, "2026-01-05");
    expect(monday[0]!.hours).toMatchObject({ kind: "ranges", ranges: [{ start: 360, end: 1260 }] });
    expect(recWellOnDate(areas, "2026-01-01").every((a) => a.hours.kind === "closed")).toBe(true);
  });

  it("drops areas with no entry for a date", () => {
    expect(recWellOnDate(areas, "2031-01-01")).toEqual([]);
  });

  it("fails loudly if the sheet layout changes", () => {
    expect(() => parseRecWellTab("totally,different\nlayout,here", "indoor")).toThrow(SourceError);
  });
});

describe("LibCal hours feed", () => {
  const libs = parseLibCalHours(JSON.parse(fixture("libcal-hours.json")) as LibCalHoursFeed);

  it("reads locations as libraries", () => {
    expect(libs.map((l) => l.name)).toEqual(["McKeldin Library", "STEM Library"]);
    expect(libs[0]!.kind).toBe("library");
  });

  it("has seven days of hours per location", () => {
    for (const lib of libs) expect(Object.keys(lib.days)).toHaveLength(7);
  });

  it("understands 24-hour days and ranges", () => {
    const mck = libs[0]!;
    expect(Object.values(mck.days).some((d) => d.kind === "24h")).toBe(true);
    expect(mck.days["2026-09-20"]).toMatchObject({ kind: "ranges", ranges: [{ start: 660, end: 1440 }] });
  });

  it("rejects an empty feed", () => {
    expect(() => parseLibCalHours({ locations: [] })).toThrow(SourceError);
  });
});

describe("dining menu page", () => {
  const menu = parseDiningMenu(fixture("dining-yahentamitsi.html"), 19, "2026-09-25");

  it("reads breakfast, lunch and dinner", () => {
    expect(menu.meals.map((m) => m.name)).toEqual(["Breakfast", "Lunch", "Dinner"]);
  });

  it("groups items by station with absolute label links", () => {
    const station = menu.meals[0]!.stations[0]!;
    expect(station.name).toBeTruthy();
    expect(station.items.length).toBeGreaterThan(0);
    expect(station.items[0]!.labelUrl).toMatch(/^https:\/\/nutrition\.umd\.edu\/label\.aspx\?RecNumAndPort=/);
  });

  it("turns icons into diet and allergen tags", () => {
    const items = menu.meals.flatMap((m) => m.stations.flatMap((s) => s.items));
    const tags = new Set(items.flatMap((i) => [...i.diets, ...i.contains]));
    expect(tags.size).toBeGreaterThan(0);
    for (const t of tags) expect(t).toMatch(/^[a-z ]+$/);
  });

  it("fails loudly on a page that isn't a menu", () => {
    expect(() => parseDiningMenu("<html><body>Maintenance</body></html>", 19, "2026-09-25")).toThrow(SourceError);
  });
});

describe("study rooms", () => {
  const html = fixture("rooms-stem.html");

  it("lists every library with bookable space", () => {
    expect(parseRoomLocations(html).map((l) => l.id)).toEqual([2552, 14005, 14006, 6745]);
  });

  it("lists a library's categories without 'Show All'", () => {
    const cats = parseRoomCategories(html, 6745);
    expect(cats.map((c) => c.id)).toEqual([23066, 31707]);
    expect(cats.every((c) => c.locationId === 6745)).toBe(true);
  });

  it("reads rooms with capacity and booking links", () => {
    expect(parseRooms(html)).toEqual([
      expect.objectContaining({
        id: 86400,
        name: "Carver Room 3403 G",
        capacity: 10,
        categoryId: 23066,
        locationId: 6745,
        bookingUrl: "https://umd.libcal.com/space/86400",
      }),
      expect.objectContaining({ id: 86401, name: "Chatelet Room 3403 F", capacity: 6 }),
    ]);
  });

  it("merges open half-hours into windows and skips booked slots", () => {
    const rooms = parseRooms(html);
    const grid = JSON.parse(fixture("rooms-stem-grid.json")) as {
      slots: { start: string; end: string; itemId: number; className?: string }[];
    };
    // Mark 10:00–10:30 in the Carver Room as booked.
    const booked = grid.slots.find((s) => s.itemId === 86400 && s.start.endsWith("10:00:00"))!;
    booked.className = "s-lc-eq-checkout";

    const [carver, chatelet] = applyAvailability(rooms, grid);
    expect(carver!.open).toEqual([
      { start: "2026-09-25 08:00:00", end: "2026-09-25 10:00:00" },
      { start: "2026-09-25 10:30:00", end: "2026-09-25 14:00:00" },
    ]);
    expect(chatelet!.open).toEqual([{ start: "2026-09-25 08:00:00", end: "2026-09-25 14:00:00" }]);
  });
});
