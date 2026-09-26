// Science (BCPM) GPA, AMCAS-style. Every expected number is worked out by hand in the comments.

import { describe, expect, it } from "vitest";
import { amcasGpa, bcpmCategory, scienceGpa, type GradedCourse } from "../src/gpa.ts";

const g = (id: string, credits: number, grade?: string): GradedCourse => ({ id, credits, grade });

describe("bcpmCategory: UMD department → AMCAS classification", () => {
  it.each([
    ["BSCI170", "biology"],
    ["BSCI180", "biology"],
    ["BIOL608", "biology"],
    ["CBMG688", "biology"],
    ["ENTM205", "biology"],
    ["NEUR305", "biology"],
    ["BIPH698", "biology"],
    ["BISI488", "biology"],
    ["CHEM131", "chemistry"],
    ["CHEM232S", "chemistry"],
    ["BCHM461", "chemistry"],
    ["PHYS131", "physics"],
    ["ASTR100", "physics"],
    ["MATH140", "math"],
    ["STAT400", "math"],
    ["AMSC460", "math"],
    ["BIOM301", "math"],
  ])("%s is %s", (id, category) => {
    expect(bcpmCategory(id)).toBe(category);
  });

  it("classifies a few courses by content rather than department", () => {
    expect(bcpmCategory("EPIB315")).toBe("math"); // Biostatistics for Public Health Practice
    expect(bcpmCategory("PSYC200")).toBe("math"); // Statistical Methods in Psychology
    expect(bcpmCategory("BIOE120")).toBe("biology"); // Biology for Engineers
  });

  it.each(["ANSC101", "NFSC100", "PSYC100", "CMSC131", "ENGL101", "EPIB301", "BIOE121", "DSNL:AP Biology"])(
    "%s is not BCPM",
    (id) => {
      expect(bcpmCategory(id)).toBeNull();
    },
  );
});

describe("scienceGpa", () => {
  it("averages biology, chemistry, physics and math by credit hours", () => {
    const result = scienceGpa([
      g("BSCI170", 3, "A"), //   3 × 4.0 = 12.0
      g("CHEM131", 3, "B+"), //  3 × 3.3 =  9.9
      g("CHEM132", 1, "A-"), //  1 × 3.7 =  3.7
      g("PHYS131", 4, "B"), //   4 × 3.0 = 12.0
      g("MATH140", 4, "C+"), //  4 × 2.3 =  9.2
      g("ENGL101", 3, "A"), //   not BCPM
      g("HIST200", 3, "B-"), //  not BCPM
    ]);
    // 46.8 quality points / 15 credits = 3.12
    expect(result.credits).toBe(15);
    expect(result.qualityPoints).toBeCloseTo(46.8, 10);
    expect(result.gpa).toBeCloseTo(3.12, 10);
    expect(result.byCategory.biology).toEqual({ credits: 3, gpa: 4 });
    expect(result.byCategory.chemistry.credits).toBe(4);
    expect(result.byCategory.chemistry.gpa).toBeCloseTo(3.4, 10); // 13.6 / 4
    expect(result.byCategory.physics).toEqual({ credits: 4, gpa: 3 });
    expect(result.byCategory.math.gpa).toBeCloseTo(2.3, 10);
  });

  it("counts every attempt of a repeated course, and A+ as 4.0", () => {
    const result = scienceGpa([g("CHEM231", 3, "F"), g("CHEM231", 3, "B"), g("BSCI223", 4, "A+")]);
    // (0 + 9 + 16) / 10 = 2.5
    expect(result.credits).toBe(10);
    expect(result.gpa).toBeCloseTo(2.5, 10);
  });

  it("leaves out pass/fail, withdrawals, and credit without a grade, and says why", () => {
    const result = scienceGpa([
      g("BSCI160", 3), // AP credit: no grade
      g("MATH140", 4, "P"),
      g("PHYS132", 4, "W"),
      g("CHEM241", 3, "B"),
    ]);
    expect(result.gpa).toBe(3);
    expect(result.credits).toBe(3);
    expect(result.excluded).toEqual([
      { id: "BSCI160", reason: "no grade (AP, IB or transfer credit)" },
      { id: "MATH140", reason: "pass/fail grade P" },
      { id: "PHYS132", reason: "grade W carries no grade points" },
    ]);
  });

  it("has no GPA without graded BCPM courses", () => {
    const result = scienceGpa([g("ENGL101", 3, "A")]);
    expect(result.gpa).toBeNull();
    expect(result.credits).toBe(0);
    expect(result.byCategory.biology).toEqual({ credits: 0, gpa: null });
  });
});

describe("amcasGpa (overall)", () => {
  it("averages every graded course on the AMCAS scale", () => {
    const result = amcasGpa([g("BSCI170", 3, "A"), g("ENGL101", 3, "C-"), g("HIST200", 2, "P")]);
    // (12 + 5.1) / 6 = 2.85
    expect(result.credits).toBe(6);
    expect(result.gpa).toBeCloseTo(2.85, 10);
  });
});
