// Anthropology Major, Bachelor of Arts, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/anthropology/anthropology-major/
// (fetched 2026-09-28); Department of Anthropology, "How to become an Anthropology Major?",
// https://anth.umd.edu/undergraduate/how-become-anthropology-major (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const anthMajorBa: Program = {
  id: "anth-major-ba",
  name: "Anthropology Major (Bachelor of Arts)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Anthropology Major, " +
    "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/anthropology/anthropology-major/ " +
    "(fetched 2026-09-28); Department of Anthropology, \"How to become an Anthropology Major?\", " +
    "https://anth.umd.edu/undergraduate/how-become-anthropology-major (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "No department-vs-catalog disagreement found on degree requirements: the department page only describes the admission process (meet the undergraduate advisor, complete an academic planning workshop, submit a graduation plan for approval, up to 15 business days) -- an admission gate, not a degree-completion rule, so it isn't encoded.",
    "Foundational Courses ('select three of the following: ANTH210, ANTH222, ANTH240, ANTH260') and Method and Theory Courses ('select two of: ANTH310, ANTH322, ANTH340, ANTH360') are encoded as `choose` requirements with `count`, not `credits`, since ANTH222 (4 credits) makes the pool's total credits variable (9-10) depending which three are picked.",
    "Applied Field Methods ('select a minimum of 3 credits' from a named list) is encoded as a `choose` requirement with `credits: 3` over that course list.",
    "Anthropology Electives ('a minimum of 12 credits offered in Anthropology, not double-counted for other Anthropology requirements') is encoded as a `choose` requirement over department ANTH, `credits: 12`, excluding every course already used by Foundational, Method and Theory, and Applied Field Methods above (same pattern as geol-major-professional-2026-27.ts's geology elective) so it can't double-count against them.",
    "Sample plan only: the Anthropology Electives requirement matches any ANTH-department course not used elsewhere, but every ANTH course number named in the fetched source (program-sources/anthropology-major.md) is already claimed by Foundational, Method and Theory, or Applied Field Methods. The sample plan fills the 12 credits with ANTH323, ANTH441, ANTH415 and ANTH440 -- real ANTH courses (checked against the Academic Catalog approved-course list, 2026-09-28); flagged in docs/project/owner-review.md for the owner to substitute real current ANTH elective offerings.",
    "NOT encoded (unenumerable, flagged in docs/project/owner-review.md): the B.A. Supporting Course Work requirement, 'Supporting courses approved by a faculty member', 18 credits -- no course list exists to check against; the audit needs an enumerable course set.",
    "NOT encoded (ambiguous source, flagged in docs/project/owner-review.md): the footnote 'Students with an archaeological focus must take this class' appears twice around the Applied Field Methods list in the fetched source; it isn't clear which course it modifies (most likely ANTH496, 'Field Methods in Archaeology 1') or what defines an 'archaeological focus', since the catalog page never establishes a formal archaeology concentration/track elsewhere.",
    "Not encoded (engine gap): the catalog's 'minimum 2.0 cumulative grade point average across all courses used to satisfy major degree requirements' -- the audit checks per-course minGrade (encoded here as C-), not a GPA average across the major's courses. Also not encoded: the program's own credit-range totals (39-54, driven entirely by the variable Foundational/Quantitative/Supporting Course Work sub-ranges) -- the audit has no total-credit-minimum concept.",
  ],
  requirements: [
    {
      kind: "choose",
      id: "foundational",
      name: "Foundational Courses (select three)",
      count: 3,
      from: { courses: ["ANTH210", "ANTH222", "ANTH240", "ANTH260"] },
    },
    {
      kind: "choose",
      id: "method-theory",
      name: "Method and Theory Courses (select two)",
      count: 2,
      from: { courses: ["ANTH310", "ANTH322", "ANTH340", "ANTH360"] },
    },
    {
      kind: "choose",
      id: "applied-field-methods",
      name: "Applied Field Methods (minimum 3 credits)",
      credits: 3,
      from: {
        courses: [
          "ANTH271", "ANTH341", "ANTH447", "ANTH451", "ANTH464", "ANTH467",
          "ANTH468", "ANTH472", "ANTH491", "ANTH492", "ANTH498", "ANTH496",
        ],
      },
    },
    {
      kind: "choose",
      id: "anthropology-electives",
      name: "Anthropology Electives (minimum 12 credits)",
      credits: 12,
      from: {
        departments: ["ANTH"],
        exclude: [
          "ANTH210", "ANTH222", "ANTH240", "ANTH260",
          "ANTH310", "ANTH322", "ANTH340", "ANTH360",
          "ANTH271", "ANTH341", "ANTH447", "ANTH451", "ANTH464", "ANTH467",
          "ANTH468", "ANTH472", "ANTH491", "ANTH492", "ANTH498", "ANTH496",
        ],
      },
    },
    {
      kind: "choose",
      id: "quantitative-skills-ba",
      name: "Quantitative Skills Requirement (B.A., select one)",
      count: 1,
      from: {
        courses: [
          "BIOM301", "ECON201", "ECON321", "GEOG306", "PSYC200",
          "QMMS251", "SOCY200", "STAT100", "MATH107",
        ],
      },
    },
  ],
};

export const anthMajorBaMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Anthropology (B.A.)",
  major: "anth",
  track: "B.A.",
  defaultTrack: true,
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/anthropology/anthropology-major/",
    department: "https://anth.umd.edu/undergraduate/how-become-anthropology-major",
  },
};
