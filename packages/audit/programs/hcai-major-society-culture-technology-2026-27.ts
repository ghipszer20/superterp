// Human-Centered Artificial Intelligence Major, Society, Culture, and Technology Specialization,
// 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/;
// the college's official Human-Centered Artificial Intelligence Four Year Academic Plan (department
// source), https://drive.google.com/uc?export=download&id=11hH4qitJRsXvN2YkuQ3TnXOmlGF_RCrS#Human-Centered-Artificial-Intelligence
// (fetched 2026-09-28) -- decoded to garbled binary/glyph text, not readable plan text; no
// department-vs-catalog comparison was possible (see hcaiCommonReviewNotes).
// Owner ruling (docs/project/rulings.md): where the department source and the catalog disagree,
// follow the department source; only the catalog was available/readable here.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { hcaiTechnicalCore, hcaiEthicalSocialCore, hcaiCapstone, hcaiCommonReviewNotes } from "./hcai-shared-2026-27.ts";

export const hcaiMajorSocietyCultureTechnology: Program = {
  id: "hcai-major-society-culture-technology",
  name: "Human-Centered Artificial Intelligence Major (Society, Culture, and Technology)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Human-Centered Artificial Intelligence Major (Society, Culture, " +
    "and Technology Specialization) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Society, Culture, and Technology Specialization (6 courses / 18 credits): catalog names 10 " +
      "eligible courses (AMST260, ENGL318, ENGL467, HIST206, HIST407, IMDM150, JOUR389W, JOUR458A, " +
      "PHIL344, WGSS280) with no further constraint on the mix; encoded as a `choose` of 6 from " +
      "exactly that named list.",
    ...hcaiCommonReviewNotes,
  ],
  requirements: [
    ...hcaiTechnicalCore,
    ...hcaiEthicalSocialCore,
    {
      kind: "choose",
      id: "specialization-society-culture-technology",
      name: "Society, Culture, and Technology Specialization (choose 6)",
      count: 6,
      from: {
        courses: [
          "AMST260",
          "ENGL318",
          "ENGL467",
          "HIST206",
          "HIST407",
          "IMDM150",
          "JOUR389W",
          "JOUR458A",
          "PHIL344",
          "WGSS280",
        ],
      },
    },
    hcaiCapstone,
  ],
};

export const hcaiMajorSocietyCultureTechnologyMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Human-Centered AI (Society, Culture & Tech)",
  major: "hcai",
  track: "Society, Culture, and Technology",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/",
    department: "https://drive.google.com/uc?export=download&id=11hH4qitJRsXvN2YkuQ3TnXOmlGF_RCrS#Human-Centered-Artificial-Intelligence",
  },
};
