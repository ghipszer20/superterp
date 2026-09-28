// Chemical Engineering Major, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/chemical-biomolecular-engineering/chemical-biomolecular-engineering-major/;
// Department of Chemical and Biomolecular Engineering, Bachelor of Science page, https://chbe.umd.edu/undergraduate/degrees/bachelor-science;
// Technical Electives page, https://chbe.umd.edu/undergraduate/technical-electives;
// Tracks page, https://chbe.umd.edu/undergraduate/prospective-students/tracks (all fetched 2026-09-28);
// and the A. James Clark School of Engineering's official Fall 2026 graduation plan,
// https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/chemical_fall_2026_gradplan_1.pdf (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const chbeMajor: Program = {
  id: "chbe-major",
  name: "Chemical Engineering Major",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Chemical Engineering Major; " +
    "Department of Chemical and Biomolecular Engineering, Bachelor of Science page, " +
    "https://chbe.umd.edu/undergraduate/degrees/bachelor-science (fetched 2026-09-28); " +
    "Technical Electives page, https://chbe.umd.edu/undergraduate/technical-electives (fetched 2026-09-28); " +
    "official Fall 2026 graduation plan, " +
    "https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/chemical_fall_2026_gradplan_1.pdf (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "Department-vs-catalog difference (department page wins, but not a real conflict): the catalog's four-year-plan table has footnote markers fused onto course numbers by its own OCR-style export (e.g. 'CHBE1011' for CHBE101 + footnote 1, 'CHBE4571' for CHBE457 + footnote 1). Once the footnote digits are stripped, the catalog's course list, the department Bachelor of Science page's '40 Credits of CHBE Courses' list (CHBE101, 250, 301, 302, 333, 410, 422, 424, 426, 437, 440, 442, 444, 446 -- 14 courses summing to exactly 40 credits), and the official graduation plan all agree exactly. Encoded from the department's clean list plus the graduation plan's placement of CHEM272, the BCHM sequence and the ENMA300/CHBE457 choice, all of which the department's 40-credit list doesn't cover (they're outside the 40 CHBE-course credits).",
    "Total credits: the catalog states 'Total Credits 128'; the department Bachelor of Science page states 'Students must complete 125 credits'; the official graduation plan's own term-by-term grid sums to exactly 125 (14+16+18+17+17+16+15+15). Per the department-wins ruling, 125 is correct here, but the audit engine has no total-credit-minimum concept regardless (see engine-gap note below), so neither figure is encoded.",
    "'Select one of the following: CHBE457 or ENMA300' (catalog junior year, second semester) -- confirmed by the official graduation plan's 'Big Question Courses ENMA 300 or CHBE 457' line, printed in the plan's own Major Requirements column (not its General Education column, whose 'Big Question (SCIS*)' rows are the generic gen-ed slots already covered by gen-ed-2026-27.ts). Encoded as a `course` requirement with both options.",
    "Biochemistry sequence: the catalog states 'BCHM461 or 463 ... If BCHM 461 is taken, it must be followed by BCHM 462, which can be counted as an out-of-major technical elective.' The official graduation plan's Technical Requirements block says the same ('BCHM 461 & BCHM 462 or BCHM463, 6 or 3 credits') and its own footnote repeats that BCHM462 doubles as the approved outside technical elective. Encoded as an `overlay` `sets` requirement ([['BCHM463'], ['BCHM461','BCHM462']]) so BCHM462 isn't consumed by this requirement and remains free to also satisfy one Technical Electives slot, matching the source exactly; BCHM462 is included in the Technical Electives filter's explicit course list for that reason.",
    "Technical Electives (9 credits): the Technical Electives page states 'Nine (9) credits of approved technical electives are required' and gives two explicit lists -- CHBE's own senior (400-level) courses, including CHBE468/469, and a named 'Approved Electives From Other Departments' table (BCHM462, BSCI4XX, CHEM425, CHEM474, CHEM482, ENES489P, ENFP464/489I, MATH461, ENMA411). Encoded as `choose` credits:9 from CHBE department courses numbered 400-499 (excluding this program's own required 400-level CHBE courses: 410, 422, 424, 426, 437, 440, 442, 444, 446, 457, so a required course can't double as its own elective) plus the named non-CHBE courses, EXCEPT BSCI4XX ('Certain courses will be approved on a case by case basis' -- no enumerable list; flagged in docs/project/owner-review.md) and ENFP464/489I are both listed since the source gives them as one slash-separated entry without saying they're interchangeable equivalents of each other.",
    "Not encoded (approved-elective policy, not a hard rule, flagged in docs/project/owner-review.md): 'Normally at least two of the three technical electives should be CHBE 4XX; the third elective may be chosen from CHBE or from the approved list of non-CHBE technical courses' -- phrased as guidance ('normally'), and the audit's `choose` requirement has no minimum-per-source-list mechanism to express 'at least 2 of 3 from department X, the rest from a named alternate list' short of a `concentration` (which requires ALL courses from one department, too strict here).",
    "Not encoded (engine gap, flagged in docs/project/owner-review.md): the technical-electives page's cap 'a maximum of three credits of CHBE 468 can be used to fulfill technical elective requirements' even though CHBE468 is otherwise repeatable up to 6 credits. The audit's course filters have no per-course credit cap within a `choose` requirement.",
    "Tracks (https://chbe.umd.edu/undergraduate/prospective-students/tracks) are NOT encoded as requirements or separate track programs: the tracks page states choosing a track is optional ('A student could choose to graduate with no tracks'), the default 4-year plan 'does not list tracks', and completion only earns a supplemental certificate ('Immediately after graduation, the department will issue printed certificates'), not a distinct major/degree. Each track just recommends 3 of its listed courses (mostly already in the Technical Electives list above) with a C- or better; no major requirement changes.",
    "Not encoded (engine gap, matches aero/biocomp precedent): the 2.0 cumulative UMD GPA requirement for graduation. The audit only checks per-course minGrade where a source states one; no source here states a per-course minimum grade for the major curriculum itself (only the optional tracks require C- per course, and tracks aren't encoded -- see above).",
    "Not encoded (engine gap): residency rules mentioned only via the general A. James Clark School boilerplate on the graduation plan (final 30 credits at UMD, 15 of the final 30 at the 300-400 level, 12 upper-level major credits at UMD) and the total-credit minimum (125 or 128, see above). The audit checks individual requirements, not residency or overall credit totals.",
  ],
  requirements: [
    { kind: "course", id: "enes100", name: "Introduction to Engineering Design", options: ["ENES100"] },
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241"] },
    { kind: "course", id: "math246", name: "Differential Equations for Scientists and Engineers", options: ["MATH246"] },
    { kind: "course", id: "phys161", name: "General Physics: Mechanics and Particle Dynamics", options: ["PHYS161"] },
    { kind: "course", id: "phys260", name: "General Physics: Electricity, Magnetism and Thermodynamics", options: ["PHYS260"] },
    { kind: "course", id: "phys261", name: "General Physics: Electricity, Magnetism and Thermodynamics (Laboratory)", options: ["PHYS261"] },
    { kind: "course", id: "phys270", name: "General Physics: Modern Physics", options: ["PHYS270"] },
    { kind: "course", id: "phys271", name: "General Physics: Modern Physics (Laboratory)", options: ["PHYS271"] },
    { kind: "course", id: "chem135", name: "Chemistry for Engineers", options: ["CHEM135"] },
    { kind: "course", id: "chem136", name: "Chemistry Laboratory for Engineers", options: ["CHEM136"] },
    { kind: "course", id: "chem231", name: "Organic Chemistry I", options: ["CHEM231"] },
    { kind: "course", id: "chem232", name: "Organic Chemistry Laboratory I", options: ["CHEM232"] },
    { kind: "course", id: "chem241", name: "Organic Chemistry II", options: ["CHEM241"] },
    { kind: "course", id: "chem242", name: "Organic Chemistry Laboratory II", options: ["CHEM242"] },
    { kind: "course", id: "chem272", name: "General Bioanalytical Chemistry Laboratory", options: ["CHEM272"] },
    { kind: "course", id: "bioe120", name: "Biology for Engineers", options: ["BIOE120"] },
    {
      kind: "sets",
      id: "biochemistry-sequence",
      name: "Biochemistry (BCHM463, or BCHM461 followed by BCHM462)",
      options: [["BCHM463"], ["BCHM461", "BCHM462"]],
      overlay: true,
    },
    { kind: "course", id: "chbe101", name: "Introduction to Chemical and Biomolecular Engineering", options: ["CHBE101"] },
    { kind: "course", id: "chbe250", name: "Computational Methods in Chemical and Biomolecular Engineering", options: ["CHBE250"] },
    { kind: "course", id: "chbe301", name: "Chemical and Biomolecular Engineering Thermodynamics", options: ["CHBE301"] },
    { kind: "course", id: "chbe302", name: "Chemical and Biomolecular Engineering Thermodynamics II", options: ["CHBE302"] },
    { kind: "course", id: "chbe333", name: "Communication Skills for Engineers", options: ["CHBE333"] },
    { kind: "course", id: "chbe410", name: "Statistics and Experimental Design", options: ["CHBE410"] },
    { kind: "course", id: "chbe422", name: "Chemical and Biomolecular Transport Phenomena", options: ["CHBE422"] },
    { kind: "course", id: "chbe424", name: "Chemical and Biomolecular Transport Phenomena II", options: ["CHBE424"] },
    { kind: "course", id: "chbe426", name: "Chemical and Biomolecular Separations Processes", options: ["CHBE426"] },
    { kind: "course", id: "chbe437", name: "Chemical and Biomolecular Engineering Laboratory", options: ["CHBE437"] },
    { kind: "course", id: "chbe440", name: "Chemical Kinetics and Reactor Design", options: ["CHBE440"] },
    { kind: "course", id: "chbe442", name: "Chemical Engineering Systems Analysis", options: ["CHBE442"] },
    { kind: "course", id: "chbe444", name: "Process Engineering Economics and Design I", options: ["CHBE444"] },
    { kind: "course", id: "chbe446", name: "Process Engineering Economics and Design II", options: ["CHBE446"] },
    {
      kind: "course",
      id: "big-question-chbe",
      name: "Big Question Course (ENMA300 or CHBE457)",
      options: ["ENMA300", "CHBE457"],
    },
    {
      kind: "choose",
      id: "technical-electives",
      name: "Technical Electives (9 credits: CHBE 400-level courses, or an approved non-CHBE course)",
      credits: 9,
      from: {
        departments: ["CHBE"],
        minNumber: 400,
        maxNumber: 499,
        exclude: ["CHBE410", "CHBE422", "CHBE424", "CHBE426", "CHBE437", "CHBE440", "CHBE442", "CHBE444", "CHBE446", "CHBE457"],
        courses: ["BCHM462", "CHEM425", "CHEM474", "CHEM482", "ENES489P", "ENFP464", "ENFP489I", "MATH461", "ENMA411"],
      },
    },
  ],
};

export const chbeMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Chemical Eng.",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/chemical-biomolecular-engineering/chemical-biomolecular-engineering-major/",
    department: "https://chbe.umd.edu/undergraduate/degrees/bachelor-science",
  },
};
