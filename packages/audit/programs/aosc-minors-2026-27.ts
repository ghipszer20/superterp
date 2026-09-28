// Atmospheric Chemistry Minor, Atmospheric Sciences Minor, and Climate Change Fluency Minor,
// 2026–27 UMD Academic Catalog (all Department of Atmospheric & Oceanic Science).
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/atmospheric-oceanic-science/
// atmospheric-chemistry-minor/, atmospheric-sciences-minor/, and climate-change-fluency-minor/
// (fetched 2026-09-27); Department of Atmospheric & Oceanic Science,
// https://aosc.umd.edu/undergraduate/minor (fetched 2026-09-27; covers the Chemistry and Sciences
// minors, not Climate Change Fluency -- no separate department page for that one was found, see
// docs/project/owner-review.md). Owner ruling (docs/project/rulings.md): where the department page
// and the catalog disagree, follow the department page. No official published sample plans (built
// from the requirements below; see docs/project/owner-review.md).
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

const SOURCE_AOSC =
  "UMD Academic Catalog 2026–27, Atmospheric Chemistry / Atmospheric Sciences Minor; " +
  "Department of Atmospheric & Oceanic Science, https://aosc.umd.edu/undergraduate/minor (fetched 2026-09-27)";

export const aoscMinorChemistry: Program = {
  id: "aosc-minor-chemistry",
  name: "Atmospheric Chemistry Minor",
  catalogYear: "2026-27",
  source: SOURCE_AOSC,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Both sources agree on shape: 2 general electives (AOSC123, AOSC200, or any 400-level AOSC course), at least 2 of AOSC431/433/434, and 1 additional elective.",
    "The 'additional elective' slot's outside-department examples differ between sources (catalog: 'such as GEOG472 or GEOL437'; department: 'CHEM474, GEOL471, or related courses') -- both are illustrative, not exhaustive ('approved courses'), so neither is treated as the complete list; the slot is encoded as any 400-level AOSC course only, and the outside-department option is left as a manual/advisor-approval note rather than guessed.",
    "Prerequisites (MATH240/461, PHYS270/271, CHEM481/135/131) are background expected before the minor's own courses, not minor requirements themselves; not encoded (matches how both sources present them separately from 'required courses').",
    "'Not open to Atmospheric and Oceanic Sciences majors': an eligibility gate, not enforced (no declared-major concept in the engine).",
    "Neither source states a sharing cap with another program; none is set.",
  ],
  requirements: [
    {
      kind: "choose",
      id: "generalElectives",
      name: "General electives (AOSC123, AOSC200, or a 400-level AOSC course)",
      count: 2,
      from: { courses: ["AOSC123", "AOSC200"], departments: ["AOSC"], minNumber: 400, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "core",
      name: "Atmospheric chemistry core (at least two of AOSC431, AOSC433, AOSC434)",
      count: 2,
      from: { courses: ["AOSC431", "AOSC433", "AOSC434"] },
    },
    {
      kind: "choose",
      id: "additional",
      name: "Additional 400-level AOSC elective",
      count: 1,
      from: { departments: ["AOSC"], minNumber: 400, maxNumber: 499 },
    },
  ],
};

export const aoscMinorSciences: Program = {
  id: "aosc-minor-sciences",
  name: "Atmospheric Sciences Minor",
  catalogYear: "2026-27",
  source: SOURCE_AOSC,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Both sources agree exactly on shape and named courses: AOSC431 + AOSC432 required; 2 electives from AOSC123/AOSC200/AOSC400; 1 additional elective from other 400-level AOSC or approved Geology/Geography courses.",
    "The additional-elective outside-department examples (catalog: GEOL437, GEOL452, GEOG472) are used since the department page is only vaguer ('related Geology/Geography courses'), not in conflict; encoded as those three named courses plus any 400-level AOSC course.",
    "Prerequisites (MATH240/461, PHYS270/271, CHEM135/131) are background expected before the minor's own courses, not minor requirements themselves; not encoded.",
    "'Not open to Atmospheric and Oceanic Sciences majors': an eligibility gate, not enforced.",
    "Neither source states a sharing cap with another program; none is set.",
  ],
  requirements: [
    { kind: "course", id: "thermo", name: "Atmospheric Thermodynamics", options: ["AOSC431"] },
    { kind: "course", id: "dynamics", name: "Dynamics of the Atmosphere and Ocean", options: ["AOSC432"] },
    {
      kind: "choose",
      id: "electives",
      name: "Electives (AOSC123, AOSC200, AOSC400)",
      count: 2,
      from: { courses: ["AOSC123", "AOSC200", "AOSC400"] },
    },
    {
      kind: "choose",
      id: "additional",
      name: "Additional elective",
      count: 1,
      from: { courses: ["GEOL437", "GEOL452", "GEOG472"], departments: ["AOSC"], minNumber: 400, maxNumber: 499 },
    },
  ],
};

export const aoscMinorClimateFluency: Program = {
  id: "aosc-minor-climate-fluency",
  name: "Climate Change Fluency Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Climate Change Fluency Minor, " +
    "academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/atmospheric-oceanic-science/climate-change-fluency-minor/ " +
    "(fetched 2026-09-27); no separate AOSC department page found for this minor (department's general minor page, " +
    "https://aosc.umd.edu/undergraduate/minor, fetched 2026-09-27, covers only Chemistry/Sciences/Meteorology).",
  verified: false,
  reviewNotes: [
    "No department page could be found naming Climate Change Fluency specifically; encoded from the catalog alone. Flagged in docs/project/owner-review.md for the owner to supply a department source.",
    "AOSC123 and GEOL123 are cross-listed (catalog: 'AOSC/GEOL 123'); both codes are accepted for the requirement. Likewise AOSC/GEOL375, AOSC/CHEM433, AOSC/GEOL437, AOSC/GEOG440 in the electives.",
    "The catalog states no minimum grade for this minor (every sibling AOSC minor states C-); not encoded here rather than guessed -- flagged in docs/project/owner-review.md.",
    "'At least 3 electives, minimum 2 at the upper level': all 4 named elective slots here are already upper-level (200+), so the sub-mix constraint isn't binding for the encoded elective list, but the 'minimum 2 upper' phrasing itself isn't separately enforced.",
    "'One 3-credit course not listed, in a closely related area, with program-director approval' isn't encoded (open-ended, approval-gated).",
    "'Intended for non-science majors, open to all but AOSC majors': an eligibility note, not enforced.",
    "Neither source states a sharing cap with another program; none is set.",
  ],
  requirements: [
    { kind: "course", id: "globalChange", name: "Causes and Consequences of Global Change", options: ["AOSC123", "GEOL123"] },
    { kind: "course", id: "climateNoise", name: "Climate Change – Cutting Through the Noise", options: ["AOSC365"] },
    {
      kind: "choose",
      id: "electives",
      name: "Electives",
      count: 3,
      from: {
        courses: [
          "AOSC200",
          "AOSC247",
          "AOSC360",
          "AOSC375",
          "GEOL375",
          "AOSC401",
          "AOSC433",
          "CHEM433",
          "AOSC437",
          "GEOL437",
          "AOSC440",
          "GEOG440",
        ],
      },
    },
  ],
};
