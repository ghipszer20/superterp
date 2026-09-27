// Pre-Dental Hygiene (transfer track: UMD grants no dental hygiene degree). Source: HPAO
// "Dental Hygiene" page, fetched 2026-09-26 (SOURCES.md), and the Academic Catalog's Pre-Health
// Professions page. Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import { HPAO, MAPPING_NOTES, anatomyPhysiology, collegeAlgebra, englishComposition, genChem1, generalPsych, introBioOneSemester, statistics } from "./common.ts";

const CATALOG = "https://academiccatalog.umd.edu/undergraduate/campus-administration-resources-student-services/academic-resources-services/pre-health-professions-advising-programs/";

export const preDentalHygiene: Track = {
  id: "pre-dental-hygiene",
  name: "Pre-Dental Hygiene",
  schools: "dental hygiene programs",
  minGrade: "C",
  minGradeNote: "HPAO: schools generally require a minimum of a C (not a C-) in all prerequisite courses; some programs require higher.",
  usesScienceGpa: true,
  entry: { kind: "transfer", afterYears: 2 },
  categories: [
    introBioOneSemester("General Biology with lab(s)"),
    genChem1("General Chemistry with lab(s)"),
    anatomyPhysiology("Anatomy & Physiology I & II with labs"),
    collegeAlgebra("College Algebra"),
    statistics("Statistics"),
    generalPsych("Introduction to Psychology"),
    englishComposition("English Composition or Writing"),
  ],
  milestones: [
    {
      id: "shadowing",
      kind: "experience",
      name: "Shadowing a dental hygienist",
      detail: "Shadow hygienists in various environments; some schools require a minimum number of shadowing hours as part of the application.",
    },
    {
      id: "clinical-job",
      kind: "experience",
      name: "Paid clinical experience",
      detail: "Many students find value in working a paid clinical job as a dental assistant or intern during their undergraduate years, though most Dental Hygiene programs don't explicitly require it.",
      optional: true,
    },
    {
      id: "service",
      kind: "experience",
      name: "Community service",
      detail: "HPAO recommends engaging in service experiences and remaining involved with your community.",
    },
    {
      id: "primary-application",
      kind: "application",
      name: "Apply to a Dental Hygiene program",
      detail: "HPAO's Dental Hygiene page describes a 2+2 transfer (two years of UMD prerequisites, then an Associate's, Bachelor's or Master's dental hygiene program), a 2+3 bachelor's/master's format, or transferring after finishing a UMD degree in an unrelated field. Prerequisites vary significantly by school and degree type; research target programs directly. The American Dental Hygienists' Association (ADHA) lists individual program prerequisites.",
    },
    {
      id: "boards",
      kind: "exam",
      name: "National Board Dental Hygiene Examination and state boards",
      detail: "After completing the (non-UMD) dental hygiene program, pass the National Board Dental Hygiene Examination and your state's clinical board examination(s) to practice as a Dental Hygienist. This happens after the UMD portion of the plan, so it has no date here.",
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("dental-hygiene"), CATALOG],
  verified: false,
  reviewNotes: [
    "entry: { kind: \"transfer\", afterYears: 2 } models the 2+2 route both HPAO's page and the Academic Catalog describe, the same shape as pre-nursing. The catalog separately allows a 4+2 route (finish a UMD major first, then apply), and HPAO's page separately mentions an Associate's-of-Applied-Science-only route (~3 years total, not at UMD, not modeled here) and a 2+3 bachelor's/master's transfer format. A student in one of those alternate routes should adjust the entry year themselves, the same as pre-nursing's after-degree alternative.",
    "UMD College Park does not grant an Associate's or Bachelor's degree in Dental Hygiene (HPAO's page, and the Academic Catalog: \"is not a pre-dental major and is not a degree-granting program\"); every Dental Hygiene student transfers out to finish the credential.",
    MAPPING_NOTES.collegeAlgebra,
    "\"Schools generally require a minimum of a C (not a C-)... Some programs require higher\" is encoded as minGrade C, HPAO's own stated baseline; a student targeting a stricter program should confirm its own minimum directly.",
    "\"General Biology with lab(s)\" and \"General Chemistry with lab(s)\" are mapped as one semester each (introBioOneSemester, genChem1), matching HPAO's singular/unquantified wording here, the same reading used for pre-PA's identically vague \"general biology with lab\" and \"general chemistry with lab\" — unlike medicine's and AA's explicit \"8-12 credits\"/\"8 Credits\", which map to the full two-semester sequences.",
    "\"Anatomy & Physiology I & II with labs\" reuses the shared anatomy-physiology category (BSCI201 & BSCI202), matching HPAO's wording directly.",
    "\"English Composition or Writing\" is mapped to ENGL101 (englishComposition, UMD's Academic Writing course), the same single first-year writing requirement as pre-PA's \"English composition\".",
    "\"Introduction to Psychology\" reuses the shared generalPsych category (PSYC100), matching HPAO's course title almost exactly.",
    "Unlike the other two new tracks, HPAO's Dental Hygiene page names no admission test (no DAT, MCAT or GRE), so no exam milestone or examContent is included here.",
    "The National Board Dental Hygiene Examination and state clinical boards happen after the (non-UMD) professional program finishes, outside the UMD portion of any plan; the \"boards\" milestone is included for completeness but carries no date.",
  ],
};
