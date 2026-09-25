// draftProgram: parsed catalog tables -> draft audit Programs, deterministically.
// Small hand-built pages here; the real CS and Math pages are in draft-golden.test.ts.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { draftProgram, draftPrograms, type DraftMeta } from "../src/draft.ts";
import { parseProgramPage, type CatalogRow, type ProgramPage } from "../src/program.ts";

const meta: DraftMeta = { id: "test-major", catalogYear: "2026-27", source: "UMD Academic Catalog 2026–27, Test Major" };

const c = (codes: string | string[], opts: { title?: string; credits?: string | null; or?: boolean; fn?: string[] } = {}): CatalogRow => ({
  kind: "course",
  codes: Array.isArray(codes) ? codes : [codes],
  title: opts.title ?? `Title of ${Array.isArray(codes) ? codes.join("+") : codes}`,
  credits: opts.credits ?? null,
  alternative: opts.or ?? false,
  footnotes: opts.fn ?? [],
});
const t = (text: string, credits: string | null = null, fn: string[] = []): CatalogRow => ({ kind: "text", text, credits, footnotes: fn });
const h = (text: string, fn: string[] = []): CatalogRow => ({ kind: "header", text, footnotes: fn });
const page = (rows: CatalogRow[], footnotes: Record<string, string> = {}): ProgramPage => ({
  name: "Test Major",
  lists: [{ heading: null, rows, total: null, footnotes }],
});

describe("draftProgram", () => {
  it("makes an unverified Program carrying the catalog year and source", () => {
    const { program } = draftProgram(page([c("MATH140")]), meta);
    expect(program).toMatchObject({
      id: "test-major",
      name: "Test Major",
      catalogYear: "2026-27",
      source: meta.source,
      verified: false,
    });
  });

  it("turns each plain course row into a course requirement with a readable id", () => {
    const { program } = draftProgram(page([c("MATH140", { title: "Calculus I" }), c("CMSC131", { title: "OOP I" })]), meta);
    expect(program.requirements).toEqual([
      { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
      { kind: "course", id: "cmsc131", name: "OOP I", options: ["CMSC131"] },
    ]);
  });

  it("merges 'or' rows into the preceding course's options", () => {
    const { program } = draftProgram(page([c("AMSC460", { title: "Computational Methods" }), c("AMSC466", { or: true })]), meta);
    expect(program.requirements).toEqual([{ kind: "course", id: "amsc460", name: "Computational Methods", options: ["AMSC460", "AMSC466"] }]);
  });

  it("treats an 'OR' text row as making the next course an alternative to the one above", () => {
    const { program } = draftProgram(page([c("DANC488"), t("OR"), c("DANC485")]), meta);
    expect(program.requirements).toEqual([{ kind: "course", id: "danc488", name: "Title of DANC488", options: ["DANC488", "DANC485"] }]);
  });

  it("splits cross-listed codes into both courses", () => {
    const { program } = draftProgram(page([c("CMSC/AMSC460"), c("ISRL342/HIST376")]), meta);
    expect(program.requirements.map((r) => r.kind === "course" && r.options)).toEqual([
      ["CMSC460", "AMSC460"],
      ["ISRL342", "HIST376"],
    ]);
  });

  it("sends a code like 'PLSC110/111' (a pair or a cross-list?) to review", () => {
    const { program, review } = draftProgram(page([c("PLSC110/111")]), meta);
    expect(program.requirements).toEqual([]);
    expect(review).toContainEqual(expect.objectContaining({ confidence: "manual", reason: "ambiguous-code", text: expect.stringContaining("PLSC110/111") }));
  });

  it("makes a row of several courses ('A and B') one course requirement per code", () => {
    const { program } = draftProgram(page([c(["GEOL100", "GEOL110"])]), meta);
    expect(program.requirements.map((r) => r.id)).toEqual(["geol100", "geol110"]);
  });

  it("makes 'A and B' or 'C and D' rows a sets requirement", () => {
    const { program } = draftProgram(page([c(["CHEM131", "CHEM132"]), c(["CHEM146", "CHEM177"], { or: true })]), meta);
    expect(program.requirements).toEqual([
      {
        kind: "sets",
        id: "chem131-chem132",
        name: "Title of CHEM131+CHEM132",
        options: [
          ["CHEM131", "CHEM132"],
          ["CHEM146", "CHEM177"],
        ],
      },
    ]);
  });

  describe("'Select …' groups over the course rows that follow", () => {
    it("drafts 'Select one of the following:' over single courses as one course requirement with every option", () => {
      const { program } = draftProgram(
        page([h("Introductory Sequence"), t("Select one of the following:", "3"), c("MATH246"), c("MATH436"), c("MATH462"), h("Next")]),
        meta,
      );
      expect(program.requirements).toEqual([
        { kind: "course", id: "one-of-math246", name: "Introductory Sequence: Select one of the following:", options: ["MATH246", "MATH436", "MATH462"] },
      ]);
    });

    it("ends the group at the next text or header row", () => {
      const { program } = draftProgram(page([t("One of the following:"), c("COMM107"), c("COMM200"), h("Required"), c("COMM250")]), meta);
      expect(program.requirements.map((r) => r.id)).toEqual(["one-of-comm107", "comm250"]);
    });

    it("keeps 'or' rows and 'OR' text rows inside a select-one as more options", () => {
      const { program } = draftProgram(page([t("One of the following:"), c("DANC488"), t("OR"), c("DANC485"), c("DANC486", { or: true })]), meta);
      expect(program.requirements).toEqual([
        { kind: "course", id: "one-of-danc488", name: "One of the following:", options: ["DANC488", "DANC485", "DANC486"] },
      ]);
    });

    it.each([
      ["Select two of the following:", 2],
      ["Select three of the following courses:", 3],
      ["Three of the following:", 3],
      ["Students must choose four courses from:", 4],
      ["Choose 5 of the following:", 5],
    ])("drafts %j as choose with count %i", (text, count) => {
      const { program } = draftProgram(page([t(text), c("CMSC411"), c("CMSC412"), c("CMSC414"), c("CMSC417"), c("CMSC420")]), meta);
      expect(program.requirements).toEqual([
        { kind: "choose", id: expect.stringMatching(/-of-cmsc411$/), name: text, count, from: { courses: ["CMSC411", "CMSC412", "CMSC414", "CMSC417", "CMSC420"] } },
      ]);
    });

    it.each([
      ["Nine credits from the following list:", 9],
      ["Select 9 credits of the following:", 9],
      ["Select six credits of the following:", 6],
      ["Choose 12 credits from the list below", 12],
    ])("drafts %j as choose with %i credits", (text, credits) => {
      const { program } = draftProgram(page([t(text), c("HIST301"), c("HIST302")]), meta);
      expect(program.requirements).toEqual([
        { kind: "choose", id: `${credits}-credits-of-hist301`, name: text, credits, from: { courses: ["HIST301", "HIST302"] } },
      ]);
    });

    it("reads a rule written in a header row too", () => {
      const { program } = draftProgram(page([h("Choose three of the following courses:"), c("ANTH301"), c("ANTH302"), c("ANTH303")]), meta);
      expect(program.requirements).toEqual([
        { kind: "choose", id: "three-of-anth301", name: "Choose three of the following courses:", count: 3, from: { courses: ["ANTH301", "ANTH302", "ANTH303"] } },
      ]);
    });

    it("drafts 'select one' over 'A and B' rows as a sets requirement", () => {
      const { program } = draftProgram(page([t("Select one of the following pairs of courses:"), c(["STAT400", "STAT401"]), t("OR"), c(["STAT410", "STAT420"])]), meta);
      expect(program.requirements).toEqual([
        {
          kind: "sets",
          id: "one-of-stat400",
          name: "Select one of the following pairs of courses:",
          options: [
            ["STAT400", "STAT401"],
            ["STAT410", "STAT420"],
          ],
        },
      ]);
    });

    it("sends 'select two' over 'A and B' rows to review as an engine gap (N of several sets)", () => {
      const { program, review } = draftProgram(page([t("Select two of the following:"), c(["STAT400", "STAT401"]), c(["STAT410", "STAT420"]), c("STAT430")]), meta);
      expect(program.requirements).toEqual([]);
      expect(review).toContainEqual(expect.objectContaining({ confidence: "manual", reason: "choose-of-sets", rows: 4 }));
    });

    it("sends 'select two' with mutually exclusive 'or' rows to review as an engine gap", () => {
      const { program, review } = draftProgram(page([t("Select two of the following:"), c("CMSC426"), c("CMSC460"), c("CMSC466", { or: true }), c("CMSC470")]), meta);
      expect(program.requirements).toEqual([]);
      expect(review).toContainEqual(expect.objectContaining({ confidence: "manual", reason: "exclusive-alternatives", rows: 5 }));
    });

    it("never drafts an empty group: a select with no course rows goes to review with what follows it", () => {
      const { program, review } = draftProgram(
        page([t("Select one of the following:"), t("Option A: Latin"), c("LATN301"), t("Option B: Greek"), c("GREK301"), h("Capstone"), c("CLAS499")]),
        meta,
      );
      expect(program.requirements.map((r) => r.id)).toEqual(["clas499"]);
      expect(review).toContainEqual(expect.objectContaining({ confidence: "manual", reason: "empty-group", rows: 5 }));
    });

    it("sends a group to review when member credits disagree and the rule row has none (the group's end is unclear)", () => {
      const { program, review } = draftProgram(
        page([t("Select one of the following pairs of courses:"), c(["STAT400", "STAT401"], { credits: "6" }), c(["STAT410", "STAT420"], { or: true, credits: "6" }), c("MATH461", { credits: "3-4" })]),
        meta,
      );
      expect(program.requirements).toEqual([]);
      expect(review).toContainEqual(expect.objectContaining({ reason: "group-boundary", rows: 4 }));
    });

    it("ends a group at a course row with its own credits when the rule row carries the group's credits", () => {
      const { program } = draftProgram(page([t("Select one of the following:", "3"), c("MATH246"), c("MATH436"), c("MATH310", { credits: "3" })]), meta);
      expect(program.requirements.map((r) => r.id)).toEqual(["one-of-math246", "math310"]);
    });
  });

  describe("rows it can't convert", () => {
    it("sends an unrecognized rule to review with its original text, and the course rows under it too", () => {
      const { program, review } = draftProgram(page([t("Select one 3xx-level ARTT elective", "3"), h("Capstone"), c("ARTT489")]), meta);
      expect(program.requirements.map((r) => r.id)).toEqual(["artt489"]);
      expect(review).toContainEqual({
        confidence: "manual",
        reason: "unrecognized-rule",
        text: 'Row "Select one 3xx-level ARTT elective" (3 credits) was not converted.',
        list: null,
        rows: 1,
      });
    });

    it("doesn't treat the course rows under an unrecognized rule as required", () => {
      const { program, review } = draftProgram(page([t("Select depth requirement; a one year sequence chosen from the following:"), c(["MATH410", "MATH411"]), c(["MATH403", "MATH404"]), t("Next rule"), h("H")]), meta);
      expect(program.requirements).toEqual([]);
      expect(review).toContainEqual(expect.objectContaining({ reason: "unrecognized-rule", rows: 3 }));
    });

    it("sends a lead-in over labelled groups to review up to the next header, nested selects included", () => {
      const { program, review } = draftProgram(
        page([
          t("Select one of the following tracks:"),
          t("Track A"),
          c("GEOL100"),
          t("Select Two From:"),
          c("GEOL322"),
          c("GEOL340"),
          h("Capstone"),
          c("GEOL499"),
        ]),
        meta,
      );
      expect(program.requirements.map((r) => r.id)).toEqual(["geol499"]);
      expect(review).toContainEqual(expect.objectContaining({ reason: "unrecognized-rule", rows: 6 }));
    });

    it("sends a course pattern like STAT4xx to review, suggesting the filter", () => {
      const { program, review } = draftProgram(page([t("STAT4xx", "3")]), meta);
      expect(program.requirements).toEqual([]);
      expect(review).toContainEqual(
        expect.objectContaining({ confidence: "manual", reason: "course-pattern", text: expect.stringContaining("departments: [STAT], 400–499") }),
      );
    });

    it("stops at a course row with its own credits: that row is a requirement of its own, not part of the rule above", () => {
      const { program, review } = draftProgram(
        page([t("STAT4XX", "3"), c("MATH401", { credits: "3" }), c("MATH405", { or: true }), t("Select one 3xx ARTT elective"), c("ARTT301"), c("ARTT302", { credits: "3" })]),
        meta,
      );
      expect(program.requirements.map((r) => r.id)).toEqual(["math401", "artt302"]);
      expect(review.filter((r) => r.confidence === "manual").map((r) => r.rows)).toEqual([1, 2]);
    });

    it("sends a 'must include:' umbrella count to review but still drafts the rows it lists", () => {
      const { program, review } = draftProgram(page([t("Select eight courses of 400-level or higher; must include:"), c("MATH410"), c("MATH401")]), meta);
      expect(program.requirements.map((r) => r.id)).toEqual(["math410", "math401"]);
      expect(review).toContainEqual(expect.objectContaining({ confidence: "manual", reason: "must-include", rows: 1 }));
    });

    it("sends a stray 'OR' row (nothing to attach to) to review", () => {
      const { review } = draftProgram(page([h("H"), t("OR"), c("MATH140")]), meta);
      expect(review).toContainEqual(expect.objectContaining({ reason: "stray-or" }));
    });
  });

  describe("footnotes", () => {
    it("drafts a footnoted row and adds one check note per footnote, quoting it and naming what it touches", () => {
      const { program, review } = draftProgram(
        page([c("CMSC131", { fn: ["1"] }), c("CMSC132", { fn: ["1"] })], { "1": "Students may pass proficiency exams instead." }),
        meta,
      );
      expect(program.requirements.map((r) => r.id)).toEqual(["cmsc131", "cmsc132"]);
      expect(review).toEqual([
        {
          confidence: "check",
          reason: "footnote",
          text: 'Footnote 1 (on cmsc131, cmsc132): "Students may pass proficiency exams instead."',
          list: null,
          rows: 0,
        },
      ]);
    });

    it("notes a footnote the list never defines", () => {
      const { review } = draftProgram(page([h("Upper level", ["3"]), c("CMSC411")]), meta);
      expect(review).toContainEqual(expect.objectContaining({ reason: "footnote", text: 'Footnote 3 (on header "Upper level"): (no footnote text on the page)' }));
    });
  });

  describe("areas and sequences", () => {
    it("drafts 'Select N … from at least M of the following areas with no more than K …' as a distribution", () => {
      const { program } = draftProgram(
        page([
          t("Select five 400 level courses from at least three of the following areas with no more than three courses in a given area:", "15"),
          t("Area 1: Systems"),
          c("CMSC411"),
          c("CMSC412"),
          t("Area 2: Theory"),
          c("CMSC451"),
          c("CMSC460"),
          c("CMSC466", { or: true }),
          h("Next"),
        ]),
        meta,
      );
      expect(program.requirements).toEqual([
        {
          kind: "distribution",
          id: "areas-cmsc411",
          name: "Select five 400 level courses from at least three of the following areas with no more than three courses in a given area:",
          count: 5,
          minAreas: 3,
          maxPerArea: 3,
          areas: [
            { name: "Area 1: Systems", courses: ["CMSC411", "CMSC412"] },
            { name: "Area 2: Theory", courses: ["CMSC451", "CMSC460", "CMSC466"] },
          ],
        },
      ]);
    });

    it("drafts 'Select one of N sequences' as sets, expanding 'or' choices within a sequence", () => {
      const { program } = draftProgram(
        page([
          h("Supporting sequence"),
          t("Select one of two sequences", "9-13"),
          t("Sequence One (11 credits)"),
          c("PHYS161"),
          c(["PHYS260", "PHYS261"]),
          t("Sequence Two (11 credits)"),
          c("ECON200"),
          c("ECON305"),
          c("ECON306", { or: true }),
          t("OR"),
          c("ECON325"),
        ]),
        meta,
      );
      expect(program.requirements).toEqual([
        {
          kind: "sets",
          id: "sequence-phys161",
          name: "Supporting sequence: Select one of two sequences",
          options: [
            ["PHYS161", "PHYS260", "PHYS261"],
            ["ECON200", "ECON305"],
            ["ECON200", "ECON306"],
            ["ECON200", "ECON325"],
          ],
        },
      ]);
    });

    it("leaves out a sequence with a rule inside it, with a check note that the sets are incomplete", () => {
      const { program, review } = draftProgram(
        page([
          t("Select one of two sequences"),
          t("Sequence One"),
          c("ASTR130"),
          c("ASTR131"),
          t("Sequence Two"),
          c(["AOSC200", "AOSC201"]),
          t("Two additional 400-level AOSC courses"),
        ]),
        meta,
      );
      expect(program.requirements).toEqual([{ kind: "sets", id: "sequence-astr130", name: "Select one of two sequences", options: [["ASTR130", "ASTR131"]] }]);
      expect(review).toContainEqual(
        expect.objectContaining({ confidence: "check", reason: "sequence-with-rule", text: expect.stringContaining('"Two additional 400-level AOSC courses"'), rows: 3 }),
      );
    });
  });

  it("keeps ids unique by suffixing repeats", () => {
    const { program } = draftProgram(page([c("MATH140"), h("Again"), c("MATH140")]), meta);
    expect(program.requirements.map((r) => r.id)).toEqual(["math140", "math140-2"]);
  });

  it("writes review items into reviewNotes with their confidence", () => {
    const { program } = draftProgram(page([t("STAT4xx")]), meta);
    expect(program.reviewNotes).toEqual([expect.stringMatching(/^\[manual\] course-pattern: Row "STAT4xx"/)]);
  });
});

describe("draftPrograms", () => {
  const twoTracks: ProgramPage = {
    name: "Mathematics Major",
    lists: [
      { heading: "Traditional Track", rows: [c("MATH140")], total: "55", footnotes: {} },
      { heading: "Applied Mathematics Track", rows: [c("MATH141")], total: "52", footnotes: {} },
    ],
  };

  it("drafts one program per requirement table, named and id'd after its heading", () => {
    const drafts = draftPrograms(twoTracks, { ...meta, id: "math-major" });
    expect(drafts.map((d) => [d.program.id, d.program.name])).toEqual([
      ["math-major-traditional-track", "Mathematics Major (Traditional Track)"],
      ["math-major-applied-mathematics-track", "Mathematics Major (Applied Mathematics Track)"],
    ]);
    expect(drafts[1]!.total).toBe("52");
  });

  it("flags that the tables' relationship (tracks or parts of one program) is unconfirmed", () => {
    const [first] = draftPrograms(twoTracks, meta);
    expect(first!.review).toContainEqual(expect.objectContaining({ confidence: "manual", reason: "multiple-lists", rows: 0 }));
  });

  it("uses the page's name and the meta id alone for a one-table page", () => {
    const [only] = draftPrograms(page([c("MATH140")]), meta);
    expect(only!.program).toMatchObject({ id: "test-major", name: "Test Major" });
    expect(only!.review).toEqual([]);
  });

  it("draftProgram picks one table by index", () => {
    expect(draftProgram(twoTracks, { ...meta, list: 1 }).program.requirements.map((r) => r.id)).toEqual(["math141"]);
  });
});

describe("row accounting on the real pages", () => {
  const fixture = (name: string) => parseProgramPage(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8"));

  it.each(["cs-major.html", "math-major.html"])("accounts for every row of %s exactly once", (name) => {
    const p = fixture(name);
    for (const d of draftPrograms(p, meta)) {
      const { converted, review, structural } = d.rows;
      expect(converted + review + structural).toBe(d.rowCount);
    }
    expect(draftPrograms(p, meta).reduce((a, d) => a + d.rowCount, 0)).toBe(p.lists.reduce((a, l) => a + l.rows.length, 0));
  });
});
