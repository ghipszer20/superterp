// Music Major, Bachelor of Music (BM) -- Jazz area track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/
// (the generic BM requirement structure only -- the catalog does not break the BM out by area);
// the School of Music's official Music - Bachelor of Music - Jazz Four Year Academic Plan
// (department source), https://drive.google.com/uc?export=download&id=1nlVRA54LPKzrofWqjOwEozZ-NI3Aajnq#Music-Performance---Jazz
// (fetched 2026-09-28). Owner ruling (docs/project/rulings.md, 2026-09-26): where the department
// page (the college's own plan counts as one) and the Academic Catalog disagree, the department
// page wins. Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import {
  muscTheory,
  muscClassPiano2,
  muscHistorySurvey,
  muscGlobalMusic,
  muscHistoryElective400,
  muscRecitalAttendance,
  muscCommonReviewNotes,
} from "./musc-shared-2026-27.ts";

export const muscMajorBmJazz: Program = {
  id: "musc-major-bm-jazz",
  name: "Music Major (Bachelor of Music - Jazz)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Music Major (Bachelor of Music) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/); " +
    "School of Music, official Music - Bachelor of Music - Jazz Four Year Academic Plan (department source), " +
    "https://drive.google.com/uc?export=download&id=1nlVRA54LPKzrofWqjOwEozZ-NI3Aajnq#Music-Performance---Jazz " +
    "(fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "The Jazz plan's applied-lesson numbers (MUSP119/120/217/218/315/316/419/420) match the generic " +
      "BM track's own -- Jazz doesn't name area-specific lesson course numbers, so this stays a " +
      "generic any-MUSP-course requirement like the other tracks.",
    "The Jazz plan replaces the generic BM's single large-ensemble/small-ensemble pair (MUSC229 x8, " +
      "MUSC129 x6-8) with its own two jazz ensemble courses, each stated as '1 cr. x 8 semesters': " +
      "MUSC229J (large, jazz band) and MUSC229Z (small, jazz combo). Both are encoded as 8-credit " +
      "floors, matching the plan's explicit semester counts.",
    "The Jazz plan does not show the generic BM's form-and-analysis (MUSC450), conducting (MUSC446) " +
      "or music-pedagogy (MUSC400) slots at all; instead it names four of its own upper-division " +
      "courses -- MUSC436, MUSC453, MUSC455 and MUSC456 -- with no more specific label than the " +
      "course number in the plan. Music literature (MUSC490) is retained, in the same position as " +
      "the generic track's.",
    "'3-5 credits of music electives' (catalog) encoded as a 3-credit floor (generic MUSC department " +
      "choose, any level), matching the generic BM track's own approach -- the Jazz plan's own " +
      "elective slots are split between MUSC and non-MUSC electives in a way the fetched text " +
      "doesn't cleanly separate, so the catalog's floor is used instead of guessing a track-specific " +
      "total.",
    ...muscCommonReviewNotes,
  ],
  requirements: [
    {
      kind: "choose",
      id: "private-lessons",
      name: "8 semesters of private lessons (Senior Recital in final semester; not encoded) " +
        "(MUSP119, MUSP120, MUSP217, MUSP218, MUSP315, MUSP316, MUSP419, MUSP420)",
      count: 8,
      from: { courses: ["MUSP119", "MUSP120", "MUSP217", "MUSP218", "MUSP315", "MUSP316", "MUSP419", "MUSP420"], departments: ["MUSP"], minNumber: 100, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "large-ensemble",
      name: "8 semesters of large (jazz band) ensemble participation (MUSC229J)",
      credits: 8,
      from: { courses: ["MUSC229J"] },
    },
    {
      kind: "choose",
      id: "small-ensemble",
      name: "8 semesters of small (jazz combo) ensemble participation (MUSC229Z)",
      credits: 8,
      from: { courses: ["MUSC229Z"] },
    },
    muscTheory,
    muscHistorySurvey,
    muscHistoryElective400,
    muscGlobalMusic,
    muscClassPiano2,
    { kind: "course", id: "jazz-req-436", name: "MUSC436 (Jazz area requirement, no more specific label in the plan)", options: ["MUSC436"] },
    { kind: "course", id: "jazz-req-453", name: "MUSC453 (Jazz area requirement, no more specific label in the plan)", options: ["MUSC453"] },
    { kind: "course", id: "jazz-req-455", name: "MUSC455 (Jazz area requirement, no more specific label in the plan)", options: ["MUSC455"] },
    { kind: "course", id: "jazz-req-456", name: "MUSC456 (Jazz area requirement, no more specific label in the plan)", options: ["MUSC456"] },
    { kind: "course", id: "music-literature", name: "1 semester of music literature (MUSC490)", options: ["MUSC490"] },
    {
      kind: "choose",
      id: "electives",
      name: "3-5 credits of music electives (3-credit floor encoded)",
      credits: 3,
      from: { departments: ["MUSC"] },
    },
    muscRecitalAttendance(6),
  ],
};

export const muscMajorBmJazzMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Music (BM-Jazz)",
  major: "musc",
  track: "Bachelor of Music - Jazz",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/",
    department: "https://drive.google.com/uc?export=download&id=1nlVRA54LPKzrofWqjOwEozZ-NI3Aajnq#Music-Performance---Jazz",
  },
};
