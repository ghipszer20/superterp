import { describe, expect, it } from "vitest";
import { buildXlsx } from "./xlsx";
import { CATEGORY_COLORS, type Takeout } from "./takeout";

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
  flags: [],
  prior: { totalCredits: 0, entries: [] },
  tracks: [],
};

describe("buildXlsx", () => {
  it("writes a Plan sheet with term columns and category fills, and an Audit sheet with citations", async () => {
    const buf = await buildXlsx(takeout);
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf);
    const plan = wb.getWorksheet("Plan")!;
    const cells: Record<string, string> = {};
    let fill = "";
    plan.eachRow((row) =>
      row.eachCell((cell) => {
        const v = String(cell.value ?? "");
        cells[v] = cell.address;
        if (v.startsWith("CMSC131")) fill = String((cell.fill as { fgColor?: { argb?: string } }).fgColor?.argb);
      }),
    );
    expect(Object.keys(cells)).toEqual(expect.arrayContaining(["Fall 2026", "Spring 2027", "2026–27"]));
    expect(fill).toContain(CATEGORY_COLORS.major);
    const audit = wb.getWorksheet("Audit")!;
    const text: string[] = [];
    audit.eachRow((row) => row.eachCell((c) => text.push(String(c.value ?? ""))));
    expect(text).toContain("Computer Science, 2026-27 catalog (UMD catalog)");
  }, 60000);
});
