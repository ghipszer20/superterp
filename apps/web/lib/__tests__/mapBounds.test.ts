import { describe, expect, it } from "vitest";
import {
  CAMPUS_BOUNDS,
  expandBounds,
  findRouteExits,
  isInCampusBounds,
  nearestOffCampusStop,
  stripDirectionSuffix,
  toMapLibreBounds,
} from "../mapBounds";

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

describe("expandBounds", () => {
  it("grows each side by a fraction of that axis's span", () => {
    // 10-wide, 10-tall box; 20% growth adds 2 on each side.
    expect(expandBounds(box, 0.2)).toEqual({ west: -2, south: -2, east: 12, north: 12 });
  });

  it("does nothing at fraction 0", () => {
    expect(expandBounds(box, 0)).toEqual(box);
  });
});

describe("findRouteExits", () => {
  it("finds nothing for a line that stays inside the bounds", () => {
    expect(findRouteExits([[[1, 1], [5, 5], [9, 9]]], box)).toEqual([]);
  });

  it("finds nothing for a line that never enters the bounds", () => {
    expect(findRouteExits([[[20, 20], [30, 30]]], box)).toEqual([]);
  });

  it("finds the crossing point, edge and heading where a line exits due east", () => {
    expect(findRouteExits([[[5, 5], [15, 5]]], box)).toEqual([
      { lon: 10, lat: 5, bearingDeg: 90, edge: "east", farthest: [15, 5] },
    ]);
  });

  it("finds the crossing point, edge and heading where a line exits due north", () => {
    expect(findRouteExits([[[5, 5], [5, 15]]], box)).toEqual([
      { lon: 5, lat: 10, bearingDeg: 0, edge: "north", farthest: [5, 15] },
    ]);
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
      { lon: 5, lat: 0, bearingDeg: 180, edge: "south", farthest: [5, -5] },
      { lon: 0, lat: 5, bearingDeg: 270, edge: "west", farthest: [-5, 5] },
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
      { lon: 10, lat: 5, bearingDeg: 90, edge: "east", farthest: [15, 5] },
      { lon: 0, lat: 5, bearingDeg: 270, edge: "west", farthest: [-15, 5] },
    ]);
  });

  it("treats a point exactly on the boundary as inside (exits with zero travel)", () => {
    expect(findRouteExits([[[10, 5], [15, 5]]], box)).toEqual([
      { lon: 10, lat: 5, bearingDeg: 90, edge: "east", farthest: [15, 5] },
    ]);
  });

  it("reports the farthest point of a multi-point run outside the bounds, not just the first", () => {
    // Exits east at x=10, then keeps going further out before the shape ends (e.g. a real
    // terminal loop past the edge) -- the label should point at the far end, not the edge itself.
    const [exit] = findRouteExits([[[5, 5], [12, 5], [20, 5], [30, 5]]], box);
    expect(exit!.farthest).toEqual([30, 5]);
  });

  it("stops the farthest-point walk as soon as the line comes back inside", () => {
    const [exit] = findRouteExits([[[5, 5], [12, 5], [20, 5], [5, 5]]], box);
    expect(exit!.farthest).toEqual([20, 5]);
  });

  it("picks the truly farthest point of an out-and-back excursion, not just the last one", () => {
    // Leaves east, goes out to x=20, loops back toward (but not into) campus, then re-enters.
    // The last point before re-entry (12,6) is much closer to the crossing than (20,5) is.
    const [exit] = findRouteExits([[[5, 5], [12, 5], [20, 5], [12, 6], [5, 5]]], box);
    expect(exit!.farthest).toEqual([20, 5]);
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

describe("stripDirectionSuffix", () => {
  it("drops a trailing (Inbound) or (Outbound) GTFS direction tag", () => {
    expect(stripDirectionSuffix("Denton Hall (Inbound)")).toBe("Denton Hall");
    expect(stripDirectionSuffix("Denton Hall (Outbound)")).toBe("Denton Hall");
  });

  it("leaves a name with no direction tag alone", () => {
    expect(stripDirectionSuffix("Stamp Student Union")).toBe("Stamp Student Union");
  });

  it("doesn't touch a parenthetical that isn't a direction tag", () => {
    expect(stripDirectionSuffix("South Campus Commons 5 and 6")).toBe("South Campus Commons 5 and 6");
  });
});
