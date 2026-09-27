// Pre-Occupational Therapy (OT). Source: HPAO "Occupational Therapy" page, fetched 2026-09-25
// (SOURCES.md). Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import {
  CPR_MILESTONE,
  GRE_MILESTONE,
  HPAO,
  MAPPING_NOTES,
  abnormalPsych,
  anatomyPhysiology,
  developmentalPsych,
  englishComposition,
  generalPsych,
  humanDevelopment,
  medicalTerminology,
  physicsOneSemester,
  sociology,
  statistics,
} from "./common.ts";

export const preOt: Track = {
  id: "pre-ot",
  name: "Pre-Occupational Therapy",
  schools: "OT programs",
  minGrade: "C",
  minGradeNote: "Example (Towson MS OT, HPAO's OT page): a B or better in prerequisites; check each target school.",
  usesScienceGpa: true,
  entry: { kind: "after-degree" },
  categories: [
    anatomyPhysiology("Anatomy and physiology 1 and 2 with labs"),
    physicsOneSemester("Physics with lab"),
    statistics("Statistics"),
    humanDevelopment("Human growth and development"),
    sociology("Sociology"),
    generalPsych("Psychology"),
    abnormalPsych("Abnormal psychology"),
    developmentalPsych("Developmental psychology"),
    medicalTerminology("Medical terminology"),
    englishComposition("English composition"),
  ],
  milestones: [
    {
      id: "ot-experience",
      kind: "experience",
      name: "OT experience",
      detail: "At least 100 hours of occupational therapy experience (shadowing or working in an OT setting) before you apply.",
      hours: 100,
    },
    { ...GRE_MILESTONE, detail: "Most OT programs require the GRE; check each target school." },
    CPR_MILESTONE,
    {
      id: "primary-application",
      kind: "application",
      name: "Primary application (OTCAS)",
      detail: "OT programs use OTCAS (Occupational Therapy Centralized Application Service).",
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("occupational-therapy")],
  verified: false,
  reviewNotes: [
    MAPPING_NOTES.grades,
    "\"Physics with lab\" is mapped as one semester (physicsOneSemester); HPAO's OT page doesn't say how many credits.",
    MAPPING_NOTES.statistics,
    "Abnormal psychology (PSYC353/PSYC330) and developmental psychology (PSYC355) reuse the same shared categories as pre-PA, per HPAO's own citation of those course numbers on the OT page.",
    "Medical terminology: HPAO says UMD offers it in winter term, but names no course, so the student confirms it themselves.",
    "No admission test is tied to these categories as exam content: OT programs don't require the MCAT or DAT, and HPAO's OT page doesn't describe the GRE's content.",
  ],
};
