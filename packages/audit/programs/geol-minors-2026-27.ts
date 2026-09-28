// Chesapeake Bay: Watersheds and Water Resources Minor, Earth History Minor, Earth Material
// Properties Minor, and Geochemistry Minor, 2026–27 UMD Academic Catalog (Department of
// Geological, Environmental, and Planetary Sciences).
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/geological-environmental-planetary-sciences/
// chesapeake-bay-watersheds-water-resources-minor/, earth-history-minor/,
// earth-material-properties-minor/, and geochemistry-minor/ (fetched 2026-09-27); Department of
// Geological, Environmental, and Planetary Sciences,
// https://www.geol.umd.edu/undergraduate/Geology_Minors.php (fetched 2026-09-27; covers all four).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page. No official published sample plans (built from the requirements
// below; see docs/project/owner-review.md).
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

const SOURCE_GEOL_MINORS =
  "UMD Academic Catalog 2026–27, Geological, Environmental, and Planetary Sciences minors; " +
  "Department of Geological, Environmental, and Planetary Sciences, " +
  "https://www.geol.umd.edu/undergraduate/Geology_Minors.php (fetched 2026-09-27)";

export const geolMinorChesapeakeBay: Program = {
  id: "geol-minor-chesapeake-bay",
  name: "Chesapeake Bay: Watersheds and Water Resources Minor",
  catalogYear: "2026-27",
  source: SOURCE_GEOL_MINORS,
  minGrade: "C-",
  verified: false,
  maxSharedWith: [{ courses: 2 }],
  reviewNotes: [
    "Both sources agree exactly: ENST333 + GEOL452 required; 3 electives (9 credits) from the same 16-course list.",
    "Catalog's elective condition 'with at least one course from GEOL or ENST' isn't enforced (the engine has no 'at least one from a sub-group within a choose' rule); all 3 electives could in principle come from outside GEOL/ENST -- manual check.",
    "'Maximum six credits or two courses may overlap between the minor and a student's major' -> maxSharedWith: [{ courses: 2 }].",
    "Department-vs-catalog difference: the department page adds 'open to Geology and Environmental Science and Technology majors'; the catalog doesn't restrict eligibility. Not enforced (no declared-major concept); noted for the owner -- unclear whether this narrows or merely describes typical declarers.",
    "'All coursework must occur at UMD, College Park' (catalog) is a residency rule, not encoded.",
  ],
  requirements: [
    { kind: "course", id: "ecosystem", name: "Ecosystem Health and Protection", options: ["ENST333"] },
    { kind: "course", id: "watershed", name: "Watershed and Wetland Hydrology", options: ["GEOL452"] },
    {
      kind: "choose",
      id: "electives",
      name: "Electives",
      count: 3,
      from: {
        courses: [
          "AOSC421",
          "AREC200",
          "BSCI467",
          "ENST373",
          "ENST417",
          "ENST423",
          "ENST430",
          "ENST450",
          "ENST453",
          "ENST485",
          "GEOG441",
          "GEOL340",
          "GEOL435",
          "GEOL451",
          "GEOL453",
          "GEOL460",
        ],
      },
    },
  ],
};

export const geolMinorEarthHistory: Program = {
  id: "geol-minor-earth-history",
  name: "Earth History Minor",
  catalogYear: "2026-27",
  source: SOURCE_GEOL_MINORS,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Both sources agree exactly: one of three foundation options (GEOL100+GEOL110, GEOL120+GEOL110, or GEOL102 alone), then 3 electives from GEOL331/341/342/436/437/499.",
    "Available to non-Geology majors; declaring requires consulting the department's Director of Undergraduate Studies (catalog) -- an advising step, not encoded. Neither source states a sharing cap; none is set.",
  ],
  requirements: [
    {
      kind: "sets",
      id: "foundation",
      name: "Foundation course",
      options: [["GEOL100", "GEOL110"], ["GEOL120", "GEOL110"], ["GEOL102"]],
    },
    {
      kind: "choose",
      id: "electives",
      name: "Electives",
      count: 3,
      from: { courses: ["GEOL331", "GEOL341", "GEOL342", "GEOL436", "GEOL437", "GEOL499"] },
    },
  ],
};

export const geolMinorEarthMaterialProperties: Program = {
  id: "geol-minor-earth-material-properties",
  name: "Earth Material Properties Minor",
  catalogYear: "2026-27",
  source: SOURCE_GEOL_MINORS,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Both sources agree exactly: one of three foundation options (GEOL100+GEOL110, GEOL120+GEOL110, or GEOL322 alone), then 3 electives from GEOL341/423/443/445 plus 'GEOL456 (Engineering Geology) or GEOL457 (Seismology)' and GEOL499.",
    "'GEOL456 or GEOL457' is one row on both pages (unlike the other plain rows); encoded as an alternatives pair (like CMSC's 'not both 460 and 466') so taking both counts only once toward the 3 electives, not two.",
    "Available to non-Geology majors, administered by the department's Geology Undergraduate Studies Director (advising recommended, not mandatory) -- not encoded. Neither source states a sharing cap; none is set.",
  ],
  requirements: [
    {
      kind: "sets",
      id: "foundation",
      name: "Foundation course",
      options: [["GEOL100", "GEOL110"], ["GEOL120", "GEOL110"], ["GEOL322"]],
    },
    {
      kind: "choose",
      id: "electives",
      name: "Electives",
      count: 3,
      from: { courses: ["GEOL341", "GEOL423", "GEOL443", "GEOL445", "GEOL456", "GEOL457", "GEOL499"] },
      alternatives: [["GEOL456", "GEOL457"]],
    },
  ],
};

export const geolMinorGeochemistry: Program = {
  id: "geol-minor-geochemistry",
  name: "Geochemistry Minor",
  catalogYear: "2026-27",
  source: SOURCE_GEOL_MINORS,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Both sources agree exactly: one of three foundation options (GEOL100+GEOL110, GEOL120+GEOL110, or GEOL322 alone), then one of GEOL444/GEOL445 as the core course, then 2 electives from GEOL435/436/443/444/445/471/499.",
    "The catalog's footnote 'GEOL444/445 can only be used in the elective slot if not already used for the core requirement' is the audit's default behavior (a course counts toward one non-overlay requirement only), so no extra encoding was needed.",
    "Available to non-Geology majors (advising recommended, not mandatory) -- not encoded. Neither source states a sharing cap; none is set.",
  ],
  requirements: [
    {
      kind: "sets",
      id: "foundation",
      name: "Foundation course",
      options: [["GEOL100", "GEOL110"], ["GEOL120", "GEOL110"], ["GEOL322"]],
    },
    { kind: "course", id: "core", name: "Core geochemistry course", options: ["GEOL444", "GEOL445"] },
    {
      kind: "choose",
      id: "electives",
      name: "Electives",
      count: 2,
      from: { courses: ["GEOL435", "GEOL436", "GEOL443", "GEOL444", "GEOL445", "GEOL471", "GEOL499"] },
    },
  ],
};

export const geolMinorChesapeakeBayMeta: ProgramMeta = { kind: "minor", college: "CMNS", short: "Chesapeake Bay", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/geological-environmental-planetary-sciences/chesapeake-bay-watersheds-water-resources-minor/", department: "https://www.geol.umd.edu/undergraduate/Geology_Minors.php" } };

export const geolMinorEarthHistoryMeta: ProgramMeta = { kind: "minor", college: "CMNS", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/geological-environmental-planetary-sciences/earth-history-minor/", department: "https://www.geol.umd.edu/undergraduate/Geology_Minors.php" } };

export const geolMinorEarthMaterialPropertiesMeta: ProgramMeta = { kind: "minor", college: "CMNS", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/geological-environmental-planetary-sciences/earth-material-properties-minor/", department: "https://www.geol.umd.edu/undergraduate/Geology_Minors.php" } };

export const geolMinorGeochemistryMeta: ProgramMeta = { kind: "minor", college: "CMNS", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/geological-environmental-planetary-sciences/geochemistry-minor/", department: "https://www.geol.umd.edu/undergraduate/Geology_Minors.php" } };
