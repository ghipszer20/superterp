// Astronomy Major, Astronomy - Physical Science Specialization, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/astronomy/astronomy-major/;
// Department of Astronomy, "Required Course List for BS Astronomy - Physical Science Specialization"
// (Oct. 8, 2025), https://www.astro.umd.edu/sites/default/files/undergrad/bs-astronomy-physical-science_requirements-and-4-year-plan.pdf
// (fetched 2026-09-27), and https://www.astro.umd.edu/education/undergraduate/astronomy-major.
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

// Same 10-item pool (ASTR320 + the 9 named 400-level courses) as astr-major-data-science.
const ADVANCED_ASTR_WITH_320 = ["ASTR320", "ASTR406", "ASTR410", "ASTR415", "ASTR421", "ASTR422", "ASTR430", "ASTR435", "ASTR450", "ASTR480"];

const COMPLEMENTARY_SCIENCE = [
  "AOSC360", "AOSC375", "AOSC401", "AOSC431", "AOSC432", "AOSC433", "AOSC434", "AOSC475",
  "BSCI331", "BSCI361", "BSCI464",
  "ENST333", "ENST360", "ENST405", "ENST415", "ENST436", "ENST485",
  "GEOG301", "GEOG373", "GEOG415", "GEOG417",
  "GEOL322", "GEOL340", "GEOL341", "GEOL412", "GEOL446", "GEOL457", "GEOL472",
];

const SOCIETAL_IMPLICATIONS = [
  "AREC345", "AREC365", "ENSP360", "GVPT273", "GVPT373", "GVPT392", "GVPT393", "LARC461", "PLCY301", "PLCY380",
];
const COMMUNICATION = [
  "COMM341", "COMM345", "COMM365", "COMM385", "COMM359C", "COMM498R",
  "ENGL387", "ENGL388C", "ENGL398N", "ENGL398R", "ENGL398V", "ENGL491", "ENGL493",
];
const SCIENCE_APPLICATIONS = [
  "AOSC424", "AOSC447", "BSCI374", "GEOG377", "GEOG440", "GEOG472", "GEOG473", "GEOG475",
  "GEOL447", "MATH401", "MATH462", "STAT426",
];

export const astrMajorPhysicalScience: Program = {
  id: "astr-major-physical-science",
  name: "Astronomy Major (Astronomy - Physical Science Specialization)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Astronomy Major; " +
    "Department of Astronomy, Required Course List for BS Astronomy - Physical Science Specialization (Oct. 8, 2025), " +
    "https://www.astro.umd.edu/sites/default/files/undergrad/bs-astronomy-physical-science_requirements-and-4-year-plan.pdf (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Department-vs-catalog difference (owner ruling: follow the department page): the catalog's table gives only a vague 'three complementary science courses from: AOSC, BSCI, ENST, GEOG, GEOL options' and 'two courses ... Societal Implications, Communication, or Science Applications'; the department page names the exact 23-course complementary-science list and the exact three elective groups (10/13/12 courses). The department's exact lists are used.",
    "'Choose one course from two of the following three groups (two courses total)' is encoded as a `distribution`: count 2, minAreas 2, maxPerArea 1, over the three named areas (Societal Implications, Communication, Science Applications).",
    "'Three upper-level Astronomy courses from the list of ASTR320 and all 400-level Astronomy courses' is encoded as `choose` count 3 over the same 10-course pool as astr-major-data-science.",
    "PHYS265 may be replaced by PHYS474 or ASTR415 (department page); if ASTR415 is used here it may not also count toward the three-astronomy-course pool above -- already true by construction, since a course counts toward at most one non-overlay requirement per program.",
    "MATH243 may be satisfied by MATH246 or MATH240/461 (department page: 'MATH 246 and MATH 240/461 will be accepted for MATH 243'); all three added as options.",
    "Not encoded (engine gap, not a disagreement): the 'no more than one 300/400-level study-abroad course in place of an ASTR-prefix course' rule, and the note that this specialization's students 'are encouraged to double major or minor in a complementary field' (advising guidance, not a requirement).",
  ],
  requirements: [
    { kind: "course", id: "astr130", name: "Astrophysics 1 - Foundations", options: ["ASTR130"] },
    { kind: "course", id: "astr131", name: "Astrophysics 2 - Planets and Stars", options: ["ASTR131"] },
    { kind: "course", id: "astr232", name: "Astrophysics 3 - Milky Way and Beyond", options: ["ASTR232"] },
    { kind: "course", id: "astr310", name: "Observational Astronomy", options: ["ASTR310"] },
    { kind: "course", id: "phys171", name: "Introductory Physics: Mechanics", options: ["PHYS171"] },
    { kind: "course", id: "phys265", name: "Introduction to Scientific Programming", options: ["PHYS265", "PHYS474", "ASTR415"] },
    { kind: "course", id: "phys272", name: "Introductory Physics: Fields", options: ["PHYS272"] },
    { kind: "course", id: "phys273", name: "Intermediate Oscillations and Waves", options: ["PHYS273"] },
    { kind: "course", id: "phys275", name: "Experimental Physics I", options: ["PHYS275"] },
    { kind: "course", id: "phys276", name: "Experimental Physics II", options: ["PHYS276"] },
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241"] },
    { kind: "course", id: "math243", name: "Linear Algebra and Differential Equations", options: ["MATH243", "MATH246", "MATH240", "MATH461"] },
    { kind: "choose", id: "advanced-astr", name: "Three upper-level Astronomy courses", count: 3, from: { courses: ADVANCED_ASTR_WITH_320 } },
    { kind: "choose", id: "complementary-science", name: "Three complementary science courses", count: 3, from: { courses: COMPLEMENTARY_SCIENCE } },
    {
      kind: "distribution",
      id: "societal-comm-applications",
      name: "Societal Implications, Communication, or Science Applications",
      count: 2,
      minAreas: 2,
      maxPerArea: 1,
      areas: [
        { name: "Societal Implications", courses: SOCIETAL_IMPLICATIONS },
        { name: "Communication", courses: COMMUNICATION },
        { name: "Science Applications", courses: SCIENCE_APPLICATIONS },
      ],
    },
  ],
};

export const astrMajorPhysicalScienceMeta: ProgramMeta = { kind: "major", college: "CMNS", short: "Astronomy (Physical Science)", major: "astr", track: "Astronomy - Physical Science", sources: { catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/astronomy/astronomy-major/", department: "https://www.astro.umd.edu/sites/default/files/undergrad/bs-astronomy-physical-science_requirements-and-4-year-plan.pdf" } };
