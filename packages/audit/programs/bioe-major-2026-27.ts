// Bioengineering Major, Bachelor of Science (B.S.), 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/bioengineering/bioengineering-major/;
// Fischell Department of Bioengineering undergraduate page, https://bioe.umd.edu/undergraduate (fetched 2026-09-28);
// Fall 2026 Bioengineering Graduation Plan, https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/bioe_fall_2026_gradplan_0.pdf
// (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const bioeMajor: Program = {
  id: "bioe-major",
  name: "Bioengineering Major (B.S.)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Bioengineering Major; " +
    "Fischell Department of Bioengineering, undergraduate program page, https://bioe.umd.edu/undergraduate; " +
    "Fall 2026 Bioengineering Graduation Plan, " +
    "https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/bioe_fall_2026_gradplan_0.pdf (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "Department-vs-catalog difference (owner ruling: follow the department page): the catalog's required-courses table lists only CHEM135 for the chemistry lecture course; the department's Fall 2026 graduation-plan sheet lists 'CHEM 135-Chem Engr or 131 & 134-Fund & Prin' as alternative lecture sequences (CHEM136, the lab, is required either way). Encoded as a `sets` choice between [CHEM135] and [CHEM131, CHEM134].",
    "Not a disagreement, just a catalog footnote: 'BSCI331 & BSCI332 (BSCI330 may count for BSCI331 and BSCI332)'. Encoded as a `sets` choice between [BSCI331, BSCI332] and [BSCI330].",
    "Biological Science Elective I is specified by the department's graduation-plan sheet as '(BSCI 2xx)' (both the Technical Requirements summary and the term-by-term schedule). Encoded as a `choose` over any BSCI course numbered 200-299, since no fixed list is given. The two sources disagree on credits (catalog table: 3; department term sheet: 4) -- not fixed at a specific credit count for this reason.",
    "Not encoded (approved-list gap, both sources point to a page that was not fetched -- http://bioe.umd.edu/undergraduate/electives/ -- so there is no course list to encode, per the owner's ruling on 'approved' electives with no list): BIOE Foundational I, BIOE Foundational II, BIOE Elective I, BIOE Elective II, BIOE Elective III, BIOE Elective IV, Biological Science Elective II, and the Breadth Elective. See docs/project/owner-review.md.",
    "Not encoded (source gap): the department page's own nav lists 'Tracks' and 'Technical Electives' pages, but their content was not fetched, so it's unknown whether BIOE names tracks with different required courses (which would call for the astr-major pattern of one track per required-course set) or whether 'Tracks' just describes how the unencoded BIOE Foundational/Elective pools are chosen. Flagged rather than guessed; see docs/project/owner-review.md.",
    "Out of scope: 'B.S. in Biocomputational Engineering', also linked from the department nav, is a separate degree program; not encoded here (the source file covers only the Bioengineering major).",
    "Not encoded (Gen Ed layer, same treatment as other majors): ENGL101 (Academic Writing), the Professional Writing requirement, Oral Communication, and the six numbered General Education Requirement slots.",
    "Not encoded (engine gap): the 2.00 cumulative UM GPA requirement, and residency rules (final 30 credits at UMD, 15 of the final 30 at the 300-400 level, 12 upper-level major credits at UMD). The audit has no GPA-average or where-taken concept. Manual check.",
    "No minimum per-course grade is stated in either source for this major (unlike some other majors' explicit 'C-' floor); left unset rather than assumed. Confirm with the department whether a floor applies.",
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
      name: "Biological Science Elective I (BSCI 2xx)",
      count: 1,
      from: { departments: ["BSCI"], minNumber: 200, maxNumber: 299 },
    },
  ],
};

export const bioeMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Bioengineering (B.S.)",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/bioengineering/bioengineering-major/",
    department: "https://bioe.umd.edu/undergraduate",
  },
};
