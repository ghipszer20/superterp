// Departmental Honors: Mathematics.
// Source: https://www-math.umd.edu/undergraduate/opportunities.html?id=101 ("The Departmental Honors Program in
// Mathematics"; fetched 2026-09-26). Hand-transcribed. UNVERIFIED.

import type { Program } from "@superterp/audit";
import { CATALOG_YEAR } from "./common.ts";

export const SOURCE = "https://www-math.umd.edu/undergraduate/opportunities.html?id=101";

/** "Any course in the following list may be applied toward the requirements of the Honors Program in Mathematics:
 * MATH 403, MATH 404, MATH 405, MATH407, MATH 432, MATH 436, MATH 446, STAT 410, or STAT 420." */
const BREADTH_COURSES = ["MATH403", "MATH404", "MATH405", "MATH407", "MATH432", "MATH436", "MATH446", "STAT410", "STAT420"];

export const deptMath: Program = {
  id: "dept-honors-math",
  name: "Departmental Honors: Mathematics",
  catalogYear: CATALOG_YEAR,
  source: SOURCE,
  verified: false,
  reviewNotes: [
    `[check] "The Departmental Honors Program in Mathematics requires a minimum of 12 credit hours of honors coursework... available in a thesis option and a non-thesis option." Drafted as the thesis option, the program's default path.`,
    `[check] Breadth: "The breadth requirement for the thesis option... will be satisfied by taking two courses from among those listed above": MATH403, MATH404, MATH405, MATH407, MATH432, MATH436, MATH446, STAT410, STAT420. "From time to time, the department may offer H-versions of other upper level courses for honors credit... any graduate course (600-level or above) in Mathematics (MATH), Applied Mathematics (AMSC), or Statistics (STAT) may be substituted"; H-versions and 600-level substitutes aren't enumerated and aren't added to the list.`,
    `[check] Depth: "The depth requirement will be satisfied by six credit-hours of MATH 498 (Selected Topics in Mathematics). The first three credits of MATH 498 must be used for a reading course... The second three credits of MATH 498 must be used to write an honors thesis."`,
    `[manual] Admission: "a student is expected to have completed either Math 410 or Math 341 with a grade of B or better" and "an overall GPA of at least 3.0." Not a program requirement; a prerequisite for entry.`,
    `[manual] Good standing: "a student must maintain a GPA of 3.3 in his or her upper-division mathematics courses" and an overall GPA of 3.0. Not a course requirement.`,
    `[manual] "In order to receive the citation for Honors in Mathematics, the student must make a successful oral defense of the thesis." The defense isn't a course requirement.`,
    `[manual] Non-thesis option: breadth (2 courses from the list above) plus 2 more courses (one 600-level MATH/AMSC/STAT, one from the list or a MATH498 reading course) with a 2-hour written exam replacing the defense. Not drafted; the thesis option above is.`,
  ],
  requirements: [
    { kind: "choose", id: "breadth", name: "Breadth: two courses from the Honors list", count: 2, from: { courses: BREADTH_COURSES } },
    { kind: "choose", id: "depth-thesis", name: "Depth: MATH498 reading course and thesis", credits: 6, from: { courses: ["MATH498"] } },
  ],
};
