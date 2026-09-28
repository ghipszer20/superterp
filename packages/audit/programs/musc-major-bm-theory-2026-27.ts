// Music Major, Bachelor of Music (BM) -- Theory area track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/
// (the generic BM requirement structure only -- the catalog does not break the BM out by area);
// the School of Music's official Music - Bachelor of Music - Theory Four Year Academic Plan
// (department source), https://drive.google.com/uc?export=download&id=1JxSZQ1DN7HKJUNvUtr0foVUAm-Rm-pmn#Music-Performance---Theory
// (fetched 2026-09-28). Owner ruling (docs/project/rulings.md, 2026-09-26): where the department
// page (the college's own plan counts as one) and the Academic Catalog disagree, the department
// page wins. Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import {
  muscTheory,
  muscClassPiano2,
  muscHistorySurvey,
  muscGlobalMusic,
  muscFormAnalysis,
  muscHistoryElective400,
  muscRecitalAttendance,
  muscCommonReviewNotes,
} from "./musc-shared-2026-27.ts";

export const muscMajorBmTheory: Program = {
  id: "musc-major-bm-theory",
  name: "Music Major (Bachelor of Music - Theory)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Music Major (Bachelor of Music) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/); " +
    "School of Music, official Music - Bachelor of Music - Theory Four Year Academic Plan (department source), " +
    "https://drive.google.com/uc?export=download&id=1JxSZQ1DN7HKJUNvUtr0foVUAm-Rm-pmn#Music-Performance---Theory " +
    "(fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "The Theory plan's own applied-lesson sequence -- MUSP109, MUSP110, MUSP207, MUSP208, MUSP305 -- " +
      "is only 5 courses, not the generic BM track's 8-semester MUSP119/120/217/218/315/316/419/420 " +
      "sequence: this is a genuinely different (shorter) private-lessons requirement per the " +
      "department page, encoded as 5 semesters accepting those numbers plus any MUSP course in the " +
      "same 100-399 range (the plan names no 400-level lesson course for Theory, so the upper bound " +
      "is left at 399; flagged).",
    "The Theory plan replaces the generic BM's separate large/small ensemble pair with a single " +
      "combined 'MUSC 229 or 329 (1 cr. x 5 semesters)' slot -- also a genuinely different (shorter, " +
      "un-split) ensemble requirement -- encoded as 5 credits choosing between MUSC229 and MUSC329.",
    "The Theory plan does not show the generic BM's conducting (MUSC446), music-literature (MUSC490) " +
      "or music-pedagogy (MUSC400) slots; instead it names MUSC461, MUSC464, a 'MUSC460 or MUSC472' " +
      "choice, and two 3-credit 400-level 'Music Theory Elective' slots (no specific course named for " +
      "either, encoded as a 6-credit 400-499 MUSC department choose). Form and analysis (MUSC450) is " +
      "retained.",
    "'3-5 credits of music electives' (catalog) is not shown as its own slot on the Theory plan " +
      "(unlike Piano, Strings and Wind & Percussion's plans, which each state an explicit 'IV. " +
      "Electives' total); encoded as the catalog's own 3-credit floor (generic MUSC department " +
      "choose, any level), matching the generic BM track's approach.",
    ...muscCommonReviewNotes,
  ],
  requirements: [
    {
      kind: "choose",
      id: "private-lessons",
      name: "5 semesters of private lessons (Senior Recital in final semester; not encoded) " +
        "(MUSP109, MUSP110, MUSP207, MUSP208, MUSP305)",
      count: 5,
      from: { courses: ["MUSP109", "MUSP110", "MUSP207", "MUSP208", "MUSP305"], departments: ["MUSP"], minNumber: 100, maxNumber: 399 },
    },
    {
      kind: "choose",
      id: "ensemble",
      name: "5 semesters of ensemble participation (MUSC229 or MUSC329)",
      credits: 5,
      from: { courses: ["MUSC229", "MUSC329"] },
    },
    muscTheory,
    muscHistorySurvey,
    muscHistoryElective400,
    muscGlobalMusic,
    muscClassPiano2,
    muscFormAnalysis,
    { kind: "course", id: "theory-req-461", name: "MUSC461 (Theory area requirement, no more specific label in the plan)", options: ["MUSC461"] },
    { kind: "course", id: "theory-req-464", name: "MUSC464 (Theory area requirement, no more specific label in the plan)", options: ["MUSC464"] },
    { kind: "choose", id: "theory-req-460-472", name: "MUSC460 or MUSC472 (Theory area requirement)", count: 1, from: { courses: ["MUSC460", "MUSC472"] } },
    {
      kind: "choose",
      id: "theory-electives",
      name: "2 semesters of 400-level Music Theory elective (no specific course named)",
      credits: 6,
      from: { departments: ["MUSC"], minNumber: 400, maxNumber: 499 },
    },
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

export const muscMajorBmTheoryMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Music (BM-Theory)",
  major: "musc",
  track: "Bachelor of Music - Theory",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/",
    department: "https://drive.google.com/uc?export=download&id=1JxSZQ1DN7HKJUNvUtr0foVUAm-Rm-pmn#Music-Performance---Theory",
  },
};
