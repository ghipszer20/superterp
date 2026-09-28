// Pre-Genetic Counseling. Source: HPAO "Genetic Counseling" page, fetched 2026-09-26
// (SOURCES.md). Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import { GRE_MILESTONE, HPAO, MAPPING_NOTES, advancedGenetics, biochem, generalPsych, genChem1, organicChem1, statistics } from "./common.ts";

export const preGeneticCounseling: Track = {
  id: "pre-genetic-counseling",
  name: "Pre-Genetic Counseling",
  schools: "Genetic Counseling master's programs",
  minGrade: "C",
  minGradeNote: "HPAO: schools generally require a minimum of a C (not a C-) in all prerequisite courses.",
  usesScienceGpa: true,
  entry: { kind: "after-degree" },
  categories: [
    statistics("Statistics"),
    genChem1("Inorganic Chemistry with lab(s)"),
    organicChem1("Organic Chemistry with lab(s)"),
    biochem("Biochemistry"),
    advancedGenetics("Advanced Genetics"),
    generalPsych("Psychology"),
  ],
  milestones: [
    { ...GRE_MILESTONE, detail: "Most of the 55 accredited Genetic Counseling master's programs require the GRE; check each target program." },
    {
      id: "shadowing",
      kind: "experience",
      name: "Shadowing a genetic counselor",
      detail: "Shadow a genetic counselor when possible. Programs understand shadowing isn't always available locally; a phone or video conversation with a genetic counselor about their work can substitute. The National Society of Genetic Counselors' \"Find a Genetic Counselor\" tool can help.",
    },
    {
      id: "counseling-experience",
      kind: "experience",
      name: "Counseling or crisis-intervention experience",
      detail: "Programs typically want counseling or crisis-intervention experience: Planned Parenthood, domestic-abuse shelters, crisis hotlines, peer counseling, homeless shelters, hospice care, or work with people with physical disabilities or intellectual impairment. UMD and Montgomery County both run volunteer crisis hotlines.",
    },
    {
      id: "primary-application",
      kind: "application",
      name: "Apply to a Genetic Counseling master's program",
      detail: "There are 55 accredited Genetic Counseling master's programs in the U.S.; each sets its own prerequisites and deadlines, so research individual programs early. The Accreditation Council for Genetic Counseling lists accredited programs.",
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("genetic-counseling")],
  verified: false,
  reviewNotes: [
    "HPAO: \"Programs vary in their requirements\" — this is HPAO's example list, not a universal one (the same caveat pre-pa's reviewNotes give). Every category here should be confirmed against each target program's own prerequisites.",
    MAPPING_NOTES.advancedGenetics,
    "\"Inorganic Chemistry with lab(s)\" and \"Organic Chemistry with lab(s)\" are mapped as one semester each (genChem1, organicChem1), the same conservative reading pre-PA and pre-dental-hygiene give to identically vague \"with lab(s)\" wording, unlike medicine's and AA's explicit \"8 Credits\" (full two-semester sequences).",
    MAPPING_NOTES.biochem,
    "\"Psychology\" (no sub-type named, unlike pre-PA's abnormal/developmental split) is mapped to the shared generalPsych category (PSYC100).",
    MAPPING_NOTES.statistics,
    MAPPING_NOTES.grades,
    "The GRE milestone reuses the shared GRE_MILESTONE with a detail rewritten for this page's own wording (\"most require the GRE... and coursework related to genetics, psychology, statistics, and biochemistry\").",
  ],
};
