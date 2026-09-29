import { describe, expect, it } from "vitest";
import { buildTakeout, CATEGORY_COLORS, DISCLAIMER } from "./takeout";

const req = (id: string, name: string, status: "satisfied" | "partial" | "missing", assigned: string[], gap: { need: string; suggestions: string[] } | null = null) => ({
  requirement: { id, name },
  result: { id, name, status, assigned },
  gap,
});
const audit = (id: string, name: string, layer: string | undefined, requirements: ReturnType<typeof req>[]) => ({
  program: { id, name, catalogYear: "2026-27", source: "UMD catalog", ...(layer ? { layer } : {}) },
  requirements,
});

const plan = {
  programs: ["cmsc-major", "math-minor"],
  catalogYear: "2026-27",
  startTerm: "Fall 2026",
  terms: [
    { name: "Fall 2026", courses: [{ id: "CMSC131", grade: "A" }, { id: "MATH140" }, { id: "ENGL101" }, { id: "ART100", credits: 2 }] },
    { name: "Spring 2027", courses: [{ id: "CMSC132", grade: "B+" }] },
  ],
  tracks: ["pre-med"],
};
const analysis = {
  audits: [
    audit("cmsc-major", "Computer Science", undefined, [
      req("core", "Core", "partial", ["CMSC131", "CMSC132"], { need: "1 more course", suggestions: ["CMSC216"] }),
      req("cap", "Capstone", "missing", [], { need: "a capstone", suggestions: ["CMSC435", "CMSC436"] }),
    ]),
    audit("math-minor", "Math Minor", undefined, [req("calc", "Calculus", "satisfied", ["MATH140", "CMSC131"])]),
    audit("gen-ed", "General Education", "gen-ed", [req("w", "Writing", "satisfied", ["ENGL101"])]),
  ],
  notices: [
    { kind: "double-major", severity: "info", programs: ["a", "b"], declared: false, message: "Suggestion: add a second major." },
    { kind: "dual-degree", severity: "info", programs: ["a", "b"], eligible: true, totalCredits: 150, creditsShort: 0, uniqueCredits: {}, message: "Suggestion: dual degree." },
  ],
  degrees: {
    issues: [
      { kind: "double-degree-credits", severity: "error", programs: ["a", "b"], message: "Needs 150 credits." },
      { kind: "double-degree-unique", severity: "error", programs: ["a", "b"], message: "Needs 18 unique." },
      { kind: "declaration-deadline", severity: "warning", programs: ["b"], message: "Declare by Spring 2026." },
    ],
  },
  gateway: { overall: "not-yet", gpa: "unknown", rule: {}, courses: [], attemptLimitViolated: false },
  tracks: [{ track: { id: "pre-med", name: "Pre-Med" }, requirements: [req("bio", "Biology", "missing", [])] }],
};
const issues = [
  { kind: "prerequisite", severity: "error", term: "Fall 2026", course: "CMSC132", message: "Needs CMSC131 first." },
  { kind: "credit-load", severity: "warning", term: "Fall 2026", message: "19 credits." },
  { kind: "grad-permission", severity: "confirm", term: "Spring 2027", course: "CMSC732", message: "Needs permission." },
];
const prior = { totalCredits: 4, entries: [{ source: "AP Calculus BC (5)", status: "counted", credits: 4, notes: [] }] };
const catalog = new Map([
  ["CMSC131", { title: "OOP I", credits: { min: 4 } }],
  ["MATH140", { title: "Calc I", credits: { min: 4 } }],
]);
const build = (hideGrades = false) =>
  buildTakeout({
    plan,
    analysis,
    issues,
    prior,
    catalog,
    programKinds: { "cmsc-major": "major", "math-minor": "minor" },
    today: new Date(2026, 8, 29),
    hideGrades,
  } as never);

describe("buildTakeout", () => {
  it("fills the header", () => {
    const h = build().header;
    expect(h.programs).toEqual(["Computer Science", "Math Minor"]);
    expect(h.catalogYear).toBe("2026-27");
    expect(h.expectedGraduation).toBe("Spring 2027");
    expect(h.date).toBe("2026-09-29");
    expect(h.disclaimer).toBe(DISCLAIMER);
    expect(DISCLAIMER).toMatch(/not affiliated with UMD/i);
  });
  it("categorizes each course by the program it was assigned to (major beats minor beats Gen Ed)", () => {
    const [t1, t2] = build().terms;
    const cat = (id: string) => t1!.courses.find((c) => c.id === id)!.category;
    expect(cat("CMSC131")).toBe("major");
    expect(cat("MATH140")).toBe("minor");
    expect(cat("ENGL101")).toBe("gen-ed");
    expect(cat("ART100")).toBe("elective");
    expect(t2!.courses[0]!.category).toBe("major");
    expect(Object.keys(CATEGORY_COLORS).sort()).toEqual(["elective", "gen-ed", "major", "minor", "other"]);
  });
  it("carries credits (override, then catalog), titles and grades; hideGrades blanks grades", () => {
    const c = build().terms[0]!.courses;
    expect(c.find((x) => x.id === "ART100")!.credits).toBe(2);
    expect(c.find((x) => x.id === "CMSC131")).toMatchObject({ credits: 4, title: "OOP I", grade: "A" });
    expect(build(true).terms.flatMap((t) => t.courses).every((x) => x.grade === "")).toBe(true);
  });
  it("cites the catalog rule and lists satisfying courses for missing and partial items", () => {
    const a = build().audit;
    expect(a).toHaveLength(3);
    const core = a[0]!.requirements[0]!;
    expect(core.status).toBe("partial");
    expect(core.citation).toBe("Computer Science, 2026-27 catalog (UMD catalog)");
    expect(core.satisfiedBy).toEqual(["CMSC216"]);
    expect(a[1]!.requirements[0]!.satisfiedBy).toEqual([]);
  });
  it("groups flags", () => {
    const f = build().flags;
    const titles = f.map((g) => g.title);
    expect(titles).toEqual(expect.arrayContaining(["Prerequisites and order", "Credit load and caps", "Graduate-course permission", "CS gateway", "Declaration deadline"]));
    expect(f.find((g) => g.title === "Prerequisites and order")!.items[0]).toMatchObject({ term: "Fall 2026", course: "CMSC132" });
  });
  it("takes double-degree and declaration flags from degree issues, never from suggestion notices", () => {
    const f = build().flags;
    expect(f.find((g) => g.title === "Double degree (150 credits, 18 unique)")!.items.map((i) => i.message)).toEqual(["Needs 150 credits.", "Needs 18 unique."]);
    expect(f.find((g) => g.title === "Declaration deadline")!.items.map((i) => i.message)).toEqual(["Declare by Spring 2026."]);
    expect(JSON.stringify(f)).not.toMatch(/Suggestion/);
    const none = buildTakeout({ plan, analysis: { ...analysis, degrees: null }, issues: [], prior, today: new Date(2026, 8, 29) } as never).flags.map((g) => g.title);
    expect(none).not.toContain("Declaration deadline");
    expect(none).not.toContain("Double degree (150 credits, 18 unique)");
  });
  it("includes prior credit and tracks", () => {
    const t = build();
    expect(t.prior.entries[0]).toMatchObject({ source: "AP Calculus BC (5)", credits: 4 });
    expect(t.prior.totalCredits).toBe(4);
    expect(t.tracks[0]).toMatchObject({ name: "Pre-Med" });
    expect(t.tracks[0]!.requirements[0]).toMatchObject({ name: "Biology", status: "missing" });
  });
});
