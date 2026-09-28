// Human-Centered Artificial Intelligence Major, Language and Cognition Specialization,
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

const LING_COURSES = ["LING311", "LING312", "LING440", "LING449"];
const PHIL_COURSES = ["PHIL202", "PHIL360", "PHIL366", "PHIL408", "PHIL488"];

export const hcaiMajorLanguageCognition: Program = {
  id: "hcai-major-language-cognition",
  name: "Human-Centered Artificial Intelligence Major (Language and Cognition)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Human-Centered Artificial Intelligence Major (Language and " +
    "Cognition Specialization) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Language and Cognition Specialization (6 courses / 18 credits, catalog: 'at least 2 courses " +
      "must be from LING and 2 courses must be from PHIL'): the named list has 4 LING courses " +
      "(LING311, LING312, LING440, LING449) and 5 PHIL courses (PHIL202, PHIL360, PHIL366, PHIL408, " +
      "PHIL488). Encoded as three `choose` requirements so a course counts toward only one: at least " +
      "2 from the LING list, at least 2 from the PHIL list, and 2 more from either list -- together " +
      "totaling exactly 6 courses with the catalog's minimum-2-per-department floor enforced.",
    ...hcaiCommonReviewNotes,
  ],
  requirements: [
    ...hcaiTechnicalCore,
    ...hcaiEthicalSocialCore,
    {
      kind: "choose",
      id: "specialization-lang-cognition-ling",
      name: "Language and Cognition Specialization: at least 2 LING courses",
      count: 2,
      from: { courses: LING_COURSES },
    },
    {
      kind: "choose",
      id: "specialization-lang-cognition-phil",
      name: "Language and Cognition Specialization: at least 2 PHIL courses",
      count: 2,
      from: { courses: PHIL_COURSES },
    },
    {
      kind: "choose",
      id: "specialization-lang-cognition-additional",
      name: "Language and Cognition Specialization: 2 additional courses from either list",
      count: 2,
      from: { courses: [...LING_COURSES, ...PHIL_COURSES] },
    },
    hcaiCapstone,
  ],
};

export const hcaiMajorLanguageCognitionMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Human-Centered AI (Language & Cognition)",
  major: "hcai",
  track: "Language and Cognition",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/",
    department: "https://drive.google.com/uc?export=download&id=11hH4qitJRsXvN2YkuQ3TnXOmlGF_RCrS#Human-Centered-Artificial-Intelligence",
  },
};
