// Computer Engineering Major, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/electrical-and-computer/computer-engineering-major/;
// Department of Electrical and Computer Engineering, B.S. in Computer Engineering page,
// https://ece.umd.edu/undergraduate/degrees/bs-computer-engineering;
// Technical Electives page, https://ece.umd.edu/undergraduate/degrees/bs-computer-engineering/technical-electives-0;
// and the A. James Clark School of Engineering's official Fall 2026 graduation plan,
// https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/computer_fall_2026_gradglan.pdf (all fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page; each such difference is recorded below citing both.
// Owner ruling: CMSC141 counts for CMSC131 and CMSC142 for CMSC132 wherever those appear.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

const CATEGORY_A = [
  "CMSC456", "MATH456", "ENEE456",
  "AMSC460", "CMSC460", "AMSC466", "CMSC466", "CMSC475",
  "MATH240", "MATH241", "MATH401", "MATH402", "MATH403", "MATH405", "MATH406",
  "MATH410", "MATH411", "MATH423", "MATH461", "MATH462", "MATH463", "MATH464",
  "PHYS270", "PHYS271", "PHYS420",
];
const CATEGORY_A_400_LEVEL = [
  "AMSC460", "CMSC460", "AMSC466", "CMSC466", "CMSC475",
  "MATH401", "MATH402", "MATH403", "MATH405", "MATH406",
  "MATH410", "MATH411", "MATH423", "MATH461", "MATH462", "MATH463", "MATH464",
  "PHYS420",
];
const CATEGORY_B = [
  "CMSC414", "CMSC416", "CMSC417", "CMSC420", "CMSC421", "CMSC422", "CMSC423",
  "CMSC424", "CMSC425", "CMSC426", "CMSC427", "CMSC430", "CMSC433", "CMSC434",
  "CMSC436", "CMSC451", "CMSC452", "CMSC457", "CMSC472", "CMSC474",
  "CMSC460", "CMSC466", "CMSC475",
];
const CATEGORY_C = [
  "ENEE322", "ENEE323", "ENEE382", "ENEE411", "ENEE413", "ENEE420", "ENEE425",
  "ENEE426", "ENEE429Z", "ENEE435", "ENEE436", "ENEE439G", "ENEE440", "ENEE452",
  "ENEE457", "ENEE459A", "ENEE459C", "ENEE459P", "ENEE460", "ENEE463", "ENEE464",
  "ENEE474", "ENEE475", "ENEE476", "ENEE484", "ENEE488", "ENEE491", "ENEE492",
  "ENEE496", "ENEE499",
];
const CATEGORY_D = [
  "ENEE415", "ENEE416", "ENEE427", "ENEE445", "ENEE459B", "ENEE459L", "ENEE461",
  "ENEE473", "ENEE489J", "ENEE493", "ENEE499L",
];
const CATEGORY_E = [
  "ENEE408A", "ENEE408C", "ENEE408D", "ENEE408I", "ENEE408J", "ENEE408M",
  "ENEE408N", "ENEE408V", "ENEE408W", "CMSC435",
];
// Disciplinary foundation courses that may not fulfill any Technical Elective category
// (department page numbers, see reviewNotes for the catalog's differing list).
const FOUNDATION_EXCLUDE = ["CMSC330", "CMSC351", "CMSC412", "ENEE447", "ENEE304", "ENEE305", "ENEE350", "ENEE446"];
const CRYPTO_CROSSLIST: string[][] = [["CMSC456", "MATH456", "ENEE456"]];

export const compeMajor: Program = {
  id: "compe-major",
  name: "Computer Engineering Major",
  catalogYear: "2026-27",
  minGrade: "C-",
  source:
    "UMD Academic Catalog 2026–27, Computer Engineering Major; " +
    "Department of Electrical and Computer Engineering, B.S. in Computer Engineering page, " +
    "https://ece.umd.edu/undergraduate/degrees/bs-computer-engineering (fetched 2026-09-28); " +
    "Technical Electives page, https://ece.umd.edu/undergraduate/degrees/bs-computer-engineering/technical-electives-0 (fetched 2026-09-28); " +
    "official Fall 2026 graduation plan, " +
    "https://eng.umd.edu/sites/clark.umd.edu/files/resource_documents/computer_fall_2026_gradglan.pdf (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    "Program-wide minGrade \"C-\": the catalog states 'Students must earn a grade of \"C-\" or higher in all engineering, mathematics, and science courses as well as the prerequisites for these courses' -- every course this program requires is ENGR, math or science, so it's set at the Program level rather than per-requirement.",
    "Owner ruling applied: CMSC141 counts for CMSC131 and CMSC142 for CMSC132 (both encoded as `course` options).",
    "Chemistry: the catalog's four-year-plan table and the department page both show only 'CHEM135' (3 credits) with no chemistry lab -- unlike ChBE/Biocomp, Computer Engineering does not require CHEM136. The official graduation plan's own overview page adds a second reading, 'CHEM 135-Chem Engr or 131 & 134 -Fund & Prin', so this is encoded as a `sets` choice: [[\"CHEM135\"], [\"CHEM131\", \"CHEM134\"]]. The CHEM131+CHEM134 option is sourced only from the graduation plan's overview page, not corroborated by the catalog or the department B.S. page.",
    "ENEE304 or ENEE322: the catalog's four-year-plan table prints this fused as 'ENEE304 or 3225' (a footnote digit fused onto the course number, matching the fetch tool's known OCR-style artifact seen on other ENGR programs); the department B.S. page's own graduation-plan-adjacent text and the official graduation plan both spell it out as 'ENEE 304 or ENEE 322'. Encoded as a `course` requirement with both options; not a real disagreement.",
    "Disciplinary-foundation exclusion list (department page wins, real disagreement): the catalog's Technical Elective Requirements section lists 'CMSC412, ENEE447, CMSC330, CMSC351, ENEE303, ENEE322, ENEE350, and ENEE446' as courses that may not fulfill any Technical Elective category. The department's Technical Electives page instead lists 'CMSC412, ENEE447, CMSC330, CMSC351, ENEE304, ENEE305, ENEE350, and ENEE446' -- ENEE303/ENEE322 (catalog) vs. ENEE304/ENEE305 (department) genuinely differ. Per the department-wins ruling, ENEE304 and ENEE305 are excluded from Category F and the Additional pool below; ENEE303 and ENEE322 are not (ENEE322 is itself a listed Category C elective and one option of the ENEE304-or-ENEE322 core pairing above).",
    "Category A: 'minimum of 6 credits, of which 3 must be 400-level' -- the '3 must be 400-level' sub-rule appears only on the department's Technical Electives page (the catalog's own Technical Elective Requirements table just gives the 6-credit minimum with no level split), so it's encoded as an additional `overlay` `choose` requirement (credits: 3, from the 400-level subset of Category A's own list plus PHYS 400-499) layered on top of the plain 6-credit Category A requirement. Being an overlay, it also counts a 400-level Category A course the solver happened to assign to Category F or the Additional pool instead, which is the more permissive (and correct) reading since the source only requires 3 of the student's Category-A-eligible 400-level credits, not 3 specifically inside the 6-credit Category A slot.",
    "Cryptography crosslisting (footnote 6): CMSC456, MATH456 and ENEE456 are the same course; a student can only take one of them. Encoded via `alternatives: [[\"CMSC456\", \"MATH456\", \"ENEE456\"]]` on Category A and on the Additional pool so at most one counts. Per the same footnote, ENEE456 doesn't appear in Category C's list and CMSC456 doesn't appear in Category B's list (matching the source as given).",
    "CMSC/AMSC460, CMSC/AMSC466, CMSC475 (footnote 1, Category A and B overlap): 'may be used for only one (1) category; if taken as a Category B course, must enroll under CMSC.' Encoded by listing both AMSC and CMSC variants (460, 466) plus CMSC475 in Category A, but only the CMSC variants in Category B -- an AMSC-coded enrollment can then only ever satisfy Category A, matching the footnote; the default single-use course assignment prevents one CMSC-coded enrollment from satisfying both categories at once.",
    "MATH240/MATH461 duplicate-credit note (footnote 2, not encoded -- engine gap): 'Students who completed MATH240 may count MATH240 as a Cat. A or CE elective, but MUST have a second Cat. A at the 400-level [already covered by the Category-A-400-level overlay above]. Students who are required to take, or have taken, ENEE290 should NOT take MATH461 or MATH240, as they are duplicate credits.' Every Computer Engineering student takes ENEE290 (a core requirement below), so this is effectively advising against MATH240/MATH461 for this major, but it's a duplicate-credit caution based on another completed course, not a hard eligibility rule the audit's CourseFilter can express; both remain in Category A's list as the source lists them (MATH240 is only named in this footnote, not in the Category A table itself, but the footnote explicitly makes it a Cat. A option).",
    "CMSE472 (Category B list, likely a source-page typo for CMSC472 'Introduction to Deep Learning' -- CMSE is not a UMD course prefix elsewhere in this catalog): encoded as CMSC472.",
    "Not encoded (owner-review.md, unenumerable): Category B's 'CMSC498x Special Topics ... must be approved by the ECE Department' -- no list of which CMSC498 sections qualify (and which are excluded for being crosslisted with 400-level ENEE courses) is given.",
    "Not encoded (owner-review.md, unenumerable): Category F / General Technical Electives -- the catalog gives an explicit prefix list (AMSC, BCHM, BIOE, BSCI, CHEM, CMSC, ENAE, ENCE, ENCH, ENEE, ENES, ENFP, ENMA, ENME, ENNU, ENRE, MATH, PHYS, STAT) for 300+ level courses, 'who do not appear on the list of unacceptable courses available from the Undergraduate Studies Office' -- that negative list isn't given anywhere in the sources. The department's Technical Electives page doesn't contradict this (it just summarizes Category F as '300 and 400-level courses outside of the Computer Engineering major', then explicitly allows 'an additional ENEE or CMSC course' -- consistent with the catalog's broader prefix list, which already includes ENEE and CMSC), so this isn't treated as a real disagreement; encoded using the catalog's prefix list with `minNumber: 300, maxNumber: 499`, excluding the disciplinary-foundation courses above.",
    "Additional Computer Engineering Tech Elective (3 credits, to reach the 26-credit total): encoded as a seventh `choose` requirement whose filter is the union of Categories A-E's explicit course lists plus Category F's department/number filter, matching the source's 'students may take an additional course from Categories A-F' (excluding the disciplinary-foundation courses). Categories A-F remain six separate credit-minimum requirements (6+3+6+2+3+3 = 23) rather than one 23-or-26-credit pool, so that a student genuinely short in one category (e.g. only 3 of the required 6 Category C credits) is correctly flagged on that category, not masked by overshoot elsewhere.",
    "Not encoded (engine gap, flagged in docs/project/owner-review.md): there is no running credit total across the six Technical Elective categories plus the Additional pool. Several eligible courses carry more credits than a category's stated minimum (e.g. most Category D courses are 3 credits against a 2-credit minimum; MATH241, ENEE323, ENEE382, and PHYS270+271 carry 4), so a student who reaches exactly 26 total technical-elective credits using such courses could still show as satisfying every one of the seven `choose` requirements individually while having taken fewer than 26 credits' worth of distinct technical electives in the aggregate sense the source describes. This can only ever pass a student who took real, eligible courses meeting every category's own minimum -- it never passes a student genuinely short on a category -- so the risk is limited to slight overshoot in the total figure, not a false pass on any single category.",
    "Not encoded (engine gap, matches the ChBE/Biocomp precedent for repeatable-course caps): footnote 5's 'Only 6 total credits of ENEE488/ENEE499/ENEE499L may be applied to the degree requirements', and the catalog's 'maximum number of ENEE499/ENEE499L credits applied towards Category C requirements is five (six for honors)'. The audit's course filters have no per-course or per-course-group credit cap within a `choose` requirement.",
    "Not encoded (owner-review.md, missing source content): the department page's own navigation lists a 'Cybersecurity Specialization' alongside 'B.S. in Computer Engineering', but the fetched department page content includes only the nav link, not the specialization's own requirements page -- there's nothing here to encode a track or requirement from.",
    "Not encoded (owner-review.md, engine gap -- cross-program admission restriction): the department page states 'students within the Computer Engineering major are not allowed to earn a second major or degree in Electrical Engineering or Computer Science' and 'are not eligible for the Computer Science and Computer Engineering minor programs.' The audit has no concept of a major disqualifying another program.",
    "Not encoded (engine gap, matches ChBE/Biocomp precedent): total credits -- the catalog states 'Total Credits 129' and the official graduation plan's own term-by-term grid sums to exactly 129 (17+17+18+17+15+15+15+15); the department B.S. page instead gives a generic curriculum-wide range, 'a minimum of 124-127 credits', which isn't a specific total for this plan. The audit has no total-credit-minimum concept regardless. Also not encoded: the 2.00 cumulative UMD GPA and residency rules (final 30 credits at UMD, 15 of the final 30 at the 300-400 level, 12 upper-level major credits at UMD) repeated as Clark School boilerplate on the graduation plan.",
    "ENEE101/ENES100 scheduling note (not encoded, not an eligibility rule): 'ENEE101 and ENES100 cannot be taken in the same semester.' Both remain separate required `course` entries; the audit doesn't model term-by-term scheduling constraints.",
  ],
  requirements: [
    { kind: "course", id: "math140", name: "Calculus I", options: ["MATH140"] },
    { kind: "course", id: "math141", name: "Calculus II", options: ["MATH141"] },
    { kind: "course", id: "phys161", name: "General Physics: Mechanics and Particle Dynamics", options: ["PHYS161"] },
    { kind: "course", id: "phys260", name: "General Physics: Electricity, Magnetism and Thermodynamics", options: ["PHYS260"] },
    { kind: "course", id: "phys261", name: "General Physics: Electricity, Magnetism and Thermodynamics (Laboratory)", options: ["PHYS261"] },
    {
      kind: "sets",
      id: "chemistry-sequence",
      name: "Chemistry for Engineers (CHEM135, or CHEM131 & CHEM134)",
      options: [["CHEM135"], ["CHEM131", "CHEM134"]],
    },
    { kind: "course", id: "enes100", name: "Introduction to Engineering Design", options: ["ENES100"] },
    { kind: "course", id: "enee101", name: "Introduction to Electrical and Computer Engineering", options: ["ENEE101"] },
    { kind: "course", id: "enee200", name: "Engineering Ethics", options: ["ENEE200"] },
    { kind: "course", id: "enee205", name: "Electric Circuits", options: ["ENEE205"] },
    { kind: "course", id: "enee222", name: "Elements of Discrete Signal Analysis", options: ["ENEE222"] },
    { kind: "course", id: "enee244", name: "Digital Logic Design", options: ["ENEE244"] },
    { kind: "course", id: "enee245", name: "Digital Circuits and Systems Laboratory", options: ["ENEE245"] },
    { kind: "course", id: "enee290", name: "Introduction to Differential Equations and Linear Algebra for Engineers", options: ["ENEE290"] },
    { kind: "course", id: "enee304-or-322", name: "Computer Architecture, or Signal and System Theory", options: ["ENEE304", "ENEE322"] },
    { kind: "course", id: "enee324-or-stat400", name: "Engineering Probability, or Applied Probability and Statistics I", options: ["ENEE324", "STAT400"] },
    { kind: "course", id: "enee350", name: "Computer Organization", options: ["ENEE350"] },
    { kind: "course", id: "enee446", name: "Digital Computer Design", options: ["ENEE446"] },
    { kind: "course", id: "cmsc131", name: "Object-Oriented Programming I", options: ["CMSC131", "CMSC141"] },
    { kind: "course", id: "cmsc132", name: "Object-Oriented Programming II", options: ["CMSC132", "CMSC142"] },
    { kind: "course", id: "cmsc216", name: "Introduction to Computer Systems", options: ["CMSC216"] },
    { kind: "course", id: "cmsc250", name: "Introduction to Discrete Structures", options: ["CMSC250"] },
    { kind: "course", id: "cmsc330", name: "Organization of Programming Languages", options: ["CMSC330"] },
    { kind: "course", id: "cmsc351", name: "Algorithms", options: ["CMSC351"] },
    { kind: "course", id: "cmsc412-or-enee447", name: "Operating Systems", options: ["CMSC412", "ENEE447"] },
    {
      kind: "choose",
      id: "tech-elective-a",
      name: "Technical Elective Category A: Mathematics and Basic Science Electives (6 credits)",
      credits: 6,
      alternatives: CRYPTO_CROSSLIST,
      from: { courses: CATEGORY_A },
    },
    {
      kind: "choose",
      id: "tech-elective-a-400-level",
      name: "Technical Elective Category A: at least 3 credits at the 400 level",
      credits: 3,
      overlay: true,
      from: { courses: CATEGORY_A_400_LEVEL, departments: ["PHYS"], minNumber: 400, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "tech-elective-b",
      name: "Technical Elective Category B: Computer Science Theory and Applications (3 credits)",
      credits: 3,
      from: { courses: CATEGORY_B },
    },
    {
      kind: "choose",
      id: "tech-elective-c",
      name: "Technical Elective Category C: Electrical Engineering Theory and Applications (6 credits)",
      credits: 6,
      from: { courses: CATEGORY_C },
    },
    {
      kind: "choose",
      id: "tech-elective-d",
      name: "Technical Elective Category D: Advanced Laboratory (2 credits)",
      credits: 2,
      from: { courses: CATEGORY_D },
    },
    {
      kind: "choose",
      id: "tech-elective-e",
      name: "Technical Elective Category E: Capstone Design (3 credits)",
      credits: 3,
      from: { courses: CATEGORY_E },
    },
    {
      kind: "choose",
      id: "tech-elective-f",
      name: "Technical Elective Category F: General Technical Elective (3 credits)",
      credits: 3,
      from: {
        departments: ["AMSC", "BCHM", "BIOE", "BSCI", "CHEM", "CMSC", "ENAE", "ENCE", "ENCH", "ENEE", "ENES", "ENFP", "ENMA", "ENME", "ENNU", "ENRE", "MATH", "PHYS", "STAT"],
        minNumber: 300,
        maxNumber: 499,
        exclude: FOUNDATION_EXCLUDE,
      },
    },
    {
      kind: "choose",
      id: "tech-elective-additional",
      name: "Additional Computer Engineering Technical Elective (3 credits, from Categories A-F)",
      credits: 3,
      alternatives: CRYPTO_CROSSLIST,
      from: {
        courses: [...new Set([...CATEGORY_A, ...CATEGORY_B, ...CATEGORY_C, ...CATEGORY_D, ...CATEGORY_E])],
        departments: ["AMSC", "BCHM", "BIOE", "BSCI", "CHEM", "CMSC", "ENAE", "ENCE", "ENCH", "ENEE", "ENES", "ENFP", "ENMA", "ENME", "ENNU", "ENRE", "MATH", "PHYS", "STAT"],
        minNumber: 300,
        maxNumber: 499,
        exclude: FOUNDATION_EXCLUDE,
      },
    },
  ],
};

export const compeMajorMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Computer Eng.",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/electrical-and-computer/computer-engineering-major/",
    department: "https://ece.umd.edu/undergraduate/degrees/bs-computer-engineering",
  },
};
