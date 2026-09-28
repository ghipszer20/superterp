import { describe, expect, it } from "vitest";
import {
  buildMissingReport,
  deriveProgramKeys,
  extractSection,
  GENERATED_MARKER,
  hasGeneratedHeader,
  isSeedableLink,
  mergeSourceMap,
  normalizeUrl,
  programKeyFromUrl,
  renderProgramDoc,
  seedProgramLinks,
  type SourcesMap,
} from "../scripts/program-sources.ts";

const CATALOG_URL = "https://academiccatalog.umd.edu/undergraduate/colleges-schools/x/foo-major/";

describe("extractSection", () => {
  it("returns null when the container is absent", () => {
    expect(extractSection("<html><body><div id='textcontainer'></div></body></html>", "#fouryearplantextcontainer")).toBeNull();
  });

  it("reads headings and paragraphs in order, and renders a table as one line per row", () => {
    const html = `<html><body><div id="requirementstextcontainer">
      <h2>Core</h2>
      <p>Complete the following.</p>
      <table class="sc_courselist"><tr><td class="codecol">MATH140</td><td>Calculus I</td><td class="hourscol">4</td></tr></table>
    </div></body></html>`;
    expect(extractSection(html, "#requirementstextcontainer")).toEqual([
      "Core",
      "Complete the following.",
      "MATH140 | Calculus I | 4",
    ]);
  });

  it("does not duplicate list items nested inside a parent li, or table cells", () => {
    const html = `<html><body><div id="textcontainer">
      <li>Outer<ul><li>Inner</li></ul></li>
      <table><tr><td>A</td><td>1</td></tr><tr><td>B</td><td>2</td></tr></table>
    </div></body></html>`;
    expect(extractSection(html, "#textcontainer")).toEqual(["Outer", "Inner", "A | 1", "B | 2"]);
  });

  it("skips a row with no cell text", () => {
    const html = `<html><body><div id="textcontainer"><table><tr><td>  </td></tr><tr><td>X</td><td>3</td></tr></table></div></body></html>`;
    expect(extractSection(html, "#textcontainer")).toEqual(["X | 3"]);
  });
});

describe("link seeding", () => {
  const html = `<html><body>
    <div id="textcontainer">
      <p><a href="https://dept.umd.edu/requirements">Department requirements</a></p>
      <p><a href="http://4yearplans.umd.edu">4-year plans</a></p>
      <p><a href="https://admissions.umd.edu">Apply</a></p>
      <p><a href="https://www.facebook.com/dept">Facebook</a></p>
      <p><a href="/undergraduate/other-page">Same catalog</a></p>
      <p><a href="mailto:dept@umd.edu">Email us</a></p>
      <p><a href="https://dept.umd.edu/requirements/">Duplicate, trailing slash</a></p>
    </div>
    <div id="fouryearplantextcontainer">
      <p><a href="https://dept.umd.edu/sample-plan.pdf">Sample plan</a></p>
      <p><a href="https://external.org/plan.pdf">Off-campus, not umd.edu</a></p>
    </div>
  </body></html>`;

  it("keeps only external umd.edu links, split by tab, deduplicated", () => {
    const seeded = seedProgramLinks(html, CATALOG_URL);
    expect(seeded.department).toEqual(["https://dept.umd.edu/requirements"]);
    expect(seeded.samplePlan).toEqual(["https://dept.umd.edu/sample-plan.pdf"]);
  });

  it("isSeedableLink rejects the catalog's own host and generic hosts", () => {
    expect(isSeedableLink("https://dept.umd.edu/x")).toBe(true);
    expect(isSeedableLink("https://academiccatalog.umd.edu/x")).toBe(false);
    expect(isSeedableLink("http://4yearplans.umd.edu")).toBe(false);
    expect(isSeedableLink("https://testudo.umd.edu")).toBe(false);
    expect(isSeedableLink("https://external.org/x")).toBe(false);
    expect(isSeedableLink("not a url")).toBe(false);
  });

  it("normalizeUrl forces https, drops the fragment and a trailing slash", () => {
    expect(normalizeUrl("http://dept.umd.edu/page/#section")).toBe("https://dept.umd.edu/page");
    expect(normalizeUrl("https://dept.umd.edu/")).toBe("https://dept.umd.edu/");
  });
});

describe("programKeyFromUrl / deriveProgramKeys", () => {
  it("takes the last path segment", () => {
    expect(programKeyFromUrl("https://academiccatalog.umd.edu/undergraduate/x/mathematics-major/")).toBe("mathematics-major");
  });

  it("prefixes the parent segment only for colliding keys", () => {
    const urls = [
      "https://academiccatalog.umd.edu/undergraduate/a/statistics-minor/",
      "https://academiccatalog.umd.edu/undergraduate/b/statistics-minor/",
      "https://academiccatalog.umd.edu/undergraduate/c/mathematics-major/",
    ];
    const keys = deriveProgramKeys(urls);
    expect(keys.get(urls[0]!)).toBe("a-statistics-minor");
    expect(keys.get(urls[1]!)).toBe("b-statistics-minor");
    expect(keys.get(urls[2]!)).toBe("mathematics-major");
  });
});

describe("mergeSourceMap", () => {
  it("adds new keys but never overwrites an existing one", () => {
    const existing: SourcesMap = {
      "foo-major": { catalog: "https://academiccatalog.umd.edu/foo-major", department: ["https://hand-edited.umd.edu"], samplePlan: [] },
    };
    const seeded: SourcesMap = {
      "foo-major": { catalog: "https://academiccatalog.umd.edu/foo-major", department: ["https://seeded.umd.edu"], samplePlan: [] },
      "bar-minor": { catalog: "https://academiccatalog.umd.edu/bar-minor", department: [], samplePlan: [] },
    };
    const merged = mergeSourceMap(existing, seeded);
    expect(merged["foo-major"]).toEqual(existing["foo-major"]);
    expect(merged["bar-minor"]).toEqual(seeded["bar-minor"]);
  });
});

describe("generated-header detection", () => {
  it("recognizes the marker and rejects hand-written files", () => {
    expect(hasGeneratedHeader(`${GENERATED_MARKER}\n# Foo\n`)).toBe(true);
    expect(hasGeneratedHeader("Source: https://example.com\nPasted by the owner: 2026-09-26\n")).toBe(false);
  });
});

describe("renderProgramDoc", () => {
  it("lists every source URL in the header and only includes the plan section when there is one", () => {
    const doc = renderProgramDoc({
      name: "Foo Major",
      catalogUrl: "https://academiccatalog.umd.edu/foo-major",
      fetchDate: "2026-09-28",
      requirements: ["Req line"],
      plan: null,
      department: [{ url: "https://dept.umd.edu", lines: ["Dept line"] }],
      samplePlan: [{ url: "https://dept.umd.edu/plan.pdf", lines: null, note: "not converted (spreadsheet)" }],
    });
    expect(doc.startsWith(GENERATED_MARKER)).toBe(true);
    expect(doc).toContain("# Foo Major");
    expect(doc).toContain("Source: https://academiccatalog.umd.edu/foo-major");
    expect(doc).toContain("Source: https://dept.umd.edu");
    expect(doc).toContain("Source: https://dept.umd.edu/plan.pdf");
    expect(doc).toContain("## Catalog requirements");
    expect(doc).not.toContain("## Catalog four-year plan");
    expect(doc).toContain("## Department page (https://dept.umd.edu)");
    expect(doc).toContain("Dept line");
    expect(doc).toContain("## Sample plan (https://dept.umd.edu/plan.pdf)");
    expect(doc).toContain("not converted (spreadsheet)");
  });
});

describe("buildMissingReport", () => {
  it("groups programs by what's missing", () => {
    const report = buildMissingReport([
      { key: "foo-major", name: "Foo Major", noDepartment: true, noSamplePlan: true, failures: [], unconverted: [] },
      {
        key: "bar-minor",
        name: "Bar Minor",
        noDepartment: false,
        noSamplePlan: true,
        failures: [{ url: "https://dept.umd.edu/x", error: "HTTP 404" }],
        unconverted: [{ url: "https://dept.umd.edu/sheet.xlsx", reason: "spreadsheet" }],
      },
    ]);
    expect(report.startsWith(GENERATED_MARKER)).toBe(true);
    expect(report).toContain("No department page (1)");
    expect(report).toContain("- Foo Major (foo-major)");
    expect(report).toContain("No sample plan (2)");
    expect(report).toContain("- Bar Minor (bar-minor)");
    expect(report).toContain("HTTP 404");
    expect(report).toContain("spreadsheet");
  });
});
