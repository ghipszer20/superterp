// Hand-checked against the Registrar's AP chart for May 2023–May 2026 exams
// (test/fixtures/ap-chart-may2023-may2026.txt is its text; SOURCES.md has the URL).

import { describe, expect, it } from "vitest";
import { apExamNames, creditForAp, CreditError } from "../src/index.ts";

const ids = (award: ReturnType<typeof creditForAp>) =>
  award.parts.map((p) => (p.kind === "course" ? p.id : p.kind === "choice" ? p.options.map((o) => o.id).join("|") : p.label));

describe("creditForAp", () => {
  it("gives Calculus BC 5 MATH140 (FSMA, FSAR) and MATH141, 8 credits", () => {
    const award = creditForAp("Calculus BC", 5);
    expect(award).toMatchObject({ program: "AP", exam: "Calculus BC", score: 5, credits: 8, source: "AP Calculus BC (5)" });
    expect(award.parts).toEqual([
      { kind: "course", id: "MATH140", credits: 4, genEd: ["FSMA", "FSAR"] },
      { kind: "course", id: "MATH141", credits: 4, genEd: [] },
    ]);
  });

  it("gives Calculus BC 3 only elective credit, and 2 nothing", () => {
    expect(creditForAp("Calculus BC", 3)).toMatchObject({ credits: 3, parts: [{ kind: "generic", label: "Lower Level Elective", credits: 3, genEd: [] }] });
    expect(creditForAp("Calculus BC", 2)).toMatchObject({ credits: 0, parts: [], source: "AP Calculus BC (2)" });
  });

  it("gives Computer Science A 4 elective credit but 5 CMSC131", () => {
    expect(ids(creditForAp("Computer Science A", 4))).toEqual(["Lower Level Elective"]);
    expect(creditForAp("Computer Science A", 4).credits).toBe(3);
    expect(creditForAp("Computer Science A", 5)).toMatchObject({ credits: 4, parts: [{ kind: "course", id: "CMSC131", credits: 4 }] });
  });

  it("gives Biology 3 Gen Ed lab-science credit without a course", () => {
    expect(creditForAp("Biology", 3).parts).toEqual([{ kind: "generic", label: "Lab Science", credits: 4, genEd: ["DSNL"] }]);
  });

  it("gives Chemistry different courses at 4 and 5", () => {
    expect(ids(creditForAp("Chemistry", 4))).toEqual(["CHEM131", "CHEM132"]);
    expect(ids(creditForAp("Chemistry", 5))).toEqual(["CHEM131", "CHEM132", "CHEM271"]);
    expect(creditForAp("Chemistry", 5).credits).toBe(6);
  });

  it("gives US History 4 a choice of HIST200 or HIST201", () => {
    expect(creditForAp("United States History", 4).parts).toEqual([
      {
        kind: "choice",
        credits: 3,
        options: [
          { id: "HIST200", genEd: ["DSHS", "DSHU"] },
          { id: "HIST201", genEd: ["DSHS", "DSHU", "DVUP"] },
        ],
      },
    ]);
  });

  it("keeps the chart's wording and notes", () => {
    expect(creditForAp("Psychology", 4).chartText).toBe("PSYC 100 (DSHS or DSNS)");
    expect(creditForAp("Calculus AB", 5).notes.join(" ")).toMatch(/Calculus AB or BC/);
  });

  it("accepts the chart's names, an 'AP' prefix and any case", () => {
    expect(creditForAp("AP Calculus BC", 5).exam).toBe("Calculus BC");
    expect(creditForAp("Math-Calculus BC", 5).exam).toBe("Calculus BC");
    expect(creditForAp("english language & composition", 4).exam).toBe("English Language and Composition");
  });

  it("rejects an exam the chart doesn't list", () => {
    expect(() => creditForAp("Underwater Basket Weaving", 5)).toThrow(CreditError);
  });

  it("rejects a score outside 1–5", () => {
    expect(() => creditForAp("Calculus BC", 6)).toThrow(CreditError);
    expect(() => creditForAp("Calculus BC", 4.5)).toThrow(CreditError);
  });

  it("lists every exam by name", () => {
    expect(apExamNames()).toContain("Calculus BC");
    expect(apExamNames()).toHaveLength(43);
  });
});
