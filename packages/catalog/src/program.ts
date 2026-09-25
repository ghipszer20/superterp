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
};

export type ProgramPage = { name: string; lists: CourseList[] };

/** Text of an element without its <sup> footnote markers, plus those markers. */
function withoutFootnotes($: cheerio.CheerioAPI, el: cheerio.Cheerio<AnyNode>) {
  const clone = el.clone();
  const footnotes = clone
    .find("sup")
    .toArray()
    .flatMap((s) => text($(s).text()).split(/[,\s]+/))
    .filter(Boolean);
  clone.find("sup").remove();
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
    const { text: code } = withoutFootnotes($, codeCell);
    return code ? { kind: "text", text: code, credits, footnotes } : null;
  }

  const comment = withoutFootnotes($, cells.first());
  if (!comment.text) return null;
  if (row.hasClass("areaheader")) return { kind: "header", text: comment.text, footnotes: comment.footnotes };
  return { kind: "text", text: comment.text, credits, footnotes: comment.footnotes };
}

export function parseProgramPage(html: string): ProgramPage {
  const $ = cheerio.load(html);
  const name = text($("h1.page-title").first().text()) || text($("title").text()).split("|")[0]!.trim();
  const lists = $("table.sc_courselist")
    .toArray()
    .map((table): CourseList => {
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
      return { heading: heading || null, rows, total };
    });
  return { name, lists };
}
