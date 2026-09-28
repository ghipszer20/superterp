// Music Major, Bachelor of Music Education (BME), Instrumental Track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/;
// the School of Music's official Music - Bachelor of Music Education - Instrumental Four Year
// Academic Plan (department source), https://drive.google.com/uc?export=download&id=1KG9zVt2VyHnytYFlROSaHHcsPHenO7lF#Music-Education---Instrumental
// (fetched 2026-09-28). Owner ruling (docs/project/rulings.md, 2026-09-26): where the department
// page (the college's own plan counts as one) and the Academic Catalog disagree, the department
// page wins. Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import {
  muscTheory,
  muscClassPiano2,
  muscHistorySurvey,
  muscGlobalMusic,
  muscRecitalAttendance,
  muscCommonReviewNotes,
} from "./musc-shared-2026-27.ts";

export const muscMajorBmeInstrumental: Program = {
  id: "musc-major-bme-instrumental",
  name: "Music Major (Bachelor of Music Education, Instrumental)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Music Major (Bachelor of Music Education, Instrumental Track) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/); " +
    "School of Music, official Music - Bachelor of Music Education - Instrumental Four Year Academic " +
    "Plan (department source), https://drive.google.com/uc?export=download&id=1KG9zVt2VyHnytYFlROSaHHcsPHenO7lF#Music-Education---Instrumental " +
    "(fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "No disagreement found between the catalog and the Instrumental plan on the track's own " +
      "requirement structure (7 semesters of lessons, 7 of large ensemble, 4 of theory, 2 of " +
      "history, 1 of a 400-level history elective, 2 of class piano, 1 of conducting, 1 of global " +
      "music, 27 credits of MUED class instruments/field experience, 6 EDHD, 3 TLPL, 2/6/6 MUED " +
      "student-teaching credits).",
    "'7 semesters of private lessons' encoded as the plan's own " +
      "MUSP109/110/207/208/305/306/410 sequence (the same 'A' family the BA track uses, one semester " +
      "longer); the Senior Recital the catalog attaches to the final lesson semester is not encoded.",
    "'7 semesters of large ensemble participation' encoded as MUSC229 x7, per the plan's own " +
      "'MUSC 229 (1 cr. x 7 semesters)' legend line.",
    "'1 semester of 400 level music history elective' -- the plan shows only a generic 'MUSC 4xx " +
      "Music History Elective' slot, no specific course; encoded as a generic 400-499 MUSC choose " +
      "(3 credits) rather than inventing a course number.",
    "'1 semester of conducting' has no separately identifiable course number in the plan (unlike " +
      "the BM track's MUSC446): the plan's MUED sequence (186, 187, 213, 215, 216, 217, 311, 320, " +
      "322, 411, 420) names no course as specifically 'conducting'. Not encoded as its own " +
      "requirement to avoid guessing which MUED course title it is; presumed subsumed by the '27 " +
      "credits MUED class instruments and field experience' bucket below, which already accepts any " +
      "of those MUED courses. Please confirm with the department.",
    "'27 credits MUED class instruments and field experience' has no course-by-course breakdown in " +
      "either source; encoded as a generic 27-credit choose over the MUED department (excluding the " +
      "three named student-teaching courses below, so they can't double-count here).",
    "'6 credits EDHD Human Development' and '3 credits TLPL Education Policy Studies' have no " +
      "specific course numbers in the catalog text, but the plan names EDHD413, EDHD426 and TLPL360; " +
      "encoded using those (courses named in a department source are usable per the batch rules).",
    "'2 credits MUED474 Pre-Student Teaching', '6 credits MUED484 Student Teaching in Elementary " +
      "School: Music' and '6 credits MUED494 Student Teaching in Secondary School: Music' are named " +
      "explicitly in the catalog text itself and encoded as individual course requirements.",
    ...muscCommonReviewNotes,
  ],
  requirements: [
    {
      kind: "choose",
      id: "private-lessons",
      name: "7 semesters of private lessons (Senior Recital in final semester; not encoded) " +
        "(MUSP109, MUSP110, MUSP207, MUSP208, MUSP305, MUSP306, MUSP410)",
      count: 7,
      // Any MUSP applied-lesson course counts: the listed numbers are one area's (main session, 2026-09-28).
      from: { courses: ["MUSP109", "MUSP110", "MUSP207", "MUSP208", "MUSP305", "MUSP306", "MUSP410"], departments: ["MUSP"], minNumber: 100, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "large-ensemble",
      name: "7 semesters of large ensemble participation (MUSC229)",
      credits: 7,
      from: { courses: ["MUSC229"] },
    },
    muscTheory,
    muscHistorySurvey,
    {
      kind: "choose",
      id: "history-elective-400",
      name: "1 semester of 400-level music history elective (no specific course named)",
      credits: 3,
      from: { departments: ["MUSC"], minNumber: 400, maxNumber: 499 },
    },
    muscClassPiano2,
    muscGlobalMusic,
    {
      kind: "choose",
      id: "mued-class-instruments",
      name: "27 credits of MUED class instruments and field experience (no course-by-course list named)",
      credits: 27,
      from: { departments: ["MUED"], exclude: ["MUED474", "MUED484", "MUED494"] },
    },
    {
      kind: "choose",
      id: "edhd-human-development",
      name: "6 credits EDHD Human Development (EDHD413, EDHD426)",
      credits: 6,
      from: { courses: ["EDHD413", "EDHD426"] },
    },
    { kind: "course", id: "tlpl-education-policy", name: "3 credits TLPL Education Policy Studies (TLPL360)", options: ["TLPL360"] },
    { kind: "course", id: "mued474", name: "2 credits MUED474 Pre-Student Teaching", options: ["MUED474"] },
    { kind: "course", id: "mued484", name: "6 credits MUED484 Student Teaching in Elementary School: Music", options: ["MUED484"] },
    { kind: "course", id: "mued494", name: "6 credits MUED494 Student Teaching in Secondary School: Music", options: ["MUED494"] },
    muscRecitalAttendance(6),
  ],
};

export const muscMajorBmeInstrumentalMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Music (BME-Instrumental)",
  major: "musc",
  track: "Music Education (Instrumental)",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/",
    department: "https://drive.google.com/uc?export=download&id=1KG9zVt2VyHnytYFlROSaHHcsPHenO7lF#Music-Education---Instrumental",
  },
};
