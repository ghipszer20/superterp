// Program requirement pages on academiccatalog.umd.edu (CourseLeaf).
// Each requirement block is a table.sc_courselist.

import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

const text = (s: string | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

export type RowFootnotes = { footnotes: string[] };

export type CatalogRow =
  | ({ kind: "header"; text: string } & RowFootnotes)
  | ({ kind: "course"; codes: string[]; title: string; credits: string | null; alternative: boolean } & RowFootnotes)
  | ({ kind: "text"; text: string; credits: string | null } & RowFootnotes);

export type CourseList = {
  /** The heading above the table (a track or specialization), if any. */
  heading: string | null;
  rows: CatalogRow[];
  total: string | null;
  /** The list's footnotes, marker ("1") to text, from the dl.sc_footnotes after its table. */
  footnotes: Record<string, string>;
};

export type ProgramPage = { name: string; lists: CourseList[] };

/** A <sup> is a footnote marker ("1", "2, 3", "a", "*") unless it holds words, which some pages put there as a note. */
const isMarker = (sup: string) =>
  sup
    .split(/[,\s]+/)
    .filter(Boolean)
    .every((t) => /^(\d+|[a-z]|[*†‡§]+)$/i.test(t));

/** A course code written as plain text in the code column (a course the catalog doesn't link), optionally after "or". */
const UNLINKED_CODE = /^(?:or\s+)?([A-Z]{4}\d{3}[A-Z]?)$/;

/** Text of an element without its <sup> footnote markers, plus those markers. */
function withoutFootnotes($: cheerio.CheerioAPI, el: cheerio.Cheerio<AnyNode>) {
  const clone = el.clone();
  const sups = clone.find("sup").filter((_, s) => isMarker(text($(s).text())));
  const footnotes = sups
    .toArray()
    .flatMap((s) => text($(s).text()).split(/[,\s]+/))
    .filter(Boolean);
  sups.remove();
  return { text: text(clone.text().replace(/ /g, " ")), footnotes };
}

function parseRow($: cheerio.CheerioAPI, tr: AnyNode): CatalogRow | null {
  const row = $(tr);
  const cells = row.find("td");
  const credits = text(row.find("td.hourscol").text()) || null;
  const codeCell = row.find("td.codecol");

  if (codeCell.length > 0) {
    const codes = codeCell
      .find("a.code, a.bubblelink")
      .toArray()
      .map((a) => text($(a).text()).replace(/\s/g, ""));
    const { text: title, footnotes } = withoutFootnotes($, cells.eq(1));
    const alternative = row.hasClass("orclass") || codeCell.hasClass("orclass");
    if (codes.length > 0) return { kind: "course", codes, title, credits, alternative, footnotes };
    const { text: code, footnotes: codeFootnotes } = withoutFootnotes($, codeCell);
    const unlinked = UNLINKED_CODE.exec(code);
    if (unlinked) {
      return { kind: "course", codes: [unlinked[1]!], title, credits, alternative, footnotes: [...codeFootnotes, ...footnotes] };
    }
    return code ? { kind: "text", text: code, credits, footnotes } : null;
  }

  const comment = withoutFootnotes($, cells.first());
  if (!comment.text) return null;
  if (row.hasClass("areaheader")) return { kind: "header", text: comment.text, footnotes: comment.footnotes };
  return { kind: "text", text: comment.text, credits, footnotes: comment.footnotes };
}

/** One dl.sc_footnotes: each <dt><sup> 1 </sup></dt> followed by its <dd>. */
function parseFootnotes($: cheerio.CheerioAPI, dl: AnyNode): Record<string, string> {
  const notes: Record<string, string> = {};
  $(dl)
    .find("dt")
    .each((_, dt) => {
      const marker = text($(dt).text());
      if (marker) notes[marker] = text($(dt).next("dd").text());
    });
  return notes;
}

function parseTable($: cheerio.CheerioAPI, table: AnyNode): CourseList {
  const heading = text($(table).prevAll("h2, h3, h4").first().text());
  let total: string | null = null;
  const rows: CatalogRow[] = [];
  $(table)
    .find("tr")
    .each((_, tr) => {
      if ($(tr).hasClass("listsum")) {
        total = text($(tr).find("td.hourscol").text()) || null;
        return;
      }
      const row = parseRow($, tr);
      if (row) rows.push(row);
    });
  return { heading: heading || null, rows, total, footnotes: {} };
}

export function parseProgramPage(html: string): ProgramPage {
  const $ = cheerio.load(html);
  const name = text($("h1.page-title").first().text()) || text($("title").text()).split("|")[0]!.trim();
  const lists: CourseList[] = [];
  // In document order. A footnote block belongs to every table since the
  // previous block: usually that's the one table just above it, but some pages
  // (Astronomy) put one block after several tables that share its markers.
  let pending: CourseList[] = [];
  $("table.sc_courselist, dl.sc_footnotes").each((_, el) => {
    if (!$(el).is("dl")) {
      const list = parseTable($, el);
      lists.push(list);
      pending.push(list);
      return;
    }
    const notes = parseFootnotes($, el);
    for (const list of pending) Object.assign(list.footnotes, notes);
    pending = [];
  });
  return { name, lists };
}
