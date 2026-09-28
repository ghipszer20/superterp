// Shared requirement building blocks for the Music Major's four degree-level tracks (Bachelor of
// Arts in Music, Bachelor of Music, Bachelor of Music Education-Instrumental, Bachelor of Music
// Education-Choral/General), 2026-27 UMD Academic Catalog. Not a program file itself (no `*Meta`
// export, so the registry generator ignores it); imported by musc-major-*-2026-27.ts, which share
// the Music Theory sequence, the two-semester "class piano" sequence, the two-semester Music
// History survey, the Global Music requirement and the MUSC099 recital-attendance requirement
// (identical across BA/BM/both BME tracks per the college's four official plans), and each define
// their own private-lessons, ensemble, and degree-specific requirements.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/music/music-major/
// (fetched 2026-09-28); see program-sources/music-major.md.

import type { Requirement } from "../src/audit.ts";

/** "4 semesters of music theory" (BA, BM, both BME tracks): all four official plans show the same
 * MUSC150/151/250/251 sequence in the same order, so this is encoded as the specific sequence
 * rather than a generic department choose. */
export const muscTheory: Requirement = {
  kind: "choose",
  id: "music-theory",
  name: "4 semesters of music theory (MUSC150, MUSC151, MUSC250, MUSC251)",
  count: 4,
  from: { courses: ["MUSC150", "MUSC151", "MUSC250", "MUSC251"] },
};

/** "2 semesters of class piano (Except Piano Majors)" (BA, BM, BME-Instrumental; BME-Choral/General
 * requires 4 semesters instead -- see that track's own file). All three plans show the same
 * MUSC102/MUSC103 pair in year 1. The "except Piano Majors" carve-out has no matching concept here
 * (the Piano BA/BM areas aren't yet encoded; see reviewNotes in each track file). */
export const muscClassPiano2: Requirement = {
  kind: "choose",
  id: "class-piano",
  name: "2 semesters of class piano, except Piano majors (MUSC102, MUSC103)",
  count: 2,
  from: { courses: ["MUSC102", "MUSC103"] },
};

/** "2 semesters of music history" (BA, BM, both BME tracks): all four plans show the same
 * MUSC360/MUSC361 pair. */
export const muscHistorySurvey: Requirement = {
  kind: "choose",
  id: "music-history",
  name: "2 semesters of music history (MUSC360, MUSC361)",
  count: 2,
  from: { courses: ["MUSC360", "MUSC361"] },
};

/** "1 semester of global music" (BA, BM, both BME tracks): all four plans show the same MUSC260
 * ("HU & UP" Gen Ed tags on the plans -- out of scope here, only the major layer is audited). */
export const muscGlobalMusic: Requirement = {
  kind: "course",
  id: "global-music",
  name: "1 semester of global music (MUSC260)",
  options: ["MUSC260"],
};

/** "1 semester of form and analysis" (BA, BM only -- not in either BME track's catalog list). All
 * plans that require it show MUSC450. */
export const muscFormAnalysis: Requirement = {
  kind: "course",
  id: "form-and-analysis",
  name: "1 semester of form and analysis (MUSC450)",
  options: ["MUSC450"],
};

/** Not in the catalog text at all, but named and required by every one of the four official plans
 * ("Students must take four/six semesters of MUSC099"): a 1-credit recital-attendance/seminar
 * course. `semesters` is the credit count (1 credit each); BA plan states 4 explicitly, both BME
 * plans state 6 explicitly, and the BM Strings plan's term grid shows MUSC099 six times (no
 * explicit total statement was legible in the fetched BM text, so 6 is inferred from the grid
 * count, matching the BME pattern). */
export function muscRecitalAttendance(semesters: number): Requirement {
  return {
    kind: "choose",
    id: "recital-attendance",
    name: `MUSC099 recital attendance/seminar (${semesters} semesters, department requirement not in the catalog text)`,
    credits: semesters,
    from: { courses: ["MUSC099"] },
  };
}

/** reviewNotes common to all four tracks (catalog-wide rules, engine gaps, and the scope decision
 * to build only the four degree-level tracks first). Each track file appends its own notes. */
export const muscCommonReviewNotes: string[] = [
  "Scope: only the four degree-level tracks (BA, BM, BME-Instrumental, BME-Choral/General) are " +
    "encoded. The BM degree also has seven per-area tracks (Composition, Jazz, Piano, Strings, " +
    "Theory, Voice, Wind & Percussion) with their own official four-year plans; none is encoded yet. " +
    "This track's applied-lesson course numbers are taken from one area's official plan (see this " +
    "file's own notes) and used generically -- a real BM/BA student's applied-lesson numbers vary by " +
    "instrument, but the semester count and credit shape are the same across areas per the catalog.",
  "Not encoded (engine gaps, matching every other ARHU major's precedent): the GPA-in-the-major " +
    "requirement (2.0 for BA/BM, 2.75 for both BME tracks per the catalog and all four plans); " +
    "residency rules (at least 30 credits at UMD, 15 of the final 30 at the 300-400 level, 12 upper-" +
    "level major credits at UMD); and the 120-credit graduation minimum (137 for BME per its plans).",
  "Not encoded (unencodable per owner ruling): auditions (all UMD Music undergraduate programs " +
    "require one), juries, the Senior Recital in the final semester of private lessons, and (for " +
    "Piano-area students, not yet encoded) the piano proficiency exam that replaces class piano.",
  "MUSC099 (recital attendance/seminar, all four tracks) is named and required by every official " +
    "plan but appears nowhere in the fetched catalog text; encoded anyway since a department plan " +
    "counts as a source under the owner's department-wins ruling, and it is a real, named course.",
];
