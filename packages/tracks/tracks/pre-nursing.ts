// Pre-Nursing (transfer track: two years at UMD, then a BSN program elsewhere). Source: HPAO
// "Nursing" page and the Academic Catalog's Pre-Health Professions page, fetched 2026-09-25
// (SOURCES.md). Encoded by hand. UNVERIFIED until the owner signs off.

import { HPAO_DISCLAIMER, type Track } from "../src/types.ts";
import {
  MAPPING_NOTES,
  anatomyPhysiology,
  genChem1,
  humanDevelopment,
  microbiology,
  nutrition,
  statistics,
} from "./common.ts";

const HPAO_NURSING = "https://prehealth.umd.edu/explore-careers/nursing";
const CATALOG = "https://academiccatalog.umd.edu/undergraduate/campus-administration-resources-student-services/academic-resources-services/pre-health-professions-advising-programs/";

export const preNursing: Track = {
  id: "pre-nursing",
  name: "Pre-Nursing",
  schools: "BSN programs",
  minGrade: "C-",
  minGradeNote: "UMSON's Guaranteed Pathway: BSCI170 and BSCI180 need a C- or better, with a 3.0 science GPA and no more than one grade below C-.",
  examCreditAccepted: true,
  usesScienceGpa: true,
  entry: { kind: "transfer", afterYears: 2 },
  categories: [
    anatomyPhysiology("Anatomy and physiology I and II with labs"),
    microbiology("Microbiology with lab"),
    genChem1("Inorganic chemistry with lab"),
    nutrition("Nutrition"),
    statistics("Statistics"),
    humanDevelopment("Human growth and development"),
  ],
  milestones: [
    {
      id: "primary-application",
      kind: "application",
      name: "Apply to a BSN program",
      detail: "HPAO's Nursing page describes two paths: transfer into a BSN program after two years of UMD prerequisites, or finish a UMD degree first and then apply to an accelerated (ABSN) or master's-entry (MSN) program. NursingCAS is the common application service; check each program's own deadline.",
    },
  ],
  disclaimer: HPAO_DISCLAIMER,
  sources: [HPAO_NURSING, CATALOG],
  verified: false,
  reviewNotes: [
    "These are HPAO's \"traditional path\" (2+2 transfer) prerequisites: anatomy & physiology, microbiology, inorganic chemistry, nutrition, statistics, human growth and development.",
    "The Academic Catalog separately describes UMSON's Guaranteed Admission Pathway: 3.25 overall GPA and 3.0 science GPA; BSCI170 and BSCI180 (formerly BSCI171) with C- or better; one of CHEM131 & 132, BSCI201, BSCI202 or BSCI223; and an unlimited amount of AP/IB credit accepted. This stricter, alternate course list and its GPA thresholds are NOT encoded as a Requirement here (the audit format has no minimum-GPA concept), so `checkTrack` cannot verify Guaranteed Pathway eligibility; the owner should treat this track as the general traditional-path prerequisites only, and a UMSON Guaranteed Pathway applicant should confirm the stricter list and GPA thresholds directly.",
    MAPPING_NOTES.grades,
    "\"Inorganic chemistry with lab\" is mapped as one semester (genChem1, CHEM131 & CHEM132); HPAO's Nursing page doesn't say how many credits.",
    MAPPING_NOTES.socialScience,
    "entry: { kind: \"transfer\", afterYears: 2 } models the 2+2 traditional path; a student finishing a full UMD degree first (the other HPAO path) should treat entry as after-degree instead.",
    "examCreditAccepted is set because the catalog says the Guaranteed Pathway accepts \"an unlimited number of AP and IB credits\"; other UMD nursing prerequisites may not be as permissive at every target BSN program.",
  ],
};
