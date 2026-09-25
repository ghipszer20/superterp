// Drafts every cached program page into audit Programs and reports how much the
// deterministic drafter converts.
//
//   node scripts/draft-all.ts            (from packages/catalog)
//
// Reads only the cache that scripts/coverage.ts fills (.cache/catalog/, git-
// ignored); run that first. Writes drafts-report.md. The drafts themselves are
// not written: they're regenerated from the catalog, and only verified programs
// get committed.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { draftPrograms } from "../src/draft.ts";
import { parseProgramPage } from "../src/program.ts";
import { PROGRAM_INDEX_URL, parseProgramIndex } from "../src/programs-index.ts";
import { renderDraftsReport, summarizeDrafts, type DraftPageResult } from "./drafts-report.ts";

const CACHE = new URL("../.cache/catalog/", import.meta.url);
const REPORT = new URL("../drafts-report.md", import.meta.url);
const CATALOG_YEAR = "2026-27";

// Same naming as coverage.ts.
const cacheFile = (url: string) => {
  const slug = new URL(url).pathname.replace(/^\/+|\/+$/g, "").replace(/[^A-Za-z0-9-]+/g, "_") || "root";
  return new URL(`${slug}.html`, CACHE);
};

function cached(url: string): string {
  const file = cacheFile(url);
  if (!existsSync(file)) throw new Error(`not cached: ${url} (run scripts/coverage.ts first)`);
  return readFileSync(file, "utf8");
}

/** A readable program id from the catalog URL's last segment, e.g. "computer-science-major". */
const idFrom = (url: string) => new URL(url).pathname.split("/").filter(Boolean).at(-1)!;

const programs = parseProgramIndex(cached(PROGRAM_INDEX_URL));
const results: DraftPageResult[] = programs.map((program) => {
  try {
    const drafts = draftPrograms(parseProgramPage(cached(program.url)), {
      id: idFrom(program.url),
      catalogYear: CATALOG_YEAR,
      source: `UMD Academic Catalog ${CATALOG_YEAR}, ${program.name} (${program.url})`,
    });
    return { program, drafts };
  } catch (err) {
    return { program, drafts: [], error: err instanceof Error ? err.message : String(err) };
  }
});

const summary = summarizeDrafts(results);
writeFileSync(REPORT, renderDraftsReport(summary, { generated: new Date().toISOString().slice(0, 10) }));
const ruleRows = summary.rows.converted + summary.rows.review;
console.log(
  `${programs.length} programs, ${summary.tables.length} tables drafted: ${summary.rows.converted}/${ruleRows} rule rows converted ` +
    `(${((100 * summary.rows.converted) / ruleRows).toFixed(1)}%); ${summary.programs.errors.length} pages unreadable. Wrote drafts-report.md.`,
);
