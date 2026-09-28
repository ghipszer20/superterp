// Pre-dentistry. Source: HPAO "Dentistry" and "Application Process" pages, fetched 2026-09-25
// (SOURCES.md). Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import {
  COMMITTEE_MILESTONES,
  HPAO,
  MAPPING_NOTES,
  biochem,
  collegeAlgebraOrCalculus,
  english,
  genChem1,
  genChem2,
  introBio,
  organicChem,
  physics,
  statistics,
  upperBioLab,
} from "./common.ts";

const onDat = { examContent: "dat" };

export const preDental: Track = {
  id: "pre-dental",
  name: "Pre-Dentistry",
  schools: "dental schools",
  minGrade: "C",
  minGradeNote: "HPAO: dental schools generally require a C (not a C-) in every prerequisite.",
  usesScienceGpa: true,
  entry: { kind: "after-degree" },
  categories: [
    genChem1("8 Credits of Inorganic Chemistry with labs", onDat),
    genChem2("8 Credits of Inorganic Chemistry with labs", onDat),
    organicChem("8 Credits of Organic Chemistry with labs", onDat),
    biochem("Biochemistry"),
    introBio("8-12 credits of Biology with labs", onDat),
    upperBioLab("8-12 credits of Biology with labs"),
    collegeAlgebraOrCalculus("College Algebra or Calculus"),
    statistics("Statistics"),
    physics("8 Credits of Physics with labs"),
    english("6 Credits of English"),
  ],
  milestones: [
    {
      id: "dat",
      kind: "exam",
      name: "DAT",
      detail: "Plan 2–4 months of study, after general chemistry, organic chemistry and biology (physics and biochemistry aren't on the DAT). HPAO: your first attempt should be no later than June 30 of the year you apply.",
      due: { year: -1, month: 6, day: 30 },
    },
    {
      id: "clinical",
      kind: "experience",
      name: "Clinical experience and shadowing",
      detail: "At least 1–2 years of long-term clinical experience that shows you the dentist–patient relationship; shadowing is the place to start.",
      due: { year: -1, month: 6, day: 7 },
    },
    {
      id: "service",
      kind: "experience",
      name: "Community service",
      detail: "At least 1 year of long-term community service.",
      due: { year: -1, month: 6, day: 7 },
    },
    {
      id: "manual-dexterity",
      kind: "experience",
      name: "Manual dexterity",
      detail: "Keep developing manual dexterity (hands-on hobbies, art, lab work); dental schools look for it.",
    },
    ...COMMITTEE_MILESTONES,
    {
      id: "primary-application",
      kind: "application",
      name: "Primary application (AADSAS)",
      detail: "AADSAS opens in mid-May and takes submissions in early June. HPAO recommends submitting by June 7.",
      start: { year: -1, month: 5 },
      due: { year: -1, month: 6, day: 7 },
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("dentistry"), HPAO.application, HPAO.apIb, HPAO.bioMajor],
  verified: false,
  reviewNotes: [
    MAPPING_NOTES.genChem,
    MAPPING_NOTES.organic,
    MAPPING_NOTES.biochem,
    MAPPING_NOTES.introBio,
    MAPPING_NOTES.upperBio,
    MAPPING_NOTES.physics,
    "\"College Algebra or Calculus\" = MATH113 (College Algebra and Trigonometry), MATH115 (Precalculus), or a calculus course (MATH120, MATH136, MATH140). Whether dental schools accept MATH115 as college algebra is assumed.",
    MAPPING_NOTES.statistics,
    MAPPING_NOTES.english,
    MAPPING_NOTES.grades,
    "DAT content courses: general chemistry I and II, organic chemistry and introductory biology. HPAO: physics and biochemistry are not tested on the DAT, so they aren't timed against it.",
    "The 3-year Arts-Dentistry program (DAT by June of sophomore year) is not encoded; a student in it can set the entry year and DAT term themselves.",
  ],
};
