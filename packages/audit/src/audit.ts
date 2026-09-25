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
  | { kind: "distribution"; id: string; name: string; count: number; minAreas: number; maxPerArea: number; areas: Area[] };

export type Program = { id: string; name: string; requirements: Requirement[] };

export type StudentCourse = { id: string; credits: number; status: "completed" | "planned" };

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
  return req.credits ?? req.count ?? 0;
}

/** One way a course could count toward a requirement (for distributions: through one area). */
type Pair = { c: number; r: number; area: number | null; name: string; weight: number };

function pairsFor(req: Requirement, r: number, course: StudentCourse, c: number): Pair[] {
  if (req.kind === "course") {
    return req.options.includes(course.id) ? [{ c, r, area: null, name: `x_${c}_${r}`, weight: 1 }] : [];
  }
  if (req.kind === "choose") {
    if (!matchesFilter(req.from, course.id)) return [];
    return [{ c, r, area: null, name: `x_${c}_${r}`, weight: req.credits ? course.credits : 1 }];
  }
  return req.areas.flatMap((area, a) =>
    area.courses.includes(course.id) ? [{ c, r, area: a, name: `x_${c}_${r}_${a}`, weight: 1 }] : [],
  );
}

const sum = (ps: Pair[]) => ps.map((p) => `${p.weight} ${p.name}`).join(" + ");

/**
 * Integer program (ADR 0001):
 *   x[c,r(,a)] = 1 when course c counts toward requirement r (through area a)
 *   y[r]       = 1 when requirement r is satisfied
 *   z[r,a]     = 1 when distribution r uses area a
 *   each course counts toward at most one requirement, once;
 *   each requirement takes at most what it needs, and is satisfied only with enough;
 *   distributions cap each area and need enough areas to be satisfied;
 *   maximize satisfied requirements first, then total progress.
 */
export async function auditProgram(program: Program, courses: StudentCourse[]): Promise<AuditResult> {
  const reqs = program.requirements;
  const pairs = courses.flatMap((course, c) => reqs.flatMap((req, r) => pairsFor(req, r, course, c)));
  const binaries = [...reqs.map((_, r) => `y_${r}`), ...pairs.map((p) => p.name)];
  const constraints: string[] = [];

  courses.forEach((_, c) => {
    const mine = pairs.filter((p) => p.c === c);
    if (mine.length > 1) constraints.push(` once_${c}: ${mine.map((p) => p.name).join(" + ")} <= 1`);
  });

  reqs.forEach((req, r) => {
    const mine = pairs.filter((p) => p.r === r);
    const n = need(req);
    if (mine.length === 0) {
      constraints.push(` sat_${r}: y_${r} <= 0`);
      return;
    }
    // A credit requirement may overshoot by less than one course (e.g. 4 credits toward the last 3).
    const slack = Math.max(0, ...mine.map((p) => p.weight)) - 1;
    constraints.push(` cap_${r}: ${sum(mine)} <= ${n + slack}`);
    constraints.push(` sat_${r}: ${sum(mine)} - ${n} y_${r} >= 0`);

    if (req.kind === "distribution") {
      const used: string[] = [];
      req.areas.forEach((_, a) => {
        const inArea = mine.filter((p) => p.area === a);
        if (inArea.length === 0) return;
        const z = `z_${r}_${a}`;
        binaries.push(z);
        used.push(z);
        constraints.push(` area_${r}_${a}: ${sum(inArea)} <= ${req.maxPerArea}`);
        constraints.push(` used_${r}_${a}: ${sum(inArea)} - ${z} >= 0`);
      });
      constraints.push(` areas_${r}: ${[...used, `- ${req.minAreas} y_${r}`].join(" + ").replace("+ -", "-")} >= 0`);
    }
  });

  const objective = [...reqs.map((_, r) => `1000 y_${r}`), ...pairs.map((p) => `1 ${p.name}`)].join(" + ");
  const model = ["Maximize", ` obj: ${objective || "0 y_0"}`, "Subject To", ...constraints, "Binary", ` ${binaries.join(" ")}`, "End"];

  const highs = await getSolver();
  const solution = highs.solve(model.join("\n"), { output_flag: false });
  if (solution.Status !== "Optimal") throw new Error(`Audit solver ended with status ${solution.Status}`);
  const chosen = (name: string) => (solution.Columns[name]?.Primal ?? 0) > 0.5;

  const used = new Set<number>();
  const requirements = reqs.map((req, r): RequirementResult => {
    const assigned = pairs.filter((p) => p.r === r && chosen(p.name));
    assigned.forEach((p) => used.add(p.c));
    const progress = assigned.reduce((t, p) => t + p.weight, 0);
    const satisfied = chosen(`y_${r}`) && progress >= need(req);
    return {
      id: req.id,
      name: req.name,
      status: satisfied ? "satisfied" : progress > 0 ? "partial" : "missing",
      assigned: assigned.map((p) => courses[p.c]!.id),
    };
  });
  return { requirements, unused: courses.filter((_, c) => !used.has(c)).map((c) => c.id) };
}
