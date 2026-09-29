// Pre-Medical Physics (CAMPEP graduate programs). Source: CAMPEP graduate standards, as reported
// in docs/project/new-tracks-research.md section 12. UNVERIFIED until the owner signs off.

import type { Track } from "../src/types.ts";
import { cat, sets } from "./common.ts";

const CAMPEP = "https://campep.org/GraduateStandards.pdf";

export const preMedicalPhysics: Track = {
  id: "pre-medical-physics",
  name: "Pre-Medical Physics",
  schools: "CAMPEP-accredited medical physics programs",
  entry: { kind: "after-degree" },
  usesScienceGpa: true,
  categories: [
    cat(
      sets("intro-physics", "Introductory physics sequence", [["PHYS161", "PHYS260", "PHYS261"], ["PHYS171", "PHYS172"]]),
      "A strong foundation in basic physics: a physics degree, or another degree with physics education equivalent to a minor in physics (CAMPEP)",
    ),
    cat(
      { kind: "choose", id: "upper-physics", name: "Three upper-level physics courses", count: 3, from: { courses: ["PHYS401", "PHYS404", "PHYS411", "PHYS420"] } },
      "At least three upper level undergraduate physics courses or equivalent required for a physics major (CAMPEP)",
    ),
  ],
  milestones: [
    {
      id: "program-requirements",
      kind: "application",
      name: "Check each program's GPA, GRE and application steps",
      detail: "CAMPEP sets no credit minimums or GPA: each graduate program sets its own GPA and GRE requirements. Remedial coursework is allowed if your physics background falls short.",
    },
  ],
  disclaimer: "Confirm with CAMPEP-accredited programs and each target school.",
  sources: [CAMPEP],
  verified: false,
  reviewNotes: [
    "CAMPEP gives no credit minimums, GPA or GRE; the standard is qualitative (a physics degree, or physics equivalent to a minor with at least three upper-level physics courses). The doc's verdict is a single category; it is split into an intro sequence and three upper-level courses so each half shows separately.",
    "UMD courses are the research doc's: PHYS161 / PHYS260 / PHYS261 (or PHYS171 / PHYS172) for the sequence, and PHYS401, PHYS404, PHYS411 and PHYS420 for the upper level. Whether the pairing of PHYS161 with PHYS260/261 is one sequence is SuperTerp's reading of the doc's \"PHYS161 / PHYS260/261\".",
    "The doc also lists math (MATH140, MATH141, MATH241, MATH246) as UMD courses but CAMPEP names no math requirement, so none is encoded.",
    "PHYS171, PHYS172, PHYS401, PHYS404, PHYS411 and PHYS420 are not in the Spring 2027 schedule fixture; they were added from the research doc alone (titles and credits are placeholders).",
    "Remedial coursework is allowed by CAMPEP, so an unmet category is a gap to close, not a bar.",
  ],
};
