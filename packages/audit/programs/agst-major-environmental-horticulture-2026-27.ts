// Agricultural Science and Technology Major, Environmental Horticulture Specialization, 2026-27
// UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/
//   plant-sciences-landscape-architecture/agricultural-science-technology-major/ (fetched 2026-09-28).
// See agst-shared-2026-27.ts for the shared Major Core Courses and common review notes; this file
// adds the Environmental Horticulture specialization's own requirements.
// Encoded by hand from the catalog alone (no department page names any requirement). UNVERIFIED
// until owner sign-off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { agstCommonReviewNotes, agstCore } from "./agst-shared-2026-27.ts";

export const agstMajorEnvironmentalHorticulture: Program = {
  id: "agst-major-environmental-horticulture",
  name: "Agricultural Science and Technology Major (Environmental Horticulture Specialization)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Agricultural Science and Technology Major, " +
    "https://academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/plant-sciences-landscape-architecture/agricultural-science-technology-major/ " +
    "(fetched 2026-09-28); department pages (psla.umd.edu, one faculty profile) name no requirement " +
    "(see program-sources/agricultural-science-technology-major.md)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...agstCommonReviewNotes,
    "'Introductory Course' (select one, 3-4 credits) mixes a two-course pair (ANSC101 & ANSC103) with " +
      "single-course options and one internal 'or' (GEOG110 or GEOG330); encoded as a `sets` choice " +
      "(`intro-course-envhort`) rather than `course`, since one option is a pair worth more credits.",
    "'Lower level restricted electives' (select two, 6-8 credits) likewise mixes single courses with " +
      "one pair (AOSC200 & AOSC201); encoded as a `sets` choice with count: 2 so a student may pick two " +
      "singles or one single plus the AOSC pair, matching the catalog's 6-8 credit range.",
    "'Agriculture Business, Economics, Management or Marketing Course' names four specific courses " +
      "plus an unnumbered 'BMGT Restricted Elective' (footnote: 200-level or above); encoded as one " +
      "choose combining the named courses with a BMGT department/minNumber:200 filter.",
    "'Upper level restricted electives' (select two, 6-8 credits) names twelve specific courses plus " +
      "an unnumbered 'AGST or PLSC Approved Elective' (footnote: 300-level or above, advisor-chosen); " +
      "encoded as one choose combining the named list with an AGST/PLSC department/minNumber:300 " +
      "filter, which also covers the approved-elective catch-all.",
  ],
  requirements: [
    ...agstCore,
    { kind: "course", id: "math115-envhort", name: "Precalculus (MATH115)", options: ["MATH115"] },
    {
      kind: "course",
      id: "econ-choice-envhort",
      name: "Economics Course (AREC250 or ECON200)",
      options: ["AREC250", "ECON200"],
    },
    {
      kind: "sets",
      id: "intro-course-envhort",
      name: "Introductory Course: select one",
      options: [
        ["ANSC101", "ANSC103"],
        ["BMGT110"],
        ["BMGT160"],
        ["BSCI126"],
        ["GEOG110"],
        ["GEOG330"],
        ["GEOL120"],
        ["INAG250"],
        ["LARC151"],
        ["LARC152"],
        ["LARC160"],
        ["LARC162"],
        ["SPAN103"],
      ],
    },
    { kind: "course", id: "bsci170-envhort", name: "Principles of Molecular & Cellular Biology (BSCI170)", options: ["BSCI170"] },
    {
      kind: "course",
      id: "biology-lab-envhort",
      name: "Principles Biology Laboratory or Molecular & Cellular Biology Laboratory (BSCI180 or BSCI171)",
      options: ["BSCI180", "BSCI171"],
    },
    { kind: "course", id: "plsc110-envhort", name: "Introduction to Horticulture (PLSC110)", options: ["PLSC110"] },
    { kind: "course", id: "plsc111-envhort", name: "Introduction to Horticulture Laboratory (PLSC111)", options: ["PLSC111"] },
    { kind: "course", id: "plsc271-envhort", name: "Plant Propagation (PLSC271)", options: ["PLSC271"] },
    {
      kind: "sets",
      id: "lower-restricted-electives-envhort",
      name: "Lower-level (100+) restricted electives: select two",
      count: 2,
      options: [
        ["AGST130"],
        ["PLSC125"],
        ["PLSC203"],
        ["PLSC205"],
        ["PLSC226"],
        ["PLSC253"],
        ["PLSC254"],
        ["AOSC200", "AOSC201"],
      ],
    },
    {
      kind: "choose",
      id: "ag-business-elective-envhort",
      name: "Agriculture Business, Economics, Management or Marketing Course (3 credits)",
      count: 1,
      credits: 3,
      from: { courses: ["AREC306", "AREC345", "AREC365", "PLSC251"], departments: ["BMGT"], minNumber: 200 },
    },
    { kind: "course", id: "plsc432-envhort", name: "Greenhouse Crop Production (PLSC432)", options: ["PLSC432"] },
    { kind: "course", id: "plsc433-envhort", name: "Technology of Fruit and Vegetable Production (PLSC433)", options: ["PLSC433"] },
    {
      kind: "choose",
      id: "upper-restricted-electives-envhort",
      name: "Upper-level (300+) restricted electives: select two",
      count: 2,
      from: {
        courses: [
          "AGST333", "AGST401", "ENST411", "LARC461", "PLSC303", "PLSC400",
          "PLSC425", "PLSC452", "PLSC461", "PLSC462", "PLSC464", "PLSC471",
        ],
        departments: ["AGST", "PLSC"],
        minNumber: 300,
      },
    },
    {
      kind: "course",
      id: "career-prep-choice-envhort",
      name: "Internship or Special Problems in Plant Science (PLSC389 or PLSC399)",
      options: ["PLSC389", "PLSC399"],
    },
    { kind: "course", id: "plsc460-envhort", name: "Application of Knowledge in Plant Sciences (PLSC460)", options: ["PLSC460"] },
  ],
};

export const agstMajorEnvironmentalHorticultureMeta: ProgramMeta = {
  kind: "major",
  college: "AGNR",
  short: "Agricultural Science & Technology (Environmental Horticulture)",
  major: "agst",
  track: "Environmental Horticulture",
  sources: {
    catalog:
      "https://academiccatalog.umd.edu/undergraduate/colleges-schools/agriculture-natural-resources/plant-sciences-landscape-architecture/agricultural-science-technology-major/",
    department: "https://psla.umd.edu/",
  },
};
