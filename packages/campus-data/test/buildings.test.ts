import { describe, expect, it } from "vitest";
import { parseBuildings } from "../src/buildings.ts";
import { SourceError } from "../src/http.ts";

const raw = [
  { name: "Brendan Iribe Center", code: "", id: "432", long: -76.9364438800535, lat: 38.9891607057353 },
  { name: "South Campus Dining Hall", code: "SDH", id: "026", long: -76.9436837393588, lat: 38.983048 },
  // Blank/garbage rows the feed sometimes has: no coordinates, or no name.
  { name: "", code: "", id: "000", long: 0, lat: 0 },
  { name: "No Coords Hall", code: "", id: "999", long: "not-a-number", lat: 38.98 },
];

describe("parseBuildings", () => {
  it("keeps name, id, and lat/lon (renaming umd.io's long to lon)", () => {
    expect(parseBuildings(raw)).toEqual([
      { id: "432", name: "Brendan Iribe Center", lat: 38.9891607057353, lon: -76.9364438800535 },
      { id: "026", name: "South Campus Dining Hall", lat: 38.983048, lon: -76.9436837393588 },
    ]);
  });

  it("drops rows with no name or invalid coordinates", () => {
    const names = parseBuildings(raw).map((b) => b.name);
    expect(names).not.toContain("");
    expect(names).not.toContain("No Coords Hall");
  });

  it("fails loudly if the feed isn't an array", () => {
    expect(() => parseBuildings({ buildings: [] })).toThrow(SourceError);
  });

  it("fails loudly on an empty feed", () => {
    expect(() => parseBuildings([])).toThrow(SourceError);
  });
});
