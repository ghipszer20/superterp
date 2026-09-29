// The advising export's data, built once from what the Advisor already computed and rendered as
// .xlsx (xlsx.ts) or PDF (pdf.ts). Pure: no solver runs here.

import type { Analysis } from "../analysis";
import type { AdvisorPlan } from "../plan-state";
import type { PriorCreditResult } from "../prior-credit";
import { sortTerms } from "../terms";

export const DISCLAIMER = "Unofficial, not affiliated with UMD, verify with your advisor";
export const FOOTER = "Unofficial. Not affiliated with the University of Maryland. Verify with your advisor and UMD's official degree audit.";

export type Category = "major" | "minor" | "gen-ed" | "other" | "elective";
export const CATEGORY_LABELS: Record<Category, string> = {
  major: "Major",
  minor: "Minor",
  "gen-ed": "Gen Ed",
  other: "Other program",
  elective: "Elective (not assigned)",
};
/** One pastel per category (hex, no #). */
export const CATEGORY_COLORS: Record<Category, string> = {
  major: "CFE2FF",
  minor: "D9F2D0",
  "gen-ed": "FFF0BF",
  other: "E8DAF5",
  elective: "EDEDED",
};
const RANK: Category[] = ["major", "minor", "gen-ed", "other", "elective"];

type IssueLike = { kind: string; severity: string; term: string; course?: string; message: string };
type CatalogLike = ReadonlyMap<string, { title: string; credits: { min: number } }>;

export type TakeoutInput = {
  plan: Pick<AdvisorPlan, "programs" | "catalogYear" | "terms"> & Partial<Pick<AdvisorPlan, "tracks" | "degreeMode">>;
  analysis: Pick<Analysis, "audits" | "gateway" | "tracks"> & Partial<Pick<Analysis, "degrees" | "notices">>;
  issues: IssueLike[];
  prior: Pick<PriorCreditResult, "entries" | "totalCredits">;
  catalog?: CatalogLike;
  /** Program id -> kind, from the registry; anything not listed and not a Requirement Layer counts as "other". */
  programKinds?: Record<string, string>;
  today: Date;
  hideGrades?: boolean;
};

export type TakeoutCourse = { id: string; title: string; credits: number; grade: string; category: Category };
export type FlagItem = { term?: string; course?: string; severity: string; message: string };

const FLAG_GROUPS: { title: string; kinds: string[] }[] = [
  { title: "Prerequisites and order", kinds: ["prerequisite", "corequisite"] },
  { title: "Credit load and caps", kinds: ["credit-load", "light-load"] },
  { title: "Repeats", kinds: ["repeat"] },
  { title: "Courses SuperTerp could not find or terms to verify", kinds: ["unknown-course"] },
  { title: "Graduate-course permission", kinds: ["grad-permission", "grad-restricted", "grad-only-cap", "grad-double-count-cap", "grad-double-count-grade"] },
];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const layerOf = (p: unknown) => (p as { layer?: string }).layer;

export function buildTakeout(input: TakeoutInput) {
  const { plan, analysis, catalog, hideGrades } = input;
  const audits = analysis.audits;

  // Category: the best-ranked kind of program that assigned the course.
  const best = new Map<string, Category>();
  for (const a of audits) {
    const layer = layerOf(a.program);
    const kind = input.programKinds?.[a.program.id];
    const cat: Category = layer === "gen-ed" ? "gen-ed" : layer ? "other" : kind === "major" ? "major" : kind === "minor" ? "minor" : "other";
    for (const r of a.requirements) {
      for (const id of r.result.assigned) {
        const prev = best.get(id);
        if (!prev || RANK.indexOf(cat) < RANK.indexOf(prev)) best.set(id, cat);
      }
    }
  }

  const order = sortTerms(plan.terms.map((t) => t.name));
  const terms = order.map((name) => {
    const t = plan.terms.find((x) => x.name === name)!;
    const courses: TakeoutCourse[] = t.courses.map((c) => ({
      id: c.id,
      title: catalog?.get(c.id)?.title ?? "",
      credits: c.credits ?? catalog?.get(c.id)?.credits.min ?? 0,
      grade: hideGrades ? "" : (c.grade ?? ""),
      category: best.get(c.id) ?? "elective",
    }));
    return { name, courses, credits: courses.reduce((s, c) => s + c.credits, 0) };
  });

  const cite = (p: { name: string; catalogYear?: string; source?: string }) =>
    `${p.name}, ${p.catalogYear ?? "unknown year"} catalog${p.source ? ` (${p.source})` : ""}`;
  const auditOut = audits.map((a) => ({
    program: a.program.name,
    citation: cite(a.program),
    requirements: a.requirements.map((r) => ({
      name: r.requirement.name,
      status: r.result.status,
      citation: cite(a.program),
      assigned: r.result.assigned,
      need: r.result.status === "satisfied" ? "" : (r.gap?.need ?? ""),
      satisfiedBy: r.result.status === "satisfied" ? [] : (r.gap?.suggestions ?? []),
    })),
  }));

  const flags: { title: string; items: FlagItem[] }[] = [];
  for (const g of FLAG_GROUPS) {
    const items = input.issues
      .filter((i) => g.kinds.includes(i.kind))
      .map((i): FlagItem => ({ severity: i.severity, term: i.term, ...(i.course ? { course: i.course } : {}), message: i.message }));
    if (items.length) flags.push({ title: g.title, items });
  }
  const gw = analysis.gateway;
  if (gw && gw.overall !== "eligible") {
    flags.push({ title: "CS gateway", items: [{ severity: "warning", message: `Gateway status: ${gw.overall === "ineligible" ? "not eligible" : "not yet met"} (GPA ${gw.gpa}).` }] });
  }
  // Degree checks only: the double-major / dual-degree notices are suggestions, not checks.
  const degreeIssues = analysis.degrees?.issues ?? [];
  const dual = degreeIssues.filter((i) => i.kind === "double-degree-credits" || i.kind === "double-degree-unique");
  if (dual.length) flags.push({ title: "Double degree (150 credits, 18 unique)", items: dual.map((i) => ({ severity: i.severity, message: i.message })) });
  const decl = degreeIssues.filter((i) => i.kind === "declaration-deadline");
  if (decl.length) flags.push({ title: "Declaration deadline", items: decl.map((i) => ({ severity: i.severity, message: i.message })) });

  return {
    header: {
      programs: audits.filter((a) => !layerOf(a.program)).map((a) => a.program.name),
      catalogYear: plan.catalogYear,
      expectedGraduation: order[order.length - 1] ?? "",
      date: iso(input.today),
      disclaimer: DISCLAIMER,
      gradesHidden: !!hideGrades,
    },
    terms,
    audit: auditOut,
    flags,
    prior: {
      totalCredits: input.prior.totalCredits,
      entries: input.prior.entries.map((e) => ({ source: e.source, status: e.status, credits: e.credits, notes: e.notes })),
    },
    tracks: analysis.tracks.map((t) => ({
      name: t.track.name,
      requirements: t.requirements.map((r) => ({ name: r.requirement.name, status: r.result.status, satisfiedBy: r.result.status === "satisfied" ? [] : (r.gap?.suggestions ?? []) })),
    })),
  };
}

export type Takeout = ReturnType<typeof buildTakeout>;

/** The download's file name, dated by the takeout's header date. */
export const exportFileName = (kind: "xlsx" | "pdf", date: string) =>
  kind === "xlsx" ? `superterp-plan-${date}.xlsx` : `superterp-advising-takeout-${date}.pdf`;
