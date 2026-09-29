import { describe, expect, it } from "vitest";
import { courseDifficulty, termDifficulty, type DifficultyCourse, type DifficultyHistory } from "../src/difficulty.ts";

const course = (id: string, averageGpa: number | null, credits = 3, rates = { wRate: 0.03, fRate: 0.02 }): DifficultyCourse => ({
  id,
  credits,
  stats: averageGpa === null ? null : { averageGpa, ...rates },
});
const mid = (n: number, avg = 3.0) => Array.from({ length: n }, (_, i) => course(`ENGL${100 + i}`, avg));

describe("courseDifficulty", () => {
  it("is low for easy averages and high for hard ones, clamped to 0-10", () => {
    expect(courseDifficulty(course("ART100", 3.8))).toBeLessThan(2);
    expect(courseDifficulty(course("CMSC451", 2.3))).toBeGreaterThan(7);
    expect(courseDifficulty(course("X100", 4.5, 3, { wRate: 0, fRate: 0 }))).toBeGreaterThanOrEqual(0);
    expect(courseDifficulty(course("X100", 0.5, 3, { wRate: 0.5, fRate: 0.4 }))).toBe(10);
  });
  it("is raised by W and F rates", () => {
    const calm = courseDifficulty(course("A200", 3.0, 3, { wRate: 0, fRate: 0 }));
    const rough = courseDifficulty(course("A200", 3.0, 3, { wRate: 0.15, fRate: 0.1 }));
    expect(rough).toBeGreaterThan(calm);
  });
  it("uses a neutral value by course level when there is no data", () => {
    const [a, b, c, d] = ["A100", "A200", "A300", "A400"].map((id) => courseDifficulty(course(id, null)));
    expect(a! < b! && b! < c! && c! < d!).toBe(true);
  });
});

describe("termDifficulty", () => {
  it("falls back to course averages and credit load without a transcript", () => {
    const r = termDifficulty(mid(5), []);
    expect(r.personalized).toBe(false);
    expect(r.score).toBeGreaterThanOrEqual(1);
    expect(r.score).toBeLessThanOrEqual(10);
    expect(Number.isInteger(r.score)).toBe(true);
    expect(r.sentence.endsWith(".")).toBe(true);
    expect(r.sentence).not.toMatch(/[\n•*-] /);
  });
  it("scores a heavy load higher than a light one, and says so", () => {
    const light = termDifficulty(mid(3), []);
    const heavy = termDifficulty(mid(7), []);
    expect(heavy.score).toBeGreaterThan(light.score);
    expect(heavy.sentence).toMatch(/21-credit|heavy/i);
  });
  it("names the hardest courses", () => {
    const r = termDifficulty([course("CMSC451", 2.4), course("CMSC420", 2.5), course("ART100", 3.8)], []);
    expect(r.sentence).toContain("CMSC451");
    expect(r.sentence).toContain("CMSC420");
    expect(r.sentence).toMatch(/harder|hardest|toughest/i);
  });
  it("handles courses with no data", () => {
    const r = termDifficulty([course("CMSC412", null), course("MATH141", null)], []);
    expect(r.score).toBeGreaterThanOrEqual(1);
    expect(r.sentence.length).toBeGreaterThan(0);
  });
  it("lowers the score for a strong record in the subject and mentions it", () => {
    const term = [course("STAT410", 2.6), course("CMSC420", 2.6), course("ENGL101", 3.5)];
    const strong: DifficultyHistory[] = [
      { id: "STAT400", grade: "A", courseAverageGpa: 2.9 },
      { id: "STAT401", grade: "A-", courseAverageGpa: 2.8 },
      { id: "STAT402", grade: "A", courseAverageGpa: 2.9 },
    ];
    const base = termDifficulty(term, []);
    const p = termDifficulty(term, strong);
    expect(p.personalized).toBe(true);
    expect(p.score).toBeLessThanOrEqual(base.score);
    expect(p.sentence).toMatch(/strong STAT record makes STAT410 easier for you/);
  });
  it("raises the score for a weak record", () => {
    const term = [course("CMSC420", 2.8), course("CMSC451", 2.8), course("MATH241", 2.8)];
    const weak: DifficultyHistory[] = [
      { id: "CMSC131", grade: "C", courseAverageGpa: 3.2 },
      { id: "CMSC132", grade: "C-", courseAverageGpa: 3.0 },
      { id: "MATH140", grade: "C", courseAverageGpa: 2.9 },
    ];
    expect(termDifficulty(term, weak).score).toBeGreaterThan(termDifficulty(term, []).score);
  });
  it("ignores history entries with a non-letter grade", () => {
    expect(termDifficulty(mid(3), [{ id: "MATH140", grade: "P", courseAverageGpa: 3 }]).personalized).toBe(false);
  });
  it("scores upper-level courses with ordinary real averages as mid-low, not hard", () => {
    // Real PlanetTerp stats: CMSC420 3.197 (5.3% W+F), CMSC421 3.292 (5.0%), ENGL101 3.4.
    const term = [
      course("CMSC420", 3.197, 3, { wRate: 0.038, fRate: 0.015 }),
      course("CMSC421", 3.292, 3, { wRate: 0.036, fRate: 0.014 }),
      course("ENGL101", 3.4),
    ];
    const r = termDifficulty(term, []);
    expect(r.score).toBeGreaterThanOrEqual(3);
    expect(r.score).toBeLessThanOrEqual(5);
    expect(r.sentence).not.toMatch(/harder|hardest|toughest/i);
  });
  it("does not max out a typical 15-credit term with two hard courses", () => {
    const term = [
      course("CMSC351", 2.67, 3, { wRate: 0.05, fRate: 0.027 }),
      course("STAT410", 2.8, 3, { wRate: 0.04, fRate: 0.02 }),
      course("ENGL201", 3.3),
      course("HIST200", 3.3),
      course("PSYC100", 3.3),
    ];
    expect(termDifficulty(term, []).score).toBeLessThanOrEqual(8);
  });
  it("does not name a repeat of a completed course or an easy course in the personal clause", () => {
    const term = [course("MATH140", 2.0), course("ENGL101", 3.6)];
    const hist: DifficultyHistory[] = [
      { id: "MATH140", grade: "A", courseAverageGpa: 2.8 },
      { id: "ENGL100", grade: "A", courseAverageGpa: 3.0 },
    ];
    expect(termDifficulty(term, hist).sentence).not.toMatch(/MATH140 easier|ENGL101 easier/);
  });
  it("clamps to 1-10", () => {
    const brutal = Array.from({ length: 8 }, (_, i) => course(`CMSC4${i}0`, 1.5, 4, { wRate: 0.4, fRate: 0.3 }));
    expect(termDifficulty(brutal, []).score).toBe(10);
    expect(termDifficulty([course("ART100", 4.0, 1, { wRate: 0, fRate: 0 })], []).score).toBe(1);
  });
});
