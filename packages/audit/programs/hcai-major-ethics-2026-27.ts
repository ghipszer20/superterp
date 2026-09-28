// Human-Centered Artificial Intelligence Major, Ethics Specialization, 2026-27 UMD Academic Catalog.
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

export const hcaiMajorEthics: Program = {
  id: "hcai-major-ethics",
  name: "Human-Centered Artificial Intelligence Major (Ethics)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Human-Centered Artificial Intelligence Major (Ethics Specialization) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Ethics Specialization (6 courses / 18 credits): catalog names 8 eligible courses (INST366, " +
      "PHIL341, PHIL344, PHIL347, PHIL438, PHIL440, PHPE308, HCAI410) with no further constraint on " +
      "the mix; encoded as a `choose` of 6 from exactly that named list.",
    ...hcaiCommonReviewNotes,
  ],
  requirements: [
    ...hcaiTechnicalCore,
    ...hcaiEthicalSocialCore,
    {
      kind: "choose",
      id: "specialization-ethics",
      name: "Ethics Specialization (choose 6)",
      count: 6,
      from: {
        courses: ["INST366", "PHIL341", "PHIL344", "PHIL347", "PHIL438", "PHIL440", "PHPE308", "HCAI410"],
      },
    },
    hcaiCapstone,
  ],
};

export const hcaiMajorEthicsMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Human-Centered AI (Ethics)",
  major: "hcai",
  track: "Ethics",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/",
    department: "https://drive.google.com/uc?export=download&id=11hH4qitJRsXvN2YkuQ3TnXOmlGF_RCrS#Human-Centered-Artificial-Intelligence",
  },
};
