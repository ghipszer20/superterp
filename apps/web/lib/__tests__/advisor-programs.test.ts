import { describe, expect, it } from "vitest";
import {
  auditedPrograms,
  collegeOf,
  degreeModeOf,
  MAX_NOTICE_CANDIDATES,
  noticeCandidates,
  NOTICE_OVERLAP_THRESHOLD,
  PROGRAM_OPTIONS,
  programsLabel,
  rankNoticeCandidates,
  studentDegrees,
  toggleProgram,
} from "../advisor/programs";
import type { ProgramOption } from "../advisor/programs";

const ids = (list: { id: string }[]) => list.map((p) => p.id);

describe("program options", () => {
  it("offers every registered program, majors first, all unverified for now", () => {
    expect(ids(PROGRAM_OPTIONS.filter((o) => o.kind === "major"))).toEqual([
      "astr-major-astrophysics",
      "astr-major-data-science",
      "astr-major-physical-science",
      "aosc-major",
      "bsci-major-genb",
      "bsci-major-cebg",
      "bsci-major-ecev",
      "bsci-major-micb",
      "bsci-major-phnb",
      "bchm-major",
      "cmsc-major",
      "cmsc-major-cybersecurity",
      "cmsc-major-data-science",
      "cmsc-major-machine-learning",
      "cmsc-major-quantum-information",
      "math-major-traditional",
      "math-major-applied",
    ]);
    expect(PROGRAM_OPTIONS.length).toBeGreaterThan(3);
    expect(PROGRAM_OPTIONS.every((o) => !o.verified)).toBe(true);
  });

  it("carries no Program: requirements load only when a program is audited", () => {
    expect(PROGRAM_OPTIONS.every((o) => !("program" in o) && typeof o.load === "function")).toBe(true);
  });
});

describe("collegeOf", () => {
  it("uses the first declared major's college", () => {
    expect(collegeOf(["cmsc-major", "math-major-applied"])).toBe("CMNS");
  });

  it("prefers a major over a special program chosen first", () => {
    expect(collegeOf(["dept-honors-engl", "cmsc-major"])).toBe("CMNS");
  });

  it("falls back to the first program when no major is chosen", () => {
    expect(collegeOf(["dept-honors-engl"])).toBe("ARHU");
  });

  it("is undefined with no programs chosen", () => {
    expect(collegeOf([])).toBeUndefined();
  });

  it("ignores an unknown program id", () => {
    expect(collegeOf(["nope"])).toBeUndefined();
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

  it("adds a non-major alongside majors", () => {
    expect(toggleProgram(["cmsc-major"], "honors-aces")).toEqual(["cmsc-major", "honors-aces"]);
  });

  it("ignores unknown ids", () => {
    expect(toggleProgram(["cmsc-major"], "nope")).toEqual(["cmsc-major"]);
  });
});

describe("auditedPrograms", () => {
  it("loads the chosen programs, then Gen Ed and the university rules", async () => {
    expect(ids(await auditedPrograms(["math-major-applied", "cmsc-major", "honors-aces"]))).toEqual([
      "math-major-applied",
      "cmsc-major",
      "honors-aces",
      "gen-ed",
      "university",
    ]);
  });
});

describe("studentDegrees", () => {
  const shape = (degrees: Awaited<ReturnType<typeof studentDegrees>>) =>
    degrees.map((d) => d.programs.map((p) => `${p.program.id}:${p.kind}:${p.status}`));
  const picked = ["math-major-applied", "cmsc-major", "honors-aces"];

  it("puts every program in one degree for a double major", async () => {
    expect(shape(await studentDegrees(picked, "double-major"))).toEqual([
      ["math-major-applied:major:planned", "cmsc-major:major:planned", "honors-aces:special:planned"],
    ]);
  });

  it("gives each major its own degree for a double degree; other programs go with the first", async () => {
    expect(shape(await studentDegrees(picked, "double-degree"))).toEqual([
      ["math-major-applied:major:planned", "honors-aces:special:planned"],
      ["cmsc-major:major:planned"],
    ]);
  });

  it("uses one degree with a single major, whatever the mode says", async () => {
    expect(shape(await studentDegrees(["cmsc-major", "honors-aces"], "double-degree"))).toHaveLength(1);
  });
});

describe("degreeModeOf", () => {
  it("is a double major by default with two majors, the stored choice when set, and null with one major", () => {
    expect(degreeModeOf(["math-major-applied", "cmsc-major"], undefined)).toBe("double-major");
    expect(degreeModeOf(["math-major-applied", "cmsc-major"], "double-degree")).toBe("double-degree");
    expect(degreeModeOf(["cmsc-major", "honors-aces"], "double-degree")).toBeNull();
  });
});

// cmsc-major's course set (course-sets.generated.ts) includes MATH140/141, CMSC131/132; the math
// majors' sets include MATH140/141/240/241. With the CMNS batch-1 majors now in the registry, both
// plans below clear NOTICE_OVERLAP_THRESHOLD against several majors at once (they all need
// MATH140/141), so these tests assert the full ranked (share descending, ties in registry order)
// and MAX_NOTICE_CANDIDATES-capped candidate lists, not just the one major each plan was chosen for.
const CS_LEANING_PLAN = ["MATH140", "MATH141", "CMSC131", "CMSC132"];
const MATH_LEANING_PLAN = ["MATH140", "MATH141", "MATH240", "MATH241"];

describe("noticeCandidates", () => {
  it("passes chosen majors as declared, in order, and other majors as undeclared", async () => {
    const c = await noticeCandidates(["math-major-applied"], CS_LEANING_PLAN);
    expect(c.map((x) => [x.program.id, x.declared])).toEqual([
      ["math-major-applied", true],
      // Undeclared majors, ranked by share of the plan's 4 courses they list: cmsc-major 4/4,
      // aosc-major 3/4, then a 2/4 tie broken by registry order (astr, bsci-genb, bchm).
      ["cmsc-major", false],
      ["aosc-major", false],
      ["astr-major-astrophysics", false],
      ["bsci-major-genb", false],
      ["bchm-major", false],
    ]);
  });

  it("never offers another track of a chosen major (that isn't a double major)", async () => {
    expect((await noticeCandidates(["math-major-applied", "cmsc-major"], CS_LEANING_PLAN)).map((x) => x.program.id)).toEqual([
      "math-major-applied",
      "cmsc-major",
      // Undeclared, cmsc-major itself excluded now that it's chosen: aosc-major 3/4, then the 2/4
      // tie (astr, bsci-genb, bchm) in registry order.
      "aosc-major",
      "astr-major-astrophysics",
      "bsci-major-genb",
      "bchm-major",
    ]);
  });

  it("offers one track of an unchosen major, the default", async () => {
    // Every remaining major lists MATH240 and MATH241 except the two Biological Sciences and
    // Biochemistry majors sampled here (no MATH241 or MATH240 respectively), so it's a 4/4 tie
    // (astr, aosc, math-major-traditional -- registry order) then a 3/4 tie (bsci-genb, bchm).
    expect((await noticeCandidates(["cmsc-major"], MATH_LEANING_PLAN)).map((x) => x.program.id)).toEqual([
      "cmsc-major",
      "astr-major-astrophysics",
      "aosc-major",
      "math-major-traditional",
      "bsci-major-genb",
      "bchm-major",
    ]);
  });

  it("only majors take part: a chosen special program is never a double major", async () => {
    expect((await noticeCandidates(["cmsc-major", "honors-aces"], MATH_LEANING_PLAN)).map((x) => x.program.id)).toEqual([
      "cmsc-major",
      "astr-major-astrophysics",
      "aosc-major",
      "math-major-traditional",
      "bsci-major-genb",
      "bchm-major",
    ]);
  });

  it("never offers Gen Ed or the university rules", async () => {
    expect((await noticeCandidates([])).map((x) => x.program.id)).toEqual([]);
  });

  it("drops an undeclared major the plan barely overlaps with, without loading it", async () => {
    // Neither course appears in math-major-traditional's course set (CMSC330/351 are cmsc-major's
    // own advanced requirements), so it never clears the overlap threshold and is filtered out
    // before noticeCandidates would load it.
    expect((await noticeCandidates(["cmsc-major"], ["CMSC330", "CMSC351"])).map((x) => x.program.id)).toEqual(["cmsc-major"]);
  });

  it("defaults to no plan courses, so an undeclared major is never offered with nothing to compare", async () => {
    expect((await noticeCandidates(["cmsc-major"])).map((x) => x.program.id)).toEqual(["cmsc-major"]);
  });
});

// Synthetic majors, standing in for the ~100-major registry the real cap has to hold up against
// (only 3 majors exist today, too few to exercise MAX_NOTICE_CANDIDATES on their own).
const major = (id: string): ProgramOption =>
  ({ id, name: id, kind: "major", college: "CMNS", catalogYear: "2026-27", verified: false, sources: {}, load: async () => ({ id, name: id, requirements: [] }) }) as ProgramOption;

describe("rankNoticeCandidates", () => {
  it("keeps only majors clearing the overlap threshold, best overlap first", () => {
    // The share is of the PLAN's courses, not the major's: "high" matches both plan courses,
    // "low" only one, "none" matches neither and is dropped.
    const options = [major("low"), major("high"), major("none")];
    const courseSets = { high: ["A", "B"], low: ["A", "C", "D"], none: ["X", "Y"] };
    const ranked = rankNoticeCandidates(options, ["A", "B"], courseSets);
    expect(ranked.map((o) => o.id)).toEqual(["high", "low"]);
  });

  it("caps the result at MAX_NOTICE_CANDIDATES even when more majors clear the threshold", () => {
    const options = Array.from({ length: MAX_NOTICE_CANDIDATES + 3 }, (_, i) => major(`m${i}`));
    const courseSets = Object.fromEntries(options.map((o) => [o.id, ["A"]]));
    const ranked = rankNoticeCandidates(options, ["A"], courseSets);
    expect(ranked.length).toBe(MAX_NOTICE_CANDIDATES);
  });

  it("never offers a major with no course set on record", () => {
    expect(rankNoticeCandidates([major("unknown")], ["A"], {})).toEqual([]);
  });

  it("offers nothing when the plan has no courses (nothing to compare)", () => {
    expect(rankNoticeCandidates([major("m")], [], { m: ["A"] })).toEqual([]);
  });

  it("NOTICE_OVERLAP_THRESHOLD is a fraction between 0 and 1", () => {
    expect(NOTICE_OVERLAP_THRESHOLD).toBeGreaterThan(0);
    expect(NOTICE_OVERLAP_THRESHOLD).toBeLessThanOrEqual(1);
  });
});

describe("programsLabel", () => {
  it("names the chosen programs briefly", () => {
    expect(programsLabel(["math-major-applied", "cmsc-major"])).toBe("Math (Applied) + Computer Science");
    expect(programsLabel(["honors-aces"])).toBe("Advanced Cybersecurity Experience for Students (ACES)");
  });

  it("names a picked minor or special program even with no major chosen", () => {
    expect(programsLabel(["honors-aces"])).not.toBe("No program chosen");
    expect(programsLabel(["dept-honors-engl"])).toBe("Departmental Honors: English");
  });

  it("says 'No program chosen' only when nothing is picked", () => {
    expect(programsLabel([])).toBe("No program chosen");
  });
});
