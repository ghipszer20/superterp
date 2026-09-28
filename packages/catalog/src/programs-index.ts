// The catalog's program index (https://academiccatalog.umd.edu/undergraduate/programs/).
//
// The page's own content (#textcontainer) is an <h2> per section ("Majors",
// "Minors", "Certificates"), each followed by a .sitemap list of program links.
// Everything else on the page is site navigation, which is where the college
// and department landing pages are linked. So a link is a program exactly when
// it sits in a .sitemap inside #textcontainer; URL shape is not a usable signal
// (some programs, e.g. Biological Sciences, live at a department-shaped URL).

import * as cheerio from "cheerio";

export const PROGRAM_INDEX_URL = "https://academiccatalog.umd.edu/undergraduate/programs/";

export type ProgramKind = "major" | "minor" | "certificate" | "other";
export type ProgramLink = { name: string; url: string; kind: ProgramKind };

const text = (s: string) => s.replace(/\s+/g, " ").trim();

function kindFrom(s: string): ProgramKind | null {
  const m = /\b(major|minor|certificate)s?\b/i.exec(s);
  return m ? (m[1]!.toLowerCase() as ProgramKind) : null;
}

/**
 * Every program on the index, in page order, deduplicated by URL. The kind
 * comes from the name ("… Major (B.A., B.S.)", "… Minor at Shady Grove"); a
 * name with no keyword (e.g. "Individual Studies Program") takes its section's.
 */
export function parseProgramIndex(html: string): ProgramLink[] {
  const $ = cheerio.load(html);
  const seen = new Set<string>();
  const programs: ProgramLink[] = [];
  let section = "";
  $("#textcontainer")
    .children()
    .each((_, el) => {
      const node = $(el);
      if (node.is("h2")) {
        section = text(node.text());
        return;
      }
      if (!node.is(".sitemap")) return;
      node.find("a[href]").each((_, a) => {
        const href = $(a).attr("href")!;
        if (href.startsWith("#")) return;
        const url = new URL(href, PROGRAM_INDEX_URL).href;
        if (seen.has(url)) return;
        seen.add(url);
        const name = text($(a).text());
        programs.push({ name, url, kind: kindFrom(name) ?? kindFrom(section) ?? "other" });
      });
    });
  return programs;
}
