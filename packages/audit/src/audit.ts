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

export type Requirement =
  /** One course from a short list (usually just one), e.g. "CMSC351". */
  | { kind: "course"; id: string; name: string; options: string[] }
  /** N courses, or N credits, matching a filter, e.g. "12 credits of 400-level CMSC". */
  | { kind: "choose"; id: string; name: string; count?: number; credits?: number; from: CourseFilter };

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

function eligible(req: Requirement, courseId: string): boolean {
  if (req.kind === "course") return req.options.includes(courseId);
  return matchesFilter(req.from, courseId);
}

/** How much a requirement needs: courses, or credits for credit requirements. */
function need(req: Requirement): number {
  return req.kind === "course" ? 1 : (req.credits ?? req.count ?? 0);
}

/**
 * Integer program (ADR 0001):
 *   x[c,r] = 1 when course c counts toward requirement r (eligible pairs only)
 *   y[r]   = 1 when requirement r is satisfied
 *   each course counts toward at most one requirement;
 *   each requirement takes at most what it needs, and is satisfied only with enough;
 *   maximize satisfied requirements first, then total progress.
 */
export async function auditProgram(program: Program, courses: StudentCourse[]): Promise<AuditResult> {
  const reqs = program.requirements;
  // weight: what one course contributes (1 course, or its credits for credit requirements).
  const pairs: { c: number; r: number; name: string; weight: number }[] = [];
  courses.forEach((course, c) =>
    reqs.forEach((req, r) => {
      if (eligible(req, course.id)) {
        const weight = req.kind === "choose" && req.credits ? course.credits : 1;
        pairs.push({ c, r, name: `x_${c}_${r}`, weight });
      }
    }),
  );
  const sum = (ps: typeof pairs) => ps.map((p) => `${p.weight} ${p.name}`).join(" + ");

  const lines: string[] = [];
  const objective = [...reqs.map((_, r) => `1000 y_${r}`), ...pairs.map((p) => `1 ${p.name}`)];
  lines.push("Maximize", ` obj: ${objective.join(" + ") || "0 y_0"}`, "Subject To");
  courses.forEach((_, c) => {
    const vars = pairs.filter((p) => p.c === c).map((p) => p.name);
    if (vars.length > 1) lines.push(` once_${c}: ${vars.join(" + ")} <= 1`);
  });
  reqs.forEach((req, r) => {
    const mine = pairs.filter((p) => p.r === r);
    const n = need(req);
    if (mine.length > 0) {
      // A credit requirement may overshoot by less than one course (e.g. 4 credits toward the last 3).
      const slack = Math.max(0, ...mine.map((p) => p.weight)) - 1;
      lines.push(` cap_${r}: ${sum(mine)} <= ${n + slack}`);
      lines.push(` sat_${r}: ${sum(mine)} - ${n} y_${r} >= 0`);
    } else {
      lines.push(` sat_${r}: y_${r} <= 0`);
    }
  });
  lines.push("Binary", ` ${[...reqs.map((_, r) => `y_${r}`), ...pairs.map((p) => p.name)].join(" ")}`, "End");

  const highs = await getSolver();
  const solution = highs.solve(lines.join("\n"), { output_flag: false });
  if (solution.Status !== "Optimal") throw new Error(`Audit solver ended with status ${solution.Status}`);
  const chosen = (name: string) => (solution.Columns[name]?.Primal ?? 0) > 0.5;

  const used = new Set<number>();
  const requirements = reqs.map((req, r): RequirementResult => {
    const assigned = pairs.filter((p) => p.r === r && chosen(p.name));
    assigned.forEach((p) => used.add(p.c));
    const n = need(req);
    const progress = assigned.reduce((t, p) => t + p.weight, 0);
    return {
      id: req.id,
      name: req.name,
      status: progress >= n ? "satisfied" : progress > 0 ? "partial" : "missing",
      assigned: assigned.map((p) => courses[p.c]!.id),
    };
  });
  return { requirements, unused: courses.filter((_, c) => !used.has(c)).map((c) => c.id) };
}
