// Social Data Science Major, 2026-27 UMD Academic Catalog. Listed under both the College of
// Behavioral and Social Sciences and the College of Information with identical requirement tables
// (the main session checked) -- encoded once here rather than as two registry entries, matching
// the Data Science Minor precedent (packages/audit/programs/data-science-minor-2026-27.ts).
// Sources: academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/social-data-science-major/;
// College of Behavioral and Social Sciences / Feller Center, "SDSC General Course Sequence
// Requirements Guide" (Internet Archive copy, fetched 2026-09-28). Owner ruling: where a department
// page and the catalog disagree, the department page wins; the college guide counts as one.
// This is the default track (African American Studies); the other eight tracks are in
// sds-major-tracks-2026-27.ts. Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta, Requirement } from "../src/audit.ts";

export const SDS_CATALOG_URL =
  "https://academiccatalog.umd.edu/undergraduate/colleges-schools/behavioral-social-sciences/social-data-science-major/";
export const SDS_COLLEGE_URL =
  "https://web.archive.org/web/20260210113440id_/https://fellercenter.umd.edu/sites/fellercenter.umd.edu/files/Major%20Cards/Final%20SDSC%20-%20General%20Course%20Sequence%20Requirements%20Guide%20current.pdf";

export const SDS_SOURCE =
  "UMD Academic Catalog 2026-27, Social Data Science Major (listed under both BSOS and the College " +
  "of Information with identical requirements; encoded once); College of Behavioral and Social " +
  "Sciences / Feller Center, SDSC General Course Sequence Requirements Guide, " +
  SDS_COLLEGE_URL +
  " (Internet Archive copy, fetched 2026-09-28)";

/** Core Requirements common to every track (Math Course option differs by track group). */
export function sdsCoreRequirements(mathOptions: string[]): Requirement[] {
  return [
    { kind: "course", id: "sdsb123", name: "Social Data Science: Pathways and Applications", options: ["SDSB123"] },
    { kind: "course", id: "sdsb233", name: "Data Science for Social Science", options: ["SDSB233"] },
    {
      kind: "course",
      id: "sds-stat100",
      name: "Elementary Statistics and Probability (or an approved equivalent)",
      options: ["STAT100", "BMGT230", "STAT400"],
    },
    { kind: "course", id: "sds-math", name: `Math Course (${mathOptions.join(" or ")})`, options: mathOptions },
    { kind: "course", id: "sdsb326", name: "Python Programming for the Social Sciences", options: ["SDSB326"] },
    { kind: "course", id: "inst327", name: "Database Design and Modeling", options: ["INST327"] },
    { kind: "course", id: "inst366", name: "Privacy, Security and Ethics for Big Data", options: ["INST366"] },
    { kind: "course", id: "inst414", name: "Data Science Techniques", options: ["INST414"] },
    { kind: "course", id: "inst462", name: "Introduction to Data Visualization", options: ["INST462"] },
    { kind: "course", id: "sdsb340", name: "Introduction to Survey Methodology", options: ["SDSB340"] },
    {
      kind: "choose",
      id: "sds-core-elective",
      name: "Core Elective (select one from the approved list of electives)",
      count: 1,
      from: { courses: ["INST447", "SURV400"] },
    },
    {
      kind: "course",
      id: "sds-capstone",
      name: "Capstone (SDSI492 Integrated Capstone or SDSI496 Research Capstone)",
      options: ["SDSI492", "SDSI496"],
    },
  ];
}

export const SDS_MATH115 = ["MATH115"];
export const SDS_MATH120 = ["MATH120"];

/** Shared review notes every SDS track file repeats (core-level interpretations and engine gaps). */
export const SDS_SHARED_NOTES: string[] = [
  "Listed under both BSOS and the College of Information with byte-identical requirement tables " +
    "(main session confirmed); encoded once as a single set of programs rather than duplicated for " +
    "both listings, matching the Data Science Minor precedent.",
  "The catalog lists 8 tracks (African American Studies, Anthropology, Economics, Geographical " +
    "Sciences, Government & Politics, Psychology, Public Health, Sociology); Anthropology itself " +
    "splits into 3 sub-tracks (Health, Heritage, Environment) with different required courses, so " +
    "10 Program entries share major key `sds`. Default track (arbitrary pick, alphabetically first " +
    "in the catalog's own track list): African American Studies (`sds-major-aaas`).",
  "The source file also contains a 'Criminology Track' section (CCJS100/105/200/300 plus CCJS " +
    "electives) that is NOT named in the catalog's own 'one of the following tracks' sentence and " +
    "has no corresponding course in the Benchmark II prerequisite list the college guide gives for " +
    "every other track (AASP101/ANTH210/ANTH222/ANTH240/ECON200/GEOG202/GVPT170/PSYC100/SPHL100/" +
    "SOCY100 -- no CCJS entry). This looks like a source-conversion artifact (content reused from the " +
    "CCJS major's own page) rather than a real 9th SDS track, so it is NOT encoded here. Flagged in " +
    "docs/project/owner-review.md for confirmation.",
  "Department-vs-catalog difference (department guide wins): the catalog names only STAT100 for the " +
    "Benchmark I statistics course; the college guide adds 'Equivalent Course: BMGT230 OR STAT400 " +
    "(if completed with a C- or higher prior to joining SDSC)'. Both are added as options; the " +
    "'prior to joining the major' timing condition isn't enforced (engine gap, no admission-timing " +
    "concept, matches other majors' benchmark-timing precedent).",
  "Core Elective ('select one from the approved list of electives', catalog gives no list) is " +
    "encoded as a choice between INST447 (Data Sources and Manipulation) and SURV400 (Fundamentals " +
    "of Survey and Data Science) -- the only two core-adjacent courses the college guide names beyond " +
    "what the catalog already requires separately (in its 'CORE COURSES CONTINUED' panel, alongside " +
    "the capstone's own prerequisite chain). This is an inference from the guide's layout, not an " +
    "explicit 'these are the electives' statement; flagged in docs/project/owner-review.md for " +
    "confirmation. SURV400 also requires 'Permission of BSOS-Joint Program in Survey Methodology " +
    "Department' per the guide -- an enrollment-permission gate not enforced (INST447 carries no such " +
    "gate).",
  "Capstone: the catalog names two options, SDSI492 (Integrated Capstone) and SDSI496 (Research " +
    "Capstone); the college guide instead names a single 'INST490 Integrative Capstone' with a " +
    "prerequisite chain covering the whole core. The guide elsewhere uses what look like legacy " +
    "course codes for courses the catalog has since renumbered (BSOS233 for SDSB233, BSOS326 for " +
    "SDSB326), so INST490 is read as a stale/legacy reference to the same capstone rather than a " +
    "live disagreement, and the catalog's current SDSI492/SDSI496 pair is encoded. Flagged in " +
    "docs/project/owner-review.md for confirmation given the department-wins default.",
  "Benchmark I (within 2 semesters) and Benchmark II (within 3 semesters) are progress-to-continue " +
    "gates, not separate graduation requirements -- every benchmark course they name is already " +
    "required below (core or track), matching the GVPT/Geographical Sciences majors' benchmark " +
    "treatment; the timing itself isn't enforced (engine gap).",
  "Cross-program eligibility rules (can't double-major/degree with the BSOS major matching a " +
    "student's own SDS track; Public Health track may double-major/degree with any School of Public " +
    "Health major) aren't enforced -- the audit has no concept of one program disqualifying or " +
    "specially permitting another.",
  "Not encoded (engine gaps): a GPA-style minimum across the major's courses, UMD residency rules, " +
    "and the program's own 52-55 total-credit range (varies by track) -- the audit checks per-" +
    "requirement course assignment and per-course minGrade, not GPA, residency, or credit totals.",
];

export const sdsMajorAaas: Program = {
  id: "sds-major-aaas",
  name: "Social Data Science Major (African American Studies Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...SDS_SHARED_NOTES,
    "The college guide's prerequisite panels twice spell this track's benchmark course 'AASP101'; " +
      "the catalog's own African American Studies Track table (and every other AAAS-prefixed course " +
      "in that table) uses 'AAAS101'. Encoded as AAAS101 per the catalog's own track table, not the " +
      "guide's recurring abbreviation -- informational only, not a substantive requirement difference.",
  ],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH115),
    { kind: "course", id: "aaas101", name: "Public Policy and the Black Community", options: ["AAAS101"] },
    {
      kind: "course",
      id: "aaas210",
      name: "Intro to Research Design and Analysis in African American and Africana Studies",
      options: ["AAAS210"],
    },
    {
      kind: "course",
      id: "aaas-methods",
      name: "Fundamentals of Quantitative Research (AAAS395 or INST314)",
      options: ["AAAS395", "INST314"],
    },
    {
      kind: "choose",
      id: "aaas-track-ii",
      name: "African American Studies Track II Electives",
      credits: 9,
      from: {
        courses: [
          "AAAS301",
          "AAAS310",
          "AAAS320",
          "AAAS398",
          "AAAS400",
          "AAAS402",
          "AAAS411",
          "AAAS441",
          "AAAS443",
          "AAAS498",
          "AAAS499",
        ],
      },
    },
  ],
};

export const sdsMajorAaasMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (African American Studies)",
  major: "sds",
  track: "African American Studies",
  defaultTrack: true,
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};
