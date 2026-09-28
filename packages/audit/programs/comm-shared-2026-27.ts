// Shared requirement building blocks for the Communication Major's five tracks (Communication
// Studies, Health and Science Communication, Media and Digital Communication, Political
// Communication and Public Advocacy, Public Relations), 2026-27 UMD Academic Catalog. Not a
// program file itself (no `*Meta` export, so the registry generator ignores it); imported by
// comm-major-*-2026-27.ts, which share these blocks verbatim where the catalog gives all (or most)
// tracks the same requirement, and define their own where the catalog differs per track.
// Source: academiccatalog.umd.edu/undergraduate/colleges-schools/arts-humanities/communication/communication-major/
// (fetched 2026-09-28); see program-sources/communication-major.md.

import type { Requirement } from "../src/audit.ts";

/** College Requirements: identical across all five tracks (10 of the major's 46 credits). */
export const commCollegeRequirements: Requirement[] = [
  {
    kind: "choose",
    id: "college-oral-communication",
    name: "College Requirement: Oral Communication",
    count: 1,
    from: { courses: ["COMM107", "COMM200", "COMM230"] },
  },
  {
    kind: "course",
    id: "college-modes-of-inquiry",
    name: "College Requirement: Modes of Communication Inquiry (COMM250)",
    options: ["COMM250"],
  },
  {
    kind: "course",
    id: "college-fundamentals",
    name: "College Requirement: Fundamentals of Communication Skills (COMM130)",
    options: ["COMM130"],
  },
  {
    kind: "choose",
    id: "college-statistics",
    name: "College Requirement: Statistics",
    count: 1,
    from: { courses: ["BMGT230", "STAT100", "QMMS251", "CCJS200", "PSYC200", "SOCY201"] },
  },
];

/** Research Methods: COMM304 plus one methods course, identical across all five tracks. */
export const commResearchMethods: Requirement[] = [
  {
    kind: "course",
    id: "research-comm304",
    name: "Research Methods: Communication Research Literacy (COMM304)",
    options: ["COMM304"],
  },
  {
    kind: "choose",
    id: "research-methods-choice",
    name: "Research Methods: one Research Methods course",
    count: 1,
    from: { courses: ["COMM305", "COMM306", "COMM307"] },
  },
];

/**
 * Communication & Society's Leadership & Social Change pick, as listed under Communication
 * Studies, Health and Science Communication, Political Communication and Public Advocacy, and
 * Public Relations (18 options, including COMM420, COMM421, COMM436, COMM455 -- named in the
 * source table with no course title, so possibly stale/variable-topic numbers; kept literally per
 * the source, never invented). Media and Digital Communication's own table lists the same 17
 * options MINUS COMM436 -- see commLeadershipSocialChangeNoComm436 below and that program's
 * reviewNotes.
 */
export const commLeadershipSocialChange: Requirement = {
  kind: "choose",
  id: "society-leadership-social-change",
  name: "Communication & Society: one Leadership & Social Change course",
  count: 1,
  from: {
    courses: [
      "COMM330", "COMM385", "COMM420", "COMM421", "COMM422", "COMM424", "COMM425", "COMM428",
      "COMM436", "COMM448", "COMM449", "COMM455", "COMM459", "COMM461", "COMM462", "COMM469",
      "COMM470", "COMM475",
    ],
  },
};

/** Media and Digital Communication's Leadership & Social Change pick: the source's table for this
 * track omits COMM436, present in the otherwise-identical list under the other four tracks. */
export const commLeadershipSocialChangeNoComm436: Requirement = {
  ...commLeadershipSocialChange,
  from: { courses: commLeadershipSocialChange.from.courses!.filter((c) => c !== "COMM436") },
};

/** Communication & Society's Diversity & Inclusion pick: identical across all five tracks. */
export const commDiversityInclusion: Requirement = {
  kind: "choose",
  id: "society-diversity-inclusion",
  name: "Communication & Society: one Diversity & Inclusion course",
  count: 1,
  from: { courses: ["COMM324", "COMM360", "COMM382", "COMM454", "COMM460"] },
};

/**
 * Applied section: identical across Communication Studies, Health and Science Communication,
 * Media and Digital Communication, and Political Communication and Public Advocacy. Public
 * Relations' Applied section names two specific required courses instead (COMM331, COMM386); see
 * comm-major-public-relations-2026-27.ts.
 */
export const commAppliedShared: Requirement[] = [
  {
    kind: "choose",
    id: "applied-a",
    name: "Applied: one course",
    count: 1,
    from: { courses: ["COMM311", "COMM386", "COMM388"] },
  },
  {
    kind: "choose",
    id: "applied-b",
    name: "Applied: one additional course",
    count: 1,
    from: {
      courses: [
        "COMM311", "COMM330", "COMM331", "COMM370", "COMM371", "COMM375", "COMM386", "COMM388",
        "COMM425", "COMM426", "COMM455",
      ],
    },
  },
];
