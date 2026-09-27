// Per-program Sharing Limits (Program.maxSharedWith) and Degree groups (unique credits per
// Degree), enforced inside the one integer program across every program at once.

import { describe, expect, it } from "vitest";
import { auditPrograms, auditStudent, type AuditResult, type Program, type StudentCourse } from "../src/audit.ts";

const took = (...ids: string[]): StudentCourse[] => ids.map((id) => ({ id, credits: 3, status: "completed" }));

const choose = (id: string, count: number, departments: string[]): Program["requirements"][number] => ({
  kind: "choose",
  id,
  name: id,
  count,
  from: { departments, minNumber: 300, maxNumber: 499 },
});

const major: Program = { id: "econ-major", name: "Econ Major", requirements: [choose("upper", 4, ["ECON"])] };
const minor = (limit?: Program["maxSharedWith"]): Program => ({
  id: "econ-minor",
  name: "Econ Minor",
  requirements: [choose("upper", 3, ["ECON"])],
  ...(limit ? { maxSharedWith: limit } : {}),
});
const genEd: Program = {
  id: "gen-ed",
  name: "Gen Ed",
  layer: "gen-ed",
  requirements: [{ kind: "choose", id: "ds", name: "DS", count: 3, from: { departments: ["ECON"], minNumber: 300, maxNumber: 499 } }],
};

const done = (r: AuditResult | undefined) => r!.requirements.every((q) => q.status === "satisfied");

describe("maxSharedWith", () => {
  const five = took("ECON301", "ECON302", "ECON303", "ECON304", "ECON305");

  it("shares freely without a limit", async () => {
    const [, m] = await auditPrograms([major, minor()], five);
    expect(m!.requirements[0]!.status).toBe("satisfied");
  });

  it("limits how many courses a minor shares with every other program", async () => {
    // 5 courses: major 4 + minor 3 needs at least 2 shared, so with at most 1 only one can finish.
    const [maj, min] = await auditPrograms([major, minor([{ courses: 1 }])], five);
    expect([maj, min].filter(done)).toHaveLength(1);
    const shared = min!.requirements[0]!.assigned.filter((id) => maj!.requirements[0]!.assigned.includes(id));
    expect(shared.length).toBeLessThanOrEqual(1);
  });

  it("is satisfied once the minor has enough courses of its own", async () => {
    const [, min] = await auditPrograms([major, minor([{ courses: 1 }])], took("ECON301", "ECON302", "ECON303", "ECON304", "ECON305", "ECON306"));
    expect(min!.requirements[0]!.status).toBe("satisfied");
  });

  it("limits shared credits", async () => {
    // 6 credits (2 courses) may be shared: 5 courses cover major 4 + minor 3 with 2 shared.
    const [, min] = await auditPrograms([major, minor([{ credits: 6 }])], five);
    expect(min!.requirements[0]!.status).toBe("satisfied");
    const tight = await auditPrograms([major, minor([{ credits: 5 }])], five);
    expect(tight.filter(done)).toHaveLength(1);
  });

  it("applies only to the named programs", async () => {
    const other: Program = { id: "other", name: "Other", requirements: [choose("upper", 3, ["ECON"])] };
    // The minor may share nothing with "other", but freely with the major.
    const [, min, oth] = await auditPrograms([major, minor([{ programs: ["other"], courses: 0 }]), other], [...five, ...took("ECON306")]);
    expect(min!.requirements[0]!.status).toBe("satisfied");
    expect(oth!.requirements[0]!.status).toBe("satisfied");
    const overlap = min!.requirements[0]!.assigned.filter((id) => oth!.requirements[0]!.assigned.includes(id));
    expect(overlap).toEqual([]);
  });

  it("never counts sharing with a Requirement Layer (Gen Ed, university, college)", async () => {
    const [, min, ge] = await auditPrograms([major, minor([{ courses: 0 }]), genEd], took("ECON301", "ECON302", "ECON303", "ECON304", "ECON305", "ECON306", "ECON307"));
    expect(min!.requirements[0]!.status).toBe("satisfied");
    expect(ge!.requirements[0]!.status).toBe("satisfied");
  });
});

describe("degree groups", () => {
  const a: Program = { id: "a", name: "A", requirements: [choose("upper", 4, ["ECON", "GVPT"])] };
  const b: Program = { id: "b", name: "B", requirements: [choose("upper", 4, ["ECON", "GVPT"])] };

  it("prefers an assignment giving each degree its minimum unique credits", async () => {
    const courses = took("ECON301", "ECON302", "ECON303", "ECON304", "GVPT301", "GVPT302", "GVPT303", "GVPT304");
    const { results, uniqueCredits } = await auditStudent([a, b], courses, { degrees: [[0], [1]], minUniqueCredits: 12 });
    expect(results.every((r) => r.requirements.every((q) => q.status === "satisfied"))).toBe(true);
    expect(uniqueCredits).toEqual([12, 12]);
  });

  it("reports unique credits short when the courses can't give both degrees enough", async () => {
    const courses = took("ECON301", "ECON302", "ECON303", "ECON304", "GVPT301", "GVPT302");
    const { uniqueCredits } = await auditStudent([a, b], courses, { degrees: [[0], [1]], minUniqueCredits: 12 });
    expect(Math.min(...uniqueCredits!)).toBeLessThan(12);
    expect(uniqueCredits![0]! + uniqueCredits![1]!).toBeLessThanOrEqual(18);
  });

  it("counts a Requirement Layer's use as neither degree's", async () => {
    const courses = took("ECON301", "ECON302", "ECON303", "ECON304", "GVPT301", "GVPT302", "GVPT303", "GVPT304");
    const { uniqueCredits } = await auditStudent([a, b, genEd], courses, { degrees: [[0], [1]], minUniqueCredits: 12 });
    expect(uniqueCredits).toEqual([12, 12]);
  });
});
