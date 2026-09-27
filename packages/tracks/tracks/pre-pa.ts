// Pre-Physician Assistant. Source: HPAO "Physician Assistant" page, fetched 2026-09-25
// (SOURCES.md). Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import {
  GRE_MILESTONE,
  HPAO,
  MAPPING_NOTES,
  abnormalPsych,
  anatomyPhysiology,
  biochem,
  developmentalPsych,
  englishComposition,
  genChem1,
  generalPsych,
  introBioOneSemester,
  medicalTerminology,
  microbiology,
  organicChem1,
  statistics,
} from "./common.ts";

export const prePa: Track = {
  id: "pre-pa",
  name: "Pre-Physician Assistant",
  schools: "PA programs",
  minGrade: "C",
  minGradeNote: "HPAO: many PA programs require a C, and many require a B or higher; check each target school.",
  usesScienceGpa: true,
  entry: { kind: "after-degree" },
  categories: [
    introBioOneSemester("General biology with lab"),
    anatomyPhysiology("Human anatomy and physiology I and II with labs"),
    genChem1("General chemistry with lab"),
    organicChem1("Organic chemistry with lab"),
    microbiology("Microbiology"),
    biochem("Biochemistry"),
    generalPsych("General psychology"),
    abnormalPsych("Abnormal psychology (Adult Psychopathology)"),
    developmentalPsych("Developmental psychology"),
    englishComposition("English composition"),
    statistics("Statistics"),
    medicalTerminology("Medical terminology"),
  ],
  milestones: [
    {
      id: "patient-care",
      kind: "experience",
      name: "Direct patient care experience",
      detail: "Typical applicants have 2–4 years and over 1,000 hours of direct patient care experience (e.g. EMT, CNA, medical scribe) before applying.",
      hours: 1000,
    },
    { ...GRE_MILESTONE, detail: "Some PA programs require the GRE; very few require the PA-CAT. Check each target school." },
    {
      id: "primary-application",
      kind: "application",
      name: "Primary application (CASPA)",
      detail: "PA programs use CASPA (Centralized Application Service for Physician Assistants). Application cycles typically open in the spring for fall matriculation the following year; check each program's deadline.",
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("physician-assistant")],
  verified: false,
  reviewNotes: [
    "HPAO's PA prerequisites \"vary widely\" between programs; this is HPAO's example list, not a universal one. Every category here should be confirmed against each target program's own prerequisites.",
    MAPPING_NOTES.grades,
    "\"General biology with lab\" is mapped as one semester (BSCI170/180 or BSCI160/180), matching HPAO's \"general biology with lab\" (singular), unlike medicine's 8-12 credit requirement.",
    "\"General chemistry with lab\" and \"organic chemistry with lab\" are mapped as one semester each (genChem1, organicChem1), matching HPAO's singular wording, unlike medicine's two-semester sequences.",
    "Abnormal psychology: HPAO names \"Adult Psychopathology (PSYC353) and Child Psychopathology (PSYC330)\" together; this reuses the shared abnormal-psych category (PSYC353 or PSYC330), so only one is required here. Re-checked directly against HPAO's PA page (https://prehealth.umd.edu/explore-careers/physician-assistant, fetched 2026-09-27): it presents the two courses as UMD's own two-stage split of one \"Abnormal Psychology\" prerequisite, not a request for both, so oneOf (either course) is correct as encoded.",
    "Developmental psychology maps to PSYC355, HPAO's own citation, reusing the shared developmental-psych category.",
    "Medical terminology: HPAO names it but UMD's course isn't identified (offered only in winter per the HPAO nursing page); the student confirms it themselves.",
    "No admission test (MCAT, GRE) is treated as exam content for these categories: HPAO doesn't tie PA prerequisites to a specific test, and very few PA programs require the PA-CAT.",
  ],
};
