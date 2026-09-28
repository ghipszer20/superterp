// Robotics and Autonomous Systems Minor (CMSC), 2026–27 UMD Academic Catalog. Administered by the
// Maryland Robotics Center (Institute for Systems Research, A. James Clark School of Engineering);
// also listed under the College of Engineering (ENGR) with an identical requirements table -- one
// interdisciplinary minor, encoded once here from its CMNS/CMSC catalog listing (same treatment as
// the Data Science Minor).
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/computer-mathematical-natural-sciences/computer-science/robotics-autonomous-systems-minor/
// (fetched 2026-09-27, catalog-generated PDF); Maryland Robotics Center,
// https://robotics.umd.edu/minor (fetched 2026-09-27; matches the catalog with no differences).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree,
// follow the department page (no disagreement found here). No official published sample plan
// (built from the requirements below; see docs/project/owner-review.md).
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program } from "../src/audit.ts";

export const rasMinor: Program = {
  id: "ras-minor",
  name: "Robotics and Autonomous Systems Minor",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Robotics and Autonomous Systems Minor (CMSC); " +
    "Maryland Robotics Center, https://robotics.umd.edu/minor (fetched 2026-09-27)",
  minGrade: "C-",
  verified: false,
  maxSharedWith: [{ courses: 2 }],
  reviewNotes: [
    "Both sources agree exactly: ENME480, ENAE450, ENEE467, CMSC477 required; one supporting math course from MATH240/340/341/461/ENEE290 (must precede CMSC477, not separately enforced -- the engine has no course-sequencing concept); two electives from a shared 24-option list spanning ENME/ENEE/ENAE/CMSC courses.",
    "'ENME467 or ENES467' is one row on the catalog's table (a cross-listed pair), encoded as an alternatives pair. ENME476 has no title in the catalog's own PDF table (a blank cell); included as a bare course id since its code is otherwise listed as an elective option.",
    "Prerequisites (MATH246 or ENES221, plus one of CMSC131/ENME202/ENAE202/ENEE150) are a declaration gate, not minor requirements themselves; not encoded (matches how the CS minor's gateway courses are kept separate from its core requirements) -- except that unlike the CS minor's gateway, these aren't restated as the minor's own Requirements here since the catalog cleanly separates 'Prerequisites' from 'Requirements' (no ambiguity to resolve).",
    "'Students may waive the supporting math course if they complete it for another minor or major' isn't encoded (the requirement itself still needs a qualifying course on the transcript; the waiver is an advising/paperwork exception).",
    "'Open only to students majoring in Aerospace Engineering, Electrical and Computer Engineering, Mechanical Engineering, or Computer Science' [manual]: an eligibility-by-major gate, not enforced (no declared-major concept in the engine).",
    "Department page's declaration gates (sophomore standing / 30 credits, 3.0 GPA, at least four semesters remaining before graduation) [manual]: admission conditions, not modeled.",
    "'A maximum of 2 courses may be used to satisfy the requirements of both a major and a minor' -> maxSharedWith: [{ courses: 2 }].",
  ],
  requirements: [
    { kind: "course", id: "introRobotics", name: "Introduction to Robotics", options: ["ENME480"] },
    { kind: "course", id: "roboticsProgramming", name: "Robotics Programming", options: ["ENAE450"] },
    { kind: "course", id: "roboticsLab", name: "Robotics Project Laboratory", options: ["ENEE467"] },
    { kind: "course", id: "perception", name: "Robotics Perception and Planning", options: ["CMSC477"] },
    { kind: "course", id: "supportingMath", name: "Supporting math course", options: ["MATH240", "MATH340", "MATH341", "MATH461", "ENEE290"] },
    {
      kind: "choose",
      id: "electives",
      name: "Technical electives",
      count: 2,
      from: {
        courses: [
          "ENME400", "ENME410", "ENME413", "ENME435", "ENME441", "ENME461", "ENME467", "ENES467",
          "ENME444", "ENME476", "ENEE440", "ENEE460", "ENEE461", "ENEE425", "ENEE426", "ENEE408",
          "ENAE380", "ENAE403", "ENAE432", "ENAE441", "ENAE488",
          "CMSC421", "CMSC422", "CMSC426", "CMSC427", "CMSC451", "CMSC498",
        ],
      },
      alternatives: [["ENME467", "ENES467"]],
    },
  ],
};
