// Civil Engineering Major, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/civil-environmental-engineering/civil-environmental-engineering-major/;
// Department of Civil & Environmental Engineering, Bachelor of Science page, https://cee.umd.edu/undergraduate/degrees/bachelor-science
// (fetched 2026-09-28); and the A. James Clark School of Engineering's official Fall 2026 graduation plan,
// https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/civil_fall_2026_gradplan.pdf (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const civilMajor: Program = {
  id: "civil-major",
  name: "Civil Engineering Major",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Civil Engineering Major; " +
    "Department of Civil & Environmental Engineering, Bachelor of Science page, https://cee.umd.edu/undergraduate/degrees/bachelor-science " +
    "(fetched 2026-09-28); official Fall 2026 graduation plan, " +
    "https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/civil_fall_2026_gradplan.pdf (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "No department-vs-catalog disagreement found on the required-course sequence: the catalog's course-by-course four-year table and the official Fall 2026 graduation plan agree exactly on every required course (they place ENCE305 in sophomore Spring together, for instance, even though a naive row-by-row reading of the catalog's own ragged table could suggest Fall). The department's Bachelor of Science page itself gives no course-level detail (just a qualitative description of program elements), so the catalog + graduation plan are used for all concrete requirements.",
    "Tracks: the department page describes three specialization tracks (Environmental & Water Resources; Geotechnical & Structural Engineering; Transportation & Project Management) explicitly under a 'Curriculum and Degree Tracks Prior to Fall 2025' heading -- i.e. these tracks applied to the OLD (pre-Fall-2025) curriculum only. The current curriculum section ('Curriculum (Fall 2025 and later)', matching this 2026-27 catalog year) names no tracks, and the catalog's own current requirements table has no track split. So no tracks are encoded here; this is not a department-vs-catalog disagreement, just tracks having been retired for the current catalog year. Please confirm this reading of the page (tracks section is clearly historical) is correct.",
    "Science Elective (catalog footnote): 'ENCE205, GEOL120, GEOL123, ENSP101, BSCI160, or ECON200'. Encoded as a `course` alternative.",
    "Not encoded (approved elective with no list, flagged in docs/project/owner-review.md): the 'STEM-Based Elective' (catalog: '3 credits of STEM-Based Elective (in-major or out-of-major)') and the 'Open Elective' (catalog: '3 credits of an Open Elective (requires pre-approval of the Civil & Environmental Engineering (CEE) department, 300-level or above, in-major or out-of-major)'). Both the catalog and the graduation plan point students to their CEE advisor for these ('See advisor'); no enumerable course list exists in any source, and the audit engine has no 'advisor pre-approved' concept.",
    "In-Major Technical Elective (catalog: '6 credits of In-Major Technical Electives required (ENCE only)') is encoded as `choose` count 2 from any ENCE course, since the catalog states only a department restriction, no level or list restriction. This major's own 16 required ENCE courses are excluded from the filter (a required course a student must take anyway shouldn't double as elective credit) -- not stated explicitly by any source, but the same treatment aero-major gives its 'ENAE Elective' slot.",
    "Not encoded (engine gap): the catalog's 'Out of the following courses, students can only take 2: ENCE325, ENCE420, ENCE421, ENCE423, ENCE424, or ENCE426' is an at-most-N cap across a pool of otherwise-eligible In-Major Technical Elective courses. The audit engine's `choose` requirement only expresses at-least-N cardinalities; it has no mechanism to cap how many courses from a sub-list may count. Not enforced -- a plan using 3+ of these would still pass the technical-elective requirement.",
    "Not encoded (engine gap): the department page's stated 2.0 cumulative GPA requirement. The audit only checks per-course minGrade (none is stated in any source for civil's core or elective courses, so none is set).",
    "Not encoded (engine gap): residency rules referenced generically via the graduation plan's 'Requirements for Graduation' box (final 30 credits at UMD; 15 of the final 30 at the 300-400 level; 12 upper-level major credits at UMD). The audit engine has no residency/where-taken concept.",
    "Not encoded (engine gap): the 122-credit total-credit minimum (catalog) / 120-credit minimum (graduation plan's own 'Requirements for Graduation' box -- these two figures differ slightly; neither is enforced). The audit checks individual requirements, not the program's overall credit total.",
    "ENES200 ('Technology and Consequences') is encoded as a major requirement (as for aero-major/bioe-major) even though the graduation plan's own Gen Ed column also lists 'ENES/ENEE 200 (HU/SCIS)' -- the catalog's own four-year table lists it as its own row distinct from the 'General Education Program Requirements' rows in the same semester, so it is treated as an engineering-sciences fundamental, not left to the Gen Ed layer.",
    "ENGL101 (Academic Writing) and ENGL39X (Professional Writing) are left to the Gen Ed layer, not encoded here: the graduation plan places both explicitly under its 'GENERAL EDUCATION REQUIREMENTS' column (unlike Biocomputational Engineering's ENGL393, which the catalog's own Required-Courses credit sum showed was part of that major's own credit total). No source states a specific Professional Writing course code for civil beyond the generic 'ENGL39X' pattern gen-ed-2026-27.ts's FSPW requirement already covers.",
  ],
  requirements: [
    { kind: "course", id: "enes100", name: "Introduction to Engineering Design", options: ["ENES100"] },
    { kind: "course", id: "chem135", name: "Chemistry for Engineers", options: ["CHEM135"] },
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    {
      kind: "course",
      id: "science-elective",
      name: "Science Elective",
      options: ["ENCE205", "GEOL120", "GEOL123", "ENSP101", "BSCI160", "ECON200"],
    },
    { kind: "course", id: "phys161", name: "General Physics I", options: ["PHYS161"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "enes102", name: "Mechanics I", options: ["ENES102"] },
    { kind: "course", id: "enes200", name: "Technology and Consequences", options: ["ENES200"] },
    { kind: "course", id: "phys260", name: "General Physics II", options: ["PHYS260"] },
    { kind: "course", id: "phys261", name: "General Physics II Laboratory", options: ["PHYS261"] },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241"] },
    { kind: "course", id: "enes220", name: "Mechanics II", options: ["ENES220"] },
    { kind: "course", id: "ence202", name: "Engineering Drawing and Design", options: ["ENCE202"] },
    { kind: "course", id: "math243", name: "Intro Linear Algebra and Differential Equations", options: ["MATH243"] },
    { kind: "course", id: "ence203", name: "Data Models and Numerical Computing", options: ["ENCE203"] },
    { kind: "course", id: "ence305", name: "Fundamentals of Engineering Fluids", options: ["ENCE305"] },
    { kind: "course", id: "ence303", name: "Probability and Statistics for CEE", options: ["ENCE303"] },
    { kind: "course", id: "ence312", name: "Engineering Economics and Project Management", options: ["ENCE312"] },
    { kind: "course", id: "ence365", name: "Materials in Civil Infrastructure", options: ["ENCE365"] },
    { kind: "course", id: "ence336", name: "Environment and Water I", options: ["ENCE336"] },
    { kind: "course", id: "ence340", name: "Fundamentals of Geotechnical Engineering", options: ["ENCE340"] },
    { kind: "course", id: "ence383", name: "Transportation Systems I", options: ["ENCE383"] },
    { kind: "course", id: "ence367", name: "Civil Engineering Systems Optimization", options: ["ENCE367"] },
    { kind: "course", id: "ence436", name: "Environment and Water II", options: ["ENCE436"] },
    { kind: "course", id: "ence342", name: "Structural Analysis and Design I", options: ["ENCE342"] },
    { kind: "course", id: "ence483", name: "Transportation Systems II", options: ["ENCE483"] },
    { kind: "course", id: "ence442", name: "Structural Analysis and Design II", options: ["ENCE442"] },
    { kind: "course", id: "ence464", name: "Civil and Environmental Engineering Design I", options: ["ENCE464"] },
    { kind: "course", id: "ence467", name: "Civil and Environmental Engineering Design II", options: ["ENCE467"] },
    {
      kind: "choose",
      id: "in-major-technical-elective",
      name: "In-Major Technical Elective (two ENCE courses)",
      count: 2,
      from: { departments: ["ENCE"], exclude: ["ENCE202", "ENCE203", "ENCE303", "ENCE305", "ENCE312", "ENCE336", "ENCE340", "ENCE342", "ENCE365", "ENCE367", "ENCE383", "ENCE436", "ENCE442", "ENCE464", "ENCE467", "ENCE483"] },
    },
  ],
};

export const civilMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Civil Engineering",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/civil-environmental-engineering/civil-environmental-engineering-major/",
    department: "https://cee.umd.edu/undergraduate/degrees/bachelor-science",
  },
};
