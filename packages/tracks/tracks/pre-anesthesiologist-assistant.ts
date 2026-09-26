// Pre-Anesthesiologist Assistant. Source: HPAO "Anesthesiologist Assistant" page, fetched
// 2026-09-26 (SOURCES.md). Encoded by hand. UNVERIFIED until the owner signs off.
//
// The owner's list calls this profession "Anesthesiology Assistant"; HPAO's own page (and the
// credential itself, Certified Anesthesiologist Assistant / CAA) calls it "Anesthesiologist
// Assistant". This track encodes HPAO's Anesthesiologist Assistant page: the same profession, HPAO's
// own name for it.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import {
  HPAO,
  MAPPING_NOTES,
  biochem,
  calculus,
  english,
  genChem1,
  genChem2,
  introBio,
  organicChem,
  physics,
  statistics,
  upperBioLab,
} from "./common.ts";

export const preAnesthesiologistAssistant: Track = {
  id: "pre-anesthesiologist-assistant",
  name: "Pre-Anesthesiologist Assistant",
  schools: "Anesthesiologist Assistant (AA) programs",
  minGrade: "C",
  minGradeNote: "HPAO: schools generally require a minimum of a C (not a C-) in all prerequisite courses.",
  entry: { kind: "after-degree" },
  categories: [
    genChem1("8 Credits of Inorganic Chemistry (with labs)"),
    genChem2("8 Credits of Inorganic Chemistry (with labs)"),
    organicChem("8 Credits of Organic Chemistry (with labs)"),
    biochem("Biochemistry"),
    introBio("8-12 credits of Biology (with labs)"),
    upperBioLab("8-12 credits of Biology (with labs)"),
    calculus("Calculus"),
    statistics("Statistics (some schools require advance statistics)"),
    physics("8 Credits of Physics (with labs)"),
    english("6 Credits of English"),
  ],
  milestones: [
    {
      id: "admission-test",
      kind: "exam",
      name: "MCAT or GRE",
      detail: "AA programs take the MCAT or the GRE (HPAO names both; programs vary on which). Finish the science courses it covers first, and check each target program's own requirement.",
    },
    {
      id: "shadowing",
      kind: "experience",
      name: "Shadowing anesthesia providers",
      detail: "Shadowing is often the first step: shadow anesthesiologists, CAAs and CRNAs across different clinical settings to see if the field is right for you. Some schools require a minimum number of shadowing hours.",
    },
    {
      id: "clinical",
      kind: "experience",
      name: "Healthcare experience",
      detail: "At least 6 months of healthcare experience: scribing, EMT, medical assistant, or hospital/clinic volunteering are common paths.",
    },
    {
      id: "service",
      kind: "experience",
      name: "Community service",
      detail: "AA schools look for substantive, longitudinal service experience that shows commitment to your community, beyond medicine itself.",
    },
    {
      id: "research",
      kind: "experience",
      name: "Research and other experience",
      detail: "Paid non-healthcare employment, leadership, extracurricular engagement and research are other ways HPAO suggests diversifying your application.",
      optional: true,
    },
    {
      id: "primary-application",
      kind: "application",
      name: "Apply to AA programs (Master's Degree)",
      detail: "HPAO names no single centralized application service or fixed cycle dates for AA programs (unlike medicine's AMCAS); check each target program's own application process and deadline. The Commission on Accreditation of Allied Health Education Programs (CAAHEP) lists accredited programs.",
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("anesthesiologist-assistant")],
  verified: false,
  reviewNotes: [
    MAPPING_NOTES.genChem,
    MAPPING_NOTES.organic,
    MAPPING_NOTES.biochem,
    MAPPING_NOTES.introBio,
    MAPPING_NOTES.upperBio,
    MAPPING_NOTES.physics,
    MAPPING_NOTES.calculus,
    MAPPING_NOTES.statistics,
    MAPPING_NOTES.english,
    MAPPING_NOTES.grades,
    "Naming: the owner's list says \"Anesthesiology Assistant\"; HPAO's own page and URL slug (and the credential's own name, Certified Anesthesiologist Assistant) say \"Anesthesiologist Assistant\". Same profession; this track uses HPAO's wording. Flagged for the owner.",
    "HPAO: \"Take the Medical College Admissions Test (MCAT) or the GRE\" — a genuine either/or, unlike pre-med's MCAT-only or pre-pa's mostly-GRE. No category is linked to a single exam via examContent (examMilestone returns undefined for this track, the same as pre-pa), so no course is checked for exam-timing against either test.",
    "\"Statistics (some schools require advance statistics)\" is mapped to the shared, introductory STATISTICS list; \"advanced statistics\" (biostatistics or a second stats course) isn't encoded — it's school-specific and not named by HPAO's page.",
    "HPAO's Committee Process milestones (Pre-Health Packet, Interfolio letters, mock-interview review; see COMMITTEE_MILESTONES) are for medical and dental applicants only, per HPAO's Application Process page, so they aren't included here; AA's own milestone list and dates come only from HPAO's Anesthesiologist Assistant page, which gives no cycle dates at all (no due/start dates on any milestone here).",
    "No application service (e.g. a CASAA-style centralized service) is named on HPAO's page, unlike medicine's AMCAS/AACOMAS; the primary-application milestone is written generically and points to CAAHEP's accredited-program list instead.",
  ],
};
