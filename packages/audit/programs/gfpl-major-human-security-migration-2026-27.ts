// Global and Foreign Policy Major, Human Security and Migration track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/public-policy/global-and-foreign-policy-major/
// and spp.umd.edu/your-education/undergraduate/bachelor-arts-global-and-foreign-policy (fetched
// 2026-09-28). Owner ruling: the department page wins where it disagrees with the catalog; see
// gfpl-shared-2026-27.ts reviewNotes for the differences found.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { gfplSharedRequirements, gfplSharedReviewNotes } from "./gfpl-shared-2026-27.ts";

export const gfplMajorHumanSecurityMigration: Program = {
  id: "gfpl-major-human-security-migration",
  name: "Global and Foreign Policy Major (Human Security and Migration)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Global and Foreign Policy Major " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/public-policy/global-and-foreign-policy-major/); " +
    "School of Public Policy department page " +
    "(https://spp.umd.edu/your-education/undergraduate/bachelor-arts-global-and-foreign-policy) (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "OPEN SLOT: 6 credits, Human Security and Migration Track Elective Courses (two courses 'linked to that track', from SPP or " +
      "elsewhere on campus). The linked approved-course list is not in the fetched source, so these are left " +
      "out of requirements.",
    ...gfplSharedReviewNotes,
  ],
  requirements: [
    ...gfplSharedRequirements,
    { kind: "course", id: "track-anchor", name: "Track Anchor Course: GFPL372 Foundations of Human Security and Migration", options: ["GFPL372"] },
  ],
};

export const gfplMajorHumanSecurityMigrationMeta: ProgramMeta = {
  kind: "major",
  college: "PLCY",
  short: "Global and Foreign Policy (Human Security and Migration)",
  major: "gfpl",
  track: "Human Security and Migration",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/public-policy/global-and-foreign-policy-major/",
    department: "https://spp.umd.edu/your-education/undergraduate/bachelor-arts-global-and-foreign-policy",
  },
};
