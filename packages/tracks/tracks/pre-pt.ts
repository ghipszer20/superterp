// Pre-Physical Therapy (DPT). Source: HPAO "Physical Therapy" page, fetched 2026-09-25
// (SOURCES.md). Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import {
  CPR_MILESTONE,
  GRE_MILESTONE,
  HPAO,
  MAPPING_NOTES,
  abnormalPsych,
  anatomyPhysiology,
  collegeAlgebraOrCalculus,
  generalPsych,
  genChem1,
  introBioOneSemester,
  organicOrGenChem2,
  physics,
  statistics,
} from "./common.ts";

export const prePt: Track = {
  id: "pre-pt",
  name: "Pre-Physical Therapy",
  schools: "DPT programs",
  minGrade: "C",
  minGradeNote: "Example (UMB DPT, HPAO's PT page): 3.0 overall and prerequisite GPA and a C or better in each prerequisite; check each target school.",
  usesScienceGpa: true,
  entry: { kind: "after-degree" },
  categories: [
    introBioOneSemester("4-8 credits of general biology with lab"),
    anatomyPhysiology("Anatomy and physiology 1 and 2 with labs"),
    genChem1("4 credits of inorganic chemistry with lab"),
    organicOrGenChem2("4 credits of organic chemistry with lab, or inorganic chemistry 2 with lab"),
    generalPsych("General psychology"),
    abnormalPsych("Abnormal psychology"),
    physics("8 credits of physics with labs"),
    collegeAlgebraOrCalculus("3 credits of mathematics"),
    statistics("Statistics"),
  ],
  milestones: [
    {
      id: "pt-experience",
      kind: "experience",
      name: "PT experience",
      detail: "At least 100 hours of physical therapy experience (shadowing or working in a PT setting) before you apply. Example (UMB DPT): 50 hours minimum.",
      hours: 100,
    },
    { ...GRE_MILESTONE, detail: "Most DPT programs require the GRE. Example (UMB DPT): 3 letters of recommendation, in addition to the GRE." },
    CPR_MILESTONE,
    {
      id: "primary-application",
      kind: "application",
      name: "Primary application (PTCAS)",
      detail: "DPT programs use PTCAS (Physical Therapist Centralized Application Service).",
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("physical-therapy")],
  verified: false,
  reviewNotes: [
    MAPPING_NOTES.introBio,
    "\"4-8 credits of general biology with lab\" is mapped as one semester (introBioOneSemester); a target school asking for 8 credits needs a second semester the plan should also include.",
    MAPPING_NOTES.grades,
    "\"4 credits of inorganic chemistry with lab\" maps to genChem1 (CHEM131 & CHEM132), which is 4 credits.",
    "\"4 credits of organic chemistry with lab or inorganic chemistry 2 with lab\" is a new combined category (organicOrGenChem2) offering CHEM231/232 (or majors' CHEM237) as the organic option, or CHEM271/272 as the \"inorganic chemistry 2\" option, per HPAO's own wording of the choice.",
    MAPPING_NOTES.physics,
    "\"3 credits of mathematics\" maps to the shared college-algebra-or-calculus category (MATH113, MATH115 or a calculus course); HPAO doesn't say which math, just \"mathematics\".",
    MAPPING_NOTES.statistics,
    "No admission test is tied to these categories as exam content: PT programs don't require the MCAT or DAT, and HPAO's PT page doesn't describe the GRE's content the way it describes the MCAT's.",
  ],
};
