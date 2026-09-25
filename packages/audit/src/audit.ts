// Degree audit. Vocabulary follows CONTEXT.md: a Program has Requirements;
// an Audit makes an Assignment of the student's courses to Requirements and
// reports Gaps and Overshoot. Assignment is solved as an optimization
// problem (docs/adr/0001-audit-assigns-courses-by-optimization.md).

import loadHighs from "highs";

/** Which courses can count toward a requirement. */
export type CourseFilter = {
  courses?: string[];
  departments?: string[];
  /** Inclusive course-number bounds, e.g. 400–499 for "400-level". */
  minNumber?: number;
  maxNumber?: number;
  exclude?: string[];
};

export type Area = { name: string; courses: string[] };

export type Requirement =
  /** One course from a short list (usually just one), e.g. "CMSC351". */
  | { kind: "course"; id: string; name: string; options: string[] }
  /** N courses, or N credits, matching a filter, e.g. "12 credits of 400-level CMSC". */
  | { kind: "choose"; id: string; name: string; count?: number; credits?: number; from: CourseFilter }
  /** N courses spread over areas, e.g. "five courses from at least three areas, at most three per area". */
  | { kind: "distribution"; id: string; name: string; count: number; minAreas: number; maxPerArea: number; areas: Area[] }
  /** N credits in a number range, all from ONE department, e.g. CS's "12 credits of 300–400 level courses from one discipline outside CMSC". */
  | {
      kind: "concentration";
      id: string;
      name: string;
      credits: number;
      minNumber: number;
      maxNumber: number;
      excludeDepartments?: string[];
    }
  /** Every course of one set, e.g. Math's depth sequence "MATH410 & MATH411 or MATH403 & MATH404". */
  | { kind: "sets"; id: string; name: string; options: string[][] };

export type Program = {
  id: string;
  name: string;
  requirements: Requirement[];
  /** Lowest grade a completed course needs to count toward this program, e.g. "C-". */
  minGrade?: string;
  /** Catalog edition these rules come from, e.g. "2026-27". */
  catalogYear?: string;
  /** Where the rules came from. */
  source?: string;
  /** True only after the owner has reviewed and signed off (a Verified Program). */
  verified?: boolean;
  /** Interpretations the owner must check before verifying. */
  reviewNotes?: string[];
};

export type StudentCourse = { id: string; credits: number; status: "completed" | "planned"; grade?: string };

// UMD letter grades, lowest to highest.
const GRADE_ORDER = ["F", "D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"];
const gradeRank = (g: string) => GRADE_ORDER.indexOf(g.trim().toUpperCase());

function meetsGrade(course: StudentCourse, minGrade: string | undefined): boolean {
  if (!minGrade || course.status !== "completed" || !course.grade) return true;
  const rank = gradeRank(course.grade);
  // Non-letter grades (P, S, W…) don't meet a letter-grade minimum.
  return rank >= 0 && rank >= gradeRank(minGrade);
}

export type RequirementResult = {
  id: string;
  name: string;
  status: "satisfied" | "partial" | "missing";
  /** Courses the Assignment put toward this requirement. */
  assigned: string[];
};

export type AuditResult = {
  requirements: RequirementResult[];
  /** Courses no requirement needs (Overshoot). */
  unused: string[];
};

let solver: ReturnType<typeof loadHighs> | null = null;
const getSolver = () => (solver ??= loadHighs());

const COURSE_ID = /^([A-Z]{4})(\d{3})[A-Z]?$/;

export function matchesFilter(filter: CourseFilter, courseId: string): boolean {
  if (filter.exclude?.includes(courseId)) return false;
  if (filter.courses?.includes(courseId)) return true;
  const m = COURSE_ID.exec(courseId);
  if (!m) return false;
  if (!filter.departments) return false;
  if (!filter.departments.includes(m[1]!)) return false;
  const n = Number(m[2]);
  return n >= (filter.minNumber ?? 0) && n <= (filter.maxNumber ?? 999);
}

/** How much a requirement needs: courses, or credits for credit requirements. */
function need(req: Requirement): number {
  if (req.kind === "course") return 1;
  if (req.kind === "distribution") return req.count;
  if (req.kind === "concentration") return req.credits;
  if (req.kind === "sets") return Math.min(...req.options.map((o) => o.length));
  return req.credits ?? req.count ?? 0;
}

/**
 * One way a course could count toward a requirement: through an area (distributions),
 * as part of one option (sets; `area` holds the option index), or within a
 * department (concentrations).
 */
type Pair = {
  p: number;
  c: number;
  r: number;
  area: number | null;
  department: string | null;
  name: string;
  weight: number;
};

function pairsFor(req: Requirement, p: number, r: number, course: StudentCourse, c: number): Pair[] {
  const base = `x_${p}_${c}_${r}`;
  const plain = (weight: number): Pair[] => [{ p, c, r, area: null, department: null, name: base, weight }];
  if (req.kind === "course") return req.options.includes(course.id) ? plain(1) : [];
  if (req.kind === "choose") return matchesFilter(req.from, course.id) ? plain(req.credits ? course.credits : 1) : [];
  if (req.kind === "concentration") {
    const m = COURSE_ID.exec(course.id);
    if (!m || req.excludeDepartments?.includes(m[1]!)) return [];
    const n = Number(m[2]);
    if (n < req.minNumber || n > req.maxNumber) return [];
    return [{ p, c, r, area: null, department: m[1]!, name: base, weight: course.credits }];
  }
  if (req.kind === "sets") {
    return req.options.flatMap((option, k) =>
      option.includes(course.id) ? [{ p, c, r, area: k, department: null, name: `${base}_${k}`, weight: 1 }] : [],
    );
  }
  return req.areas.flatMap((area, a) =>
    area.courses.includes(course.id)
      ? [{ p, c, r, area: a, department: null, name: `${base}_${a}`, weight: 1 }]
      : [],
  );
}

const sum = (ps: Pair[]) => ps.map((q) => `${q.weight} ${q.name}`).join(" + ");

export type AuditOptions = {
  /** How many courses may count toward more than one program (a Sharing Limit). Unlimited if omitted. */
  maxSharedCourses?: number;
};

/**
 * Integer program (ADR 0001), over every program at once:
 *   x[p,c,r(,a)] = 1 when course c counts toward requirement r of program p (through area a)
 *   y[p,r]       = 1 when requirement r of program p is satisfied
 *   z[p,r,a]     = 1 when distribution r of program p uses area a
 *   s[c]         = 1 when course c counts toward more than one program
 *   within a program each course counts once; across programs, sharing is limited;
 *   each requirement takes at most what it needs, and is satisfied only with enough;
 *   distributions cap each area and need enough areas to be satisfied;
 *   maximize satisfied requirements first, then total progress.
 */
export async function auditPrograms(
  programs: Program[],
  courses: StudentCourse[],
  options: AuditOptions = {},
): Promise<AuditResult[]> {
  const pairs = programs.flatMap((program, p) =>
    courses.flatMap((course, c) =>
      meetsGrade(course, program.minGrade) ? program.requirements.flatMap((req, r) => pairsFor(req, p, r, course, c)) : [],
    ),
  );
  const y = (p: number, r: number) => `y_${p}_${r}`;
  const binaries = [...programs.flatMap((pr, p) => pr.requirements.map((_, r) => y(p, r))), ...pairs.map((q) => q.name)];
  const constraints: string[] = [];

  // Within one program, a course counts toward at most one requirement.
  programs.forEach((_, p) =>
    courses.forEach((_, c) => {
      const mine = pairs.filter((q) => q.p === p && q.c === c);
      if (mine.length > 1) constraints.push(` once_${p}_${c}: ${mine.map((q) => q.name).join(" + ")} <= 1`);
    }),
  );

  // Across programs: a course used by k programs needs k-1 "shares"; shares are limited.
  if (options.maxSharedCourses !== undefined && programs.length > 1) {
    const shares: string[] = [];
    courses.forEach((_, c) => {
      const uses = pairs.filter((q) => q.c === c);
      if (new Set(uses.map((q) => q.p)).size < 2) return;
      const s = `s_${c}`;
      binaries.push(s);
      shares.push(s);
      constraints.push(` share_${c}: ${uses.map((q) => q.name).join(" + ")} - ${programs.length - 1} ${s} <= 1`);
    });
    if (shares.length > 0) constraints.push(` shared: ${shares.join(" + ")} <= ${options.maxSharedCourses}`);
  }

  programs.forEach((program, p) =>
    program.requirements.forEach((req, r) => {
      const mine = pairs.filter((q) => q.p === p && q.r === r);
      const n = need(req);
      const id = `${p}_${r}`;
      if (mine.length === 0) {
        constraints.push(` sat_${id}: ${y(p, r)} <= 0`);
        return;
      }
      if (req.kind === "sets") {
        // o[k]: option k is the one being pursued; w[k]: option k is complete.
        const picked: string[] = [];
        const complete: string[] = [];
        req.options.forEach((option, k) => {
          const inOption = mine.filter((q) => q.area === k);
          if (inOption.length === 0) return;
          const o = `o_${id}_${k}`;
          const w = `w_${id}_${k}`;
          binaries.push(o, w);
          picked.push(o);
          complete.push(w);
          inOption.forEach((q, i) => constraints.push(` pick_${id}_${k}_${i}: ${q.name} - ${o} <= 0`));
          constraints.push(` done_${id}_${k}: ${sum(inOption)} - ${option.length} ${w} >= 0`);
          constraints.push(` doneonly_${id}_${k}: ${w} - ${o} <= 0`);
        });
        constraints.push(` onepick_${id}: ${picked.join(" + ")} <= 1`);
        constraints.push(` sat_${id}: ${y(p, r)} - ${complete.join(" - ")} <= 0`);
        return;
      }
      // A credit requirement may overshoot by less than one course (e.g. 4 credits toward the last 3).
      const slack = Math.max(0, ...mine.map((q) => q.weight)) - 1;
      constraints.push(` cap_${id}: ${sum(mine)} <= ${n + slack}`);
      constraints.push(` sat_${id}: ${sum(mine)} - ${n} ${y(p, r)} >= 0`);

      if (req.kind === "distribution") {
        const used: string[] = [];
        req.areas.forEach((_, a) => {
          const inArea = mine.filter((q) => q.area === a);
          if (inArea.length === 0) return;
          const z = `z_${id}_${a}`;
          binaries.push(z);
          used.push(z);
          constraints.push(` area_${id}_${a}: ${sum(inArea)} <= ${req.maxPerArea}`);
          constraints.push(` used_${id}_${a}: ${sum(inArea)} - ${z} >= 0`);
        });
        constraints.push(` areas_${id}: ${[...used, `- ${req.minAreas} ${y(p, r)}`].join(" + ").replace("+ -", "-")} >= 0`);
      }

      if (req.kind === "concentration") {
        // Pick one department; only its courses count.
        const departments = [...new Set(mine.map((q) => q.department!))];
        const d = (dept: string) => `d_${id}_${dept}`;
        departments.forEach((dept) => {
          binaries.push(d(dept));
          mine
            .filter((q) => q.department === dept)
            .forEach((q, i) => constraints.push(` dept_${id}_${dept}_${i}: ${q.name} - ${d(dept)} <= 0`));
        });
        constraints.push(` onedept_${id}: ${departments.map(d).join(" + ")} <= 1`);
      }
    }),
  );

  const objective = [
    ...programs.flatMap((pr, p) => pr.requirements.map((_, r) => `1000 ${y(p, r)}`)),
    ...pairs.map((q) => `1 ${q.name}`),
  ].join(" + ");
  const model = ["Maximize", ` obj: ${objective || "0 y_0_0"}`, "Subject To", ...constraints, "Binary", ` ${binaries.join(" ")}`, "End"];

  const highs = await getSolver();
  const solution = highs.solve(model.join("\n"), { output_flag: false });
  if (solution.Status !== "Optimal") throw new Error(`Audit solver ended with status ${solution.Status}`);
  const chosen = (name: string) => (solution.Columns[name]?.Primal ?? 0) > 0.5;

  return programs.map((program, p) => {
    const used = new Set<number>();
    const requirements = program.requirements.map((req, r): RequirementResult => {
      const assigned = pairs.filter((q) => q.p === p && q.r === r && chosen(q.name));
      assigned.forEach((q) => used.add(q.c));
      const progress = assigned.reduce((t, q) => t + q.weight, 0);
      const satisfied = chosen(y(p, r)) && progress >= need(req);
      return {
        id: req.id,
        name: req.name,
        status: satisfied ? "satisfied" : progress > 0 ? "partial" : "missing",
        assigned: assigned.map((q) => courses[q.c]!.id),
      };
    });
    return { requirements, unused: courses.filter((_, c) => !used.has(c)).map((c) => c.id) };
  });
}

export async function auditProgram(program: Program, courses: StudentCourse[]): Promise<AuditResult> {
  const [result] = await auditPrograms([program], courses);
  return result!;
}
