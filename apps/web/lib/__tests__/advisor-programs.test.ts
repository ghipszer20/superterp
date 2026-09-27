import { describe, expect, it } from "vitest";
import { auditedPrograms, collegeOf, degreeModeOf, studentDegrees, noticeCandidates, PROGRAM_OPTIONS, programsLabel, toggleProgram } from "../advisor/programs";

const ids = (list: { id: string }[]) => list.map((p) => p.id);

describe("program options", () => {
  it("offers every registered program, majors first, all unverified for now", () => {
    expect(ids(PROGRAM_OPTIONS.filter((o) => o.kind === "major"))).toEqual(["cmsc-major", "math-major-traditional", "math-major-applied"]);
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

describe("noticeCandidates", () => {
  it("passes chosen majors as declared, in order, and other majors as undeclared", async () => {
    const c = await noticeCandidates(["math-major-applied"]);
    expect(c.map((x) => [x.program.id, x.declared])).toEqual([
      ["math-major-applied", true],
      ["cmsc-major", false],
    ]);
  });

  it("never offers another track of a chosen major (that isn't a double major)", async () => {
    expect((await noticeCandidates(["math-major-applied", "cmsc-major"])).map((x) => x.program.id)).toEqual(["math-major-applied", "cmsc-major"]);
  });

  it("offers one track of an unchosen major, the default", async () => {
    expect((await noticeCandidates(["cmsc-major"])).map((x) => x.program.id)).toEqual(["cmsc-major", "math-major-traditional"]);
  });

  it("only majors take part: a chosen special program is never a double major", async () => {
    expect((await noticeCandidates(["cmsc-major", "honors-aces"])).map((x) => x.program.id)).toEqual(["cmsc-major", "math-major-traditional"]);
  });

  it("never offers Gen Ed or the university rules", async () => {
    expect((await noticeCandidates([])).map((x) => x.program.id)).toEqual([]);
  });
});

describe("programsLabel", () => {
  it("names the chosen programs briefly", () => {
    expect(programsLabel(["math-major-applied", "cmsc-major"])).toBe("Math (Applied) + Computer Science");
    expect(programsLabel(["honors-aces"])).toBe("Advanced Cybersecurity Experience for Students (ACES)");
    expect(programsLabel([])).toBe("No major chosen");
  });
});
