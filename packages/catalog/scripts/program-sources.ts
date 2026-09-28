// Pure helpers for fetch-sources.ts: turning a cached catalog page (and the
// department/sample-plan pages it links to) into program-sources/<program>.md.
// No network here -- see fetch-sources.ts for the CLI that fetches and writes.

import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

const text = (s: string | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

/** One line per <tr>, direct td/th cells joined -- puts a course code and its
 * credits (adjacent cells) on the same line. Skips rows with no cell text. */
export function renderTableRows($: cheerio.CheerioAPI, table: AnyNode): string[] {
  const rows: string[] = [];
  $(table)
    .find("tr")
    .each((_, tr) => {
      const cells = $(tr)
        .children("td, th")
        .toArray()
        .map((c) => text($(c).text()))
        .filter(Boolean);
      if (cells.length) rows.push(cells.join(" | "));
    });
  return rows;
}

/** Block-level text in document order: headings/paragraphs/list items as one
 * line each, tables rendered as rows. Nested lists and tables are excluded from
 * their parent's own text so nothing is emitted twice. */
function extractBlocks($: cheerio.CheerioAPI, root: cheerio.Cheerio<AnyNode>): string[] {
  const blocks: string[] = [];
  root.find("h1, h2, h3, h4, h5, h6, p, li, dt, dd, table").each((_, el) => {
    const node = $(el);
    if (node.parents("table").length) return; // its table already renders it
    if (node.is("table")) {
      blocks.push(...renderTableRows($, el));
      return;
    }
    const clone = node.clone();
    clone.children("ul, ol, table").remove();
    const t = text(clone.text());
    if (t) blocks.push(t);
  });
  return blocks;
}

/** The block text of one container (by selector), or null if the page has none
 * (e.g. no #fouryearplantextcontainer). Scripts/styles are stripped first. */
export function extractSection(html: string, selector: string): string[] | null {
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();
  const root = $(selector);
  if (!root.length) return null;
  return extractBlocks($, root);
}

// --- Link seeding -----------------------------------------------------------

/** Hosts that are never a program's own department/plan source. */
const DENYLIST_HOSTS = [
  "4yearplans.umd.edu",
  "admissions.umd.edu",
  "testudo.umd.edu",
  "academiccatalog.umd.edu",
  "facebook.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "youtube.com",
  "linkedin.com",
  "tiktok.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

function hostMatches(host: string, denied: string): boolean {
  return host === denied || host.endsWith(`.${denied}`);
}

/** A umd.edu link worth recording as a source, i.e. not the catalog itself and
 * not one of the generic/social/font links every page carries. */
export function isSeedableLink(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (!/^https?:$/.test(u.protocol)) return false;
  const host = u.hostname.toLowerCase();
  if (!(host === "umd.edu" || host.endsWith(".umd.edu"))) return false;
  return !DENYLIST_HOSTS.some((d) => hostMatches(host, d));
}

/** https, no fragment, no trailing slash -- so the same page seeded from two
 * spots (or re-seeded later) dedupes to one entry. */
export function normalizeUrl(url: string): string {
  const u = new URL(url);
  u.protocol = "https:";
  u.hash = "";
  let href = u.href;
  if (href.endsWith("/") && u.pathname !== "/") href = href.slice(0, -1);
  return href;
}

function linksIn($: cheerio.CheerioAPI, selector: string, baseUrl: string): string[] {
  const out: string[] = [];
  $(selector)
    .find("a[href]")
    .each((_, a) => {
      const href = $(a).attr("href");
      if (!href || href.startsWith("#") || /^(mailto|tel):/i.test(href)) return;
      try {
        out.push(new URL(href, baseUrl).href);
      } catch {
        /* not a URL; skip */
      }
    });
  return out;
}

export type SourceEntry = { catalog: string; department: string[]; samplePlan: string[] };

/** External umd.edu links from the overview tab (-> department) and the
 * four-year-plan tab (-> samplePlan), filtered and deduplicated. */
export function seedProgramLinks(html: string, catalogUrl: string): Omit<SourceEntry, "catalog"> {
  const $ = cheerio.load(html);
  const department = new Set<string>();
  const samplePlan = new Set<string>();
  for (const href of linksIn($, "#textcontainer", catalogUrl)) {
    if (isSeedableLink(href)) department.add(normalizeUrl(href));
  }
  for (const href of linksIn($, "#fouryearplantextcontainer", catalogUrl)) {
    if (isSeedableLink(href)) samplePlan.add(normalizeUrl(href));
  }
  return { department: [...department], samplePlan: [...samplePlan] };
}

// --- Program keys -------------------------------------------------------------

/** The last non-empty path segment of a catalog URL, e.g. "mathematics-major". */
export function programKeyFromUrl(url: string): string {
  const segs = new URL(url).pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  return segs[segs.length - 1] ?? "root";
}

/** Program keys for every catalog URL; a collision (two programs sharing a
 * last segment) is broken by prefixing the parent path segment. */
export function deriveProgramKeys(urls: string[]): Map<string, string> {
  const bare = new Map(urls.map((u) => [u, programKeyFromUrl(u)] as const));
  const counts = new Map<string, number>();
  for (const k of bare.values()) counts.set(k, (counts.get(k) ?? 0) + 1);
  const result = new Map<string, string>();
  for (const u of urls) {
    const k = bare.get(u)!;
    if ((counts.get(k) ?? 0) <= 1) {
      result.set(u, k);
      continue;
    }
    const segs = new URL(u).pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    const parent = segs.length > 1 ? segs[segs.length - 2] : "";
    result.set(u, parent ? `${parent}-${k}` : k);
  }
  return result;
}

// --- sources.json merge -------------------------------------------------------

export type SourcesMap = Record<string, SourceEntry>;

/** Adds newly-seeded entries; never touches a key already in `existing`, so
 * hand edits (added URLs, corrections) survive a re-seed. */
export function mergeSourceMap(existing: SourcesMap, seeded: SourcesMap): SourcesMap {
  const merged: SourcesMap = { ...existing };
  for (const [key, entry] of Object.entries(seeded)) {
    if (!(key in merged)) merged[key] = entry;
  }
  return merged;
}

// --- Generated .md files -------------------------------------------------------

export const GENERATED_MARKER = "<!-- generated by fetch-sources.ts: do not hand-edit -->";

/** True only for files this script wrote -- so it never clobbers a
 * hand-captured file like cmsc-major.md that lacks the marker. */
export function hasGeneratedHeader(content: string): boolean {
  return content.trimStart().startsWith(GENERATED_MARKER);
}

export type PageContent = { url: string; lines: string[] | null; note?: string };

export function renderProgramDoc(input: {
  name: string;
  catalogUrl: string;
  fetchDate: string;
  requirements: string[];
  plan: string[] | null;
  department: PageContent[];
  samplePlan: PageContent[];
}): string {
  const out: string[] = [GENERATED_MARKER, `# ${input.name}`, `Source: ${input.catalogUrl}`];
  for (const p of [...input.department, ...input.samplePlan]) out.push(`Source: ${p.url}`);
  out.push(`Fetched: ${input.fetchDate}`, "");
  out.push("## Catalog requirements", "", ...(input.requirements.length ? input.requirements : ["(none found)"]), "");
  if (input.plan) out.push("## Catalog four-year plan", "", ...input.plan, "");
  for (const p of input.department) {
    out.push(`## Department page (${p.url})`, "", ...(p.note ? [p.note] : p.lines?.length ? p.lines : ["(no content)"]), "");
  }
  for (const p of input.samplePlan) {
    out.push(`## Sample plan (${p.url})`, "", ...(p.note ? [p.note] : p.lines?.length ? p.lines : ["(no content)"]), "");
  }
  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

// --- missing.md ----------------------------------------------------------------

export type MissingEntry = {
  key: string;
  name: string;
  noDepartment: boolean;
  noSamplePlan: boolean;
  failures: { url: string; error: string }[];
  unconverted: { url: string; reason: string }[];
};

export function buildMissingReport(entries: MissingEntry[]): string {
  const noDept = entries.filter((e) => e.noDepartment);
  const noPlan = entries.filter((e) => e.noSamplePlan);
  const lines = [
    GENERATED_MARKER,
    "# Missing sources and conversion gaps",
    "",
    `## No department page (${noDept.length})`,
    "",
    ...noDept.map((e) => `- ${e.name} (${e.key})`),
    "",
    `## No sample plan (${noPlan.length})`,
    "",
    ...noPlan.map((e) => `- ${e.name} (${e.key})`),
    "",
    "## Fetch failures",
    "",
    ...entries.flatMap((e) => e.failures.map((f) => `- ${e.name} (${e.key}): ${f.url} -- ${f.error}`)),
    "",
    "## Not converted (spreadsheets, Google Docs, etc.)",
    "",
    ...entries.flatMap((e) => e.unconverted.map((u) => `- ${e.name} (${e.key}): ${u.url} -- ${u.reason}`)),
  ];
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}
