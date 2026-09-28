// Geophysics Minor, Hydrology Minor, Surficial Geology Minor, Paleobiology Minor, and Planetary
// Sciences Minor, 2026–27 UMD Academic Catalog (all Department of Geological, Environmental, and
// Planetary Sciences; Paleobiology jointly with Entomology, Planetary Sciences jointly with
// Astronomy).
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/geological-environmental-planetary-sciences/
// geophysics-minor/, hydrology-minor/, surficial-geology-minor/, paleobiology-minor/, and
// planetary-sciences-minor/ (each fetched 2026-09-27 as the catalog's own generated PDF); also
// .../entomology/paleobiology-minor/ and .../astronomy/planetary-sciences-minor/ (fetched
// 2026-09-27, identical requirement tables to the GEPS versions -- one interdisciplinary minor
// each, encoded once here rather than as two registry entries a student could double-declare, same
// treatment as the Data Science Minor in the batch-1 file). Department of Geological,
// Environmental, and Planetary Sciences, https://www.geol.umd.edu/undergraduate/Geology_Minors.php
// (fetched 2026-09-27; covers all five, plus a general "C- per course, 2.0 minor GPA" policy
// statement that applies to every minor on the page). Owner ruling (docs/project/rulings.md):
// where the department page and the catalog disagree, follow the department page. No official
// published sample plans (built from the requirements below; see docs/project/owner-review.md).
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

const FOUNDATION_GEOL: [string, string][] = [
  ["GEOL100", "GEOL110"],
  ["GEOL120", "GEOL110"],
];

export const geolMinorGeophysics: Program = {
  id: "geol-minor-geophysics",
  name: "Geophysics Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Geophysics Minor; Department of Geological, Environmental, and " +
    "Planetary Sciences, https://www.geol.umd.edu/undergraduate/Geology_Minors.php (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Both sources agree exactly: one of two foundation pairs (GEOL100+GEOL110 or GEOL120+GEOL110), then two of GEOL446/447/457, then two more from GEOL341/412/446/447/455/456/457/499.",
    "The catalog's footnote 'GEOL446, GEOL447, GEOL457 only count toward the second elective group if not used to satisfy the first' is the audit's default behavior (a course counts toward one non-overlay requirement only), matching the Geochemistry Minor's treatment in the batch-1 file; no extra encoding needed.",
    "Available to non-Geology majors (advising recommended, not mandatory) -- not encoded. Neither source states a sharing cap with another program; none is set.",
  ],
  requirements: [
    { kind: "sets", id: "foundation", name: "Foundation course", options: FOUNDATION_GEOL.map((pair) => [...pair]) },
    { kind: "choose", id: "core", name: "Two of GEOL446, GEOL447, GEOL457", count: 2, from: { courses: ["GEOL446", "GEOL447", "GEOL457"] } },
    {
      kind: "choose",
      id: "electives",
      name: "Electives",
      count: 2,
      from: { courses: ["GEOL341", "GEOL412", "GEOL446", "GEOL447", "GEOL455", "GEOL456", "GEOL457", "GEOL499"] },
    },
  ],
};

export const geolMinorHydrology: Program = {
  id: "geol-minor-hydrology",
  name: "Hydrology Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Hydrology Minor; Department of Geological, Environmental, and " +
    "Planetary Sciences, https://www.geol.umd.edu/undergraduate/Geology_Minors.php (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Both sources agree exactly: one of two foundation pairs, then GEOL451 + GEOL452, then two electives from GEOL436, GEOL444, (GEOL453 or GEOL435, one cross-listed row), and GEOL499.",
    "'GEOL453 Ecosystem Restoration or GEOL435 Environmental Geochemistry' is one row on the catalog's own requirements table (like Earth Material Properties' 'GEOL456 or GEOL457' in the batch-1 file), so it's encoded as an alternatives pair -- taking both counts once toward the 2 electives, not two.",
    "Available to non-Geology majors (advising recommended, not mandatory) -- not encoded. Neither source states a sharing cap with another program; none is set.",
  ],
  requirements: [
    { kind: "sets", id: "foundation", name: "Foundation course", options: FOUNDATION_GEOL.map((pair) => [...pair]) },
    { kind: "course", id: "groundwater", name: "Groundwater", options: ["GEOL451"] },
    { kind: "course", id: "watershed", name: "Watershed and Wetland Hydrology", options: ["GEOL452"] },
    {
      kind: "choose",
      id: "electives",
      name: "Electives",
      count: 2,
      from: { courses: ["GEOL436", "GEOL444", "GEOL453", "GEOL435", "GEOL499"] },
      alternatives: [["GEOL453", "GEOL435"]],
    },
  ],
};

export const geolMinorSurficialGeology: Program = {
  id: "geol-minor-surficial-geology",
  name: "Surficial Geology Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Surficial Geology Minor; Department of Geological, Environmental, " +
    "and Planetary Sciences, https://www.geol.umd.edu/undergraduate/Geology_Minors.php (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Both sources agree exactly: one of two foundation pairs, then GEOL123 and GEOL340 (both required, not alternatives to the foundation), then two electives from GEOL331/342/435/437/444/499 plus a 'GEOL451 or GEOL452' cross-listed row.",
    "'GEOL451 or GEOL452' is one row on the requirements table (the same pattern as Hydrology's 453/435 row above), encoded as an alternatives pair.",
    "Available to non-Geology majors (advising recommended, not mandatory) -- not encoded. Neither source states a sharing cap with another program; none is set.",
  ],
  requirements: [
    { kind: "sets", id: "foundation", name: "Foundation course", options: FOUNDATION_GEOL.map((pair) => [...pair]) },
    { kind: "course", id: "globalChange", name: "Causes and Consequences of Global Change", options: ["GEOL123"] },
    { kind: "course", id: "geomorphology", name: "Geomorphology", options: ["GEOL340"] },
    {
      kind: "choose",
      id: "electives",
      name: "Electives",
      count: 2,
      from: { courses: ["GEOL331", "GEOL342", "GEOL435", "GEOL437", "GEOL444", "GEOL451", "GEOL452", "GEOL499"] },
      alternatives: [["GEOL451", "GEOL452"]],
    },
  ],
};

export const paleobiologyMinor: Program = {
  id: "paleobiology-minor",
  name: "Paleobiology Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Paleobiology Minor (GEPS and ENTM listings, identical); " +
    "Department of Geological, Environmental, and Planetary Sciences and Department of Entomology, " +
    "https://www.geol.umd.edu/undergraduate/Geology_Minors.php (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Listed twice in the catalog (once under GEPS, once under Entomology), 'administered jointly with the Department of Entomology' -- one interdisciplinary minor, encoded once (same treatment as the Data Science Minor).",
    "Upper-level requirement is 'BSCI333/GEOL331 (cross-listed) OR BSCI392 & BSCI393' -- encoded as a sets requirement with three options (BSCI333 alone, GEOL331 alone, or the BSCI392+BSCI393 pair) so any of the three satisfies it.",
    "Electives ('two courses, one from Biology and one from Geology') don't enforce the one-from-each-department split -- the engine has no 'at least one from a sub-group within a choose' rule (same caveat as the Chesapeake Bay Minor in the batch-1 file); encoded as any 2 from the combined list. The catalog lets BSCI333/GEOL331 and BSCI392+BSCI393 count here too 'if not taken to satisfy the requirement above' -- the audit's default one-requirement-per-course behavior handles that without extra encoding, so both appear in the elective list as well.",
    "'The Paleobiology Minor requires 3 cumulative credits of BSCI399 to count as elective, research topic must be approved' -- the engine has no partial-credit-per-course or approval-gate concept; BSCI399 is included as a plain elective option, credit/approval nuance is a manual check.",
    "'Or another appropriate biology or geology course approved in advance' isn't encoded (open-ended, approval-gated).",
    "Open to Geology and biological sciences majors; advising optional -- not an eligibility restriction to enforce. Neither source states a sharing cap with another program; none is set.",
  ],
  requirements: [
    { kind: "course", id: "ecology", name: "Principles of Ecology and Evolution", options: ["BSCI160"] },
    { kind: "course", id: "lab", name: "Biology lab", options: ["BSCI180", "BSCI161"] },
    { kind: "sets", id: "geoFoundation", name: "Foundation geology course", options: FOUNDATION_GEOL.map((pair) => [...pair]) },
    {
      kind: "course",
      id: "lifeHistory",
      name: "Introductory life history or organismal biology",
      options: ["GEOL102", "GEOL104", "GEOL204", "BSCI207", "BSCI222"],
    },
    {
      kind: "sets",
      id: "upperLevel",
      name: "Upper-level paleobiology",
      options: [["BSCI333"], ["GEOL331"], ["BSCI392", "BSCI393"]],
    },
    {
      kind: "sets",
      id: "electives",
      name: "Electives (one Biology, one Geology)",
      count: 2,
      options: [
        ["BSCI333"],
        ["GEOL331"],
        ["BSCI334"],
        ["BSCI361"],
        ["BSCI363"],
        ["BSCI392", "BSCI393"],
        ["BSCI370"],
        ["BSCI399"],
        ["GEOL342"],
        ["GEOL431"],
        ["GEOL436"],
        ["GEOL437"],
        ["GEOL499"],
      ],
    },
  ],
};

export const planetarySciencesMinor: Program = {
  id: "planetary-sciences-minor",
  name: "Planetary Sciences Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Planetary Sciences Minor (GEPS and ASTR listings, identical); " +
    "Department of Geological, Environmental, and Planetary Sciences and Department of Astronomy, " +
    "https://www.geol.umd.edu/undergraduate/Geology_Minors.php (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Listed twice in the catalog (once under GEPS, once under Astronomy), 'administered jointly with the Department of Astronomy' -- one interdisciplinary minor, encoded once (same treatment as the Data Science Minor).",
    "The catalog page for this minor doesn't restate the 'C- per course' floor that every sibling GEPS minor states explicitly; the department's general minors page states it applies to all minors on that page, including this one, so minGrade 'C-' is kept for consistency -- flagged in docs/project/owner-review.md in case the omission is intentional.",
    "Electives ('select three ... at least one choice must be from Geology and one from Astronomy; at least 6 credits from this list and 9 overall at the 300-400 level') don't enforce the cross-department split or the credit-level thresholds -- same 'no sub-group in choose' caveat as Paleobiology and the batch-1 Chesapeake Bay Minor.",
    "'An appointment must be made to register for the minor before final 30 credits are taken' is a timing/advising rule, not encoded. 'ASTR/GEOL another approved course' isn't encoded (open-ended, approval-gated). Neither source states a sharing cap with another program; none is set.",
  ],
  requirements: [
    { kind: "course", id: "astroFoundation", name: "Introductory astronomy", options: ["ASTR100", "ASTR101", "ASTR120"] },
    { kind: "sets", id: "geoFoundation", name: "Foundation geology course", options: FOUNDATION_GEOL.map((pair) => [...pair]) },
    { kind: "course", id: "core", name: "Solar system core course", options: ["ASTR330", "ASTR430", "GEOL212"] },
    {
      kind: "choose",
      id: "electives",
      name: "Advanced electives",
      count: 3,
      from: { courses: ["ASTR220", "ASTR230", "ASTR380", "ASTR498", "GEOL322", "GEOL340", "GEOL412", "GEOL437", "GEOL499"] },
    },
  ],
};
