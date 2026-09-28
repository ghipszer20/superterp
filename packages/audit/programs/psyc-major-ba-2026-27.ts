// Psychology Major, Bachelor of Arts Track, 2026–27 UMD Academic Catalog.
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/psychology/psychology-major/;
// Department of Psychology, "Degree Requirements (BS and BA)", https://psyc.umd.edu/undergraduate/degree-requirements-bs-and-ba;
// Feller Center (BSOS), "Psychology Major Checklist" (Internet Archive copy, effective Spring 2022,
// last updated 4/23/24) (fetched 2026-09-28).
// Owner ruling (docs/project/rulings.md): where the department page and the catalog disagree, follow
// the department page. The only such disagreement found is noted below (MATH136, not encoded).
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";

export const psycMajorBa: Program = {
  id: "psyc-major-ba",
  name: "Psychology Major (Bachelor of Arts)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026–27, Psychology Major; " +
    "Department of Psychology, Degree Requirements (BS and BA), https://psyc.umd.edu/undergraduate/degree-requirements-bs-and-ba; " +
    "Feller Center, Psychology Major Checklist (Internet Archive, effective Spring 2022, updated 4/23/24) (fetched 2026-09-28)",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    "PSYC100 (or PSYC221 if AP/IB credit was earned for PSYC100) needs a B- or higher, not the program's usual C-; both the catalog and the department page agree. Encoded as a requirement-level minGrade override.",
    "Math gateway: catalog names only MATH120 or MATH140. The department page adds MATH136 as a third option, but restricts it to 'declared PSYC/BSCI double majors' (or students who took it before declaring PSYC) -- a major-conditional eligibility rule the audit can't model (it would otherwise let any student satisfy the requirement with a course the source says most PSYC majors can't take). Not encoded; MATH136 is left out of the options list.",
    "Thematic Courses (2 courses from each of Mind/Brain/Behavior, Mental Health/Interventions, and Social/Developmental/Organizational -- 6 of the 11 major courses) are NOT encoded as a per-theme distribution: neither source lists which PSYC courses belong to which theme, only a link to a department page (psyc.umd.edu/undergraduate/courses-syllabi) that wasn't part of the fetched source. What IS enumerable from the sources is encoded on its own: the PSYC Multicultural Course (the department page names the specific list -- see psyc-multicultural below, one of which must be among the 6 thematic courses) and the two 400-level requirements. The remaining thematic credits are only captured in aggregate by psyc-total-credits below (see next note), not by theme.",
    "psyc-total-credits (35 credits of any PSYC course, overlay) stands in for the catalog's 'at least 35 credits (11 courses) in Psychology' / the checklist's '11 PSYC courses totaling at least 35 credits'. It's an overlay so PSYC100/200/300, the multicultural course and the 400-level courses all count toward it without being used up twice; a plan still needs enough additional PSYC courses to reach 35 credits, which is where the un-enumerable thematic courses' credits actually get satisfied. The 11-course count itself isn't separately enforced (credits only), and per the checklist, PSYC309A/309C/309B/389/478/479 don't count toward this total even though they're real PSYC courses -- not separately excluded here since the sample plan doesn't use any of them.",
    "PSYC 400-Level Lab (psyc-400-lab) is encoded as '4 credits of 400-level PSYC' rather than a verified lab-course identity: the audit's course filter has no notion of which courses are labs, only department and course number. In principle two 3-credit 400-level courses could substitute for one true lab course; treat this as an approximation of the checklist's 'one 400-level Lab {Must have 85 credits}' row.",
    "Not encoded (admission/progress gate, matches other majors' precedent): the LEP gateway and Academic Review requirements (PSYC100 B-, BSCI170 C-, math C- within the student's first 45 credits; a 2.00 cumulative GPA for continuing students, 2.70 for later transfers/declarers applying to the major) and the 'no more than 3 PSYC courses per semester' cap (with named exceptions). These gate progress toward/within the major rather than what's needed to graduate with it.",
    "Not encoded (engine gap): the requirement that all 35 PSYC credits average a C- (a GPA-style average, not a per-course minimum -- the per-course C-/B- minimums above are encoded); the college's residency/upper-level rules (15 of the final 30 credits at the 300-400 level, 12 upper-level major credits at UMD, 30 credits at UMD); and the 120-credit graduation minimum.",
  ],
  requirements: [
    {
      kind: "course",
      id: "psyc100",
      name: "Introduction to Psychology (PSYC100, or PSYC221 with AP/IB credit for PSYC100)",
      options: ["PSYC100", "PSYC221"],
      minGrade: "B-",
    },
    {
      kind: "course",
      id: "math-gateway",
      name: "Math Gateway (MATH120 or MATH140)",
      options: ["MATH120", "MATH140"],
    },
    { kind: "course", id: "bsci170", name: "Principles of Biology I", options: ["BSCI170"] },
    { kind: "course", id: "psyc200", name: "Statistical Methods in Psychology", options: ["PSYC200"] },
    { kind: "course", id: "psyc300", name: "Research Methods in Psychology Laboratory", options: ["PSYC300"] },
    {
      kind: "choose",
      id: "psyc-multicultural",
      name: "PSYC Multicultural Course",
      count: 1,
      from: { courses: ["PSYC232", "PSYC262", "PSYC336", "PSYC354", "PSYC391", "PSYC447", "PSYC489E", "PSYC489F"] },
    },
    {
      kind: "choose",
      id: "psyc-400-nonlab",
      name: "PSYC 400-Level Non-Lab Courses (2)",
      count: 2,
      from: { departments: ["PSYC"], minNumber: 400, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "psyc-400-lab",
      name: "PSYC 400-Level Lab Course",
      credits: 4,
      from: { departments: ["PSYC"], minNumber: 400, maxNumber: 499 },
    },
    {
      kind: "choose",
      id: "psyc-total-credits",
      name: "Total Psychology Credits (35, 11 courses)",
      credits: 35,
      from: { departments: ["PSYC"] },
      overlay: true,
    },
  ],
};

export const psycMajorBaMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Psychology (B.A.)",
  major: "psyc",
  track: "B.A.",
  defaultTrack: true,
  sources: {
    catalog: "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/psychology/psychology-major/",
    department: "https://psyc.umd.edu/undergraduate/degree-requirements-bs-and-ba",
  },
};
