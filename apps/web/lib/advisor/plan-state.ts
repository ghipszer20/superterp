// The student's Plan as the Advisor tab stores it on this device: programs, terms with
// course-level entries (never sections, so the schedule builder can sync by course only), and the
// prior-credit form inputs (derived credit is recomputed, never stored).

import { defaultTerms, parseTerm, sortTerms } from "./terms";

export type PlannedCourse = {
  id: string;
  /** Overrides the catalog's credits, e.g. for a variable-credit course. */
  credits?: number;
  status?: "planned" | "completed";
  grade?: string;
};

export type PlanTermState = { name: string; courses: PlannedCourse[] };

export type ApInput = { key: string; exam: string; score: number };
export type IbInput = { key: string; exam: string; level: "SL" | "HL"; score: number };
export type DualInput = {
  key: string;
  institution: string;
  course: string;
  credits: number;
  /** The UMD course it transfers as, e.g. "MATH140"; ignored when `elective` is set. */
  umd: string;
  /** Transfers as elective credit (no UMD course). */
  elective: boolean;
};

export type PriorInputs = {
  ap: ApInput[];
  ib: IbInput[];
  dual: DualInput[];
  /** The course picked for an award that offers a choice, keyed by the award's source label. */
  choices: Record<string, string>;
};

export type AdvisorPlan = {
  v: 1;
  /** Chosen program ids (majors), in the order chosen. */
  programs: string[];
  catalogYear: string;
  startTerm: string;
  terms: PlanTermState[];
  prior: PriorInputs;
  /** Cumulative UMD GPA, for the CS gateway check. */
  gpa?: number;
};

export type PlanAction =
  | { type: "setup"; programs: string[]; catalogYear: string; startTerm: string }
  | { type: "add-course"; term: string; id: string; credits?: number }
  | { type: "remove-course"; term: string; id: string }
  | { type: "move-course"; id: string; from: string; to: string; index?: number }
  | { type: "add-term"; name: string }
  | { type: "remove-term"; name: string }
  /** Course-level sync from the schedule builder's Active Schedule. */
  | { type: "set-term-courses"; term: string; ids: string[] }
  | { type: "set-prior"; prior: PriorInputs }
  | { type: "set-gpa"; gpa: number | undefined };

export const emptyPrior = (): PriorInputs => ({ ap: [], ib: [], dual: [], choices: {} });

export function newPlan(setup: { programs: string[]; catalogYear: string; startTerm: string }): AdvisorPlan {
  return {
    v: 1,
    programs: setup.programs,
    catalogYear: setup.catalogYear,
    startTerm: setup.startTerm,
    terms: defaultTerms(setup.startTerm).map((name) => ({ name, courses: [] })),
    prior: emptyPrior(),
  };
}

export const termCourseIds = (plan: AdvisorPlan, term: string) => plan.terms.find((t) => t.name === term)?.courses.map((c) => c.id) ?? [];

const normalizeId = (id: string) => id.replace(/\s+/g, "").toUpperCase();
const isMain = (name: string) => {
  const season = parseTerm(name)?.season;
  return season === "Fall" || season === "Spring";
};

function mapTerm(plan: AdvisorPlan, name: string, f: (t: PlanTermState) => PlanTermState): AdvisorPlan {
  return { ...plan, terms: plan.terms.map((t) => (t.name === name ? f(t) : t)) };
}

/** Moves the whole plan to a new start term, keeping each course's place in the fall/spring sequence. */
function restart(plan: AdvisorPlan, startTerm: string): AdvisorPlan {
  const main: PlannedCourse[][] = [];
  for (const term of plan.terms) {
    if (isMain(term.name) || main.length === 0) main.push([...term.courses]);
    // A winter or summer term's courses join the term before it.
    else main[main.length - 1]!.push(...term.courses.filter((c) => !main[main.length - 1]!.some((x) => x.id === c.id)));
  }
  const names = defaultTerms(startTerm, Math.max(8, main.length));
  return { ...plan, startTerm, terms: names.map((name, i) => ({ name, courses: main[i] ?? [] })) };
}

export function planReducer(plan: AdvisorPlan, action: PlanAction): AdvisorPlan {
  switch (action.type) {
    case "setup": {
      const next = { ...plan, programs: action.programs, catalogYear: action.catalogYear };
      return action.startTerm === plan.startTerm || !parseTerm(action.startTerm) ? next : restart(next, action.startTerm);
    }
    case "add-course": {
      const id = normalizeId(action.id);
      const term = plan.terms.find((t) => t.name === action.term);
      if (!id || !term || term.courses.some((c) => c.id === id)) return plan;
      const course: PlannedCourse = action.credits === undefined ? { id } : { id, credits: action.credits };
      return mapTerm(plan, action.term, (t) => ({ ...t, courses: [...t.courses, course] }));
    }
    case "remove-course":
      return mapTerm(plan, action.term, (t) => ({ ...t, courses: t.courses.filter((c) => c.id !== action.id) }));
    case "move-course": {
      const from = plan.terms.find((t) => t.name === action.from);
      const to = plan.terms.find((t) => t.name === action.to);
      const course = from?.courses.find((c) => c.id === action.id);
      if (!from || !to || !course) return plan;
      if (from !== to && to.courses.some((c) => c.id === action.id)) return plan;
      const place = (list: PlannedCourse[]) => {
        const rest = list.filter((c) => c.id !== action.id);
        const at = action.index === undefined ? rest.length : Math.max(0, Math.min(action.index, rest.length));
        return [...rest.slice(0, at), course, ...rest.slice(at)];
      };
      return {
        ...plan,
        terms: plan.terms.map((t) => {
          if (t === to) return { ...t, courses: place(t.courses) };
          if (t === from) return { ...t, courses: t.courses.filter((c) => c.id !== action.id) };
          return t;
        }),
      };
    }
    case "add-term": {
      if (!parseTerm(action.name) || plan.terms.some((t) => t.name === action.name)) return plan;
      const names = sortTerms([...plan.terms.map((t) => t.name), action.name]);
      return { ...plan, terms: names.map((name) => plan.terms.find((t) => t.name === name) ?? { name, courses: [] }) };
    }
    case "remove-term":
      return { ...plan, terms: plan.terms.filter((t) => t.name !== action.name) };
    case "set-term-courses": {
      const ids = [...new Set(action.ids.map(normalizeId).filter(Boolean))];
      return mapTerm(plan, action.term, (t) => ({ ...t, courses: ids.map((id) => t.courses.find((c) => c.id === id) ?? { id }) }));
    }
    case "set-prior":
      return { ...plan, prior: action.prior };
    case "set-gpa": {
      const next = { ...plan };
      if (action.gpa === undefined) delete next.gpa;
      else next.gpa = action.gpa;
      return next;
    }
  }
}
