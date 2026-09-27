// Chart selection by exam year, and a few spot checks on UMD's older ("May 2023 exams" PDF,
// applied here through 2022 — see src/ap-through-2022.ts) AP chart. Full row-by-row mechanical
// checks for that chart live in charts.test.ts, alongside the current chart's.

import { describe, expect, it } from "vitest";
import { AP_EXAMS_OLDER, creditForAp, CreditError } from "../src/index.ts";

describe("creditForAp: chart selection by exam year", () => {
  it("defaults to the current (2023-2026) chart when no exam year is given", () => {
    expect(creditForAp("Calculus BC", 5).credits).toBe(8);
  });

  it("uses the current chart for an exam year in its range", () => {
    expect(creditForAp("Calculus BC", 5, 2025).credits).toBe(8);
  });

  it("uses the older chart for an exam year before 2023, giving the same credit where the charts agree", () => {
    const award = creditForAp("Chemistry", 5, 2022);
    expect(award.credits).toBe(6);
    expect(award.parts.map((p) => (p as { id: string }).id)).toEqual(["CHEM131", "CHEM132", "CHEM271"]);
  });

  it("keeps the older chart's own wording for the Calculus BC AB Subscore note", () => {
    const older = creditForAp("Calculus BC AB Subscore", 5, 2019);
    const current = creditForAp("Calculus BC AB Subscore", 5, 2025);
    expect(older.chartText).not.toBe(current.chartText);
    expect(older.chartText).toMatch(/may not receive credit/);
    expect(current.chartText).toMatch(/will not be awarded/);
  });

  it("rejects an exam the older chart doesn't list, even though the current chart has it", () => {
    expect(() => creditForAp("Cybersecurity", 4, 2020)).toThrow(CreditError);
    expect(() => creditForAp("Precalculus", 4, 2020)).toThrow(CreditError);
  });

  it("still returns the older chart's normal exams without any special note", () => {
    const award = creditForAp("Psychology", 4, 2018);
    expect(award.notes.some((n) => /check with/i.test(n))).toBe(false);
  });

  it("falls back to the oldest chart with a 'check with UMD' note for a year before AP exams existed", () => {
    const award = creditForAp("Psychology", 4, 1900);
    expect(award.credits).toBe(3);
    expect(award.notes.some((n) => /check with/i.test(n))).toBe(true);
  });

  it("doesn't crash for a very old exam year", () => {
    expect(() => creditForAp("Psychology", 4, 1900)).not.toThrow();
  });

  it("lists 39 exams on the older chart (4 fewer than current: no African American Studies, Cybersecurity, Networking or Precalculus)", () => {
    expect(AP_EXAMS_OLDER).toHaveLength(39);
  });
});
