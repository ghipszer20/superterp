// Communication Major, Communication Studies Track, 2026-27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/communication/communication-major/;
// the College's official Communication Studies Four Year Academic Plan (department source),
// https://drive.google.com/uc?export=download&id=1I36HqnXfxSpWs3PW_3on9226EDeW8CaR (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page/plan and the catalog disagree,
// follow the department source. No disagreement could be checked here -- see reviewNotes.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import {
  commCollegeRequirements,
  commResearchMethods,
  commLeadershipSocialChange,
  commDiversityInclusion,
  commAppliedShared,
} from "./comm-shared-2026-27.ts";

/** Courses required elsewhere in this track, excluded from the generic COMM 300-499 elective
 * filter below so that slot can't be double-satisfied by a course that's separately required. */
const REQUIRED_ELSEWHERE = ["COMM304"];

export const commMajorCommunicationStudies: Program = {
  id: "comm-major-communication-studies",
  name: "Communication Major (Communication Studies)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Communication Major (Communication Studies Track); " +
    "College of Arts and Humanities, official Communication Studies Four Year Academic Plan (department source), " +
    "https://drive.google.com/uc?export=download&id=1I36HqnXfxSpWs3PW_3on9226EDeW8CaR (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "The Communication Studies plan PDF's text conversion is fully garbled (a substitution-style symbol-font extraction with no legible course codes, term headers, or other course-level signal anywhere in the converted text). No term-by-term placement could be read from it, so `packages/programs/sample-plans/comm-major-communication-studies.json` is CONSTRUCTED from the catalog's own requirement structure (College Requirements before the specialization, matching the catalog's own listing order) rather than read from the plan; flagged in docs/project/owner-review.md. Because the plan is unreadable, no department-vs-catalog disagreement could be checked for this track (owner ruling on department-vs-catalog conflicts doesn't apply here).",
    "Communication Theory & Principles: 'Select two of the following' (COMM201, COMM301, COMM302, COMM303) is encoded as a single choose(count 2) over all four -- unlike the other four tracks, which each name one of the four as fixed and let the student pick one more.",
    "The Communication & Society Leadership & Social Change list (COMM420, COMM421, COMM436, COMM455) includes numbers the source table gives no course title for -- possibly stale or variable-topic numbers; kept literally since they're named in the source (never invented). See comm-shared-2026-27.ts.",
    "'3xx or 4xx-Level COMM Electives' (12 credits, no named list) is encoded as a generic choose over COMM 300-499 excluding COMM304 (Research Methods, separately required); the catalog names no rubric or list to check against.",
    "Not encoded (engine gap, matches other ARHU majors' precedent): the major's 46-credit and specialization's 36-credit totals (aggregate credit minimums with no requirement type for them -- every course-level requirement is itself encoded); residency rules and the 120-credit graduation minimum; GPA minimums.",
  ],
  requirements: [
    ...commCollegeRequirements,
    {
      kind: "choose",
      id: "theory-principles-choice",
      name: "Communication Theory & Principles: two of the following",
      count: 2,
      from: { courses: ["COMM201", "COMM301", "COMM302", "COMM303"] },
    },
    ...commResearchMethods,
    commLeadershipSocialChange,
    commDiversityInclusion,
    ...commAppliedShared,
    {
      kind: "choose",
      id: "cs-electives",
      name: "Communication Studies: 3xx or 4xx-Level COMM Electives",
      count: 4,
      from: { departments: ["COMM"], minNumber: 300, maxNumber: 499, exclude: REQUIRED_ELSEWHERE },
    },
  ],
};

export const commMajorCommunicationStudiesMeta: ProgramMeta = {
  kind: "major",
  college: "ARHU",
  short: "Communication (Communication Studies)",
  major: "comm",
  track: "Communication Studies",
  defaultTrack: true,
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/communication/communication-major/",
    department: "https://drive.google.com/uc?export=download&id=1I36HqnXfxSpWs3PW_3on9226EDeW8CaR",
  },
};
