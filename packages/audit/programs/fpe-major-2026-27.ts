// Fire Protection Engineering Major, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/fire-protection-engineering/fire-protection-engineering-major/;
// Department of Fire Protection Engineering, Bachelor of Science page, https://fpe.umd.edu/undergraduate/degrees/bachelor-science;
// Curriculum of the Fire Protection Engineering Major page, https://fpe.umd.edu/undergraduate/curriculum-fpe-major
// (all fetched 2026-09-28); and the A. James Clark School of Engineering's official Fall 2026
// graduation plan, https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/fire_protection_fall_2026_gradplan.pdf
// (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const fpeMajor: Program = {
  id: "fpe-major",
  name: "Fire Protection Engineering Major",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Fire Protection Engineering Major; " +
    "Department of Fire Protection Engineering, Bachelor of Science page, " +
    "https://fpe.umd.edu/undergraduate/degrees/bachelor-science (fetched 2026-09-28); " +
    "Curriculum of the Fire Protection Engineering Major page, " +
    "https://fpe.umd.edu/undergraduate/curriculum-fpe-major (fetched 2026-09-28); " +
    "official Fall 2026 graduation plan, " +
    "https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/fire_protection_fall_2026_gradplan.pdf (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "No department-vs-catalog conflict found: the catalog's requirement table and the department's " +
      "'Curriculum of the Fire Protection Engineering Major' page list the same courses with the same " +
      "credits (Basic Math and Science 25, Engineering Science 15, Major Requirements 56 including 12 " +
      "Technical Elective credits; General Education 24 -- covered separately by gen-ed-2026-27.ts, not " +
      "encoded here). Sub-totals were cross-checked and match exactly.",
    "'MATH241 or MATH240' (both pages agree, 4 credits): encoded as a `course` requirement with both options.",
    "Technical Electives (12 credits total): both the catalog and department pages give the same three-part " +
      "rule verbatim -- 'at least 3 credits of MATH400+ or STAT400+; at least 3 credits of ENFP400+; and at " +
      "least 6 credits of Engineering coursework 300+, CHEM400+, CMSC400+, MATH400+, or PHYS400+.' Encoded as " +
      "three separate `choose` requirements (3 + 3 + 6 = 12, matching the source split exactly): " +
      "tech-elective-math-stat (MATH/STAT 400+), tech-elective-enfp (ENFP 400+, excluding the 9 ENFP 400+ " +
      "courses already required above so a required course can't double as its own elective), and " +
      "tech-elective-engineering-science (CHEM/CMSC/MATH/PHYS 400+ only).",
    "Not encoded (unenumerable, flagged in docs/project/owner-review.md): the 6-credit bucket's 'Engineering " +
      "coursework 300+' option. Neither source names which departments count as 'Engineering coursework', and " +
      "the audit's `choose` filter applies one number floor to every department in its list, so it can't mix " +
      "a 300+ floor for an open-ended set of engineering departments with a 400+ floor for CHEM/CMSC/MATH/PHYS " +
      "in the same requirement. Only the CHEM/CMSC/MATH/PHYS 400+ half of that bucket is encoded; this is " +
      "conservative (under- not over-inclusive) -- a real plan using 300+ engineering coursework here may show " +
      "a false gap.",
    "Not encoded (no source lists specific technical-elective course numbers, unlike CHBE's dedicated " +
      "Technical Electives page): the sample plan's four generic 'Technical Elective**' slots are filled with " +
      "MATH461, ENFP464, CHEM425 and CHEM474 -- real UMD courses already cited as approved technical electives " +
      "for neighboring ENGR majors in this repo (chbe-major-2026-27.ts's Technical Electives page citation) " +
      "and confirmed elsewhere in the codebase's own course data; any courses satisfying the three buckets " +
      "above would equally work. See sample-plans/fpe-major.json notes.",
    "Not encoded (engine gap, matches other ENGR majors' precedent): the 2.0 cumulative UMD GPA requirement, " +
      "the graduation-plan boilerplate residency rules (final 30 credits at UMD, 15 of the final 30 at the " +
      "300-400 level, 12 upper-level major credits at UMD), and the 120-credit degree total. The audit checks " +
      "individual requirements, not GPA, residency or overall credit totals.",
  ],
  requirements: [
    { kind: "course", id: "chem135", name: "General Chemistry for Engineers", options: ["CHEM135"] },
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math241-or-240", name: "Calculus III or Introduction to Linear Algebra", options: ["MATH241", "MATH240"] },
    { kind: "course", id: "math246", name: "Differential Equations for Scientists and Engineers", options: ["MATH246"] },
    { kind: "course", id: "phys161", name: "General Physics: Mechanics and Particle Dynamics", options: ["PHYS161"] },
    { kind: "course", id: "phys260", name: "General Physics: Electricity, Magnetism and Thermodynamics", options: ["PHYS260"] },
    { kind: "course", id: "phys261", name: "General Physics: Mechanics, Vibrations, Waves, Heat (Laboratory)", options: ["PHYS261"] },
    { kind: "course", id: "enes100", name: "Introduction to Engineering Design", options: ["ENES100"] },
    { kind: "course", id: "enes102", name: "Mechanics I", options: ["ENES102"] },
    { kind: "course", id: "enes220", name: "Mechanics II", options: ["ENES220"] },
    { kind: "course", id: "enes221", name: "Dynamics", options: ["ENES221"] },
    { kind: "course", id: "enes232", name: "Thermodynamics", options: ["ENES232"] },
    { kind: "course", id: "enfp201", name: "Computer Programming and Numerical Methods in Fire Protection Engineering", options: ["ENFP201"] },
    { kind: "course", id: "enfp250", name: "Introduction to Life Safety Analysis", options: ["ENFP250"] },
    { kind: "course", id: "enfp300", name: "Fire Protection Fluid Mechanics", options: ["ENFP300"] },
    { kind: "course", id: "enfp310", name: "Water Based Fire Protection Systems Design", options: ["ENFP310"] },
    { kind: "course", id: "enfp312", name: "Heat and Mass Transfer", options: ["ENFP312"] },
    { kind: "course", id: "enfp350", name: "Professional Development Seminar", options: ["ENFP350"] },
    { kind: "course", id: "enfp405", name: "Structural Fire Protection", options: ["ENFP405"] },
    { kind: "course", id: "enfp410", name: "Special Hazard Suppression Systems", options: ["ENFP410"] },
    { kind: "course", id: "enfp411", name: "Risk-Informed Performance Based Design", options: ["ENFP411"] },
    { kind: "course", id: "enfp413", name: "Human Response to Fire", options: ["ENFP413"] },
    { kind: "course", id: "enfp415", name: "Fire Dynamics", options: ["ENFP415"] },
    { kind: "course", id: "enfp420", name: "Fire Assessment Methods and Laboratory", options: ["ENFP420"] },
    { kind: "course", id: "enfp425", name: "Enclosure Fire Modeling", options: ["ENFP425"] },
    { kind: "course", id: "enfp426", name: "Computational Methods in Fire Protection", options: ["ENFP426"] },
    { kind: "course", id: "enfp440", name: "Smoke Management and Fire Alarm Systems", options: ["ENFP440"] },
    {
      kind: "choose",
      id: "tech-elective-math-stat",
      name: "Technical Elective: 3 credits of MATH400+ or STAT400+",
      credits: 3,
      from: { departments: ["MATH", "STAT"], minNumber: 400 },
    },
    {
      kind: "choose",
      id: "tech-elective-enfp",
      name: "Technical Elective: 3 credits of ENFP400+",
      credits: 3,
      from: {
        departments: ["ENFP"],
        minNumber: 400,
        exclude: ["ENFP405", "ENFP410", "ENFP411", "ENFP413", "ENFP415", "ENFP420", "ENFP425", "ENFP426", "ENFP440"],
      },
    },
    {
      kind: "choose",
      id: "tech-elective-engineering-science",
      name: "Technical Elective: 6 credits of CHEM400+, CMSC400+, MATH400+ or PHYS400+ (see reviewNotes for the 'Engineering coursework 300+' option, not encoded)",
      credits: 6,
      from: { departments: ["CHEM", "CMSC", "MATH", "PHYS"], minNumber: 400 },
    },
  ],
};

export const fpeMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Fire Protection Eng.",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/fire-protection-engineering/fire-protection-engineering-major/",
    department: "https://fpe.umd.edu/undergraduate/degrees/bachelor-science",
  },
};
