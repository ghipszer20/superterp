// Pre-Law. Source: Letters & Sciences' Pre-Law Advising page, its linked timeline Google Doc, and
// its linked "Pre-Law Courses" Google Slides, fetched 2026-09-25 (SOURCES.md). Encoded by hand.
// UNVERIFIED until the owner signs off. There are no required courses (the page says so
// explicitly), so `categories` is empty; law schools care about GPA, the LSAT and the personal
// statement, not a specific major or course list.

import type { Track } from "../src/types.ts";

const LTSC = {
  home: "https://ltsc.umd.edu/prelaw",
  timeline: "https://docs.google.com/document/d/1axiEQGLbrViGeDe6JDv-zuG8iiB73_APxrWJwGypywQ/",
  courses:
    "https://docs.google.com/presentation/d/e/2PACX-1vTWhRut_I5MQO_D1gg0Z4Sb-c4AYV77Okv8FROY69Yfq5fp3sgf4o2OPmTe-WnnyWOh5aqEgQdBJ-qB/embed",
};

export const preLaw: Track = {
  id: "pre-law",
  name: "Pre-Law",
  schools: "law schools",
  entry: { kind: "after-degree" },
  categories: [],
  gpaProtection: true,
  suggestedCourses: [
    { area: "Government and Politics (GVPT)", courses: ["GVPT170", "GVPT331", "GVPT432"] },
    { area: "History (HIST)", courses: ["HIST200", "HIST201", "HIST455"] },
    { area: "English (ENGL)", courses: ["ENGL392"] },
    { area: "Journalism (JOUR)", courses: ["JOUR181"] },
    { area: "Philosophy (PHIL)", courses: ["PHIL100", "PHIL140", "PHIL170"] },
    { area: "Psychology (PSYC)", courses: ["PSYC100", "PSYC221"] },
    { area: "Family Science (FMSC)", courses: ["FMSC487"] },
    { area: "Sociology (SOCY)", courses: ["SOCY100", "SOCY105"] },
    { area: "Communication (COMM)", courses: ["COMM107", "COMM230", "COMM330"] },
    { area: "Criminology and Criminal Justice (CCJS)", courses: ["CCJS100", "CCJS105", "CCJS230"] },
    { area: "Business and Management (BMGT)", courses: ["BMGT110", "BMGT220", "BMGT380"] },
    { area: "Economics (ECON)", courses: ["ECON200", "ECON201", "ECON456"] },
    { area: "Classics (CLAS)", courses: ["CLAS170"] },
    { area: "Agricultural and Resource Economics (AREC)", courses: ["AREC240"] },
  ],
  milestones: [
    {
      id: "pick-a-major",
      kind: "advising",
      name: "Pick a major and build your skills",
      detail: "There's no required pre-law major or course list; pick one you'll do well in, and build reading, writing, critical thinking and analytical reasoning skills. Get to know professors who can write you a strong letter later.",
    },
    {
      id: "meet-advisor",
      kind: "advising",
      name: "Meet a pre-law advisor",
      detail: "Junior fall: meet with a pre-law advisor at Letters & Sciences to plan your LSAT timing and application year.",
      due: { year: -2, month: 10 },
    },
    {
      id: "lsat",
      kind: "exam",
      name: "LSAT",
      detail: "Take the LSAT at least one year before you'd enter law school, usually spring or summer of junior year or fall of senior year. Plan 3-6 months of prep.",
      start: { year: -2, month: 3 },
      due: { year: -1, month: 10 },
    },
    {
      id: "letters-and-cas",
      kind: "letters",
      name: "Letters of recommendation and LSAC's CAS",
      detail: "Senior year: request letters of recommendation and register for LSAC's Credential Assembly Service (CAS), which every ABA-accredited law school requires.",
      due: { year: -1, month: 10 },
    },
    {
      id: "applications",
      kind: "application",
      name: "Submit applications",
      detail: "Submit applications, preferably between October 15 and December 1 of the year before you'd start law school; earlier is generally better for rolling admissions.",
      start: { year: -1, month: 10, day: 15 },
      due: { year: -1, month: 12, day: 1 },
    },
  ],
  disclaimer: "Confirm with pre-law advising and each target school.",
  sources: [LTSC.home, LTSC.timeline, LTSC.courses],
  verified: false,
  reviewNotes: [
    "There are no required courses for law school admission (ltsc.umd.edu/prelaw: \"there are no required courses and no preferred majors\"), so `categories` is intentionally empty.",
    "suggestedCourses come from the \"Pre-Law Courses\" Google Slides embedded in the page. The slides render each course as vector artwork, not text, but the accessibility label on each slide's title includes readable course numbers and titles, which is how this list was extracted; SOURCES.md's caveat about \"losing the bold\" refers only to which entries the source calls \"strongly recommended\" (not preserved here), not to the numbers themselves.",
    "Only slide entries confirmed against the Spring 2027 Schedule of Classes are listed (see MAPPING_NOTES.fixture in common.ts); other slide entries (e.g. most of the GVPT, HIST, PHIL, FMSC, CCJS, BMGT and CLAS numbers, and everything under American Studies (AMST), which had none confirmed) aren't offered that term and are left out. The owner should check Testudo for a fuller, current list.",
    "PHIL170 is kept even though it isn't in the Spring 2027 schedule (likely fall-only): the separate pre-law timeline document names it directly (\"PHIL170 (logic) and ENGL392 (legal writing) are two of the most common courses\"), which is a stronger source than the slides for that one course.",
    "The LSAT and application-year milestone dates are this builder's own estimates from the timeline document's academic-year language (\"junior fall\", \"junior spring and summer\", \"senior year\"), converted to year offsets from the entry year the same way the HPAO tracks are. They are not literal HPAO/HPAO-style published dates and the owner should confirm them.",
    "The Law School Fair (October 19, 2026, per the page) and the Three-Year Arts/Law program (LSAT in June after sophomore year or October of junior year) are one-off/undated details from the page and aren't encoded as recurring milestones.",
    "LSAC's CAS counts every attempt of a repeated course toward a student's law-school GPA, even when UMD replaces the grade for its own GPA (ltsc.umd.edu/prelaw); `scienceGpa` and `amcasGpa` already count every attempt the same way, so they double as a rough LSAC-style GPA, though the exact LSAC grade-point scale isn't confirmed (see gpa.ts).",
  ],
};
