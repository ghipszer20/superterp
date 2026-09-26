// The Plan in this device's localStorage. Loading validates everything and drops what it can't
// read, so a corrupt or older save never breaks the page.

// TRACKS comes from "@superterp/tracks/list", which has no runtime @superterp/audit import (no
// HiGHS), so validating a saved track id here doesn't pull the solver into the main bundle.
import { TRACKS } from "@superterp/tracks/list";
import type { AdvisorPlan, ApInput, DualInput, IbInput, PlannedCourse, PlanTermState, PriorInputs } from "./plan-state";
import { parseTerm } from "./terms";

export const PLAN_STORAGE_KEY = "superterp-advisor-plan";

export const serializePlan = (plan: AdvisorPlan) => JSON.stringify(plan);

type Obj = Record<string, unknown>;
const isObj = (x: unknown): x is Obj => typeof x === "object" && x !== null && !Array.isArray(x);
const str = (x: unknown): x is string => typeof x === "string";
const num = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
const list = (x: unknown): unknown[] => (Array.isArray(x) ? x : []);
const COURSE = /^[A-Z]{4}\d{3}[A-Z]?$/;

function course(x: unknown): PlannedCourse | null {
  if (!isObj(x) || !str(x.id) || !COURSE.test(x.id)) return null;
  const out: PlannedCourse = { id: x.id };
  if (num(x.credits)) out.credits = x.credits;
  if (x.status === "planned" || x.status === "completed") out.status = x.status;
  if (str(x.grade)) out.grade = x.grade;
  return out;
}

function term(x: unknown): PlanTermState | null {
  if (!isObj(x) || !str(x.name) || !parseTerm(x.name)) return null;
  return { name: x.name, courses: list(x.courses).map(course).filter((c): c is PlannedCourse => c !== null) };
}

const score = (x: unknown, max: number): x is number => num(x) && Number.isInteger(x) && x >= 1 && x <= max;

function prior(x: unknown): PriorInputs {
  const p = isObj(x) ? x : {};
  const ap = list(p.ap).filter((a): a is ApInput => isObj(a) && str(a.key) && str(a.exam) && score(a.score, 5));
  const ib = list(p.ib).filter(
    (a): a is IbInput => isObj(a) && str(a.key) && str(a.exam) && (a.level === "SL" || a.level === "HL") && score(a.score, 7),
  );
  const dual = list(p.dual).filter(
    (a): a is DualInput =>
      isObj(a) && str(a.key) && str(a.institution) && str(a.course) && num(a.credits) && str(a.umd) && typeof a.elective === "boolean",
  );
  const choices: Record<string, string> = {};
  if (isObj(p.choices)) for (const [k, v] of Object.entries(p.choices)) if (str(v)) choices[k] = v;
  return { ap, ib, dual, choices };
}

const KNOWN_TRACK_IDS = new Set(TRACKS.map((t) => t.id));

/** Chosen track ids, unknown ones dropped; undefined when none are left. */
function tracks(x: unknown): string[] | undefined {
  const ids = [...new Set(list(x).filter((v): v is string => str(v) && KNOWN_TRACK_IDS.has(v)))];
  return ids.length ? ids : undefined;
}

/** Milestone id -> term name, a malformed term name dropped; undefined when none are left. */
function examTerms(x: unknown): Record<string, string> | undefined {
  if (!isObj(x)) return undefined;
  const out: Record<string, string> = {};
  for (const [milestone, term] of Object.entries(x)) if (str(term) && parseTerm(term)) out[milestone] = term;
  return Object.keys(out).length ? out : undefined;
}

/** Term name -> course id -> grade, a malformed term or course id dropped; undefined when none are left. */
function expectedGrades(x: unknown): Record<string, Record<string, string>> | undefined {
  if (!isObj(x)) return undefined;
  const out: Record<string, Record<string, string>> = {};
  for (const [term, grades] of Object.entries(x)) {
    if (!parseTerm(term) || !isObj(grades)) continue;
    const g: Record<string, string> = {};
    for (const [id, grade] of Object.entries(grades)) if (COURSE.test(id) && str(grade)) g[id] = grade;
    if (Object.keys(g).length) out[term] = g;
  }
  return Object.keys(out).length ? out : undefined;
}

export function parsePlan(raw: string | null): AdvisorPlan | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObj(data) || data.v !== 1 || !str(data.startTerm) || !parseTerm(data.startTerm) || !str(data.catalogYear)) return null;
  const terms = list(data.terms).map(term).filter((t): t is PlanTermState => t !== null);
  if (terms.length === 0) return null;
  const plan: AdvisorPlan = {
    v: 1,
    programs: list(data.programs).filter(str),
    catalogYear: data.catalogYear,
    startTerm: data.startTerm,
    terms,
    prior: prior(data.prior),
  };
  if (num(data.gpa)) plan.gpa = data.gpa;
  const t = tracks(data.tracks);
  if (t) plan.tracks = t;
  const et = examTerms(data.examTerms);
  if (et) plan.examTerms = et;
  const eg = expectedGrades(data.expectedGrades);
  if (eg) plan.expectedGrades = eg;
  return plan;
}
