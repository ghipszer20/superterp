// The owner's review tool (PROJECT_MEMORY.md section 6, step 5): for each program,
// the catalog's requirement tables side by side with what SuperTerp will check,
// either drafted from those tables or encoded by hand. Plain data, so the web
// app can render it; the cache reader is the only I/O.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Program } from "@superterp/audit";
import { cmscMajor } from "@superterp/audit/programs/cmsc-major-2026-27.ts";
import { genEd, university } from "@superterp/audit/programs/gen-ed-2026-27.ts";
import { mathMajorTraditional } from "@superterp/audit/programs/math-major-2026-27.ts";
import { mathMajorApplied } from "@superterp/audit/programs/math-major-applied-2026-27.ts";
import { describeRequirement, type Described } from "./describe.ts";
import { draftPrograms, type Confidence } from "./draft.ts";
import type { CatalogRow, ProgramPage } from "./program.ts";
import { PROGRAM_INDEX_URL, parseProgramIndex, type ProgramKind, type ProgramLink } from "./programs-index.ts";
import { catalogHash, contentHash, itemKey, reviewStatus, type ReviewStatus, type Signoff } from "./signoff.ts";

export const CATALOG_YEAR = "2026-27";

export type ReviewRequirement = Described & { id: string; name: string; /** Indexes of the catalog rows it came from. */ rows: number[] };

export type ReviewItemView = { key: string; confidence: Confidence; reason: string; text: string; /** Indexes of the catalog rows it concerns. */ rows: number[] };

export type ReviewStats = { tables: number; converted: number; review: number; check: number; manual: number };

export type ReviewTable = {
  heading: string | null;
  rows: CatalogRow[];
  total: string | null;
  footnotes: { marker: string; text: string }[];
  /** Drafted from this table (empty for a hand-encoded program). */
  requirements: ReviewRequirement[];
  items: ReviewItemView[];
  stats: { converted: number; review: number };
};

export type ReviewProgram = {
  /** Catalog path under /undergraduate/, or "hand-encoded/<program id>". Sign-offs are keyed by it. */
  id: string;
  name: string;
  kind: ProgramKind;
  source: "draft" | "hand-encoded";
  /** The live catalog page. */
  url: string | null;
  catalogYear: string;
  tables: ReviewTable[];
  /** A hand-encoded program's requirements and review notes (not tied to table rows). */
  encoded?: { requirements: ReviewRequirement[]; items: ReviewItemView[] };
  catalogHash: string | null;
  requirementsHash: string;
  stats: ReviewStats;
};

export type ReviewIndexEntry = Pick<ReviewProgram, "id" | "name" | "kind" | "source" | "stats"> & { status: ReviewStatus; verifiedAt: string | null };

const CATALOG = "https://academiccatalog.umd.edu/undergraduate/";

/** A program's id: its catalog path under /undergraduate/ (last segments alone aren't unique, e.g. two data-science-minor pages). */
export const reviewId = (url: string): string => new URL(url).pathname.replace(/^\/undergraduate\//, "").replace(/^\/+|\/+$/g, "");

export type HandEncoded = { id: string; program: Program; kind: ProgramKind; catalogUrl: string | null };

const CMNS = `${CATALOG}colleges-schools/computer-mathematical-natural-sciences/`;
const hand = (program: Program, kind: ProgramKind, catalogUrl: string | null): HandEncoded => ({ id: `hand-encoded/${program.id}`, program, kind, catalogUrl });

/** The programs in packages/audit/programs/, with the catalog page each was encoded from. */
export const HAND_ENCODED: HandEncoded[] = [
  hand(cmscMajor, "major", `${CMNS}computer-science/computer-science-major/`),
  hand(mathMajorTraditional, "major", `${CMNS}mathematics/mathematics-major/`),
  hand(mathMajorApplied, "major", `${CMNS}mathematics/mathematics-major/`),
  hand(genEd, "other", null),
  hand(university, "other", null),
];

const describe = (r: Program["requirements"][number], rows: number[]): ReviewRequirement => ({ id: r.id, name: r.name, ...describeRequirement(r), rows });

function catalogTable(list: ProgramPage["lists"][number]): ReviewTable {
  return {
    heading: list.heading,
    rows: list.rows,
    total: list.total,
    footnotes: Object.entries(list.footnotes).map(([marker, text]) => ({ marker, text })),
    requirements: [],
    items: [],
    stats: { converted: 0, review: 0 },
  };
}

function tally(tables: ReviewTable[], extra: ReviewItemView[] = []): ReviewStats {
  const items = [...tables.flatMap((t) => t.items), ...extra];
  return {
    tables: tables.length,
    converted: tables.reduce((a, t) => a + t.stats.converted, 0),
    review: tables.reduce((a, t) => a + t.stats.review, 0),
    check: items.filter((i) => i.confidence === "check").length,
    manual: items.filter((i) => i.confidence === "manual").length,
  };
}

export function buildDraftedReview(link: ProgramLink, page: ProgramPage, catalogYear: string = CATALOG_YEAR): ReviewProgram {
  const id = reviewId(link.url);
  const drafts = draftPrograms(page, { id, catalogYear, source: `UMD Academic Catalog ${catalogYear}, ${link.name} (${link.url})` });
  const tables = page.lists.map((list, n): ReviewTable => {
    const d = drafts[n]!;
    return {
      ...catalogTable(list),
      requirements: d.program.requirements.map((r) => describe(r, d.sources[r.id] ?? [])),
      items: d.review.map((r) => ({ key: itemKey(r), confidence: r.confidence, reason: r.reason, text: r.text, rows: r.at })),
      stats: { converted: d.rows.converted, review: d.rows.review },
    };
  });
  return {
    id,
    name: link.name,
    kind: link.kind,
    source: "draft",
    url: link.url,
    catalogYear,
    tables,
    catalogHash: catalogHash(page.lists),
    requirementsHash: contentHash(drafts.map((d) => d.program.requirements)),
    stats: tally(tables),
  };
}

/** page: the catalog page the program was encoded from, if it has one and it's cached. */
export function buildHandEncodedReview(entry: HandEncoded, page: ProgramPage | null): ReviewProgram {
  const { program } = entry;
  const tables = page ? page.lists.map(catalogTable) : [];
  const items = (program.reviewNotes ?? []).map((text): ReviewItemView => ({ key: itemKey({ reason: "note", text }), confidence: "check", reason: "note", text, rows: [] }));
  return {
    id: entry.id,
    name: program.name,
    kind: entry.kind,
    source: "hand-encoded",
    url: entry.catalogUrl,
    catalogYear: program.catalogYear ?? CATALOG_YEAR,
    tables,
    encoded: { requirements: program.requirements.map((r) => describe(r, [])), items },
    catalogHash: page ? catalogHash(page.lists) : null,
    requirementsHash: contentHash(program.requirements),
    stats: tally(tables, items),
  };
}

export function indexEntry(review: ReviewProgram, signoff: Signoff | undefined): ReviewIndexEntry {
  const status = reviewStatus(signoff, review);
  return {
    id: review.id,
    name: review.name,
    kind: review.kind,
    source: review.source,
    stats: review.stats,
    status,
    verifiedAt: status === "verified" || status === "changed" ? signoff!.verifiedAt : null,
  };
}

/** Cache file name for a catalog URL; same naming as scripts/coverage.ts. */
export const cacheFileName = (url: string): string =>
  `${new URL(url).pathname.replace(/^\/+|\/+$/g, "").replace(/[^A-Za-z0-9-]+/g, "_") || "root"}.html`;

export type CatalogCache = { programs: ProgramLink[]; page: (url: string) => string | null };

/** The catalog cache that scripts/coverage.ts fills (.cache/catalog/); empty when it doesn't exist. */
export function readCatalogCache(dir: string): CatalogCache {
  const read = (url: string) => {
    const file = join(dir, cacheFileName(url));
    return existsSync(file) ? readFileSync(file, "utf8") : null;
  };
  const index = read(PROGRAM_INDEX_URL);
  return { programs: index ? parseProgramIndex(index) : [], page: read };
}
