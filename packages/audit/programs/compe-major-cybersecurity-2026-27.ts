// Computer Engineering Major, Cybersecurity Specialization, 2026–27 UMD Academic Catalog.
// Source: Department of Electrical and Computer Engineering, B.S. in Computer Engineering,
// Cybersecurity Specialization page,
// https://ece.umd.edu/undergraduate/degrees/bs-computer-engineering/cybersecurity (fetched 2026-09-28).
// Encoded by hand. UNVERIFIED until the owner signs off.
//
// The specialization requires 5 courses across 4 areas; every listed course already appears in one
// of the base major's Technical Elective categories (compe-major-2026-27.ts), so the areas are
// encoded as overlay `choose` requirements layered on top of the base major's own requirement list
// (imported, not copied) -- they check that the student's technical electives include the right
// courses without consuming a second set of credits. Same pattern as the CPSE major's tracks
// (cpse-major-hardware-2026-27.ts / cpse-major-security-2026-27.ts), except here the base
// requirement list itself doesn't differ between the General and Cybersecurity tracks, so it's
// imported wholesale rather than duplicated.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { compeMajor } from "./compe-major-2026-27.ts";

export const compeMajorCybersecurity: Program = {
  id: "compe-major-cybersecurity",
  name: "Computer Engineering Major (Cybersecurity Specialization)",
  catalogYear: "2026-27",
  minGrade: compeMajor.minGrade,
  source:
    compeMajor.source +
    "; Cybersecurity Specialization page, " +
    "https://ece.umd.edu/undergraduate/degrees/bs-computer-engineering/cybersecurity (fetched 2026-09-28)",
  verified: false,
  reviewNotes: [
    ...compeMajor.reviewNotes!.filter((n) => !n.includes("Cybersecurity Specialization")),
    "Cybersecurity Specialization (5 courses across 4 areas) encoded as overlay `choose` requirements on top of the base major's Technical Elective requirements (imported from compe-major-2026-27.ts): Area 1 - Security (two courses: one of ENEE457/CMSC414, plus CMSC456/ENEE456 Cryptography), Area 2 - Networks (one of CMSC417/ENEE426), Area 3 - Hands-On Experience (one of ENEE459B/ENEE445/ENEE408C), Area 4 - Computer Systems and Software (one of CMSC420/CMSC451/ENEE440/CMSC433). Every listed course already sits in one of the base major's Category A-E lists, so these are overlays: they don't add credits beyond the major's own 26 technical-elective credits, matching the page's framing of the specialization as a way to choose among existing Technical Elective options rather than a set of additional courses.",
    "Area 1's crypto course is encoded as CMSC456/ENEE456 only, exactly as the specialization page lists it. The base major's own Category A treats CMSC456, MATH456 and ENEE456 as the same crosslisted course (footnote 6, from the Technical Electives page, a different source), but the specialization page itself doesn't mention MATH456. Not adding it here since it isn't stated on this page; flagged in docs/project/owner-review.md in case the owner wants MATH456 included for consistency with the crosslist.",
    "Not encoded (owner-review.md, permission gate): two of Area 3's three options, ENEE445 (Computer Laboratory) and ENEE408C (Modern Digital System Design), are marked on the specialization page as '*requires permission - see below for details'; the page's fetched content doesn't include that permission-details section, and the audit has no concept of an enrollment permission gate distinct from eligibility. Both remain valid Area 3 options here since they're still degree-eligible courses once permission is granted.",
  ],
  requirements: [
    ...compeMajor.requirements,
    {
      kind: "choose",
      id: "cyber-area1-security",
      name: "Cybersecurity Area 1 - Security (two courses: one security course, plus Cryptography)",
      overlay: true,
      count: 2,
      alternatives: [["ENEE457", "CMSC414"], ["CMSC456", "ENEE456"]],
      from: { courses: ["ENEE457", "CMSC414", "CMSC456", "ENEE456"] },
    },
    {
      kind: "choose",
      id: "cyber-area2-networks",
      name: "Cybersecurity Area 2 - Networks (one course)",
      overlay: true,
      count: 1,
      from: { courses: ["CMSC417", "ENEE426"] },
    },
    {
      kind: "choose",
      id: "cyber-area3-hands-on",
      name: "Cybersecurity Area 3 - Hands-On Experience (one course)",
      overlay: true,
      count: 1,
      from: { courses: ["ENEE459B", "ENEE445", "ENEE408C"] },
    },
    {
      kind: "choose",
      id: "cyber-area4-systems-software",
      name: "Cybersecurity Area 4 - Computer Systems and Software (one course)",
      overlay: true,
      count: 1,
      from: { courses: ["CMSC420", "CMSC451", "ENEE440", "CMSC433"] },
    },
  ],
};

export const compeMajorCybersecurityMeta: ProgramMeta = {
  kind: "major",
  college: "ENGR",
  short: "Computer Eng. (Cybersecurity)",
  major: "compe",
  track: "Cybersecurity",
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/engineering/electrical-and-computer/computer-engineering-major/",
    department: "https://ece.umd.edu/undergraduate/degrees/bs-computer-engineering/cybersecurity",
  },
};
