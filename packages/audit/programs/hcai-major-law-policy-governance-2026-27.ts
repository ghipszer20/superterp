// Human-Centered Artificial Intelligence Major, Law, Policy, and Governance Specialization,
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

export const hcaiMajorLawPolicyGovernance: Program = {
  id: "hcai-major-law-policy-governance",
  name: "Human-Centered Artificial Intelligence Major (Law, Policy, and Governance)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Human-Centered Artificial Intelligence Major (Law, Policy, and " +
    "Governance Specialization) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Law, Policy, and Governance Specialization (7 courses / 21 credits -- the one specialization " +
      "that is not 6 courses / 18 credits, per the catalog: 'GVPT170 is required for this " +
      "specialization along with 6 other courses for a total of 21 credits'): encoded as a mandatory " +
      "GVPT170 plus a `choose` of 6 from the remaining 13 named courses (COMM330, GVPT331, GVPT431, " +
      "GVPT432, HIST338F, HIST454, HIST455, PHIL347, PHIL438, PHIL445, PLCY100, PLCY313, WGSS200).",
    ...hcaiCommonReviewNotes,
  ],
  requirements: [
    ...hcaiTechnicalCore,
    ...hcaiEthicalSocialCore,
    {
      kind: "course",
      id: "gvpt170",
      name: "American Government (GVPT170)",
      options: ["GVPT170"],
    },
    {
      kind: "choose",
      id: "specialization-law-policy-governance",
      name: "Law, Policy, and Governance Specialization (choose 6, in addition to GVPT170)",
      count: 6,
      from: {
        courses: [
          "COMM330",
          "GVPT331",
          "GVPT431",
          "GVPT432",
          "HIST338F",
          "HIST454",
          "HIST455",
          "PHIL347",
          "PHIL438",
          "PHIL445",
          "PLCY100",
          "PLCY313",
          "WGSS200",
        ],
      },
    },
    hcaiCapstone,
  ],
};

export const hcaiMajorLawPolicyGovernanceMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Human-Centered AI (Law, Policy & Governance)",
  major: "hcai",
  track: "Law, Policy, and Governance",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/philosophy/human-centered-artificial-intelligence-major/",
    department: "https://drive.google.com/uc?export=download&id=11hH4qitJRsXvN2YkuQ3TnXOmlGF_RCrS#Human-Centered-Artificial-Intelligence",
  },
};
