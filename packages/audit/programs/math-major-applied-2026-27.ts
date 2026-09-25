// Mathematics Major, Applied Mathematics Track, 2026–27 UMD Academic Catalog.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/mathematics/mathematics-major/
// Encoded by hand from the catalog's Applied Mathematics Track table and its footnotes
// (packages/catalog/test/fixtures/math-major.html, lists[1]). UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

const MATH_400_LEVEL = { departments: ["MATH", "AMSC", "STAT"], minNumber: 400, maxNumber: 499 };
// Footnote 3: electives may not include these.
const NOT_ELECTIVES = ["MATH461", "MATH478", "MATH480", "MATH481", "MATH482", "MATH483", "MATH484", "STAT464"];

// Owner-confirmed 2026-09-25: CMSC141 counts for CMSC131 and CMSC142 for CMSC132.
const CMSC_I = ["CMSC131", "CMSC141"];
const CMSC_II = ["CMSC132", "CMSC142"];
// Sequence Nine: BSCI171 and BSCI161 together may count for BSCI180; either general-chemistry pair.
const BIO_LABS = [["BSCI180"], ["BSCI171", "BSCI161"]];
const GEN_CHEM = [["CHEM131", "CHEM132"], ["CHEM146", "CHEM177"]];
// Sequence Eleven: GEOL100–GEOL110 plus two of these.
const GEOL_UPPER = ["GEOL322", "GEOL340", "GEOL341", "GEOL375"];
// Sequence Twelve: AOSC200–AOSC201 plus two additional 400-level AOSC courses.
const AOSC_400_TWO = { count: 2, from: { departments: ["AOSC"], minNumber: 400, maxNumber: 499 } };

export const mathMajorApplied: Program = {
  id: "math-major-applied",
  name: "Mathematics Major (Applied Mathematics Track)",
  catalogYear: "2026-27",
  source: "UMD Academic Catalog 2026–27, Mathematics Major, Applied Mathematics Track",
  // Owner-confirmed 2026-09-25: C- minimum; CMSC131 may count for programming and Sequence Four.
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "Honors sequence (footnote 1): 'MATH340 satisfies MATH241; MATH340–MATH341 satisfies MATH240–MATH241–MATH246.' Approximated as in the Traditional track: MATH340 counts for MATH240 (overlay) and MATH241; MATH341 counts for the MATH246/436/462 slot. MATH340 alone would wrongly satisfy MATH240 too.",
    "Eight 400-level MATH/AMSC/STAT courses: encoded as an overlay count of 8 that the specific requirements (MATH410, STAT410, STAT4xx, MATH401/405/423, AMSC460/466, the applied list, depth) also count toward. MATH436/MATH462 used for the introductory MATH246 slot still count toward the eight.",
    "Footnote 3's exclusions (MATH461, 478, 480–484, STAT464) are attached to the electives in the catalog but applied here to all eight, and STAT464 is also excluded from the STAT4xx course (as in the Traditional track).",
    "'400-level or higher' is capped at 499: 500+ graduate courses don't count toward the eight.",
    "'STAT4XX' is encoded as a 400-level STAT course other than STAT410 (which is required separately) and STAT464.",
    "The depth sequence is an overlay: its courses may also fill MATH410, STAT410, STAT4xx or the applied-list course. So STAT410–STAT420 alone fills stat410, stat4xx and depth, and MATH462–MATH463 may fill both the applied list and depth.",
    "The applied-list course (MATH416, 420, 424, 431, 452, 456, 462, 463, 464, 475) uses a course up; a course taken for the MATH246/436/462 slot can't also be it (MATH462).",
    "Programming requirement also accepts CMSC141/CMSC142 (owner confirmed these substitute for CMSC131/132 in CS; assumed here too). Sequence Four also accepts CMSC141 for CMSC131 and CMSC142 for CMSC132 (the Traditional track file does NOT do this for its Sequence Four yet).",
    "CMSC131 may count for both the programming requirement and Sequence Four (owner-confirmed): the supporting sequence is an overlay.",
    "Sequence Seven (ECON200, ECON201, ECON305 or 306, OR ECON325 or 326) is expanded into four three-course sets.",
    "Sequence Nine (BSCI170, BSCI160, BSCI180, CHEM131–132 or CHEM146–177; 'BSCI171 and BSCI161 may count for BSCI180') is expanded into four sets, all courses required.",
    "Sequence Eleven (GEOL100–GEOL110 plus two of GEOL322/340/341/375) is expanded into six sets.",
    "Sequence Twelve (AOSC200–AOSC201 plus two additional 400-level AOSC courses) is encoded as a set with a filter part: AOSC200, AOSC201 and any two AOSC courses numbered 400–499. 'Additional' is read as two courses other than AOSC200/201 (automatic, since those are 200-level); 500+ graduate AOSC courses don't count.",
    "Footnote 2 (at least four of the 400-level courses taken at College Park) and footnote 4 (other sequences approved by the Undergraduate Office) are not enforced.",
    "Footnote 5 (ASTR121 restricted to Astronomy majors) is cited by no row of the Applied table; ASTR121 is not in any Applied sequence. Ignored.",
  ],
  requirements: [
    // Introductory sequence (footnote 1: honors MATH340–341)
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "math240", name: "Introduction to Linear Algebra", options: ["MATH240", "MATH340"], overlay: true },
    { kind: "course", id: "math241", name: "Calculus III", options: ["MATH241", "MATH340"] },
    { kind: "course", id: "math310", name: "Introduction to Mathematical Proof", options: ["MATH310"] },
    { kind: "course", id: "intro3", name: "MATH246, MATH436 or MATH462", options: ["MATH246", "MATH436", "MATH462", "MATH341"] },
    // MATH/AMSC/STAT courses: eight at the 400 level, which must include… (footnote 2)
    { kind: "course", id: "math410", name: "Advanced Calculus I", options: ["MATH410"] },
    { kind: "course", id: "stat410", name: "Introduction to Probability Theory", options: ["STAT410"] },
    { kind: "choose", id: "stat4xx", name: "STAT4XX (other than STAT410 and STAT464)", count: 1, from: { departments: ["STAT"], minNumber: 400, maxNumber: 499, exclude: ["STAT410", "STAT464"] } },
    { kind: "course", id: "algebra", name: "MATH401, MATH405 or MATH423", options: ["MATH401", "MATH405", "MATH423"] },
    { kind: "course", id: "numerical", name: "AMSC460 or AMSC466", options: ["AMSC460", "AMSC466"] },
    {
      kind: "course",
      id: "applied",
      name: "One of MATH416, 420, 424, 431, 452, 456, 462, 463, 464, 475",
      options: ["MATH416", "MATH420", "MATH424", "MATH431", "MATH452", "MATH456", "MATH462", "MATH463", "MATH464", "MATH475"],
    },
    {
      kind: "sets",
      id: "depth",
      name: "Depth sequence (one year)",
      overlay: true,
      options: [
        ["MATH410", "MATH411"],
        ["MATH410", "MATH463"],
        ["MATH416", "MATH464"],
        ["MATH462", "MATH463"],
        ["STAT410", "STAT420"],
      ],
    },
    // Electives (footnote 3) fill out the eight.
    { kind: "choose", id: "eight", name: "Eight 400-level MATH/AMSC/STAT courses", count: 8, overlay: true, from: { ...MATH_400_LEVEL, exclude: NOT_ELECTIVES } },
    // Computer programming requirement
    { kind: "course", id: "programming", name: "Computer programming course", options: ["CMSC106", "CMSC131", "CMSC141", "CMSC132", "CMSC142", "ENAE202", "ENEE150", "PHYS265"] },
    // Supporting three-course sequence (one of twelve; footnote 4)
    {
      kind: "sets",
      id: "supporting",
      name: "Supporting three-course sequence",
      overlay: true,
      options: [
        // One
        ["PHYS161", "PHYS260", "PHYS261", "PHYS270", "PHYS271"],
        // Two
        ["PHYS171", "PHYS272", "PHYS273"],
        // Three
        ["ENES102", "PHYS161", "ENES220"],
        // Four
        ...CMSC_I.flatMap((i) => CMSC_II.map((ii) => [i, ii, "CMSC216"])),
        // Five
        ["CHEM146", "CHEM177", "CHEM237", "CHEM247"],
        // Six
        ["CHEM131", "CHEM132", "CHEM231", "CHEM232", "CHEM241", "CHEM242"],
        // Seven
        ["ECON200", "ECON201", "ECON305"],
        ["ECON200", "ECON201", "ECON306"],
        ["ECON200", "ECON201", "ECON325"],
        ["ECON200", "ECON201", "ECON326"],
        // Eight
        ["BMGT220", "BMGT221", "BMGT340"],
        // Nine
        ...BIO_LABS.flatMap((labs) => GEN_CHEM.map((chem) => ["BSCI170", "BSCI160", ...labs, ...chem])),
        // Ten
        ["ASTR130", "ASTR131", "ASTR232"],
        // Eleven
        ...GEOL_UPPER.flatMap((a, i) => GEOL_UPPER.slice(i + 1).map((b) => ["GEOL100", "GEOL110", a, b])),
        // Twelve
        ["AOSC200", "AOSC201", AOSC_400_TWO],
      ],
    },
  ],
};
