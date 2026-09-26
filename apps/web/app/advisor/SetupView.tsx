"use client";

import { useState } from "react";
import { newPlan, planReducer, type AdvisorPlan } from "@/lib/advisor/plan-state";
import { AUTOMATIC_PROGRAMS, CATALOG_YEARS, PROGRAM_OPTIONS, toggleProgram } from "@/lib/advisor/programs";
import { startTermOptions } from "@/lib/advisor/terms";
import styles from "./advisor.module.css";

/** First run (plan = null) or editing: majors, catalog year and first term. */
export function SetupView({ plan, onDone, onCancel }: { plan: AdvisorPlan | null; onDone: (plan: AdvisorPlan) => void; onCancel?: () => void }) {
  const thisYear = new Date().getFullYear();
  const terms = startTermOptions(thisYear);
  const [programs, setPrograms] = useState<string[]>(plan?.programs ?? []);
  const [catalogYear, setCatalogYear] = useState<string>(plan?.catalogYear ?? CATALOG_YEARS[0]);
  const [startTerm, setStartTerm] = useState(plan?.startTerm ?? `Fall ${thisYear}`);
  const moves = plan !== null && plan.startTerm !== startTerm && plan.terms.some((t) => t.courses.length > 0);

  const done = () => {
    const setup = { programs, catalogYear, startTerm };
    onDone(plan ? planReducer(plan, { type: "setup", ...setup }) : newPlan(setup));
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>Advisor</p>
          <h1 className={styles.title}>{plan ? "Edit setup" : "Set up your plan"}</h1>
        </div>
      </header>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Your majors</h2>
        <p className={styles.panelNote}>Pick every major you have or want. Tracks of one major replace each other.</p>
        <div className={styles.optionList} role="group" aria-label="Majors">
          {PROGRAM_OPTIONS.map((o) => {
            const on = programs.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                className={styles.option}
                aria-pressed={on}
                onClick={() => setPrograms((p) => toggleProgram(p, o.id))}
              >
                <span className={styles.optionCheck} aria-hidden="true">
                  {on ? "✓" : ""}
                </span>
                <span className={styles.optionText}>
                  <span className={styles.optionTitle}>{o.program.name.replace(/ \(.*\)$/, "")}</span>
                  <span className={styles.optionSub}>{o.track ? `${o.track} track` : "B.S."}</span>
                </span>
                <span className={styles.unverified} title="The owner hasn't reviewed these requirements against the catalog yet.">
                  Unverified
                </span>
              </button>
            );
          })}
        </div>
        <p className={styles.panelNote}>
          Always included: {AUTOMATIC_PROGRAMS.map((p) => p.name).join(" and ")}.
        </p>
      </section>

      <section className={styles.panel}>
        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Catalog year</span>
            <select className={styles.input} value={catalogYear} onChange={(e) => setCatalogYear(e.target.value)}>
              {CATALOG_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y.replace("-", "–")}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>First term at UMD</span>
            <select className={styles.input} value={startTerm} onChange={(e) => setStartTerm(e.target.value)}>
              {terms.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className={styles.panelNote}>
          The catalog year is usually the year you started or declared. Only 2026–27 is available so far.
        </p>
        {moves ? <p className={styles.banner} data-tone="warning">Changing your first term moves every course to the matching term.</p> : null}
      </section>

      <div className={styles.actions}>
        {onCancel ? (
          <button type="button" className={styles.ghostButton} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
        <button type="button" className={styles.primaryButton} onClick={done} disabled={programs.length === 0}>
          {plan ? "Save" : "Build my plan"}
        </button>
      </div>
      {programs.length === 0 ? <p className={styles.fine}>Pick at least one major to continue.</p> : null}
    </main>
  );
}
