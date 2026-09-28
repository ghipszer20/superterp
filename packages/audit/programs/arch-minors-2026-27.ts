// Artificial Intelligence in Architecture Minor and Construction Project Management Minor,
// 2026–27 UMD Academic Catalog (School of Architecture, Planning and Preservation).
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/architecture-planning-preservation/
// artificial-intelligence-in-architecture-Minor/ and .../construction-project-management-minor/;
// Project Management Center for Excellence, https://pm.umd.edu/program/cpm-minor (all fetched 2026-09-28).
// No official published sample plans (built from the requirements below; see docs/project/owner-review.md).
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const archAiMinor: Program = {
  id: "arch-ai-minor",
  name: "Artificial Intelligence in Architecture Minor",
  catalogYear: "2026-27",
  source: "UMD Academic Catalog 2026–27, Artificial Intelligence in Architecture Minor (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "No department page was fetched; encoded from the catalog. Department page not checked.",
    "The catalog lists five courses (15 credits) with no 'or' and no elective choice: ARCH230, PHIL211, ARCH470, and two ARCH418 sections (ARCH418J AI and Architecture, ARCH418D AI and Sustainability). Encoded as all required.",
    "ARCH418 is a selected-topics number: the audit sees one course code, so the two required sections are checked as ONE ARCH418 course. That the student took both the J and D sections is a manual check.",
    "Catalog states no minimum grade, GPA or sharing cap; none is set.",
  ],
  requirements: [
    { kind: "course", id: "arch230", name: "AI and the Built Environment", options: ["ARCH230"] },
    { kind: "course", id: "phil211", name: "AI & Ethics", options: ["PHIL211"] },
    { kind: "course", id: "arch418", name: "Selected Topics in Architectural Technology (ARCH418J and ARCH418D; sections checked manually)", options: ["ARCH418"] },
    { kind: "course", id: "arch470", name: "Computer Applications in Architecture", options: ["ARCH470"] },
  ],
};

export const archAiMinorMeta: ProgramMeta = { kind: "minor", college: "ARCH", short: "AI in Architecture Minor", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/architecture-planning-preservation/artificial-intelligence-in-architecture-Minor/" } };

export const archConstructionProjectManagementMinor: Program = {
  id: "arch-construction-project-management-minor",
  name: "Construction Project Management Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Construction Project Management Minor (School of Architecture, Planning and Preservation; " +
    "identical table under Civil and Environmental Engineering); Project Management Center for Excellence, " +
    "https://pm.umd.edu/program/cpm-minor (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Cross-listed: the ARCH and ENGR (Civil and Environmental Engineering) catalog pages carry the same requirement table (verified by diff: only the title suffix and URL differ). Encoded once under college ARCH.",
    "Department-vs-catalog difference: the department page's elective list is ARCH430, ARCH462, ARCH467, ENCE421, ENCE422 and omits ENCE420 (Selection and Utilization of Construction Equipment), which the catalog lists. Kept ENCE420 (accepting the larger catalog list, never narrower); the owner may decide.",
    "Both sources agree on the core: ENCE325, ENCE423, ENCE424, and ENCE426 or ARCH472.",
    "Not encoded: minimum 2.0 GPA for the minor (catalog); a construction-industry internship (both sources; the department page says summer after junior year); eligibility from the department page (Clark School of Engineering or School of Architecture, Planning & Preservation students with at least 60 credits and a 3.0 GPA or higher).",
    "Neither source states a sharing cap, so none is set. The separate Project Management Minor (project-management-minor) is a different minor.",
  ],
  requirements: [
    { kind: "course", id: "ence325", name: "Introduction to Construction Project Management", options: ["ENCE325"] },
    { kind: "course", id: "ence423", name: "Project Planning, Estimating & Scheduling", options: ["ENCE423"] },
    { kind: "course", id: "ence424", name: "Communication for Project Managers", options: ["ENCE424"] },
    { kind: "course", id: "bim", name: "Construction Documentation and BIM (ENCE426) or BIM Communication and Collaboration (ARCH472)", options: ["ENCE426", "ARCH472"] },
    { kind: "course", id: "elective", name: "Elective", options: ["ENCE420", "ENCE421", "ENCE422", "ARCH430", "ARCH462", "ARCH467"] },
  ],
};

export const archConstructionProjectManagementMinorMeta: ProgramMeta = { kind: "minor", college: "ARCH", short: "Construction Project Mgmt. Minor", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/architecture-planning-preservation/construction-project-management-minor/", department: "https://pm.umd.edu/program/cpm-minor" } };
