// Every track definition is well formed: it audits, it points at its sources, and every UMD
// course it names exists (test/fixtures/umd-courses.json, taken from UMD's Schedule of Classes).

import { readFileSync } from "node:fs";
import { auditProgram, type Requirement, type SetMember } from "@superterp/audit";
import { describe, expect, it } from "vitest";
import { HPAO_DISCLAIMER, TRACKS, trackProgram, type Track } from "../src/index.ts";
import known from "./fixtures/umd-courses.json" with { type: "json" };

const SOURCES = readFileSync(new URL("../SOURCES.md", import.meta.url), "utf8");
const KNOWN = new Set(Object.keys(known.courses));

/** Every specific course id a requirement names (filters are checked separately). */
function courseIds(req: Requirement): string[] {
  const member = (m: SetMember) => (typeof m === "string" ? [m] : (m.from.courses ?? []));
  switch (req.kind) {
    case "course":
      return req.options;
    case "choose":
      return req.from.courses ?? [];
    case "sets":
      return req.options.flat().flatMap(member);
    case "distribution":
      return req.areas.flatMap((a) => a.courses);
    default:
      return [];
  }
}

/** Filter parts written as one course number, e.g. CHEM232 with any suffix: those must exist too. */
function numberedCourses(req: Requirement): string[] {
  if (req.kind !== "sets") return [];
  return req.options.flat().flatMap((m) => {
    if (typeof m === "string") return [];
    const { departments, minNumber, maxNumber } = m.from;
    return departments?.length === 1 && minNumber !== undefined && minNumber === maxNumber ? [`${departments[0]}${minNumber}`] : [];
  });
}

const EXPECTED = [
  "pre-med",
  "pre-dental",
  "pre-pa",
  "pre-vet",
  "pre-pharmacy",
  "pre-optometry",
  "pre-podiatry",
  "pre-pt",
  "pre-ot",
  "pre-nursing",
  "pre-law",
];

describe("track definitions", () => {
  it("include every track the owner asked for", () => {
    expect(TRACKS.map((t) => t.id).sort()).toEqual([...EXPECTED].sort());
  });

  describe.each(TRACKS.map((t): [string, Track] => [t.id, t]))("%s", (_, track) => {
    it("is unverified, with review notes and sources recorded in SOURCES.md", () => {
      expect(track.verified).toBe(false);
      expect(track.reviewNotes.length).toBeGreaterThan(0);
      expect(track.sources.length).toBeGreaterThan(0);
      for (const url of track.sources) expect(SOURCES, url).toContain(url);
    });

    it("carries a disclaimer to confirm with advisors and each target school", () => {
      expect(track.disclaimer).toMatch(/^Confirm with .+ and each target school\.$/);
    });

    it("has unique category ids, each with a requirement or a name", () => {
      const ids = track.categories.map((c) => c.requirement?.id ?? c.id);
      expect(ids.every(Boolean)).toBe(true);
      expect(new Set(ids).size).toBe(ids.length);
      for (const c of track.categories) {
        if (!c.requirement) expect(c.name, c.id).toBeTruthy();
        expect(c.source.length).toBeGreaterThan(0);
      }
    });

    it("names only UMD courses that exist", () => {
      for (const c of track.categories) {
        if (!c.requirement) continue;
        for (const id of [...courseIds(c.requirement), ...numberedCourses(c.requirement)]) {
          expect(KNOWN.has(id), `${c.requirement.id}: ${id}`).toBe(true);
        }
      }
      for (const s of track.suggestedCourses ?? []) for (const id of s.courses) expect(KNOWN.has(id), id).toBe(true);
    });

    it("points exam-content categories at an exam milestone", () => {
      const exams = new Set(track.milestones.filter((m) => m.kind === "exam").map((m) => m.id));
      for (const c of track.categories) if (c.examContent) expect(exams.has(c.examContent), c.examContent).toBe(true);
    });

    it("has milestones with unique ids and valid dates", () => {
      expect(track.milestones.length).toBeGreaterThan(0);
      const ids = track.milestones.map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const m of track.milestones) {
        for (const d of [m.start, m.due]) {
          if (!d) continue;
          expect(d.month, m.id).toBeGreaterThanOrEqual(1);
          expect(d.month, m.id).toBeLessThanOrEqual(12);
          if (d.day !== undefined) expect(d.day).toBeGreaterThanOrEqual(1);
          if (d.day !== undefined) expect(d.day).toBeLessThanOrEqual(31);
        }
        expect(m.detail.length).toBeGreaterThan(0);
      }
    });

    it("builds a program the audit can check", async () => {
      const program = trackProgram(track);
      expect(program.verified).toBe(false);
      expect(program.requirements.length).toBe(track.categories.filter((c) => c.requirement).length);
      const result = await auditProgram(program, []);
      expect(result.requirements.every((r) => r.status === "missing")).toBe(true);
    });
  });

  it("use HPAO's disclaimer and minimum grade of C on every HPAO track except the nursing pathway", () => {
    for (const id of ["pre-med", "pre-dental", "pre-pa", "pre-pharmacy", "pre-optometry", "pre-podiatry", "pre-pt", "pre-ot"]) {
      const track = TRACKS.find((t) => t.id === id)!;
      expect(track.disclaimer, id).toBe(HPAO_DISCLAIMER);
      expect(track.minGrade, id).toBe("C");
    }
    const nursing = TRACKS.find((t) => t.id === "pre-nursing")!;
    expect(nursing.disclaimer).toBe(HPAO_DISCLAIMER);
    expect(nursing.minGrade).toBe("C-");
    expect(nursing.examCreditAccepted).toBe(true);
    expect(nursing.entry).toEqual({ kind: "transfer", afterYears: 2 });
  });

  it("give pre-law no required courses, but suggested courses, the LSAT and GPA protection", () => {
    const law = TRACKS.find((t) => t.id === "pre-law")!;
    expect(law.categories).toEqual([]);
    expect(law.gpaProtection).toBe(true);
    const suggested = law.suggestedCourses!.flatMap((s) => s.courses);
    expect(suggested).toContain("PHIL170");
    expect(suggested).toContain("ENGL392");
    expect(law.milestones.find((m) => m.id === "lsat")?.kind).toBe("exam");
  });

  it("put the MCAT's science on the MCAT, but not DAT-free physics and biochemistry on the DAT", () => {
    const med = TRACKS.find((t) => t.id === "pre-med")!;
    const onMcat = med.categories.filter((c) => c.examContent === "mcat").map((c) => c.requirement!.id);
    expect(onMcat).toEqual(expect.arrayContaining(["gen-chem-1", "gen-chem-2", "organic-chem", "biochem", "intro-bio", "physics"]));
    const dental = TRACKS.find((t) => t.id === "pre-dental")!;
    const onDat = dental.categories.filter((c) => c.examContent === "dat").map((c) => c.requirement!.id);
    expect(onDat).not.toContain("physics");
    expect(onDat).not.toContain("biochem");
    expect(onDat).toContain("organic-chem");
  });
});
