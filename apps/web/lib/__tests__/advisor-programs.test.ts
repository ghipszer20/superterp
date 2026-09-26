import { describe, expect, it } from "vitest";
import { auditedPrograms, noticeCandidates, PROGRAM_OPTIONS, programsLabel, toggleProgram } from "../advisor/programs";

const ids = (list: { id: string }[]) => list.map((p) => p.id);

describe("program options", () => {
  it("offers the encoded majors, all unverified for now", () => {
    expect(ids(PROGRAM_OPTIONS)).toEqual(["cmsc-major", "math-major-traditional", "math-major-applied"]);
    expect(PROGRAM_OPTIONS.every((o) => o.program.verified !== true)).toBe(true);
  });
});

describe("toggleProgram", () => {
  it("adds and removes a major", () => {
    expect(toggleProgram([], "cmsc-major")).toEqual(["cmsc-major"]);
    expect(toggleProgram(["cmsc-major"], "cmsc-major")).toEqual([]);
  });

  it("keeps one track per major: picking Applied replaces Traditional in place", () => {
    expect(toggleProgram(["math-major-traditional", "cmsc-major"], "math-major-applied")).toEqual(["math-major-applied", "cmsc-major"]);
  });

  it("ignores unknown ids", () => {
    expect(toggleProgram(["cmsc-major"], "nope")).toEqual(["cmsc-major"]);
  });
});

describe("auditedPrograms", () => {
  it("checks the chosen majors, then Gen Ed and the university rules", () => {
    expect(ids(auditedPrograms(["math-major-applied", "cmsc-major"]))).toEqual([
      "math-major-applied",
      "cmsc-major",
      "gen-ed",
      "university",
    ]);
  });
});

describe("noticeCandidates", () => {
  it("passes chosen majors as declared, in order, and other majors as undeclared", () => {
    const c = noticeCandidates(["math-major-applied"]);
    expect(c.map((x) => [x.program.id, x.declared])).toEqual([
      ["math-major-applied", true],
      ["cmsc-major", false],
    ]);
  });

  it("never offers another track of a chosen major (that isn't a double major)", () => {
    expect(noticeCandidates(["math-major-applied", "cmsc-major"]).map((x) => x.program.id)).toEqual(["math-major-applied", "cmsc-major"]);
  });

  it("offers one track of an unchosen major, the default", () => {
    expect(noticeCandidates(["cmsc-major"]).map((x) => x.program.id)).toEqual(["cmsc-major", "math-major-traditional"]);
  });

  it("never offers Gen Ed or the university rules", () => {
    expect(noticeCandidates([]).map((x) => x.program.id)).toEqual([]);
  });
});

describe("programsLabel", () => {
  it("names the chosen majors briefly", () => {
    expect(programsLabel(["math-major-applied", "cmsc-major"])).toBe("Math (Applied) + Computer Science");
    expect(programsLabel([])).toBe("No major chosen");
  });
});
