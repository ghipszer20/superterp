// One course's grade distributions: course-wide (4-year plan's course detail)
// and per professor (schedule builder's section panel). Pure; the build script
// feeds it PlanetTerp /grades rows and the Schedule of Classes instructors.

import { GRADE_COLUMNS, summarizeGrades, type GradeColumn, type GradeLetter, type GradeRow } from "./planetterp.ts";

export type Distribution = {
  /** Students per grade column, A+ … F, W and Other (PlanetTerp's catch-all for P, I, etc.). */
  counts: Record<GradeColumn, number>;
  /** Share of all students (W and Other included) per letter group; 0 when there are no students. */
  shares: Record<GradeLetter, number>;
  /** Mean grade points over letter grades only (W and Other excluded); null if none. */
  averageGpa: number | null;
  /** Every student counted, W and Other included. */
  students: number;
  /** Testudo term ids covered, sorted, once each. */
  terms: string[];
};

export type NameReport = {
  /** PlanetTerp names re-keyed to the Schedule of Classes spelling. */
  renamed: { planetTerp: string; soc: string }[];
  /** SOC instructors with no PlanetTerp record; candidates share their last name. */
  unmatched: { soc: string; candidates: string[] }[];
};

export type CourseGrades = {
  course: string;
  overall: Distribution;
  /** Keyed by the SOC spelling when a PlanetTerp name matches an SOC instructor, else PlanetTerp's. */
  byProfessor: Record<string, Distribution>;
  terms: string[];
};

const zeroCounts = (): Record<GradeColumn, number> =>
  Object.fromEntries(GRADE_COLUMNS.map((c) => [c, 0])) as Record<GradeColumn, number>;

/** Builds a Distribution from summed counts (also used to expand the compact file format). */
export function distributionFromCounts(counts: Record<GradeColumn, number>, terms: string[]): Distribution {
  const s = summarizeGrades([{ course: "", professor: null, semester: "", section: "", counts }]);
  const shares = { ...s.distribution };
  for (const k of Object.keys(shares) as GradeLetter[]) shares[k] = s.total > 0 ? shares[k] / s.total : 0;
  return { counts: { ...counts }, shares, averageGpa: s.averageGpa, students: s.total, terms: [...terms] };
}

function distributionOf(rows: GradeRow[]): Distribution {
  const counts = zeroCounts();
  for (const row of rows) for (const c of GRADE_COLUMNS) counts[c] += row.counts[c];
  return distributionFromCounts(counts, [...new Set(rows.map((r) => r.semester))].sort());
}

// ---- professor names ----

export const nameTokens = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

export const isTba = (name: string) => /\bTBA\b/i.test(name) || name.trim() === "";

function sameName(a: string[], b: string[]): boolean {
  if (a.length === 0 || b.length === 0) return false;
  if (a.join(" ") === b.join(" ")) return true;
  return a[0] === b[0] && a.at(-1) === b.at(-1);
}

function matchNames(planetTerp: string[], soc: string[]): { rename: Map<string, string>; names: NameReport } {
  const rename = new Map<string, string>();
  const names: NameReport = { renamed: [], unmatched: [] };
  const ptTokens = planetTerp.map((n) => [n, nameTokens(n)] as const);
  for (const s of [...new Set(soc)]) {
    if (isTba(s)) continue;
    const st = nameTokens(s);
    const hits = ptTokens.filter(([n, t]) => !rename.has(n) && sameName(t, st)).map(([n]) => n);
    if (hits.length === 0) {
      const last = st.at(-1);
      names.unmatched.push({ soc: s, candidates: ptTokens.filter(([, t]) => t.at(-1) === last).map(([n]) => n) });
      continue;
    }
    for (const n of hits) {
      rename.set(n, s);
      if (n !== s) names.renamed.push({ planetTerp: n, soc: s });
    }
  }
  return { rename, names };
}

// ---- summary ----

/**
 * Summarizes one course's PlanetTerp grade rows. Rows with no professor count
 * toward `overall` only. `socInstructors` (the course's instructors in the
 * Schedule of Classes) decides the professor keys and the name report.
 */
export function summarizeCourseGrades(
  course: string,
  rows: GradeRow[],
  socInstructors: string[] = [],
): CourseGrades & { names: NameReport } {
  const planetTerp = [...new Set(rows.flatMap((r) => (r.professor === null ? [] : [r.professor])))];
  const { rename, names } = matchNames(planetTerp, socInstructors);
  const groups = new Map<string, GradeRow[]>();
  for (const row of rows) {
    if (row.professor === null) continue;
    const key = rename.get(row.professor) ?? row.professor;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const overall = distributionOf(rows);
  const byProfessor: Record<string, Distribution> = {};
  for (const [name, group] of groups) byProfessor[name] = distributionOf(group);
  return { course, overall, byProfessor, terms: overall.terms, names };
}
