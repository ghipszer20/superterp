// Pre-Veterinary Medicine. Source: ANSC's Pre-Vet page and Pre-Veterinary Advising Guide, fetched
// 2026-09-25 (SOURCES.md). Not an HPAO track: ANSC (Animal & Avian Sciences) advises it, and
// prehealth.umd.edu just links out to it. Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import {
  GRE_MILESTONE,
  MAPPING_NOTES,
  biochem,
  englishComposition,
  genChem1,
  genChem2,
  introBio,
  organicChem,
  physics,
  statisticsOrCalculus,
} from "./common.ts";

const ANSC = {
  preVet: "https://ansc.umd.edu/undergraduate/pre-vet",
  guide: "https://docs.google.com/document/d/15stVzTTLP2Gl6X138r0lAqAmEsbXXzwIKf1Y8M_67sk/",
};

export const preVet: Track = {
  id: "pre-vet",
  name: "Pre-Veterinary Medicine",
  schools: "veterinary schools",
  minGrade: "C-",
  minGradeNote: "The ANSC guide: \"some schools won't accept a grade below C or C-\" in a prerequisite; check each target school.",
  usesScienceGpa: true,
  entry: { kind: "after-degree" },
  categories: [
    englishComposition("1-2 semesters of English"),
    introBio("2 semesters of biology with lab"),
    genChem1("2 semesters of general chemistry with lab"),
    genChem2("2 semesters of general chemistry with lab"),
    organicChem("2 semesters of organic chemistry with lab"),
    physics("2 semesters of physics with lab"),
    biochem("1-2 semesters of biochemistry"),
    statisticsOrCalculus("1-2 semesters of mathematics (statistics or (pre)calculus)"),
  ],
  milestones: [
    {
      id: "veterinary-experience",
      kind: "experience",
      name: "Veterinary experience",
      detail: "At least 100 hours, and preferably 400–600 hours, of veterinary experience across species (large and small animal, exotics), before you apply.",
      hours: 100,
    },
    { ...GRE_MILESTONE, detail: "Only a handful of vet schools require the GRE; take it sophomore or junior year if a target school needs it." },
    {
      id: "primary-application",
      kind: "application",
      name: "Primary application (VMCAS)",
      detail: "VMCAS (Veterinary Medical College Application Service) opens in late January of the year before matriculation and closes near September 15.",
      start: { year: -1, month: 1 },
      due: { year: -1, month: 9, day: 15 },
    },
  ],
  disclaimer: "Confirm with ANSC's pre-veterinary advising and each target school.",
  sources: [ANSC.preVet, ANSC.guide],
  verified: false,
  reviewNotes: [
    "Any UMD major works for pre-vet (ANSC page); these are the ANSC Pre-Veterinary Advising Guide's typical prerequisites, which the guide itself says vary by school and \"is changing\" for physics.",
    MAPPING_NOTES.genChem,
    MAPPING_NOTES.organic,
    MAPPING_NOTES.introBio,
    MAPPING_NOTES.physics,
    MAPPING_NOTES.biochem,
    "\"1-2 semesters of mathematics (statistics or (pre)calculus)\" is mapped as one semester of either the shared statistics list or the shared calculus list (statisticsOrCalculus), since the guide doesn't say which schools want which or how many.",
    "\"1-2 semesters of English\" is mapped as just ENGL101 (one semester), the minimum reading; a target school may want a second semester.",
    "Vet schools generally \"don't accept online labs\" (ANSC page); not checkable from a plan, so not encoded as a rule.",
    "No admission test is tied to these categories as exam content: most vet schools don't require the GRE at all, and the ones that do don't publish MCAT/DAT-style content lists the way HPAO does.",
  ],
};
