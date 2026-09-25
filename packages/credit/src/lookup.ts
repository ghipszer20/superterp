// Look up what an exam score earns at UMD.

import { AP_EXAMS } from "./ap-2023-2026.ts";
import { IB_EXAMS } from "./ib-2023-2026.ts";
import { CreditError, type ApExam, type ChartRow, type CreditAward, type IbExam, type IbLevel } from "./types.ts";

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

function findApExam(name: string): ApExam {
  const key = normalizeName(name);
  const exam = AP_EXAMS.find((e) => [e.name, ...e.aliases].some((n) => normalizeName(n) === key));
  if (!exam) throw new CreditError(`UMD's AP chart doesn't list an exam called "${name}"`);
  return exam;
}

export function apExamNames(): string[] {
  return AP_EXAMS.map((e) => e.name);
}

/** What an AP score earns (exams taken May 2023 – May 2026). No credit gives an award with no parts. */
export function creditForAp(exam: string, score: number): CreditAward {
  checkScore(score, 5, "AP");
  const found = findApExam(exam);
  return award(
    { program: "AP", exam: found.name, score, source: `AP ${found.name} (${score})`, notes: found.notes ?? [] },
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
