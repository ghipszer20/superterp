import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS } from "../filters";
import { affectsPlan, emptySaved, parseSaved, savePlan, serializeSaved, setOwnSection, withCourses } from "../saved";

describe("saved schedule (per device)", () => {
  it("starts empty for the term", () => {
    expect(emptySaved("202701")).toEqual({
      v: 1,
      term: "202701",
      courses: [],
      filters: DEFAULT_FILTERS,
      plans: {},
      own: {},
    });
  });

  it("round-trips through storage", () => {
    const s = savePlan(withCourses(emptySaved("202701"), ["CMSC351", "STAT400"]), "A", {
      CMSC351: "0101",
      STAT400: "0111",
    });
    expect(parseSaved(serializeSaved(s), "202701")).toEqual(s);
  });

  it("starts fresh when storage is empty, corrupt, from another version or another term", () => {
    expect(parseSaved(null, "202701")).toEqual(emptySaved("202701"));
    expect(parseSaved("{not json", "202701")).toEqual(emptySaved("202701"));
    expect(parseSaved(JSON.stringify({ ...emptySaved("202701"), v: 99 }), "202701")).toEqual(emptySaved("202701"));
    const old = withCourses(emptySaved("202608"), ["CMSC131"]);
    expect(parseSaved(serializeSaved(old), "202701")).toEqual(emptySaved("202701"));
  });

  it("drops a removed course's sections from every plan and from Build my own", () => {
    let s = withCourses(emptySaved("202701"), ["CMSC351", "STAT400"]);
    s = savePlan(s, "A", { CMSC351: "0101", STAT400: "0111" });
    s = setOwnSection(s, "STAT400", "0211");
    s = withCourses(s, ["CMSC351"]);
    expect(s.plans.A).toEqual({ CMSC351: "0101" });
    expect(s.own).toEqual({});
  });

  it("removes a course from Build my own when its section is cleared", () => {
    const s = setOwnSection(setOwnSection(emptySaved("202701"), "STAT400", "0211"), "STAT400", null);
    expect(s.own).toEqual({});
  });
});

describe("affectsPlan (only course changes reach the 4-year plan)", () => {
  const base = withCourses(emptySaved("202701"), ["CMSC351", "STAT400"]);

  it("is true when a course is added or removed", () => {
    expect(affectsPlan(base, withCourses(base, ["CMSC351", "STAT400", "ENGL394"]))).toBe(true);
    expect(affectsPlan(base, withCourses(base, ["CMSC351"]))).toBe(true);
  });

  it("is false for section changes, reordering and filter changes", () => {
    expect(affectsPlan(base, savePlan(base, "A", { CMSC351: "0201" }))).toBe(false);
    expect(affectsPlan(base, setOwnSection(base, "CMSC351", "0101"))).toBe(false);
    expect(affectsPlan(base, withCourses(base, ["STAT400", "CMSC351"]))).toBe(false);
    expect(affectsPlan(base, { ...base, filters: { ...DEFAULT_FILTERS, sort: "fewestGaps" } })).toBe(false);
  });
});
