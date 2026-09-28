// Environmental Science and Policy Major, Culture and Environment Concentration (BSOS), 2026-27 UMD Academic Catalog.
// Source: program-sources/environmental-science-policy-major.md (catalog + official four-year plan).
// Shared ENSP Core and common review notes: ensp-shared-2026-27.ts. UNVERIFIED until owner sign-off.

import type { Program, ProgramMeta } from "../src/audit.ts";
import { enspCatalogUrl, enspCommonReviewNotes, enspCore, enspPickerInfo } from "./ensp-shared-2026-27.ts";

export const enspMajorCultureEnvironment: Program = {
  id: "ensp-major-culture-environment",
  name: "Environmental Science and Policy Major (Culture and Environment Concentration)",
  catalogYear: "2026-27",
  source:
    "UMD Academic Catalog 2026-27, Environmental Science and Policy Major, " +
    enspCatalogUrl +
    " (fetched 2026-09-28); the official four-year plan (agnr.umd.edu ENSP FourYrPlan PDF for this concentration) is the department source",
  minGrade: "C-",
  verified: false,
  reviewNotes: [
    ...enspCommonReviewNotes,
    "Official four-year plan (agnr.umd.edu PDF) transcribed; placeholders filled with real catalog courses (each fill is in the sample plan's notes). The plan's Restricted Elective, Techniques & Methods and similar unnamed slots are left out of the sample plan because they are not encoded.",
    "OPEN SLOT: Restricted Electives outside Anthropology (including 9 credits from the same department) (15 credits) names no courses or department in the catalog (only 'See ENSP website for list of approved electives', no web access); not encoded, so the audit cannot check it.",
    "OPEN SLOT: Applied Field Methods (3-6 credits) names no courses or department in the catalog (only 'See ENSP website for list of approved electives', no web access); not encoded, so the audit cannot check it.",
    "Restricted Electives in Anthropology: the catalog names only the department (ANTH), so any ANTH course counts (the approved list on the ENSP website was not available); 'at least 6 credits 300- or 400-level' is an overlay. More permissive than the ENSP-website list.",
  ],
  requirements: [
    ...enspCore,
    { kind: "course", id: "anth222-ce", name: "Introduction to Ecological and Evolutionary Anthropology (ANTH222)", options: ["ANTH222"] },
    { kind: "course", id: "anth322-ce", name: "Method and Theory in Ecological Anthropology (ANTH322)", options: ["ANTH322"] },
    { kind: "sets", id: "anth-sequence-ce", name: "ANTH240 & ANTH340 (archaeology) or ANTH260 & ANTH360 (sociocultural anthropology and linguistics)", count: 1, options: [["ANTH240", "ANTH340"], ["ANTH260", "ANTH360"]] },
    { kind: "choose", id: "anth-electives-ce", name: "Restricted Electives in Anthropology: at least 4 courses (12 credits)", count: 4, credits: 12, from: { departments: ["ANTH"], minNumber: 100, maxNumber: 499 } },
    { kind: "choose", id: "anth-electives-upper-ce", name: "At least 6 of those Anthropology credits at 300- or 400-level", overlay: true, count: 2, credits: 6, from: { departments: ["ANTH"], minNumber: 300, maxNumber: 499 } },
  ],
};

export const enspMajorCultureEnvironmentMeta: ProgramMeta = enspPickerInfo("BSOS", "Culture and Environment");
