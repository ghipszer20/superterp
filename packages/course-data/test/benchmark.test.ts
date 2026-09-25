// Speed guard: filtering, sorting and explaining must stay fast in a student's browser.
// Freshman example: MATH140 + CMSC131 + ENGL101 + CHEM131 + COMM107, real Spring 2027 sections.
// Bounds are generous (CI runners are slower than a laptop); each test logs its actual time.
// On a laptop (2026-09-25): no filters 450 ms for 117,117 layouts, 9am–5pm 70 ms, explain ~4 ms.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { explainNoLayouts } from "../src/explain.ts";
import { generateLayouts, sameHoursEveryDay, type ScheduleFilters } from "../src/schedules.ts";
import { sortLayouts } from "../src/sort.ts";
import type { Section } from "../src/soc.ts";

const { sections } = JSON.parse(
  readFileSync(new URL("./fixtures/soc-202701-sample.json", import.meta.url), "utf8"),
) as { sections: Section[] };
const FRESHMAN = ["MATH140", "CMSC131", "ENGL101", "CHEM131", "COMM107"];
const h = (hour: number) => hour * 60;

function timed<T>(run: () => T): { result: T; ms: number } {
  const t = performance.now();
  const result = run();
  return { result, ms: performance.now() - t };
}

describe("freshman 5-course benchmark", () => {
  const cases: [string, ScheduleFilters, number][] = [
    ["no filters", {}, 117_117],
    ["permissive (8am–8pm every day, prunes little)", { days: sameHoursEveryDay(h(8), h(20)) }, 102_498],
    ["typical (9am–5pm every day)", { days: sameHoursEveryDay(h(9), h(17)) }, 16_157],
  ];

  for (const [name, filters, expected] of cases) {
    it(`generates and sorts every layout best-first in under 3 s: ${name}`, { timeout: 30_000 }, () => {
      const { result, ms } = timed(() => sortLayouts([...generateLayouts(FRESHMAN, sections, filters)], "best", {}));
      console.log(`[bench] ${name}: ${result.length} layouts, generate + sort ${ms.toFixed(0)} ms`);
      expect(result).toHaveLength(expected);
      expect(ms).toBeLessThan(3000);
    });
  }

  it("explains an over-filtered result in under 1 s", { timeout: 30_000 }, () => {
    // 10am–2pm every day: each course fits on its own, so the explanation has to search for the clash.
    const { result, ms } = timed(() => explainNoLayouts(FRESHMAN, sections, { days: sameHoursEveryDay(h(10), h(14)) }));
    console.log(`[bench] explain over-filtered: ${ms.toFixed(1)} ms — ${result?.message}`);
    expect(result?.message).toBe("MATH140, CMSC131 and CHEM131 can't fit together with your filters.");
    expect(ms).toBeLessThan(1000);
  });
});
