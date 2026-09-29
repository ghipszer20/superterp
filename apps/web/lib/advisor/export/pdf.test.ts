import { describe, expect, it } from "vitest";
import { buildPdf } from "./pdf";
import { FOOTER, type Takeout } from "./takeout";

const takeout: Takeout = {
  header: { programs: ["Computer Science"], catalogYear: "2026-27", expectedGraduation: "Spring 2027", date: "2026-09-29", disclaimer: "Unofficial, not affiliated with UMD, verify with your advisor", gradesHidden: false },
  terms: [
    { name: "Fall 2026", credits: 4, courses: [{ id: "CMSC131", title: "OOP I", credits: 4, grade: "A", category: "major" }] },
    { name: "Spring 2027", credits: 3, courses: [{ id: "ART100", title: "", credits: 3, grade: "", category: "elective" }] },
  ],
  audit: [
    {
      program: "Computer Science",
      citation: "Computer Science, 2026-27 catalog (UMD catalog)",
      requirements: [{ name: "Core", status: "partial", citation: "Computer Science, 2026-27 catalog (UMD catalog)", assigned: ["CMSC131"], need: "1 more", satisfiedBy: ["CMSC216"] }],
    },
  ],
  flags: [{ title: "Prerequisites and order", items: [{ severity: "error", term: "Fall 2026", course: "CMSC132", message: "Needs CMSC131 first." }] }],
  prior: { totalCredits: 4, entries: [{ source: "AP Calculus BC (5)", status: "counted", credits: 4, notes: [] }] },
  tracks: [{ name: "Pre-Med", requirements: [{ name: "Biology", status: "missing", satisfiedBy: ["BSCI170"] }] }],
};

describe("buildPdf", () => {
  it("makes a letter PDF with the header and the disclaimer footer on every page", async () => {
    const doc = await buildPdf(takeout);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    const out = doc.output();
    expect(out).toContain("Advising takeout");
    expect(out).toContain("Computer Science");
    expect(out).toContain(FOOTER);
    expect(out).toContain("Page 1 of");
  }, 60000);
});
