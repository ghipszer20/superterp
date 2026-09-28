// Human-Centered Artificial Intelligence Major, Arts Specialization, 2026-27 UMD Academic Catalog.
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

export const hcaiMajorArts: Program = {
  id: "hcai-major-arts",
  name: "Human-Centered Artificial Intelligence Major (Arts)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Human-Centered Artificial Intelligence Major (Arts Specialization) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Arts Specialization (6 courses / 18 credits): catalog names 10 eligible courses (AMST260, " +
      "ARCH418J, ARTT255, ARTT370, COMM371, COMM373, COMM449A, THET116, THET385, THET475) with no " +
      "further constraint on the mix; encoded as a `choose` of 6 from exactly that named list.",
    ...hcaiCommonReviewNotes,
  ],
  requirements: [
    ...hcaiTechnicalCore,
    ...hcaiEthicalSocialCore,
    {
      kind: "choose",
      id: "specialization-arts",
      name: "Arts Specialization (choose 6)",
      count: 6,
      from: {
        courses: [
          "AMST260",
          "ARCH418J",
          "ARTT255",
          "ARTT370",
          "COMM371",
          "COMM373",
          "COMM449A",
          "THET116",
          "THET385",
          "THET475",
        ],
      },
    },
    hcaiCapstone,
  ],
};

export const hcaiMajorArtsMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Human-Centered AI (Arts)",
  major: "hcai",
  track: "Arts",
  defaultTrack: true,
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/",
    department: "https://drive.google.com/uc?export=download&id=11hH4qitJRsXvN2YkuQ3TnXOmlGF_RCrS#Human-Centered-Artificial-Intelligence",
  },
};
