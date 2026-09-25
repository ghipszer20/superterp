// Mathematics Major, Traditional Track, 2026–27 UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/mathematics/mathematics-major/
// Encoded by hand from the catalog's requirement table and footnotes. UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

const MATH_400_LEVEL = { departments: ["MATH", "AMSC", "STAT"], minNumber: 400, maxNumber: 499 };
// Footnote 4: electives may not include these.
const NOT_ELECTIVES = ["MATH461", "MATH478", "MATH480", "MATH481", "MATH482", "MATH483", "MATH484", "STAT464"];

export const mathMajorTraditional: Program = {
  id: "math-major-traditional",
  name: "Mathematics Major (Traditional Track)",
  catalogYear: "2026-27",
  source: "UMD Academic Catalog 2026–27, Mathematics Major, Traditional Track",
  // Owner-confirmed 2026-09-25: C- minimum; CMSC131 may count for programming and Sequence Four.
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Honors sequence (footnote 1): 'MATH340 satisfies MATH241; MATH340–MATH341 satisfies MATH240–MATH241–MATH246.' Approximated: MATH340 counts for MATH240 (overlay) and MATH241; MATH341 counts for the MATH246/436/462 slot. MATH340 alone would wrongly satisfy MATH240 too.",
    "Eight 400-level MATH/AMSC/STAT courses: encoded as an overlay count of 8 that the specific requirements (MATH410, algebra, AMSC, STAT, depth) also count toward. Footnote 4's exclusions (MATH461, 478, 480–484, STAT464) are applied to all eight, not only the electives.",
    "The depth sequence is an overlay: its courses may also be MATH410 / the algebra course.",
    "Applied Mathematics Track (the owner's track) is encoded separately in math-major-applied-2026-27.ts.",
    "Programming requirement also accepts CMSC141/CMSC142 (owner confirmed these substitute for CMSC131/132 in CS; assumed here too).",
    "Footnote 2 (at least four of the 400-level courses taken at College Park) and footnote 3 (outside substitutions with Undergraduate Office approval) are not enforced.",
  ],
  requirements: [
    // Introductory sequence (footnote 1: honors MATH340–341)
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math240", name: "Introduction to Linear Algebra", options: ["MATH240", "MATH340"], overlay: true },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241", "MATH340"] },
    { kind: "course", id: "math310", name: "Introduction to Mathematical Proof", options: ["MATH310"] },
    { kind: "course", id: "intro3", name: "MATH246, MATH436 or MATH462", options: ["MATH246", "MATH436", "MATH462", "MATH341"] },
    // MATH/AMSC/STAT courses: eight at the 400 level, which must include…
    { kind: "course", id: "math410", name: "Advanced Calculus I", options: ["MATH410"] },
    { kind: "course", id: "algebra", name: "MATH401, MATH403, MATH405 or MATH423", options: ["MATH401", "MATH403", "MATH405", "MATH423"] },
    { kind: "course", id: "numerical", name: "AMSC460 or AMSC466", options: ["AMSC460", "AMSC466"] },
    { kind: "choose", id: "stat4xx", name: "400-level STAT course other than STAT464", count: 1, from: { departments: ["STAT"], minNumber: 400, maxNumber: 499, exclude: ["STAT464"] } },
    {
      kind: "sets",
      id: "depth",
      name: "Depth sequence (one year)",
      overlay: true,
      options: [
        ["MATH410", "MATH411"],
        ["MATH410", "MATH463"],
        ["MATH403", "MATH404"],
        ["MATH403", "MATH405"],
        ["STAT410", "STAT420"],
      ],
    },
    { kind: "choose", id: "eight", name: "Eight 400-level MATH/AMSC/STAT courses", count: 8, overlay: true, from: { ...MATH_400_LEVEL, exclude: NOT_ELECTIVES } },
    // Computer programming requirement
    { kind: "course", id: "programming", name: "Computer programming course", options: ["CMSC106", "CMSC131", "CMSC141", "CMSC132", "CMSC142", "ENAE202", "ENEE150", "PHYS265"] },
    // Supporting three-course sequence (one of eight)
    {
      kind: "sets",
      id: "supporting",
      name: "Supporting three-course sequence",
      overlay: true,
      options: [
        ["PHYS161", "PHYS260", "PHYS261", "PHYS270", "PHYS271"],
        ["PHYS171", "PHYS272", "PHYS273"],
        ["ENES102", "PHYS161", "ENES220"],
        ["CMSC131", "CMSC132", "CMSC216"],
        ["CHEM146", "CHEM177", "CHEM237", "CHEM247"],
        ["CHEM131", "CHEM132", "CHEM231", "CHEM232", "CHEM241", "CHEM242"],
        ["ECON200", "ECON201", "ECON305"],
        ["ECON200", "ECON201", "ECON306"],
        ["ECON200", "ECON201", "ECON325"],
        ["ECON200", "ECON201", "ECON326"],
        ["BMGT220", "BMGT221", "BMGT340"],
      ],
    },
  ],
};
