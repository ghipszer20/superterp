import { describe, expect, it } from "vitest";
import { findProgram, loadProgram, PROGRAMS } from "../src/registry.ts";

describe("program registry", () => {
  it("lists the hand-encoded majors, Math's tracks sharing one major key", () => {
    const majors = PROGRAMS.filter((p) => p.kind === "major");
    expect(majors.map((p) => p.id)).toEqual([
      "astr-major-astrophysics",
      "astr-major-data-science",
      "astr-major-physical-science",
      "aosc-major",
      "bchm-major",
      "cmsc-major",
      "math-major-traditional",
      "math-major-applied",
    ]);
    expect(findProgram("math-major-applied")).toMatchObject({ major: "math", track: "Applied Mathematics", college: "CMNS" });
  });

  it("has unique ids", () => {
    expect(new Set(PROGRAMS.map((p) => p.id)).size).toBe(PROGRAMS.length);
  });

  it("includes the hand-drafted special programs", () => {
    expect(findProgram("honors-aces")).toMatchObject({ kind: "special", college: "UGST" });
  });

  it("loads unknown ids as undefined", async () => {
    expect(await loadProgram("nope")).toBeUndefined();
  });

  // Every entry's metadata matches the Program its loader returns, so the picker (which never
  // loads a Program) shows the same name, year and verified state the audit cites.
  it.each(PROGRAMS.map((p) => [p.id, p] as const))("%s: metadata matches its Program", async (_id, entry) => {
    const program = await entry.load();
    expect(program.id).toBe(entry.id);
    expect(program.name).toBe(entry.name);
    expect(program.catalogYear).toBe(entry.catalogYear);
    expect(program.verified === true).toBe(entry.verified);
    expect(program.source).toBeTruthy();
    expect(entry.sources.catalog ?? entry.sources.department).toMatch(/^https:\/\//);
  });
});
