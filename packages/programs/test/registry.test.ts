// Invariants the registry (src/registry.generated.ts, built from every program file's own
// ProgramMeta -- see scripts/build-registry.ts) must hold whatever programs it lists, so this file
// never needs rewriting when a program batch adds, removes or reorders entries. Staleness and
// migration-content checks live in registry-generated.test.ts and registry-migration.test.ts.
import { describe, expect, it } from "vitest";
import { findProgram, loadProgram, majorKey, PROGRAMS } from "../src/registry.ts";

const KIND_RANK: Record<string, number> = { major: 0, minor: 1, certificate: 2, special: 3 };

describe("program registry", () => {
  it("is not empty", () => {
    expect(PROGRAMS.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    expect(new Set(PROGRAMS.map((p) => p.id)).size).toBe(PROGRAMS.length);
  });

  it("lists majors, then minors, then certificates, then special programs", () => {
    const ranks = PROGRAMS.map((p) => KIND_RANK[p.kind]!);
    const sorted = [...ranks].sort((a, b) => a - b);
    expect(ranks).toEqual(sorted);
  });

  it("has at least one major and one special program", () => {
    expect(PROGRAMS.some((p) => p.kind === "major")).toBe(true);
    expect(PROGRAMS.some((p) => p.kind === "special")).toBe(true);
  });

  it("keeps every major's tracks together, sharing one major key", () => {
    const majors = PROGRAMS.filter((p) => p.kind === "major");
    const seen = new Set<string>();
    let previousKey: string | null = null;
    for (const p of majors) {
      const key = majorKey(p);
      if (key !== previousKey) {
        expect(seen.has(key)).toBe(false); // a majorKey's tracks must be contiguous
        seen.add(key);
        previousKey = key;
      }
    }
  });

  it("findProgram finds every entry by id", () => {
    for (const entry of PROGRAMS) {
      expect(findProgram(entry.id)).toBe(entry);
    }
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
