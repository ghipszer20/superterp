// The what-if comparison (@superterp/plan/what-if): current vs proposed majors, run only when the
// student picks a different proposed set in the Advisor's What-if tab. Solver-backed (HiGHS via
// @superterp/audit through @superterp/plan), so this module is loaded with import() from the
// component -- never imported at the top of a file in the main bundle (see analysis.ts).

import type { PlanCatalog } from "@superterp/plan/catalog";
import type { Plan } from "@superterp/plan/check";
import { whatIf, type CourseWhatIf, type WhatIfResult } from "@superterp/plan/what-if";
import { AUTOMATIC_PROGRAMS, majorPrograms } from "./programs";
import { matriculationTermId } from "./terms";

export type { CourseWhatIf, WhatIfResult };

export async function runWhatIf(
  plan: Plan,
  catalog: PlanCatalog,
  currentProgramIds: string[],
  proposedProgramIds: string[],
  startTerm: string,
  gpa: number | undefined,
): Promise<WhatIfResult> {
  const matriculationTerm = matriculationTermId(startTerm);
  const [current, proposed] = await Promise.all([majorPrograms(currentProgramIds), majorPrograms(proposedProgramIds)]);
  return whatIf(plan, catalog, current, proposed, AUTOMATIC_PROGRAMS, {
    ...(matriculationTerm ? { matriculationTerm } : {}),
    ...(gpa !== undefined ? { cumulativeGpa: gpa } : {}),
  });
}
