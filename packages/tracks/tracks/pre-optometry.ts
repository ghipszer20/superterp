// Pre-Optometry (OD). Source: HPAO "Optometry" page, fetched 2026-09-25 (SOURCES.md). HPAO
// describes this as "Medicine's list" plus a fixed 8 credits of biology (not medicine's 8-12) and
// 3 credits of psychology. Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import {
  COMMITTEE_MILESTONES,
  HPAO,
  MAPPING_NOTES,
  biochem,
  calculus,
  english,
  genChem1,
  genChem2,
  generalPsych,
  introBio,
  organicChem,
  physics,
  statistics,
} from "./common.ts";

const onOat = { examContent: "oat" };

export const preOptometry: Track = {
  id: "pre-optometry",
  name: "Pre-Optometry",
  schools: "optometry schools",
  minGrade: "C",
  minGradeNote: "HPAO: schools generally require a C (not a C-) in every prerequisite, as for medicine.",
  entry: { kind: "after-degree" },
  categories: [
    genChem1("8 Credits of Inorganic Chemistry with labs", onOat),
    genChem2("8 Credits of Inorganic Chemistry with labs", onOat),
    organicChem("8 Credits of Organic Chemistry with labs", onOat),
    biochem("Biochemistry", onOat),
    introBio("8 credits of Biology with labs", onOat),
    calculus("Calculus"),
    statistics("Statistics"),
    physics("8 Credits of Physics with labs", onOat),
    english("6 Credits of English"),
    generalPsych("3 credits of Psychology"),
  ],
  milestones: [
    {
      id: "oat",
      kind: "exam",
      name: "OAT",
      detail: "The Optometry Admission Test covers general chemistry, organic chemistry, biology and physics; finish those courses before you sit for it. OptomCAS opens in July.",
    },
    {
      id: "clinical",
      kind: "experience",
      name: "Clinical experience",
      detail: "At least 1 year of clinical experience (shadowing an optometrist is a good start).",
    },
    {
      id: "service",
      kind: "experience",
      name: "Community service",
      detail: "At least 1 year of community service.",
    },
    ...COMMITTEE_MILESTONES,
    {
      id: "primary-application",
      kind: "application",
      name: "Primary application (OptomCAS)",
      detail: "OptomCAS opens in July of the year before matriculation.",
      start: { year: -1, month: 7 },
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("optometry"), HPAO.application],
  verified: false,
  reviewNotes: [
    MAPPING_NOTES.genChem,
    MAPPING_NOTES.organic,
    MAPPING_NOTES.biochem,
    MAPPING_NOTES.introBio,
    MAPPING_NOTES.physics,
    MAPPING_NOTES.calculus,
    MAPPING_NOTES.statistics,
    MAPPING_NOTES.english,
    MAPPING_NOTES.grades,
    "\"8 credits of Biology with labs\" is HPAO's fixed number for optometry, unlike medicine's 8-12 credit range, so this is intro biology only (introBio), with no upper-level biology category.",
    "\"3 credits of Psychology\" maps to PSYC100 (generalPsych); HPAO doesn't name a course.",
    "The OAT's content categories reuse medicine's list (general chemistry, organic chemistry, biochemistry, introductory biology and physics); HPAO's optometry page doesn't itself give the OAT's content breakdown, so this is copied from the OAT's well-known outline the way HPAO's medicine page describes the MCAT's.",
    "The medical/dental Committee Process milestones (HPAO's application-process page) are reused here on the assumption optometry applicants go through the same HPAO committee process as medicine and dentistry; the owner should confirm this, since HPAO's application-process page names only \"medical and dental applicants\".",
  ],
};
