// Music Major, Bachelor of Music (BM) -- Piano area track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/
// (the generic BM requirement structure only -- the catalog does not break the BM out by area);
// the School of Music's official Music - Bachelor of Music - Piano Four Year Academic Plan
// (department source), https://drive.google.com/uc?export=download&id=1ynFMU1Wj48gXVxKtkrrReC2KKerzQDCO#Music-Performance---Piano
// (fetched 2026-09-28). Owner ruling (docs/project/rulings.md, 2026-09-26): where the department
// page (the college's own plan counts as one) and the Academic Catalog disagree, the department
// page wins. Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import {
  muscTheory,
  muscHistorySurvey,
  muscGlobalMusic,
  muscFormAnalysis,
  muscHistoryElective400,
  muscRecitalAttendance,
  muscCommonReviewNotes,
} from "./musc-shared-2026-27.ts";

export const muscMajorBmPiano: Program = {
  id: "musc-major-bm-piano",
  name: "Music Major (Bachelor of Music - Piano)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Music Major (Bachelor of Music) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/); " +
    "School of Music, official Music - Bachelor of Music - Piano Four Year Academic Plan (department source), " +
    "https://drive.google.com/uc?export=download&id=1ynFMU1Wj48gXVxKtkrrReC2KKerzQDCO#Music-Performance---Piano " +
    "(fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "The Piano plan names its own applied-lesson course numbers -- MUSP119A/120A/217A/218A/315A/" +
      "316A/419A/420A (an 'A' suffix, presumably the piano-lesson section of each generic MUSP " +
      "number) -- so per the batch's 'named area-specific lesson courses' rule, this requirement " +
      "accepts those numbers plus any MUSP course in the same 100-499 range (flagged; a real Piano " +
      "student's lesson course records may show the base MUSP number without the 'A').",
    "The Piano plan replaces the generic BM's single 8-semester large-ensemble / 6-8-semester " +
      "small-ensemble pair with a four-course piano-ensemble/accompanying progression, each stated " +
      "as '(N cr. x M semesters)': MUSC128 (2 cr. x 2 sem., 4 credits), MUSC228 (2 cr. x 2 sem., 4 " +
      "credits), MUSC328 (2 cr. x 2 sem., 4 credits) and MUSC329 (1 cr. x 4 sem., 4 credits).",
    "Class piano (MUSC102/103) is not on the Piano plan, matching the catalog's own 'except Piano " +
      "Majors' carve-out for the 2-semester class-piano requirement -- not encoded for this track.",
    "The Piano plan does not show the generic BM's conducting (MUSC446) or music-pedagogy (MUSC400) " +
      "slots; instead it names two of its own upper-division courses -- MUSC467 and MUSC492 -- with " +
      "no more specific label than the course number in the plan. Form and analysis (MUSC450) and " +
      "music literature (MUSC490) are retained, in the same positions as the generic track's.",
    "'3-5 credits of music electives' (catalog) is superseded by the Piano plan's own explicit total " +
      "-- three named MUSC elective slots (3 cr. + 3 cr. + 1 cr. = 7 credits) that together match its " +
      "'IV. Electives (7 credits)' line -- per the owner's department-wins ruling; encoded as a " +
      "7-credit floor (generic MUSC department choose, any level) rather than the catalog's lower " +
      "range, since the department page names a higher, more specific total.",
    ...muscCommonReviewNotes,
  ],
  requirements: [
    {
      kind: "choose",
      id: "private-lessons",
      name: "8 semesters of private lessons (Senior Recital in final semester; not encoded) " +
        "(MUSP119A, MUSP120A, MUSP217A, MUSP218A, MUSP315A, MUSP316A, MUSP419A, MUSP420A)",
      count: 8,
      from: { courses: ["MUSP119A", "MUSP120A", "MUSP217A", "MUSP218A", "MUSP315A", "MUSP316A", "MUSP419A", "MUSP420A"], departments: ["MUSP"], minNumber: 100, maxNumber: 499 },
    },
    { kind: "choose", id: "piano-ensemble-1", name: "Piano ensemble/accompanying, year 1 (MUSC128, 2 cr. x 2 semesters)", credits: 4, from: { courses: ["MUSC128"] } },
    { kind: "choose", id: "piano-ensemble-2", name: "Piano ensemble/accompanying, year 2 (MUSC228, 2 cr. x 2 semesters)", credits: 4, from: { courses: ["MUSC228"] } },
    { kind: "choose", id: "piano-ensemble-3", name: "Piano ensemble/accompanying, year 3 (MUSC328, 2 cr. x 2 semesters)", credits: 4, from: { courses: ["MUSC328"] } },
    { kind: "choose", id: "piano-ensemble-4", name: "Piano ensemble/accompanying, year 4 (MUSC329, 1 cr. x 4 semesters)", credits: 4, from: { courses: ["MUSC329"] } },
    muscTheory,
    muscHistorySurvey,
    muscHistoryElective400,
    muscGlobalMusic,
    muscFormAnalysis,
    { kind: "course", id: "piano-req-467", name: "MUSC467 (Piano area requirement, no more specific label in the plan)", options: ["MUSC467"] },
    { kind: "course", id: "piano-req-492", name: "MUSC492 (Piano area requirement, no more specific label in the plan)", options: ["MUSC492"] },
    { kind: "course", id: "music-literature", name: "1 semester of music literature (MUSC490)", options: ["MUSC490"] },
    {
      kind: "choose",
      id: "electives",
      name: "Music electives (7 credits per the plan's 'IV. Electives' total)",
      credits: 7,
      from: { departments: ["MUSC"] },
    },
    muscRecitalAttendance(6),
  ],
};

export const muscMajorBmPianoMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Music (BM-Piano)",
  major: "musc",
  track: "Bachelor of Music - Piano",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/",
    department: "https://drive.google.com/uc?export=download&id=1ynFMU1Wj48gXVxKtkrrReC2KKerzQDCO#Music-Performance---Piano",
  },
};
