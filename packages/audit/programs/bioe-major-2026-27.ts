// Bioengineering Major, Bachelor of Science (B.S.), 2026-27 UMD Academic Catalog.
// Bioengineering Studies (No Track) -- the department's default track for students who don't
// declare one of the four named tracks (see bioe-major-tracks-2026-27.ts).
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/bioengineering/bioengineering-major/;
// Fischell Department of Bioengineering undergraduate page, https://bioe.umd.edu/undergraduate (fetched 2026-09-28);
// Department Technical Electives page, https://bioe.umd.edu/undergraduate/electives (fetched 2026-09-28);
// Fall 2026 Bioengineering Graduation Plan, https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/bioe_fall_2026_gradplan_0.pdf
// (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

/** The six courses eligible as a BIOE Foundational (electives page, "Electives Overview"). */
export const BIOE_FOUNDATIONAL_LIST = ["BIOE404", "BIOE413", "BIOE420", "BIOE453", "BIOE461", "BIOE462"];

/** Core-curriculum BIOE courses (300+) that can't also count as a BIOE elective or breadth elective. */
export const BIOE_CORE_UPPER = ["BIOE331", "BIOE340", "BIOE372", "BIOE457", "BIOE485", "BIOE486"];

/** BIOE489H and BIOE389 are explicitly excluded from the BIOE-elective pool (electives page footnote). */
export const BIOE_NOT_ELECTIVE = [...BIOE_CORE_UPPER, ...BIOE_FOUNDATIONAL_LIST, "BIOE389", "BIOE489H"];

/**
 * The department's "Biological Science Electives" list (electives page). CHEM271/272 and
 * BSCI222/HLSC322 are either/or pairs per the page's own footnotes; BSCI374 was previously coded
 * BSCI474 (page note), kept as an alternative for older transcripts.
 */
export const BIOE_BIOSCI_LIST = [
  "BSCI202", "BSCI222", "BSCI223", "BSCI338", "BSCI339", "BSCI343", "BSCI353", "BSCI370", "BSCI374", "BSCI382",
  "BSCI404", "BSCI410", "BSCI411", "BSCI412", "BSCI414", "BSCI416", "BSCI417", "BSCI420", "BSCI421", "BSCI422",
  "BSCI424", "BSCI430", "BSCI433", "BSCI435", "BSCI436", "BSCI437", "BSCI443", "BSCI446", "BSCI447", "BSCI471",
  "BCHM461", "BCHM463", "CHEM241", "CHEM271", "CHEM272", "CHEM481", "CHEM482", "ENST499G", "KNES360", "KNES370",
  "NEUR306",
];
const BIOE_BIOSCI_300PLUS = BIOE_BIOSCI_LIST.filter((c) => !["BSCI202", "BSCI222", "BSCI223"].includes(c));
export const BIOE_BIOSCI_ALTERNATIVES: string[][] = [["CHEM271", "CHEM272"], ["BSCI222", "HLSC322"], ["BSCI374", "BSCI474"]];

/** The department's named "Breadth Electives" list (electives page); the page's own "Any 3xx/4xx */
export const BIOE_BREADTH_NAMED = ["BSCI222", "BSCI223", "CHEM241", "CHEM271", "CHEM272", "BCHM463", "CMSC132", "ENED394H", "MATH463", "MATH464"];

export const bioeMajor: Program = {
  id: "bioe-major",
  name: "Bioengineering Major (B.S.)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Bioengineering Major; " +
    "Fischell Department of Bioengineering, undergraduate program page, https://bioe.umd.edu/undergraduate; " +
    "Department Technical Electives page, https://bioe.umd.edu/undergraduate/electives (fetched 2026-09-28); " +
    "Fall 2026 Bioengineering Graduation Plan, " +
    "https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/bioe_fall_2026_gradplan_0.pdf (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "Department-vs-catalog difference (owner ruling: follow the department page): the catalog's required-courses table lists only CHEM135 for the chemistry lecture course; the department's Fall 2026 graduation-plan sheet lists 'CHEM 135-Chem Engr or 131 & 134-Fund & Prin' as alternative lecture sequences (CHEM136, the lab, is required either way). Encoded as a `sets` choice between [CHEM135] and [CHEM131, CHEM134].",
    "Not a disagreement, just a catalog footnote: 'BSCI331 & BSCI332 (BSCI330 may count for BSCI331 and BSCI332)'. Encoded as a `sets` choice between [BSCI331, BSCI332] and [BSCI330].",
    "Biological Science Elective I and II: the electives page's 'Biological Science Electives' list and policy (both 200+, at least one of the two 300+) now supersedes the graduation-plan sheet's vaguer '(BSCI 2xx)'. Encoded as two `choose` requirements over BIOE_BIOSCI_LIST: Elective I from the full list, Elective II restricted to the 300+ subset, which guarantees the 'at least one 300+' policy without a cross-requirement constraint the engine doesn't have. The two sources still disagree on Elective I's credits (catalog table: 3; department term sheet: 4); not fixed at a specific credit count for this reason.",
    "Now encoded from the department's electives page (https://bioe.umd.edu/undergraduate/electives, fetched 2026-09-28): BIOE Foundational I/II (choose 2 of BIOE_FOUNDATIONAL_LIST), BIOE Elective I-IV (choose 4, any 300-499 BIOE course excluding core/foundational/BIOE389/BIOE489H per the page's own carve-outs), and the Breadth Elective (the page's named non-BIOE list plus any 300-499 BIOE course). All five electives categories carry the page's stated 'C- or better' floor -- encoded as `minGrade: \"C-\"` on each, superseding review note below about no floor being stated.",
    "Not encoded (Breadth Elective, undecidable list): the electives page also allows 'Any 3xx or 4xx Engr. dept. course... other departmental upper-level courses if available' beyond BIOE, with an ENES carve-out (excluded except ENES221/401/498E/489P/499). Which department prefixes count as 'Engr. dept.' is never enumerated, and 'if available' implies it isn't a fixed set; not guessed. Only the page's own named list plus BIOE 3xx/4xx is encoded. See docs/project/owner-review.md.",
    "Lecture/lab and either/or pairs (CHEM271/272, BSCI222-or-HLSC322, BSCI338-or-339, BSCI374/474) are encoded as `alternatives` pairs (taking both counts once), per the electives page's own footnotes. 'Both required together' for CHEM271/272 is not enforced -- the engine has no set-inside-choose primitive; either course alone satisfies the slot it's used for.",
    "The four named Bioengineering Tracks (https://bioe.umd.edu/undergraduate/tracks, fetched 2026-09-28) define their own Foundational/Elective/Breadth/Biological-Science-Elective course lists, distinct from this program's general 'Bioengineering Studies (No Track)' lists -- encoded as four separate track programs sharing major key 'bioe' (see bioe-major-tracks-2026-27.ts); this program is the default track (Bioengineering Studies (No Track), ProgramMeta.defaultTrack: true), per the tracks page's own wording ('Students may wish to select electives in conjunction with a Bioengineering Track').",
    "Out of scope: 'B.S. in Biocomputational Engineering', also linked from the department nav, is a separate degree program; not encoded here (the source file covers only the Bioengineering major).",
    "Not encoded (Gen Ed layer, same treatment as other majors): ENGL101 (Academic Writing), the Professional Writing requirement, Oral Communication, and the six numbered General Education Requirement slots.",
    "Not encoded (engine gap): the 2.00 cumulative UM GPA requirement, and residency rules (final 30 credits at UMD, 15 of the final 30 at the 300-400 level, 12 upper-level major credits at UMD). The audit has no GPA-average or where-taken concept. Manual check.",
    "No minimum per-course grade is stated for the required core courses above (unlike some other majors' explicit program-wide 'C-' floor); left unset there. The electives page does state a 'C- or better' floor, but only for the electives -- see the electives note above. Confirm with the department whether a floor also applies to the core courses.",
    "Credit-total note (informational, not a real disagreement): the catalog's total is 126 credits; summing the department's own term-by-term schedule gives 127. The one-credit difference is Biological Science Elective I, which both sources present as '3 or 4' credits depending on the course chosen.",
  ],
  requirements: [
    { kind: "course", id: "bioe120", name: "Biology for Engineers", options: ["BIOE120"] },
    { kind: "course", id: "bioe121", name: "Biology for Engineers Laboratory", options: ["BIOE121"] },
    { kind: "course", id: "bioe221", name: "Introduction to the Bioengineering Major", options: ["BIOE221"] },
    { kind: "course", id: "bioe232", name: "Biological Thermodynamics", options: ["BIOE232"] },
    { kind: "course", id: "bioe241", name: "Biocomputation Methods", options: ["BIOE241"] },
    { kind: "course", id: "bioe246", name: "Differential Equations for Bioengineers", options: ["BIOE246"] },
    { kind: "course", id: "bioe331", name: "Biofluids", options: ["BIOE331"] },
    { kind: "course", id: "bioe340", name: "Modeling of Physiological Systems and Laboratory", options: ["BIOE340"] },
    { kind: "course", id: "bioe372", name: "Biostatistics", options: ["BIOE372"] },
    { kind: "course", id: "bioe457", name: "Biomedical Electronics and Instrumentation", options: ["BIOE457"] },
    { kind: "course", id: "bioe485", name: "Bioengineering Capstone Design I", options: ["BIOE485"] },
    { kind: "course", id: "bioe486", name: "Bioengineering Capstone Design II", options: ["BIOE486"] },
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241"] },
    { kind: "course", id: "math243", name: "Introduction to Linear Algebra and Differential Equations", options: ["MATH243"] },
    { kind: "course", id: "phys161", name: "General Physics I", options: ["PHYS161"] },
    { kind: "course", id: "phys260", name: "General Physics II", options: ["PHYS260"] },
    { kind: "course", id: "phys261", name: "General Physics II Laboratory", options: ["PHYS261"] },
    { kind: "course", id: "chem136", name: "Chemistry Laboratory for Engineers", options: ["CHEM136"] },
    { kind: "course", id: "chem231", name: "Organic Chemistry I", options: ["CHEM231"] },
    { kind: "course", id: "chem232", name: "Organic Chemistry I Laboratory", options: ["CHEM232"] },
    { kind: "course", id: "enes100", name: "Introduction to Engineering Design", options: ["ENES100"] },
    { kind: "course", id: "enes102", name: "Mechanics I", options: ["ENES102"] },
    { kind: "course", id: "enes200", name: "Technology and Consequences", options: ["ENES200"] },
    {
      kind: "sets",
      id: "chem-lecture",
      name: "Chemistry lecture sequence",
      options: [["CHEM135"], ["CHEM131", "CHEM134"]],
    },
    {
      kind: "sets",
      id: "cell-biology",
      name: "Cell Biology & Physiology (with lab)",
      options: [["BSCI331", "BSCI332"], ["BSCI330"]],
    },
    {
      kind: "choose",
      id: "bio-science-elective-1",
      name: "Biological Science Elective I",
      count: 1,
      minGrade: "C-",
      from: { courses: BIOE_BIOSCI_LIST },
      alternatives: BIOE_BIOSCI_ALTERNATIVES,
    },
    {
      kind: "choose",
      id: "bio-science-elective-2",
      name: "Biological Science Elective II (300-level or above)",
      count: 1,
      minGrade: "C-",
      from: { courses: BIOE_BIOSCI_300PLUS },
      alternatives: BIOE_BIOSCI_ALTERNATIVES,
    },
    {
      kind: "choose",
      id: "bioe-foundational",
      name: "BIOE Foundational I & II",
      count: 2,
      minGrade: "C-",
      from: { courses: BIOE_FOUNDATIONAL_LIST },
    },
    {
      kind: "choose",
      id: "bioe-elective",
      name: "BIOE Elective I-IV",
      count: 4,
      minGrade: "C-",
      from: { departments: ["BIOE"], minNumber: 300, maxNumber: 499, exclude: BIOE_NOT_ELECTIVE },
    },
    {
      kind: "choose",
      id: "breadth-elective",
      name: "Breadth Elective",
      count: 1,
      minGrade: "C-",
      from: { courses: BIOE_BREADTH_NAMED, departments: ["BIOE"], minNumber: 300, maxNumber: 499, exclude: BIOE_NOT_ELECTIVE },
      alternatives: [["CHEM271", "CHEM272"], ["BSCI222", "HLSC322"]],
    },
  ],
};

export const bioeMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Bioengineering (B.S.)",
  major: "bioe",
  track: "Bioengineering Studies (No Track)",
  defaultTrack: true,
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/bioengineering/bioengineering-major/",
    department: "https://bioe.umd.edu/undergraduate",
  },
};
