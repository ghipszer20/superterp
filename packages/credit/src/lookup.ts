// Look up what an exam score earns at UMD.

import { AP_EXAMS } from "./ap-2023-2026.ts";
import { AP_EXAMS_OLDER } from "./ap-through-2022.ts";
import { IB_EXAMS } from "./ib-2023-2026.ts";
import { CreditError, type ApExam, type ChartRow, type CreditAward, type IbExam, type IbLevel } from "./types.ts";

// AP exams have been administered since 1956; a year before that can't be real. Used only to give
// the oldest chart's "check with UMD" note below, not as a claim that our older chart is verified
// that far back — see src/ap-through-2022.ts for what it actually covers and why.
const OLDEST_POSSIBLE_AP_YEAR = 1956;

/** Exams May 2023 – May 2026 (the current chart) unless `examYear` picks the older one. */
function apExamsFor(examYear: number | undefined): { exams: ApExam[]; note?: string } {
  if (examYear === undefined || examYear >= 2023) return { exams: AP_EXAMS };
  if (examYear >= OLDEST_POSSIBLE_AP_YEAR) return { exams: AP_EXAMS_OLDER };
  return {
    exams: AP_EXAMS_OLDER,
    note: `${examYear} is before AP exams existed; using UMD's oldest chart on file, but check with the registrar.`,
  };
}

/** Lowercase, "&" as "and", punctuation as spaces, and no leading "AP"/"IB". */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/^(ap|ib) /, "");
}

function checkScore(score: number, max: number, program: string): void {
  if (!Number.isInteger(score) || score < 1 || score > max) throw new CreditError(`${program} scores run 1–${max}, not ${score}`);
}

function award(base: Omit<CreditAward, "credits" | "parts" | "chartText">, row: ChartRow | undefined): CreditAward {
  return row
    ? { ...base, credits: row.credits, parts: row.parts, chartText: row.text }
    : { ...base, credits: 0, parts: [], chartText: "" };
}

function findApExam(name: string, exams: ApExam[]): ApExam {
  const key = normalizeName(name);
  const exam = exams.find((e) => [e.name, ...e.aliases].some((n) => normalizeName(n) === key));
  if (!exam) throw new CreditError(`UMD's AP chart doesn't list an exam called "${name}"`);
  return exam;
}

export function apExamNames(): string[] {
  return AP_EXAMS.map((e) => e.name);
}

/**
 * What an AP score earns. `examYear` picks the chart: 2023 or later (or omitted) uses the current
 * (May 2023 – May 2026) chart; earlier years use the older chart (src/ap-through-2022.ts). A year
 * before AP exams existed still uses that older chart, with a "check with UMD" note added.
 * No credit gives an award with no parts.
 */
export function creditForAp(exam: string, score: number, examYear?: number): CreditAward {
  checkScore(score, 5, "AP");
  const { exams, note } = apExamsFor(examYear);
  const found = findApExam(exam, exams);
  const notes = note ? [...(found.notes ?? []), note] : (found.notes ?? []);
  return award(
    { program: "AP", exam: found.name, score, source: `AP ${found.name} (${score})`, notes },
    found.rows.find((r) => r.scores.includes(score)),
  );
}

// A language's "(All Exam Types)" row covers its A, B and ab initio exams, e.g. "Spanish B".
const EXAM_TYPE = / (a literature|a language and literature|a|b|ab initio|all exam types)$/;

function findIbExam(name: string): IbExam {
  const key = normalizeName(name);
  const byName = IB_EXAMS.find((e) => [e.name, ...e.aliases].some((n) => normalizeName(n) === key));
  const language = key.replace(EXAM_TYPE, "");
  const exam = byName ?? IB_EXAMS.find((e) => e.allExamTypes && normalizeName(e.name) === language);
  if (!exam) throw new CreditError(`UMD's IB chart doesn't list an exam called "${name}"`);
  return exam;
}

export function ibExamNames(): string[] {
  return IB_EXAMS.map((e) => e.name);
}

/** What an IB score earns (exams taken November 2023 – May 2026). No credit gives an award with no parts. */
export function creditForIb(exam: string, level: IbLevel, score: number): CreditAward {
  checkScore(score, 7, "IB");
  const found = findIbExam(exam);
  return award(
    { program: "IB", exam: found.name, level, score, source: `IB ${found.name} ${level} (${score})`, notes: found.notes ?? [] },
    found.levels[level]?.find((r) => r.scores.includes(score)),
  );
}
