"use client";

// The plan's checks: a summary list (worst first) and the program notices. checkPlan's issues are
// synchronous and run on every edit; notices come from the debounced audit (AnalysisState).

import type { PlanIssue } from "@superterp/plan/check";
import type { AnalysisState, OpenCourse } from "./AdvisorApp";
import type { CatalogState } from "./data";
import { SEVERITY, SEVERITY_ORDER, type IssueGroups } from "@/lib/advisor/issues";
import styles from "./advisor.module.css";

type Checked = { issues: PlanIssue[]; groups: IssueGroups } | null;

export function ChecksPanel({
  checked,
  catalogStatus,
  onOpenCourse,
}: {
  checked: Checked;
  catalogStatus: CatalogState["status"];
  onOpenCourse: (c: OpenCourse) => void;
}) {
  return (
    <section className={styles.card} aria-label="Checks">
      <h2 className={styles.cardTitle}>Checks</h2>
      {catalogStatus === "loading" && !checked ? (
        <p className={styles.cardNote}>Loading course data…</p>
      ) : catalogStatus === "missing" ? (
        <p className={styles.cardNote}>Build the course data to check prerequisites and credit loads.</p>
      ) : !checked || checked.issues.length === 0 ? (
        <p className={styles.cardNote}>No issues found. SuperTerp checks prerequisites, corequisites, repeats and credit loads on every edit.</p>
      ) : (
        <>
          <div className={styles.severityCounts}>
            {SEVERITY_ORDER.filter((s) => checked.groups.counts[s] > 0).map((s) => (
              <span key={s} className={styles.severityCount} data-severity={s}>
                {SEVERITY[s].plural(checked.groups.counts[s])}
              </span>
            ))}
          </div>
          <ul className={styles.issueList}>
            {checked.groups.summary.map((issue, i) => (
              <IssueRow key={i} issue={issue} onOpenCourse={onOpenCourse} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function IssueRow({ issue, onOpenCourse }: { issue: PlanIssue; onOpenCourse: (c: OpenCourse) => void }) {
  const body = (
    <>
      <span className={styles.issueSeverity} data-severity={issue.severity}>
        {SEVERITY[issue.severity].label}
      </span>
      <span className={styles.issueText}>
        <span className={styles.issueWhere}>{issue.course ? `${issue.course} · ${issue.term}` : issue.term}</span>
        {issue.message}
      </span>
    </>
  );
  if (!issue.course) {
    return (
      <li className={styles.issueRow} data-severity={issue.severity}>
        {body}
      </li>
    );
  }
  return (
    <li className={styles.issueRow} data-severity={issue.severity}>
      <button type="button" className={styles.issueButton} onClick={() => onOpenCourse({ id: issue.course!, term: issue.term })}>
        {body}
      </button>
    </li>
  );
}

/** Program notices: always info, never a warning (double major, dual degree, close-to-major). */
export function Notices({ analysis }: { analysis: AnalysisState }) {
  if (analysis.status === "error" && !analysis.result) {
    return (
      <section className={styles.card} aria-label="Program notices">
        <p className={styles.cardNote}>Couldn&apos;t check your programs and the CS gateway right now.</p>
      </section>
    );
  }
  const notices = analysis.result?.notices ?? [];
  if (notices.length === 0) {
    if (analysis.status === "running" && !analysis.result) {
      return (
        <section className={styles.card} aria-label="Program notices">
          <p className={styles.cardNote}>Checking your programs…</p>
        </section>
      );
    }
    return null;
  }
  return (
    <section className={styles.card} aria-label="Program notices" aria-busy={analysis.status === "running"}>
      <h2 className={styles.cardTitle}>Good to know</h2>
      <ul className={styles.noticeList}>
        {notices.map((n, i) => (
          <li key={i} className={styles.notice} data-severity="info">
            {n.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
