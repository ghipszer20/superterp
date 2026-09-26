// Pre-Podiatry (DPM). Not one of the tracks the owner named, but HPAO publishes a page for it
// (prehealth.umd.edu/explore-careers/podiatry, fetched 2026-09-25, SOURCES.md) alongside the
// named tracks, so it's included as one of the "and others" the owner's requirement allows for.
// Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import { HPAO, MAPPING_NOTES, english, genChem1, genChem2, introBio, organicChem, physics } from "./common.ts";

const onMcat = { examContent: "mcat" };

export const prePodiatry: Track = {
  id: "pre-podiatry",
  name: "Pre-Podiatry",
  schools: "podiatric medical schools",
  minGrade: "C",
  minGradeNote: "HPAO: schools generally require a C (not a C-) in every prerequisite, as for medicine.",
  entry: { kind: "after-degree" },
  categories: [
    genChem1("8 credits of Inorganic Chemistry with labs", onMcat),
    genChem2("8 credits of Inorganic Chemistry with labs", onMcat),
    organicChem("8 credits of Organic Chemistry with labs", onMcat),
    introBio("8 credits of Biology with labs", onMcat),
    physics("8 credits of Physics with labs", onMcat),
    english("6 credits of English"),
  ],
  milestones: [
    {
      id: "mcat",
      kind: "exam",
      name: "MCAT",
      detail: "Podiatric medical schools use the MCAT (not a podiatry-specific test). Finish general chemistry, organic chemistry, introductory biology and physics first.",
    },
    {
      id: "clinical",
      kind: "experience",
      name: "Clinical experience",
      detail: "At least 1-2 years of clinical experience (shadowing a podiatrist is a good start).",
    },
    {
      id: "service",
      kind: "experience",
      name: "Community service",
      detail: "At least 1 year of community service.",
    },
    {
      id: "primary-application",
      kind: "application",
      name: "Primary application (AACPOMAS)",
      detail: "Podiatric medical schools use AACPMAS (American Association of Colleges of Podiatric Medicine Application Service).",
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO.career("podiatry")],
  verified: false,
  reviewNotes: [
    "This track wasn't named in the owner's requirement, but HPAO publishes a page for it (\"and others\"); the owner should confirm whether to keep it.",
    MAPPING_NOTES.genChem,
    MAPPING_NOTES.organic,
    MAPPING_NOTES.introBio,
    MAPPING_NOTES.physics,
    MAPPING_NOTES.english,
    MAPPING_NOTES.grades,
    "HPAO's podiatry page gives no biochemistry, calculus or statistics requirement (unlike medicine's list), so none is included here; the owner should double check this is a genuine gap in HPAO's page and not an oversight.",
    "No HPAO committee-process milestones are included: HPAO's application-process page names only \"medical and dental applicants\", and its podiatry page doesn't mention a Pre-Health Packet.",
  ],
};
