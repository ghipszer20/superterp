// Music Major, Bachelor of Music (BM) -- Wind & Percussion area track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/
// (the generic BM requirement structure only -- the catalog does not break the BM out by area);
// the School of Music's official Music - Bachelor of Music - Winds and Percussion Four Year
// Academic Plan (department source), https://drive.google.com/uc?export=download&id=1pg0VkRRx43VVi85Y8_xmmvXXM5XpOumi#Music-Performance---Wind-&-Percussion
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

export const muscMajorBmWindPercussion: Program = {
  id: "musc-major-bm-wind-percussion",
  name: "Music Major (Bachelor of Music - Wind & Percussion)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Music Major (Bachelor of Music) " +
    "(https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/); " +
    "School of Music, official Music - Bachelor of Music - Winds and Percussion Four Year Academic Plan " +
    "(department source), https://drive.google.com/uc?export=download&id=1pg0VkRRx43VVi85Y8_xmmvXXM5XpOumi#Music-Performance---Wind-&-Percussion " +
    "(fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "The Wind & Percussion plan's applied-lesson numbers (MUSP119/120/217/218/315/316/419/420) and " +
      "ensemble numbers (MUSC229 large x8, MUSC129 small x6) match the generic BM track's own exactly " +
      "-- this area doesn't name area-specific lesson or ensemble courses.",
    "The Wind & Percussion plan does not show the generic BM's conducting (MUSC446) or music-pedagogy " +
      "(MUSC400) slots; instead it names two of its own upper-division courses -- MUSC444 and " +
      "MUSC448W -- with no more specific label than the course number in the plan. Form and analysis " +
      "(MUSC450) and music literature (MUSC490) are retained, in the same positions as the generic " +
      "track's.",
    "'3-5 credits of music electives' (catalog) is superseded by the plan's own explicit total -- two " +
      "named MUSC elective slots (3 cr. + 2 cr. = 5 credits) that together match its 'IV. Electives " +
      "(5 credits)' line -- per the owner's department-wins ruling; encoded as a 5-credit floor " +
      "(generic MUSC department choose, any level) rather than the catalog's lower range, since the " +
      "department page names a higher, exact total.",
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
    { kind: "choose", id: "large-ensemble", name: "8 semesters of large ensemble participation (MUSC229)", credits: 8, from: { courses: ["MUSC229"] } },
    { kind: "choose", id: "small-ensemble", name: "6-8 semesters of small ensemble participation (6-semester floor encoded) (MUSC129)", credits: 6, from: { courses: ["MUSC129"] } },
    muscTheory,
    muscHistorySurvey,
    muscHistoryElective400,
    muscGlobalMusic,
    muscClassPiano2,
    muscFormAnalysis,
    { kind: "course", id: "wp-req-444", name: "MUSC444 (Wind & Percussion area requirement, no more specific label in the plan)", options: ["MUSC444"] },
    { kind: "course", id: "wp-req-448w", name: "MUSC448W (Wind & Percussion area requirement, no more specific label in the plan)", options: ["MUSC448W"] },
    { kind: "course", id: "music-literature", name: "1 semester of music literature (MUSC490)", options: ["MUSC490"] },
    {
      kind: "choose",
      id: "electives",
      name: "Music electives (5 credits per the plan's 'IV. Electives' total)",
      credits: 5,
      from: { departments: ["MUSC"] },
    },
    muscRecitalAttendance(6),
  ],
};

export const muscMajorBmWindPercussionMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Music (BM-Wind&Perc)",
  major: "musc",
  track: "Bachelor of Music - Wind & Percussion",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/",
    department: "https://drive.google.com/uc?export=download&id=1pg0VkRRx43VVi85Y8_xmmvXXM5XpOumi#Music-Performance---Wind-&-Percussion",
  },
};
