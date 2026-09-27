import { describe, expect, it } from "vitest";
import {
  BS_MS_DOUBLE_COUNT_RATE,
  GRADUATE_ONLY_MAX_CREDITS,
  GRADUATE_ONLY_WARN_CREDITS,
  bsMsCap,
  isBlockedGraduateCourse,
  isGraduateCourse,
  meetsBsMsGrade,
} from "../src/grad-courses.ts";

describe("isGraduateCourse", () => {
  it("accepts 600-897, letter suffixes included", () => {
    expect(isGraduateCourse("CMSC616")).toBe(true);
    expect(isGraduateCourse("CMSC818C")).toBe(true);
    expect(isGraduateCourse("CMSC897")).toBe(true);
  });

  it("rejects 799 (thesis research)", () => {
    expect(isGraduateCourse("CMSC799")).toBe(false);
  });

  it("rejects undergrad-level and doctoral-only numbers", () => {
    expect(isGraduateCourse("CMSC499A")).toBe(false);
    expect(isGraduateCourse("CMSC898")).toBe(false);
    expect(isGraduateCourse("CMSC899")).toBe(false);
  });

  it("rejects a malformed id", () => {
    expect(isGraduateCourse("CMSC")).toBe(false);
    expect(isGraduateCourse("not-a-course")).toBe(false);
  });

  it("is case- and whitespace-insensitive", () => {
    expect(isGraduateCourse(" cmsc616 ")).toBe(true);
  });
});

describe("isBlockedGraduateCourse", () => {
  it("blocks 799, 898 and 899", () => {
    expect(isBlockedGraduateCourse("CMSC799")).toBe(true);
    expect(isBlockedGraduateCourse("CMSC898")).toBe(true);
    expect(isBlockedGraduateCourse("CMSC899")).toBe(true);
  });

  it("doesn't block an allowed graduate course", () => {
    expect(isBlockedGraduateCourse("CMSC616")).toBe(false);
    expect(isBlockedGraduateCourse("CMSC897")).toBe(false);
  });

  it("doesn't block an undergrad course", () => {
    expect(isBlockedGraduateCourse("CMSC131")).toBe(false);
  });
});

describe("meetsBsMsGrade", () => {
  it("needs a completed course with a grade", () => {
    expect(meetsBsMsGrade({ status: "planned" })).toBe(false);
    expect(meetsBsMsGrade({ status: "completed" })).toBe(false);
  });

  it("accepts B- or better", () => {
    expect(meetsBsMsGrade({ status: "completed", grade: "B-" })).toBe(true);
    expect(meetsBsMsGrade({ status: "completed", grade: "b-" })).toBe(true);
    expect(meetsBsMsGrade({ status: "completed", grade: "A" })).toBe(true);
  });

  it("rejects below B-", () => {
    expect(meetsBsMsGrade({ status: "completed", grade: "C+" })).toBe(false);
    expect(meetsBsMsGrade({ status: "completed", grade: "F" })).toBe(false);
  });

  it("rejects a non-letter grade like P/S", () => {
    expect(meetsBsMsGrade({ status: "completed", grade: "P" })).toBe(false);
  });
});

describe("bsMsCap", () => {
  it("is null with no master's-credit total set", () => {
    expect(bsMsCap(undefined)).toBeNull();
  });

  it("is 35% of the master's credits", () => {
    expect(bsMsCap(30)).toBeCloseTo(10.5);
    expect(BS_MS_DOUBLE_COUNT_RATE).toBe(0.35);
  });
});

describe("caps", () => {
  it("9 credits warns, 12 (9 + petitioned 3) is the max", () => {
    expect(GRADUATE_ONLY_WARN_CREDITS).toBe(9);
    expect(GRADUATE_ONLY_MAX_CREDITS).toBe(12);
  });
});
