// Human-Centered Artificial Intelligence Major, Design and User Experience Specialization,
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

export const hcaiMajorDesignUx: Program = {
  id: "hcai-major-design-ux",
  name: "Human-Centered Artificial Intelligence Major (Design and User Experience)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Human-Centered Artificial Intelligence Major (Design and User " +
    "Experience Specialization) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Design and User Experience Specialization (6 courses / 18 credits): catalog names exactly 6 " +
      "eligible courses (INST430, INST431, INST432, INST433, INST436, INST480), so the `choose 6` " +
      "requirement effectively requires all of them; encoded as `choose` of 6 from exactly that list " +
      "rather than 6 separate mandatory `course` requirements, matching the catalog's 'choose 6 " +
      "courses' framing for every specialization.",
    ...hcaiCommonReviewNotes,
  ],
  requirements: [
    ...hcaiTechnicalCore,
    ...hcaiEthicalSocialCore,
    {
      kind: "choose",
      id: "specialization-design-ux",
      name: "Design and User Experience Specialization (choose 6)",
      count: 6,
      from: {
        courses: ["INST430", "INST431", "INST432", "INST433", "INST436", "INST480"],
      },
    },
    hcaiCapstone,
  ],
};

export const hcaiMajorDesignUxMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Human-Centered AI (Design & UX)",
  major: "hcai",
  track: "Design and User Experience",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/",
    department: "https://drive.google.com/uc?export=download&id=11hH4qitJRsXvN2YkuQ3TnXOmlGF_RCrS#Human-Centered-Artificial-Intelligence",
  },
};
