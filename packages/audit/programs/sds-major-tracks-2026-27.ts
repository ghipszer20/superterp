// Social Data Science Major, 2026-27 UMD Academic Catalog -- the nine remaining tracks (the
// African American Studies default track is in sds-major-aaas-2026-27.ts, which also holds the
// shared core requirements, sources, and shared review notes every track here repeats).
// Anthropology splits into three sub-tracks (Health, Heritage, Environment) with different required
// courses, so this file has 10 Program/Meta pairs total, all sharing major key `sds`.
// Encoded by hand. UNVERIFIED until the owner signs off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import {
  SDS_CATALOG_URL,
  SDS_COLLEGE_URL,
  SDS_SOURCE,
  SDS_SHARED_NOTES,
  SDS_MATH115,
  SDS_MATH120,
  sdsCoreRequirements,
} from "./sds-major-aaas-2026-27.ts";

// ---------------------------------------------------------------------------------------------
// Anthropology -- Health
// ---------------------------------------------------------------------------------------------

export const sdsMajorAnthHealth: Program = {
  id: "sds-major-anth-health",
  name: "Social Data Science Major (Anthropology - Health Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [...SDS_SHARED_NOTES],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH115),
    { kind: "course", id: "anth210", name: "Introduction to Medical Anthropology and Global Health", options: ["ANTH210"] },
    { kind: "course", id: "anth-health-inst314", name: "Statistics for Information Science", options: ["INST314"] },
    { kind: "course", id: "anth310", name: "Method & Theory in Medical Anthropology and Global Health", options: ["ANTH310"] },
    {
      kind: "choose",
      id: "anth-health-track-ii",
      name: "Anthropology-Health Track II Electives",
      credits: 9,
      from: { courses: ["ANTH411", "ANTH412", "ANTH413", "ANTH415", "ANTH416"] },
    },
  ],
};

export const sdsMajorAnthHealthMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Anthropology - Health)",
  major: "sds",
  track: "Anthropology - Health",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Anthropology -- Heritage
// ---------------------------------------------------------------------------------------------

export const sdsMajorAnthHeritage: Program = {
  id: "sds-major-anth-heritage",
  name: "Social Data Science Major (Anthropology - Heritage Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [...SDS_SHARED_NOTES],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH115),
    { kind: "course", id: "anth240", name: "Introduction to Archaeology", options: ["ANTH240"] },
    { kind: "course", id: "anth-heritage-inst314", name: "Statistics for Information Science", options: ["INST314"] },
    { kind: "course", id: "anth340", name: "Method and Theory in Archaeology", options: ["ANTH340"] },
    {
      kind: "choose",
      id: "anth-heritage-track-ii",
      name: "Anthropology-Heritage Track II Electives",
      credits: 9,
      from: {
        courses: ["ANTH341", "ANTH440", "ANTH441", "ANTH447", "ANTH448", "ANTH451", "ANTH464", "ANTH496"],
      },
    },
  ],
};

export const sdsMajorAnthHeritageMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Anthropology - Heritage)",
  major: "sds",
  track: "Anthropology - Heritage",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Anthropology -- Environment
// ---------------------------------------------------------------------------------------------

export const sdsMajorAnthEnvironment: Program = {
  id: "sds-major-anth-environment",
  name: "Social Data Science Major (Anthropology - Environment Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...SDS_SHARED_NOTES,
    "ANTH450 is named with no course title anywhere in the fetched source (just the bare code, " +
      "unlike its two list-mates); included as-is since it's a real named course code, not invented.",
  ],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH115),
    { kind: "course", id: "anth222", name: "Introduction to Ecological and Evolutionary Anthropology", options: ["ANTH222"] },
    { kind: "course", id: "anth-env-inst314", name: "Statistics for Information Science", options: ["INST314"] },
    { kind: "course", id: "anth322", name: "Method and Theory in Ecological Anthropology", options: ["ANTH322"] },
    {
      kind: "choose",
      id: "anth-env-track-ii",
      name: "Anthropology-Environment Track II Electives",
      credits: 9,
      from: { courses: ["ANTH450", "ANTH454", "ANTH467"] },
    },
  ],
};

export const sdsMajorAnthEnvironmentMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Anthropology - Environment)",
  major: "sds",
  track: "Anthropology - Environment",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Economics
// ---------------------------------------------------------------------------------------------

export const sdsMajorEcon: Program = {
  id: "sds-major-econ",
  name: "Social Data Science Major (Economics Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...SDS_SHARED_NOTES,
    "Track II Requirement ('six credits of ECON coursework at the 300-400 levels selected from the " +
      "approved course list') has no enumerable list in the fetched sources (a footnote points to " +
      "'the program website'); encoded as a department+level filter (ECON, 300-499) excluding every " +
      "course already required elsewhere in this track, per the no-named-list ruling. This is broader " +
      "than the department's actual (unpublished) list.",
    "'The course taken for the Track I requirement may not also be used for the Track II requirement' " +
      "is enforced by excluding ECON200/201/230/305/306 from the Track II filter above.",
  ],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH120),
    { kind: "course", id: "econ200", name: "Principles of Microeconomics", options: ["ECON200"] },
    { kind: "course", id: "econ201", name: "Principles of Macroeconomics", options: ["ECON201"] },
    { kind: "course", id: "econ230", name: "Applied Economic Statistics", options: ["ECON230"] },
    {
      kind: "course",
      id: "econ-intermediate",
      name: "Intermediate Macro or Micro Theory (ECON305 or ECON306)",
      options: ["ECON305", "ECON306"],
    },
    {
      kind: "choose",
      id: "econ-track-ii",
      name: "Economics Track II Electives (300-400 level)",
      credits: 6,
      from: { departments: ["ECON"], minNumber: 300, maxNumber: 499, exclude: ["ECON200", "ECON201", "ECON230", "ECON305", "ECON306"] },
    },
  ],
};

export const sdsMajorEconMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Economics)",
  major: "sds",
  track: "Economics",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Geographical Sciences
// ---------------------------------------------------------------------------------------------

const GEOG_TRACK_II_400 = ["GEOG415", "GEOG416", "GEOG422", "GEOG431", "GEOG432", "GEOG470", "GEOG473", "GEOG475"];
const GEOG_TRACK_II_ANY = ["GEOG276", "GEOG330", "GEOG331", "GEOG333", "GEOG377", ...GEOG_TRACK_II_400];

export const sdsMajorGeog: Program = {
  id: "sds-major-geog",
  name: "Social Data Science Major (Geographical Sciences Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...SDS_SHARED_NOTES,
    "Track II Requirement ('9 credits from the following list, six must be at the 400-level') is " +
      "split into two `choose` requirements matching the stated sub-split: 2 courses (6 credits) from " +
      "the list's 8 400-level entries, plus 1 course (3 credits) from the full 13-course list.",
  ],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH120),
    { kind: "course", id: "geog202", name: "Introduction to Human Geography", options: ["GEOG202"] },
    { kind: "course", id: "geog306", name: "Introduction to Quantitative Methods for the Geographical Environmental Sciences", options: ["GEOG306"] },
    { kind: "course", id: "geog373", name: "Geographic Information Systems", options: ["GEOG373"] },
    {
      kind: "choose",
      id: "geog-track-ii-400",
      name: "Geographical Sciences Track II Electives (400-level, two courses)",
      count: 2,
      from: { courses: GEOG_TRACK_II_400 },
    },
    {
      kind: "choose",
      id: "geog-track-ii-any",
      name: "Geographical Sciences Track II Electives (any level, one course)",
      count: 1,
      from: { courses: GEOG_TRACK_II_ANY },
    },
  ],
};

export const sdsMajorGeogMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Geographical Sciences)",
  major: "sds",
  track: "Geographical Sciences",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Government and Politics
// ---------------------------------------------------------------------------------------------

export const sdsMajorGvpt: Program = {
  id: "sds-major-gvpt",
  name: "Social Data Science Major (Government and Politics Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...SDS_SHARED_NOTES,
    "Track II Requirement ('any six credits of GVPT coursework at the 300- or 400-levels') has no " +
      "enumerated list; encoded as a department+level filter (GVPT, 300-499) excluding the track's " +
      "own required courses, per the no-named-list ruling.",
  ],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH115),
    { kind: "course", id: "gvpt170", name: "American Government", options: ["GVPT170"] },
    { kind: "course", id: "gvpt200", name: "International Political Relations", options: ["GVPT200"] },
    { kind: "course", id: "gvpt201", name: "Scope and Methods for Political Science Research", options: ["GVPT201"] },
    { kind: "course", id: "gvpt320", name: "Advanced Empirical Research", options: ["GVPT320"] },
    {
      kind: "choose",
      id: "gvpt-track-ii",
      name: "Government and Politics Track II Electives (300-400 level)",
      credits: 6,
      from: { departments: ["GVPT"], minNumber: 300, maxNumber: 499, exclude: ["GVPT170", "GVPT200", "GVPT201", "GVPT320"] },
    },
  ],
};

export const sdsMajorGvptMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Government and Politics)",
  major: "sds",
  track: "Government and Politics",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Psychology
// ---------------------------------------------------------------------------------------------

export const sdsMajorPsyc: Program = {
  id: "sds-major-psyc",
  name: "Social Data Science Major (Psychology Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...SDS_SHARED_NOTES,
    "Track II Requirement ('nine credits of PSYC coursework at the 300 or 400-level') has no " +
      "enumerated list; encoded as a department+level filter (PSYC, 300-499) excluding PSYC100/200/300, " +
      "per the no-named-list ruling. The footnote against double-counting Track I courses here is " +
      "enforced by that same exclusion.",
  ],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH120),
    { kind: "course", id: "psyc100", name: "Introduction to Psychology", options: ["PSYC100"] },
    { kind: "course", id: "psyc200", name: "Statistical Methods in Psychology", options: ["PSYC200"] },
    { kind: "course", id: "psyc300", name: "Research Methods in Psychology Laboratory", options: ["PSYC300"] },
    {
      kind: "choose",
      id: "psyc-track-ii",
      name: "Psychology Track II Electives (300-400 level)",
      credits: 9,
      from: { departments: ["PSYC"], minNumber: 300, maxNumber: 499, exclude: ["PSYC100", "PSYC200", "PSYC300"] },
    },
  ],
};

export const sdsMajorPsycMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Psychology)",
  major: "sds",
  track: "Psychology",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Public Health
// ---------------------------------------------------------------------------------------------

export const sdsMajorPublicHealth: Program = {
  id: "sds-major-public-health",
  name: "Social Data Science Major (Public Health Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [...SDS_SHARED_NOTES],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH120),
    { kind: "course", id: "sphl100", name: "Foundations of Public Health", options: ["SPHL100"] },
    { kind: "course", id: "epib301", name: "Epidemiology for Public Health Practice", options: ["EPIB301"] },
    { kind: "course", id: "epib315", name: "Biostatistics for Public Health Practice", options: ["EPIB315"] },
    { kind: "course", id: "hlth200", name: "Introduction to Research in Community Health", options: ["HLTH200"] },
    {
      kind: "choose",
      id: "public-health-track-ii",
      name: "Public Health Track II Electives",
      credits: 9,
      from: {
        courses: [
          "EPIB330",
          "EPIB463",
          "FMSC310",
          "FMSC332",
          "FMSC460",
          "HLSA300",
          "HLSA465",
          "HLSA484",
          "HLTH377",
          "HLTH424",
          "HLTH431",
          "HLTH434",
          "HLTH460",
          "KNES401",
          "PHSC412",
        ],
      },
    },
  ],
};

export const sdsMajorPublicHealthMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Public Health)",
  major: "sds",
  track: "Public Health",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Sociology
// ---------------------------------------------------------------------------------------------

export const sdsMajorSocy: Program = {
  id: "sds-major-socy",
  name: "Social Data Science Major (Sociology Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...SDS_SHARED_NOTES,
    "Track II Requirement ('nine credits of SOCY coursework at the 300 or 400-level') has no " +
      "enumerated list; encoded as a department+level filter (SOCY, 300-499) excluding SOCY100/201/202, " +
      "per the no-named-list ruling.",
  ],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH115),
    { kind: "course", id: "socy100", name: "Introduction to Sociology", options: ["SOCY100"] },
    { kind: "course", id: "socy201", name: "Introductory Statistics for Sociology", options: ["SOCY201"] },
    { kind: "course", id: "socy202", name: "Introduction to Research Methods in Sociology", options: ["SOCY202"] },
    {
      kind: "choose",
      id: "socy-track-ii",
      name: "Sociology Track II Electives (300-400 level)",
      credits: 9,
      from: { departments: ["SOCY"], minNumber: 300, maxNumber: 499, exclude: ["SOCY100", "SOCY201", "SOCY202"] },
    },
  ],
};

export const sdsMajorSocyMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Sociology)",
  major: "sds",
  track: "Sociology",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};

// ---------------------------------------------------------------------------------------------
// Criminology
// ---------------------------------------------------------------------------------------------

export const sdsMajorCcjs: Program = {
  id: "sds-major-ccjs",
  name: "Social Data Science Major (Criminology Track)",
  catalogYear: "2026-27",
  source: SDS_SOURCE,
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...SDS_SHARED_NOTES,
    "Track II Requirement ('choose 6 credits from the list below') is a fully enumerated 13-course " +
      "list (CCJS320/340/342/345/346/352/360/405/418/444/450/451/454); encoded as a `choose` " +
      "requirement over that exact list.",
  ],
  requirements: [
    ...sdsCoreRequirements(SDS_MATH115),
    { kind: "course", id: "ccjs100", name: "Introduction to Criminal Justice", options: ["CCJS100"] },
    { kind: "course", id: "ccjs105", name: "Introduction to Criminology", options: ["CCJS105"] },
    { kind: "course", id: "ccjs200", name: "Statistics for Criminology and Criminal Justice", options: ["CCJS200"] },
    { kind: "course", id: "ccjs300", name: "Criminological and Criminal Justice Research Methods", options: ["CCJS300"] },
    {
      kind: "choose",
      id: "ccjs-track-ii",
      name: "Criminology Track II Electives",
      credits: 6,
      from: {
        courses: [
          "CCJS320",
          "CCJS340",
          "CCJS342",
          "CCJS345",
          "CCJS346",
          "CCJS352",
          "CCJS360",
          "CCJS405",
          "CCJS418",
          "CCJS444",
          "CCJS450",
          "CCJS451",
          "CCJS454",
        ],
      },
    },
  ],
};

export const sdsMajorCcjsMeta: ProgramMeta = {
  kind: "major",
  college: "BSOS",
  short: "Social Data Science (Criminology)",
  major: "sds",
  track: "Criminology",
  sources: { catalog: SDS_CATALOG_URL, department: SDS_COLLEGE_URL },
};
