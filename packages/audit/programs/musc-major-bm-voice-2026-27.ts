// Music Major, Bachelor of Music (BM) -- Voice area track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/
// (the generic BM requirement structure only -- the catalog does not break the BM out by area);
// the School of Music's official Music - Bachelor of Music - Voice Four Year Academic Plan
// (department source), https://drive.google.com/uc?export=download&id=1HGZC7G4ULXXPlXEB6QrN3Fp0RJ5-ZpWL#Music-Performance---Voice
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

export const muscMajorBmVoice: Program = {
  id: "musc-major-bm-voice",
  name: "Music Major (Bachelor of Music - Voice)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Music Major (Bachelor of Music) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/); " +
    "School of Music, official Music - Bachelor of Music - Voice Four Year Academic Plan (department source), " +
    "https://drive.google.com/uc?export=download&id=1HGZC7G4ULXXPlXEB6QrN3Fp0RJ5-ZpWL#Music-Performance---Voice " +
    "(fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "The Voice plan names its own applied-lesson course numbers -- MUSP119B/120B/217B/218B/315B/" +
      "316B/419B/420B (a 'B' suffix, presumably the voice-lesson section of each generic MUSP " +
      "number) -- so per the batch's 'named area-specific lesson courses' rule, this requirement " +
      "accepts those numbers plus any MUSP course in the same 100-499 range (flagged).",
    "The Voice plan replaces the generic BM's separate large/small ensemble pair with a single " +
      "MUSC329 (1 cr. x 8 semesters) requirement, plus its own MUSC379 (1 cr. x 2 semesters, opera " +
      "workshop/vocal repertoire, no more specific label in the plan) -- both genuinely different " +
      "from the generic track's MUSC229/MUSC129 pair.",
    "The Voice plan adds six diction/vocal-skills courses not in the generic BM track at all -- " +
      "MUSC123, MUSC126, MUSC127, MUSC202, MUSC226 and MUSC227 -- encoded as a single 6-course choose " +
      "restricted to exactly that list (all six are required, not a genuine choice among them).",
    "The Voice plan adds a foreign-language requirement not in the generic BM track: 'Choose two " +
      "from FREN103, GERS103 and ITAL103', encoded as a 2-course choose among those three.",
    "The Voice plan's '1 semester of music pedagogy' slot shows 'MUSC 400V', reconstructed here as " +
      "the base course MUSC400 (a 'V' section suffix, not a distinct catalog course number), the " +
      "same reconstruction the generic BM track applies to Strings' 'MUSC 400S'. Please verify " +
      "against the department if exact identity matters.",
    "The Voice plan does not show the generic BM's conducting (MUSC446) slot; it names MUSC443 in a " +
      "comparable position instead (no more specific label than the course number in the plan). Form " +
      "and analysis (MUSC450) and music literature (MUSC490) are retained.",
    "'3-5 credits of music electives' (catalog) encoded as a 3-credit floor (generic MUSC department " +
      "choose, any level), matching the generic BM track's own approach -- the Voice plan shows no " +
      "explicit music-elective total of its own.",
    ...muscCommonReviewNotes,
  ],
  requirements: [
    {
      kind: "choose",
      id: "private-lessons",
      name: "8 semesters of private lessons (Senior Recital in final semester; not encoded) " +
        "(MUSP119B, MUSP120B, MUSP217B, MUSP218B, MUSP315B, MUSP316B, MUSP419B, MUSP420B)",
      count: 8,
      from: { courses: ["MUSP119B", "MUSP120B", "MUSP217B", "MUSP218B", "MUSP315B", "MUSP316B", "MUSP419B", "MUSP420B"], departments: ["MUSP"], minNumber: 100, maxNumber: 499 },
    },
    { kind: "choose", id: "ensemble", name: "8 semesters of ensemble participation (MUSC329)", credits: 8, from: { courses: ["MUSC329"] } },
    { kind: "choose", id: "vocal-repertoire", name: "2 semesters of opera workshop/vocal repertoire (MUSC379, no more specific label in the plan)", credits: 2, from: { courses: ["MUSC379"] } },
    {
      kind: "choose",
      id: "diction",
      name: "Voice diction/vocal-skills courses (MUSC123, MUSC126, MUSC127, MUSC202, MUSC226, MUSC227)",
      count: 6,
      from: { courses: ["MUSC123", "MUSC126", "MUSC127", "MUSC202", "MUSC226", "MUSC227"] },
    },
    {
      kind: "choose",
      id: "language",
      name: "Language requirement: choose two from FREN103, GERS103 and ITAL103",
      count: 2,
      from: { courses: ["FREN103", "GERS103", "ITAL103"] },
    },
    muscTheory,
    muscHistorySurvey,
    muscHistoryElective400,
    muscGlobalMusic,
    muscClassPiano2,
    muscFormAnalysis,
    { kind: "course", id: "voice-req-443", name: "MUSC443 (Voice area requirement, no more specific label in the plan)", options: ["MUSC443"] },
    { kind: "course", id: "music-pedagogy", name: "1 semester of music pedagogy (MUSC400, plan shows 'MUSC400V')", options: ["MUSC400"] },
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

export const muscMajorBmVoiceMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Music (BM-Voice)",
  major: "musc",
  track: "Bachelor of Music - Voice",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/",
    department: "https://drive.google.com/uc?export=download&id=1HGZC7G4ULXXPlXEB6QrN3Fp0RJ5-ZpWL#Music-Performance---Voice",
  },
};
