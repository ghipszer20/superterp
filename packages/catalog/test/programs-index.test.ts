// Tested against a trimmed copy of the real program index
// (https://academiccatalog.umd.edu/undergraduate/programs/, 2026–27 catalog).
// The trim keeps a slice of the site navigation, which links to college and
// department landing pages, so the "ignore everything but programs" rule can fail.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROGRAM_INDEX_URL, parseProgramIndex } from "../src/programs-index.ts";

const html = readFileSync(new URL("./fixtures/program-index.html", import.meta.url), "utf8");
const programs = parseProgramIndex(html);
const base = "https://academiccatalog.umd.edu/undergraduate/colleges-schools";

describe("parseProgramIndex", () => {
  it("lists every program in the Majors, Minors and Certificates sections, in page order", () => {
    expect(programs.map((p) => p.name)).toEqual([
      "Accounting Major",
      "Accounting Major at Shady Grove",
      "Aerospace Engineering Major",
      "Biological Sciences Major",
      "Chemistry Major (B.A., B.S.)",
      "Computer Science Major",
      "Individual Studies Program",
      "Mathematics Major",
      "Actuarial Mathematics Minor",
      "Computer Science Minor",
      "Sustainability Studies Minor (AGNR)",
      "Sustainability Studies Minor (PLCY)",
      "Technology Innovation Leadership Minor at Shady Grove",
      "Applied Agriculture Certificate",
      "LGBTQ Studies Certificate",
    ]);
  });

  it("returns absolute URLs, including programs that live at a department-shaped URL", () => {
    expect(programs[0]).toEqual({
      name: "Accounting Major",
      url: `${base}/business/accounting/accounting-major/`,
      kind: "major",
    });
    expect(programs.find((p) => p.name === "Biological Sciences Major")!.url).toBe(
      `${base}/computer-mathematical-natural-sciences/biological-sciences/`,
    );
  });

  it("ignores site navigation (college and department landing pages) and on-page anchors", () => {
    const urls = programs.map((p) => p.url);
    expect(urls).not.toContain(`${base}/computer-mathematical-natural-sciences/`);
    expect(urls).not.toContain(`${base}/computer-mathematical-natural-sciences/computer-science/`);
    expect(urls).not.toContain(`${base}/`);
    expect(urls.every((u) => u.startsWith("https://academiccatalog.umd.edu/") && !u.includes("#"))).toBe(true);
  });

  it("infers the kind from the name, wherever the keyword appears", () => {
    const kind = (name: string) => programs.find((p) => p.name === name)!.kind;
    expect(kind("Chemistry Major (B.A., B.S.)")).toBe("major");
    expect(kind("Accounting Major at Shady Grove")).toBe("major");
    expect(kind("Sustainability Studies Minor (AGNR)")).toBe("minor");
    expect(kind("Technology Innovation Leadership Minor at Shady Grove")).toBe("minor");
    expect(kind("LGBTQ Studies Certificate")).toBe("certificate");
  });

  it("falls back to the section heading when the name has no kind keyword", () => {
    // Listed under "Majors" on the real page.
    expect(programs.find((p) => p.name === "Individual Studies Program")!.kind).toBe("major");
  });

  it("is 'other' when neither the name nor the section says what it is", () => {
    const page = `<div id="textcontainer"><h2>Programs</h2><div class="sitemap"><ul>
      <li><a href="/undergraduate/x/honors-college/">Honors College</a></li></ul></div></div>`;
    expect(parseProgramIndex(page)).toEqual([
      { name: "Honors College", url: "https://academiccatalog.umd.edu/undergraduate/x/honors-college/", kind: "other" },
    ]);
  });

  it("lists a program linked twice only once", () => {
    const page = `<div id="textcontainer"><h2>Majors</h2><div class="sitemap"><ul>
      <li><a href="/undergraduate/a/history-major/">History Major</a></li>
      <li><a href="/undergraduate/a/history-major/">History Major</a></li></ul></div></div>`;
    expect(parseProgramIndex(page)).toHaveLength(1);
  });

  it("points at the real index page", () => {
    expect(PROGRAM_INDEX_URL).toBe("https://academiccatalog.umd.edu/undergraduate/programs/");
  });
});
