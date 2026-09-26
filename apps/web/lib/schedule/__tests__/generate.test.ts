import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Section } from "@superterp/course-data/schedules";
import { decodeLayout } from "../gallery";
import { runGeneration } from "../generate";

const { sections } = JSON.parse(
  readFileSync(new URL("../../../../../packages/course-data/test/fixtures/soc-202701-sample.json", import.meta.url), "utf8"),
) as { sections: Section[] };
const byKey = new Map(sections.map((s) => [`${s.courseId}/${s.id}`, s]));
const TRIO = ["CMSC351", "STAT400", "ENGL394"];

describe("runGeneration (what the Web Worker does)", () => {
  it("returns every distinct layout, best first", () => {
    const out = runGeneration({ courseIds: TRIO, sections, filters: { days: {} }, sort: "best", ratings: {} });
    expect(out.layouts.count).toBeGreaterThan(100);
    expect(out.explanation).toBeNull();
    const first = decodeLayout(out.layouts, 0, byKey);
    expect(first.map((g) => g[0]!.courseId)).toEqual(TRIO);
  });

  it("uses one time scale for every card, covering the classes that pass the filters", () => {
    const out = runGeneration({ courseIds: TRIO, sections, filters: { days: {} }, sort: "best", ratings: {} });
    expect(out.scale.start % 60).toBe(0);
    expect(out.scale.hours[0]).toBe(out.scale.start);
  });

  it("explains an empty result (e.g. Fridays off for CMSC351 + STAT400 + ENGL394)", () => {
    const out = runGeneration({ courseIds: TRIO, sections, filters: { days: { F: "off" } }, sort: "best", ratings: {} });
    expect(out.layouts.count).toBe(0);
    expect(out.explanation?.blockers[0]?.filters).toContainEqual({ kind: "dayOff", day: "F" });
  });

  it("returns nothing (and no explanation) with no courses", () => {
    const out = runGeneration({ courseIds: [], sections, filters: { days: {} }, sort: "best", ratings: {} });
    expect(out.layouts.count).toBe(0);
    expect(out.explanation).toBeNull();
  });
});
