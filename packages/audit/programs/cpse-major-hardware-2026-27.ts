// Cyber-Physical Systems Engineering Major, Hardware Track, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/electrical-and-computer/cyber-physical-systems-engineering-major/;
// Universities at Shady Grove ECE Curriculum page, https://shadygrove.ece.umd.edu/curriculum (fetched 2026-09-28);
// Program Admissions page, https://shadygrove.ece.umd.edu/program-admissions (fetched 2026-09-28); and the
// A. James Clark School of Engineering's official Fall 2026 graduation plan,
// https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/cyber-physical_fall_2026_gradplan.pdf (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Owner ruling: CMSC141 counts for CMSC131 wherever CMSC131 appears (CMSC132/CMSC142 don't appear in this program).
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const cpseMajorHardware: Program = {
  id: "cpse-major-hardware",
  name: "Cyber-Physical Systems Engineering Major (Hardware Track)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Cyber-Physical Systems Engineering Major; " +
    "Universities at Shady Grove ECE Curriculum page, https://shadygrove.ece.umd.edu/curriculum " +
    "(fetched 2026-09-28); official Fall 2026 graduation plan, " +
    "https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/cyber-physical_fall_2026_gradplan.pdf (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "This is a cohort program at the Universities at Shady Grove: students complete the first ~60 credits (lower-level Gen Ed, math/science and the pre-major courses below) at College Park or a community college, then apply for direct admission into the two-year junior/senior CPSE cohort. Only the curriculum requirements are encoded below; the admission process itself is out of scope for the audit.",
    "Department-vs-catalog difference (not a real conflict): the catalog's junior-year table has an extra 'ENEB ELECTIVE | 3' row in the second semester that the department's Curriculum page's own 'Required Courses' list (15 courses, summing to 47 credits) doesn't include. Cross-checked against the official Fall 2026 graduation plan, which places ENEB352 (one of the track elective-pool courses, a prerequisite for ENEB451) in that exact Junior-Spring slot instead of a 15th required course. The math confirms this: 47 (15 required courses) + 15 (1 track-required course + 4 track electives) = 62, matching the catalog's own 'Total Credits 62' with no room left for a distinct 16th required course. Encoded as the department's 15 required courses plus the track's 1 required + 4 elective courses, with ENEB352 simply being one elective a student may take early (as the sample plan does); no separate 'ENEB elective' requirement is encoded.",
    "Programming Requirement (catalog footnote 1): 'Any of the following ... or their equivalents will be accepted: ENEE140, CMSC131, CMSC106, [or] any introductory course in C, C++, Java, or Python (student must submit the course to ECE Department for Evaluation)'. Encoded as a `course` requirement with options ENEE140/CMSC131/CMSC106 plus CMSC141 (owner ruling: CMSC141 substitutes for CMSC131 wherever it appears). The open-ended 'any introductory course ... submit for evaluation' clause is NOT encoded (no enumerable list, case-by-case department approval); flagged in docs/project/owner-review.md.",
    "'One of the following MATH2xx courses: MATH246, MATH241, MATH240' encoded as a `course` requirement with all three as options.",
    "Tracks (catalog and department Curriculum page agree): students select one of Hardware, Computational, Security or General. Hardware, Computational and Security each require one specific course plus 'select four of' a 7-course pool (the pool is the same 8 courses across all three tracks, minus that track's own required course); encoded as separate track programs (this file, `cpse-major-computational`, `cpse-major-security`) sharing the major key 'cpse', with Hardware set as `defaultTrack: true` (listed first on both the catalog's Tracks section and the department Curriculum page's track list). The General Track is NOT encoded as a program: both sources state it 'offers... no specific required or elective courses... Consult with an advisor for details' -- no enumerable course list exists. Flagged in docs/project/owner-review.md.",
    "Not encoded (admission gate, not a degree-completion rule, flagged in docs/project/owner-review.md): the Program Admissions page's per-course minimum grades for direct admission to the CPSE cohort (MATH141 and PHYS161 at B-; CHEM135/271/134 and ENES100/MATH140/PHYS260/261/the programming course at C-) and the college-wide 3.0 cumulative GPA gateway requirement (eng.umd.edu/transfer/external, lep.umd.edu). These gate entry into the major, not graduation from it, and the audit only checks per-course minGrade for requirements that must be met to complete the program.",
    "Not encoded (engine gap, matches other ENGR majors' precedent): the 2.00 cumulative UMD GPA and 2.0 minimum GPA for all degree requirements (graduation plan's boilerplate 'Requirements for Graduation' block); residency rules (final 30 credits at UMD, 15 of the final 30 at the 300-400 level, 12 upper-level major credits at UMD); and the 120-credit total-credit minimum. The audit checks individual requirements, not GPA, residency or overall credit totals.",
  ],
  requirements: [
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "engl101", name: "Academic Writing", options: ["ENGL101"] },
    { kind: "course", id: "chem135", name: "General Chemistry for Engineers", options: ["CHEM135"] },
    { kind: "course", id: "phys161", name: "General Physics: Mechanics and Particle Dynamics", options: ["PHYS161"] },
    { kind: "course", id: "phys260", name: "General Physics: Electricity, Magnetism and Thermodynamics", options: ["PHYS260"] },
    { kind: "course", id: "phys261", name: "General Physics: Mechanics, Vibrations, Waves, Heat (Laboratory)", options: ["PHYS261"] },
    {
      kind: "course",
      id: "programming-requirement",
      name: "Programming Requirement (ENEE140, CMSC131, CMSC106, or CMSC141)",
      options: ["ENEE140", "CMSC131", "CMSC141", "CMSC106"],
    },
    { kind: "course", id: "enes100", name: "Introduction to Engineering Design", options: ["ENES100"] },
    {
      kind: "course",
      id: "math2xx",
      name: "MATH246, MATH241, or MATH240",
      options: ["MATH246", "MATH241", "MATH240"],
    },
    { kind: "course", id: "eneb302", name: "Analog Circuits", options: ["ENEB302"] },
    { kind: "course", id: "eneb304", name: "Microelectronics and Sensors", options: ["ENEB304"] },
    { kind: "course", id: "eneb340", name: "Intermediate Programming Concepts and Applications for Embedded Systems", options: ["ENEB340"] },
    { kind: "course", id: "eneb341", name: "Introduction to Internet of Things", options: ["ENEB341"] },
    { kind: "course", id: "eneb344", name: "Digital Logic Design for Embedded Systems", options: ["ENEB344"] },
    { kind: "course", id: "eneb345", name: "Probability and Statistical Inference", options: ["ENEB345"] },
    { kind: "course", id: "eneb346", name: "Linear Algebra for Machine Learning Applications", options: ["ENEB346"] },
    { kind: "course", id: "eneb353", name: "Computer Organization for Embedded Systems", options: ["ENEB353"] },
    { kind: "course", id: "eneb354", name: "Discrete Mathematics for Information Technology", options: ["ENEB354"] },
    { kind: "course", id: "eneb355", name: "Algorithms in Python", options: ["ENEB355"] },
    { kind: "course", id: "eneb408a", name: "Capstone Design Lab I", options: ["ENEB408A"] },
    { kind: "course", id: "eneb408b", name: "Capstone Design Lab II", options: ["ENEB408B"] },
    { kind: "course", id: "eneb444", name: "Operating Systems for Embedded Systems", options: ["ENEB444"] },
    { kind: "course", id: "eneb454", name: "Embedded Systems", options: ["ENEB454"] },
    { kind: "course", id: "engl393", name: "Technical Writing", options: ["ENGL393"] },
    { kind: "course", id: "eneb455", name: "Advanced FPGA System Design using Verilog for Embedded Systems", options: ["ENEB455"] },
    {
      kind: "choose",
      id: "hardware-track-elective",
      name: "Hardware Track Elective (select four)",
      count: 4,
      from: { courses: ["ENEB352", "ENEB443", "ENEB451", "ENEB452", "ENEB453", "ENEB456", "ENEB457"] },
    },
  ],
};

export const cpseMajorHardwareMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Cyber-Physical Sys. Eng. (Hardware)",
  major: "cpse",
  track: "Hardware",
  defaultTrack: true,
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/electrical-and-computer/cyber-physical-systems-engineering-major/",
    department: "https://shadygrove.ece.umd.edu/curriculum",
  },
};
