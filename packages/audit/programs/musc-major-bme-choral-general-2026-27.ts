// Music Major, Bachelor of Music Education (BME), Choral/General Track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/;
// the School of Music's official Music - Bachelor of Music Education - Choral/General Four Year
// Academic Plan (department source), https://drive.google.com/uc?export=download&id=1gsAwruL7JiOj3BHkKkix16YOPS4NhbMT#Music-Education---Choral
// (fetched 2026-09-28). Owner ruling (docs/project/rulings.md, 2026-09-26): where the department
// page (the college's own plan counts as one) and the Academic Catalog disagree, the department
// page wins. Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import {
  muscTheory,
  muscHistorySurvey,
  muscGlobalMusic,
  muscRecitalAttendance,
  muscCommonReviewNotes,
} from "./musc-shared-2026-27.ts";

export const muscMajorBmeChoralGeneral: Program = {
  id: "musc-major-bme-choral-general",
  name: "Music Major (Bachelor of Music Education, Choral/General)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Music Major (Bachelor of Music Education, Choral/General Track) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/); " +
    "School of Music, official Music - Bachelor of Music Education - Choral/General Four Year " +
    "Academic Plan (department source), https://drive.google.com/uc?export=download&id=1gsAwruL7JiOj3BHkKkix16YOPS4NhbMT#Music-Education---Choral " +
    "(fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "No disagreement found between the catalog and the Choral/General plan on the track's own " +
      "requirement structure (7 semesters of lessons, 7 of large ensemble, 4 of theory, 4 of class " +
      "piano, 2 of history, 1 of a 400-level history elective, 1 of conducting, 1 of global music, " +
      "4 credits of MUSC class instrument/vocal diction, 19 credits of MUED class instruments/field " +
      "experience, 6 EDHD, 3 TLPL, 2/6/6 MUED student-teaching credits).",
    "'7 semesters of private lessons' encoded as the plan's own " +
      "MUSP109/110/207/208/305/306/410 sequence -- the same numbers as the BME-Instrumental track " +
      "(non-piano-major lessons appear to use one family of numbers across BA/both BME tracks).",
    "'7 semesters of large ensemble participation' encoded as MUSC329 (NOT MUSC229 -- this track's " +
      "plan explicitly uses a different large-ensemble course number than BA/BM/BME-Instrumental, " +
      "per its own 'MUSC 329 (1 cr. x 7 semesters)' legend line), x7.",
    "'4 semesters of class piano (Except Piano Majors who take voice and upper level piano)' -- " +
      "shared musc-shared-2026-27.ts's 2-semester MUSC102/MUSC103 sequence is NOT reused here; this " +
      "track's plan additionally and uniquely shows MUSC202 and MUSC203 (not seen in any other " +
      "track's plan), in the same year-2 position where the other tracks stop at 2 semesters. " +
      "Reconstructed as MUSC102/103/202/203 (a natural I-II-III-IV piano sequence, paralleling the " +
      "shared MUSC150/151/250/251 theory sequence); please verify with the department.",
    "'1 semester of 400 level music history elective' -- the plan shows only a generic 'MUSC 4xx " +
      "Music History Elective' slot, no specific course; encoded as a generic 400-499 MUSC choose " +
      "(3 credits) rather than inventing a course number.",
    "'1 semester of conducting' has no separately identifiable course number in the plan. Not " +
      "encoded as its own requirement (same reasoning as the BME-Instrumental track); presumed " +
      "subsumed by the '19 credits MUED class instruments and field experience' bucket below.",
    "'4 credits MUSC class instrument and vocal diction' -- the plan shows MUSC106 and an " +
      "alternative 'MUSC 126, 226, or 227' slot but no clear vocal-diction-specific number; encoded " +
      "as a generic 4-credit choose over {MUSC106, MUSC126, MUSC226, MUSC227} rather than picking one " +
      "specific pairing (the engine has no 'course A plus one of B/C/D' primitive). Flagged for the " +
      "owner to confirm which of these is actually 'vocal diction' versus 'class instrument'.",
    "'19 credits MUED class instruments and field experience' has no course-by-course breakdown in " +
      "either source; encoded as a generic 19-credit choose over the MUED department (excluding the " +
      "three named student-teaching courses, so they can't double-count here). The plan's own 'MUED " +
      "213, 215, 216, or 217' phrasing (an explicit 'choose one of four', unlike the Instrumental " +
      "plan which lists all four as separate requirements) is not modeled separately since any MUED " +
      "course already counts toward this generic bucket.",
    "'6 credits EDHD Human Development' and '3 credits TLPL Education Policy Studies' have no " +
      "specific course numbers in the catalog text, but the plan names EDHD413, EDHD426 and TLPL360; " +
      "encoded using those.",
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
      from: { courses: ["MUSP109", "MUSP110", "MUSP207", "MUSP208", "MUSP305", "MUSP306", "MUSP410"] },
    },
    {
      kind: "choose",
      id: "large-ensemble",
      name: "7 semesters of large ensemble participation (MUSC329)",
      credits: 7,
      from: { courses: ["MUSC329"] },
    },
    muscTheory,
    {
      kind: "choose",
      id: "class-piano-4",
      name: "4 semesters of class piano, except Piano majors who take voice and upper level piano " +
        "(reconstructed: MUSC102, MUSC103, MUSC202, MUSC203)",
      count: 4,
      from: { courses: ["MUSC102", "MUSC103", "MUSC202", "MUSC203"] },
    },
    muscHistorySurvey,
    {
      kind: "choose",
      id: "history-elective-400",
      name: "1 semester of 400-level music history elective (no specific course named)",
      credits: 3,
      from: { departments: ["MUSC"], minNumber: 400, maxNumber: 499 },
    },
    muscGlobalMusic,
    {
      kind: "choose",
      id: "class-instrument-vocal-diction",
      name: "4 credits MUSC class instrument and vocal diction (reconstructed: MUSC106, MUSC126, MUSC226, MUSC227)",
      credits: 4,
      from: { courses: ["MUSC106", "MUSC126", "MUSC226", "MUSC227"] },
    },
    {
      kind: "choose",
      id: "mued-class-instruments",
      name: "19 credits of MUED class instruments and field experience (no course-by-course list named)",
      credits: 19,
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

export const muscMajorBmeChoralGeneralMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Music (BME-Choral/General)",
  major: "musc",
  track: "Music Education (Choral/General)",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/",
    department: "https://drive.google.com/uc?export=download&id=1gsAwruL7JiOj3BHkKkix16YOPS4NhbMT#Music-Education---Choral",
  },
};
