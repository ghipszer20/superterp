"use client";

// The degree audit, per program, and the CS gateway. Reads the debounced Analysis; never imports
// @superterp/audit as a value (only types), so HiGHS stays out of this file's bundle — it's already
// loaded by lib/advisor/analysis.ts, which the app code-splits with import().

import type { GatewayCourseStatus, GatewayOverallStatus, RequirementResult } from "@superterp/audit";
import { gatewayCourseNote } from "@/lib/advisor/gateway-notes";
import type { AdvisorPlan } from "@/lib/advisor/plan-state";
import type { PriorCreditResult } from "@/lib/advisor/prior-credit";
import type { AnalysisState, OpenCourse } from "./AdvisorApp";
import { dispatchPlan } from "./store";
import styles from "./advisor.module.css";

const REQ_STATUS: Record<RequirementResult["status"], string> = { satisfied: "Satisfied", partial: "In progress", missing: "Missing" };

export function AuditView({
  plan,
  analysis,
  prior,
  onOpenCourse,
}: {
  plan: AdvisorPlan;
  analysis: AnalysisState;
  prior: PriorCreditResult;
  onOpenCourse: (c: OpenCourse) => void;
}) {
  if (!analysis.result) {
    return (
      <div className={styles.card}>
        <p className={styles.cardNote}>
          {analysis.status === "error" ? "Couldn't build the audit right now. Try again in a moment." : "Building your audit…"}
        </p>
      </div>
    );
  }
  const { audits, gateway } = analysis.result;
  const priorCourseIds = new Set(prior.courses.map((c) => c.id));

  return (
    <div className={styles.auditLayout} aria-busy={analysis.status === "running"}>
      {audits.map((audit) => (
        <section key={audit.program.id} className={styles.card}>
          <div className={styles.auditHead}>
            <h2 className={styles.cardTitle}>{audit.program.name}</h2>
            {!audit.program.verified ? <span className={styles.unverified}>Unverified</span> : null}
          </div>
          <p className={styles.cardNote}>
            {audit.satisfied} of {audit.requirements.length} requirements met
          </p>
          <ul className={styles.reqList}>
            {audit.requirements.map(({ requirement, result, gap }) => (
              <li key={requirement.id} className={styles.reqRow}>
                <div className={styles.reqHead}>
                  <span className={styles.reqName}>{requirement.name}</span>
                  <span className={styles.reqStatus} data-status={result.status}>
                    {REQ_STATUS[result.status]}
                  </span>
                </div>
                {result.assigned.length > 0 ? (
                  <p className={styles.reqAssigned}>
                    Counted: <CourseChips ids={result.assigned} onOpenCourse={onOpenCourse} />
                  </p>
                ) : null}
                {gap ? (
                  <p className={styles.reqGap}>
                    Still needed: {gap.need}
                    {gap.suggestions.length > 0 ? (
                      <>
                        {" "}
                        For example: <CourseChips ids={gap.suggestions} onOpenCourse={onOpenCourse} />
                      </>
                    ) : null}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {gateway ? (
        <section className={styles.card} aria-label="CS gateway">
          <h2 className={styles.cardTitle}>CS gateway (Limited Enrollment Program)</h2>
          <p className={styles.cardNote}>
            {gateway.rule.name === "fall-2024-or-later"
              ? `Matriculated Fall 2024 or later: every gateway course ${gateway.rule.minGrade} or better, cumulative GPA ${gateway.rule.minGpa.toFixed(1)} or higher.`
              : `Matriculated before Fall 2024: every gateway course ${gateway.rule.minGrade} or better, cumulative GPA ${gateway.rule.minGpa.toFixed(1)} or higher.`}
          </p>
          <ul className={styles.reqList}>
            {gateway.courses.map((c) => {
              const note = gatewayCourseNote(c, gateway.rule.minGrade, priorCourseIds);
              return (
                <li key={c.id} className={styles.reqRow}>
                  <div className={styles.reqHead}>
                    <span className={styles.reqName}>
                      {c.name} ({c.options.join(" or ")})
                    </span>
                    <span className={styles.reqStatus} data-status={GATEWAY_TONE[c.status]}>
                      {GATEWAY_COURSE_LABEL[c.status]}
                      {c.satisfiedBy ? ` (${c.satisfiedBy})` : ""}
                    </span>
                  </div>
                  {note ? <p className={styles.reqGap}>{note}</p> : null}
                </li>
              );
            })}
          </ul>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Cumulative UMD GPA</span>
            <input
              className={styles.input}
              type="number"
              min={0}
              max={4}
              step={0.01}
              value={plan.gpa ?? ""}
              placeholder="Not entered"
              onChange={(e) => dispatchPlan({ type: "set-gpa", gpa: e.target.value === "" ? undefined : Number(e.target.value) })}
            />
          </label>
          <p className={styles.cardNote} data-severity={gateway.gpa === "below" ? "warning" : undefined}>
            GPA: {GPA_LABEL[gateway.gpa]}
          </p>
          <p className={styles.reqStatus} data-status={OVERALL_TONE[gateway.overall]}>
            {OVERALL_LABEL[gateway.overall]}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function CourseChips({ ids, onOpenCourse }: { ids: string[]; onOpenCourse: (c: OpenCourse) => void }) {
  return (
    <>
      {ids.map((id, i) => (
        <span key={id}>
          <button type="button" className={styles.courseLink} onClick={() => onOpenCourse({ id, term: null })}>
            {id}
          </button>
          {i < ids.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
}

const GATEWAY_COURSE_LABEL: Record<GatewayCourseStatus, string> = {
  met: "Met",
  "below-minimum": "Below the minimum grade",
  planned: "Planned",
  missing: "Not planned",
};
const GATEWAY_TONE: Record<GatewayCourseStatus, RequirementResult["status"]> = {
  met: "satisfied",
  planned: "partial",
  missing: "missing",
  "below-minimum": "missing",
};
const GPA_LABEL: Record<"met" | "below" | "unknown", string> = { met: "Meets the minimum", below: "Below the minimum", unknown: "Not entered" };
const OVERALL_LABEL: Record<GatewayOverallStatus, string> = {
  eligible: "Eligible to apply to the CS major",
  "not-yet": "Not eligible yet",
  ineligible: "Not eligible as your record stands",
};
const OVERALL_TONE: Record<GatewayOverallStatus, RequirementResult["status"]> = { eligible: "satisfied", "not-yet": "partial", ineligible: "missing" };
