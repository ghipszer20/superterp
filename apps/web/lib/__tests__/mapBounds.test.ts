import { describe, expect, it } from "vitest";
import { CAMPUS_BOUNDS, findRouteExits, isInCampusBounds, nearestOffCampusStop, toMapLibreBounds } from "../mapBounds";

// A simple 0..10 box (not real coordinates) so the geometry is easy to check by hand.
const box = { west: 0, south: 0, east: 10, north: 10 };

describe("isInCampusBounds", () => {
  it("is true inside, and true exactly on the edge", () => {
    expect(isInCampusBounds([5, 5], box)).toBe(true);
    expect(isInCampusBounds([0, 0], box)).toBe(true);
    expect(isInCampusBounds([10, 10], box)).toBe(true);
  });

  it("is false outside", () => {
    expect(isInCampusBounds([-1, 5], box)).toBe(false);
    expect(isInCampusBounds([5, 11], box)).toBe(false);
  });
});

describe("toMapLibreBounds", () => {
  it("orders a CampusBounds as MapLibre's [[west, south], [east, north]]", () => {
    expect(toMapLibreBounds(CAMPUS_BOUNDS)).toEqual([
      [CAMPUS_BOUNDS.west, CAMPUS_BOUNDS.south],
      [CAMPUS_BOUNDS.east, CAMPUS_BOUNDS.north],
    ]);
  });
});

describe("findRouteExits", () => {
  it("finds nothing for a line that stays inside the bounds", () => {
    expect(findRouteExits([[[1, 1], [5, 5], [9, 9]]], box)).toEqual([]);
  });

  it("finds nothing for a line that never enters the bounds", () => {
    expect(findRouteExits([[[20, 20], [30, 30]]], box)).toEqual([]);
  });

  it("finds the crossing point and heading where a line exits the east edge", () => {
    expect(findRouteExits([[[5, 5], [15, 5]]], box)).toEqual([{ lon: 10, lat: 5, bearingDeg: 90 }]);
  });

  it("finds the crossing point and heading where a line exits the north edge", () => {
    expect(findRouteExits([[[5, 5], [5, 15]]], box)).toEqual([{ lon: 5, lat: 10, bearingDeg: 0 }]);
  });

  it("finds exits on the south and west edges too, across separate lines of one route", () => {
    const exits = findRouteExits(
      [
        [[5, 5], [5, -5]],
        [[5, 5], [-5, 5]],
      ],
      box,
    );
    expect(exits).toEqual([
      { lon: 5, lat: 0, bearingDeg: 180 },
      { lon: 0, lat: 5, bearingDeg: 270 },
    ]);
  });

  it("reports a corner exit at roughly the diagonal bearing", () => {
    const [exit] = findRouteExits([[[5, 5], [15, 15]]], box);
    expect(exit!.lon).toBeCloseTo(10);
    expect(exit!.lat).toBeCloseTo(10);
    expect(exit!.bearingDeg).toBeGreaterThan(40);
    expect(exit!.bearingDeg).toBeLessThan(50);
  });

  it("only reports inside-to-outside crossings, not the line coming back in", () => {
    // Starts inside, leaves east, comes back to the same point (re-entry ignored), then leaves west.
    const exits = findRouteExits([[[5, 5], [15, 5], [5, 5], [-15, 5]]], box);
    expect(exits).toEqual([
      { lon: 10, lat: 5, bearingDeg: 90 },
      { lon: 0, lat: 5, bearingDeg: 270 },
    ]);
  });

  it("treats a point exactly on the boundary as inside (exits with zero travel)", () => {
    expect(findRouteExits([[[10, 5], [15, 5]]], box)).toEqual([{ lon: 10, lat: 5, bearingDeg: 90 }]);
  });
});

describe("nearestOffCampusStop", () => {
  const stops = [
    { id: "a", lat: 5, lon: 5 }, // inside the box: never a candidate
    { id: "b", lat: 5, lon: 12 }, // outside, close to an east exit
    { id: "c", lat: 5, lon: 20 }, // outside, far from an east exit
  ];

  it("picks the nearest stop that is itself outside the bounds", () => {
    expect(nearestOffCampusStop([10, 5], stops, box)?.id).toBe("b");
  });

  it("returns null when every candidate stop is inside the bounds", () => {
    expect(nearestOffCampusStop([10, 5], [stops[0]!], box)).toBeNull();
  });
});
