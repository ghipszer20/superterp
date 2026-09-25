// Hand-checked against the Registrar's IB chart for November 2023 – May 2026 exams (SOURCES.md).

import { describe, expect, it } from "vitest";
import { creditForIb, CreditError, ibExamNames } from "../src/index.ts";

describe("creditForIb", () => {
  it("gives Psychology SL 5 Gen Ed credit only, and SL 6 PSYC100", () => {
    expect(creditForIb("Psychology", "SL", 5)).toMatchObject({
      program: "IB",
      level: "SL",
      credits: 3,
      source: "IB Psychology SL (5)",
      parts: [{ kind: "generic", label: "No Direct Equivalent", credits: 3, genEd: ["DSHS"] }],
    });
    expect(creditForIb("Psychology", "SL", 6).parts).toEqual([{ kind: "course", id: "PSYC100", credits: 3, genEd: ["DSNS", "DSHS"] }]);
    expect(creditForIb("Psychology", "SL", 4)).toMatchObject({ credits: 0, parts: [] });
  });

  it("gives Mathematics: Analysis and Approaches HL 4 elective credit and HL 5 MATH140 and STAT100", () => {
    expect(creditForIb("Mathematics: Analysis and Approaches", "HL", 3).parts).toEqual([]);
    expect(creditForIb("Mathematics: Analysis and Approaches", "HL", 4)).toMatchObject({ credits: 4, parts: [{ label: "Lower Level Elective" }] });
    expect(creditForIb("Mathematics: Analysis and Approaches", "HL", 5)).toMatchObject({
      credits: 7,
      parts: [
        { id: "MATH140", credits: 4, genEd: ["FSMA", "FSAR"] },
        { id: "STAT100", credits: 3, genEd: ["FSMA", "FSAR"] },
      ],
    });
  });

  it("gives no credit where the chart says credit is not awarded", () => {
    expect(creditForIb("Mathematics: Analysis and Approaches", "SL", 7).parts).toEqual([]);
    expect(creditForIb("English B", "HL", 7).parts).toEqual([]);
  });

  it("gives no credit at a level the chart doesn't list", () => {
    expect(creditForIb("History: Africa", "SL", 7)).toMatchObject({ credits: 0, parts: [] });
  });

  it("gives Biology HL 6 the four BSCI courses and HL 5 lab-science credit", () => {
    expect(creditForIb("Biology", "HL", 5).parts).toEqual([{ kind: "generic", label: "No Direct Equivalent", credits: 4, genEd: ["DSNL"] }]);
    expect(creditForIb("Biology", "HL", 6).credits).toBe(8);
  });

  it("uses a language's all-exam-types row for its A, B and ab initio exams", () => {
    expect(creditForIb("Spanish B", "SL", 6)).toMatchObject({ exam: "Spanish", credits: 6 });
    expect(creditForIb("Spanish ab initio", "SL", 5).parts).toMatchObject([{ id: "SPAN203" }]);
    expect(creditForIb("French A: Language & Literature", "HL", 5).exam).toBe("French");
  });

  it("accepts the chart's spelling of exam titles", () => {
    expect(creditForIb("Applications/Intepretation", "HL", 5).exam).toBe("Mathematics: Applications and Interpretation");
    expect(creditForIb("Social and Cultural Anthropology", "SL", 4).parts).toMatchObject([{ id: "ANTH260" }]);
  });

  it("rejects an exam the chart doesn't list, and scores outside 1–7", () => {
    expect(() => creditForIb("Astrology", "HL", 7)).toThrow(CreditError);
    expect(() => creditForIb("Psychology", "HL", 8)).toThrow(CreditError);
    expect(() => creditForIb("Psychology", "HL", 0)).toThrow(CreditError);
  });

  it("lists every exam by name", () => {
    expect(ibExamNames()).toContain("Psychology");
    expect(ibExamNames()).toHaveLength(51);
  });
});
