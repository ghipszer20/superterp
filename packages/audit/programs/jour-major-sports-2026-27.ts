// Journalism Major, Sports Specialization, 2026-27 UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/journalism/journalism-major/
//   (fetched 2026-09-28). See jour-shared-2026-27.ts for the shared requirements and notes.
// Catalog only (department page not checked). UNVERIFIED until owner sign-off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { jourCommonReviewNotes, jourCore, jourSources } from "./jour-shared-2026-27.ts";

export const jourMajorSports: Program = {
  id: "jour-major-sports",
  name: "Journalism Major (Sports Specialization)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Journalism Major, " +
    "https://academiccatalog.umd.edu/undergraduate/colleges-schools/journalism/journalism-major/ (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    ...jourCommonReviewNotes,
    "Sports Specialization (11-21 credits): which JOUR courses count as 'sports' skills or seminar " +
      "courses is not listed in the source, so those rows accept any JOUR course in 321-389 and " +
      "410-469 respectively, as overlays.",
    "OPEN SLOT: sports capstone course, 3-9 credits (covered by the capstone OPEN SLOT above; if a second " +
      "sports capstone replaces the experiential course, each is limited to 6 credits).",
    "OPEN SLOT: sports experiential course, 2-6 credits: an approved sports internship for JOUR396 (the " +
      "core JOUR396 already covers 2 credits) or a second sports-focused capstone. Which internships are " +
      "sports-approved is not stated.",
  ],
  requirements: [
    ...jourCore,
    {
      kind: "choose",
      id: "sports-skills",
      name: "Sports skills JOUR course from the 321-389 range",
      overlay: true,
      count: 1,
      from: { departments: ["JOUR"], minNumber: 321, maxNumber: 389 },
    },
    {
      kind: "choose",
      id: "sports-seminar",
      name: "Sports discussion/seminar JOUR course from the 410-469 range",
      overlay: true,
      count: 1,
      from: { departments: ["JOUR"], minNumber: 410, maxNumber: 469 },
    },
  ],
};

export const jourMajorSportsMeta: ProgramMeta = {
  kind: "major",
  college: "JOUR",
  short: "Journalism (Sports)",
  major: "jour",
  track: "Sports",
  sources: jourSources,
};
