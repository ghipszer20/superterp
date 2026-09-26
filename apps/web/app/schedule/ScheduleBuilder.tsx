"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import type { Section } from "@superterp/course-data/schedules";
import { dispatchPlan, useAdvisorStore } from "@/app/advisor/store";
import { Segmented } from "@/components/Segmented";
import { EmptyState, SkeletonCard } from "@/components/ui";
import { timeScale } from "@/lib/schedule/calendar";
import { DEFAULT_FILTERS, readQuery, relaxConstraint, relaxOptions, toScheduleFilters, writeQuery, type FilterState } from "@/lib/schedule/filters";
import type { GenerateRequest } from "@/lib/schedule/generate";
import { applyQueryCourses, otherPlannedTerms, planCourseIds, planTermName } from "@/lib/schedule/plan-link";
import {
  parseSaved,
  PLAN_IDS,
  savePlan,
  serializeSaved,
  setOwnSection,
  withCourses,
  type PlanId,
  type SavedSchedule,
} from "@/lib/schedule/saved";
import { NOT_LOADED, savedStore } from "@/lib/schedule/saved-store";
import { sectionKey } from "@/lib/schedule/sections";
import { useLayouts } from "@/lib/schedule/use-layouts";
import { useScheduleData } from "@/lib/schedule/use-schedule-data";
import { CoursePicker } from "./CoursePicker";
import { Gallery } from "./Gallery";
import { WeekEditor } from "./WeekEditor";
import { WeekFilters } from "./WeekFilters";
import styles from "./builder.module.css";

type View = { kind: "gallery" } | { kind: "editor"; picks: Record<string, Section> } | { kind: "own" };

declare global {
  interface Window {
    /** Timing of the last gallery render, read by the ui-check performance probe. */
    __schedulePerf?: { layouts: number; workerMs: number; firstCardsMs: number };
  }
}

export function ScheduleBuilder() {
  const params = useSearchParams();
  const [view, setView] = useState<View>(() => (params.get("view") === "own" ? { kind: "own" } : { kind: "gallery" }));
  const [plan, setPlan] = useState<PlanId>("A");
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const raw = useSyncExternalStore(savedStore.subscribe, savedStore.getSnapshot, savedStore.getServerSnapshot);
  // null until this device's Advisor plan (if any) has loaded.
  const advisor = useAdvisorStore();

  // The term is known once the course index loads; the saved schedule is per term.
  const [courseList, setCourseList] = useState<string[]>([]);
  const data = useScheduleData(courseList);
  const term = data.term;
  const saved: SavedSchedule | null = useMemo(
    () => (term && raw !== NOT_LOADED ? parseSaved(raw, term) : null),
    [raw, term],
  );
  const update = useCallback(
    (fn: (s: SavedSchedule) => SavedSchedule) => {
      if (!term) return;
      savedStore.write(serializeSaved(fn(parseSaved(savedStore.getSnapshot(), term))));
    },
    [term],
  );

  // The 4-year plan's term for this schedule term, if a plan exists ("There is one plan model.
  // The builder for a term is a view of that term in the 4-year plan, plus the chosen sections.")
  const advisorPlan = advisor?.plan ?? null;
  const termName = useMemo(() => (term ? planTermName(term) : null), [term]);
  const linked = advisorPlan !== null && termName !== null;
  const hasPlanTerm = linked && advisorPlan!.terms.some((t) => t.name === termName);

  // The one source of truth for which courses are in this term: the plan's term once it's
  // linked, otherwise the builder's own saved list. Never both at once (derive, don't copy).
  const courses = useMemo(
    () => (hasPlanTerm ? planCourseIds(advisorPlan!, termName!) : (saved?.courses ?? [])),
    [hasPlanTerm, advisorPlan, termName, saved],
  );
  const filters = saved?.filters ?? DEFAULT_FILTERS;

  const setCourses = useCallback(
    (next: string[]) => {
      if (linked && termName) dispatchPlan({ type: "set-term-courses", term: termName, ids: next });
      else update((s) => withCourses(s, next));
    },
    [linked, termName, update],
  );

  // A plan just appeared (or gained a term) for a term the builder already had local courses
  // in: fold them into the plan term once, then clear the local copy so the plan becomes the
  // one source of truth going forward (a course later removed in the Advisor won't come back).
  useEffect(() => {
    if (!termName || advisor === null || !advisorPlan || hasPlanTerm) return;
    if (!saved || saved.courses.length === 0) return;
    dispatchPlan({ type: "set-term-courses", term: termName, ids: saved.courses });
    update((s) => withCourses(s, []));
  }, [termName, advisor, advisorPlan, hasPlanTerm, saved, update]);

  // Once linked, keep the builder's local cache (and the section picks it prunes) in step with
  // the plan — it may have changed courses for this term from the Advisor tab.
  useEffect(() => {
    if (!hasPlanTerm || !saved) return;
    if (saved.courses.join() === courses.join()) return;
    update((s) => withCourses(s, courses));
  }, [hasPlanTerm, saved, courses, update]);

  // A link like ?c=CMSC351,STAT400&off=F sets up the builder once; afterwards the URL follows the state.
  const fromUrl = useRef(false);
  useEffect(() => {
    if (!term || advisor === null || fromUrl.current) return;
    fromUrl.current = true;
    const q = readQuery(new URLSearchParams(window.location.search));
    // A stale or shared link must never delete a linked term's plan courses: add-only there.
    if (q.courses) setCourses(applyQueryCourses(courses, q.courses, linked));
    if (q.filters) update((s) => ({ ...s, filters: q.filters! }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, advisor]);

  useEffect(() => {
    // Mirror the saved courses into the data loader (a separate state so loading starts as soon as they're known).
    const t = setTimeout(() => setCourseList((prev) => (prev.join() === courses.join() ? prev : courses)), 0);
    return () => clearTimeout(t);
  }, [courses]);

  useEffect(() => {
    if (!saved || !fromUrl.current) return;
    const q = writeQuery(courses, saved.filters);
    const viewParam = view.kind === "own" ? `${q ? "&" : ""}view=own` : "";
    const next = `${window.location.pathname}${q || viewParam ? `?${q}${viewParam}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [saved, courses, view.kind]);

  const sectionsByCourse = useMemo(() => {
    const m = new Map<string, Section[]>();
    for (const s of data.sections) m.set(s.courseId, [...(m.get(s.courseId) ?? []), s]);
    return m;
  }, [data.sections]);
  const sectionByKey = useMemo(() => new Map(data.sections.map((s) => [sectionKey(s), s])), [data.sections]);

  const ready = data.loaded && courseList.join() === courses.join();
  // filters is rebuilt from saved on every change; key the memo on its serialized form.
  const filtersKey = JSON.stringify(filters);
  const request = useMemo<GenerateRequest | null>(
    () =>
      ready && courses.length
        ? { courseIds: courses, sections: data.sections, filters: toScheduleFilters(filters), sort: filters.sort, ratings: data.ratings }
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, courses, data.sections, data.ratings, filtersKey],
  );
  const { result, pending } = useLayouts(view.kind === "own" ? null : request);

  // Performance probe: time from asking for layouts to the first cards on screen.
  const askedAt = useRef(0);
  useEffect(() => {
    if (request) askedAt.current = performance.now();
  }, [request]);
  useEffect(() => {
    if (!result || pending) return;
    const frame = requestAnimationFrame(() => {
      window.__schedulePerf = {
        layouts: result.layouts.count,
        workerMs: Math.round(result.ms),
        firstCardsMs: Math.round(performance.now() - askedAt.current),
      };
    });
    return () => cancelAnimationFrame(frame);
  }, [result, pending]);

  const ownScale = useMemo(() => timeScale(data.sections.filter((s) => s.seats.open > 0).flatMap((s) => s.meetings)), [data.sections]);
  const ownPicks = useMemo(() => {
    const out: Record<string, Section> = {};
    // Filtered against `courses` (not written into `saved` at write time) so a course the
    // Advisor tab removed from a linked term disappears here too, without waiting on the
    // reconciliation effect.
    for (const [c, id] of Object.entries(saved?.own ?? {})) {
      if (!courses.includes(c)) continue;
      const s = sectionByKey.get(`${c}/${id}`);
      if (s) out[c] = s;
    }
    return out;
  }, [saved, sectionByKey, courses]);

  // A course present in this linked term's plan, and the same course's other plan terms, for
  // the picker's "From your 4-year plan" / "Also planned for …" notes.
  const fromPlan = useMemo(() => (hasPlanTerm ? new Set(courses) : new Set<string>()), [hasPlanTerm, courses]);
  const elsewhere = useMemo(() => {
    const m = new Map<string, string[]>();
    if (!linked || !termName || !advisorPlan) return m;
    for (const id of courses) {
      const others = otherPlannedTerms(advisorPlan, termName, id);
      if (others.length) m.set(id, others);
    }
    return m;
  }, [linked, termName, advisorPlan, courses]);

  if (data.indexState.status === "loading" || (data.indexState.status === "ready" && !saved)) {
    return <SkeletonCard rows={4} />;
  }
  if (data.indexState.status !== "ready" || !saved) {
    return (
      <div className={styles.panel}>
        <EmptyState title={data.indexState.status === "missing" ? "Course data isn’t ready yet" : "Couldn’t load courses"}>
          {data.indexState.status === "missing"
            ? "This term’s Schedule of Classes hasn’t been prepared on this server yet."
            : "Try again in a minute."}
        </EmptyState>
      </div>
    );
  }

  const setFilters = (f: FilterState) => update((s) => ({ ...s, filters: f }));
  const save = (picks: Record<string, string>) => {
    update((s) => savePlan(s, plan, picks));
    setSavedNote(`Saved as Plan ${plan}`);
    setTimeout(() => setSavedNote(null), 2500);
  };
  // Only a saved plan's picks for courses still in this term count — a course the plan or the
  // picker dropped shouldn't leave a phantom "Plan A ✓".
  const planHasPicks = (p: PlanId) => Object.keys(saved.plans[p] ?? {}).some((c) => courses.includes(c));
  const planHeader = (picks: Record<string, string>, back: React.ReactNode) => (
    <div className={styles.editorTop}>
      {back}
      <Segmented<PlanId>
        label="Plan"
        options={PLAN_IDS.map((p) => ({ value: p, label: `Plan ${p}${planHasPicks(p) ? " ✓" : ""}` }))}
        value={plan}
        onChange={setPlan}
      />
      <button type="button" className={styles.save} onClick={() => save(picks)} disabled={!Object.keys(picks).length}>
        {savedNote ?? `Save as Plan ${plan}`}
      </button>
    </div>
  );
  const idsOf = (picks: Record<string, Section>) => Object.fromEntries(Object.entries(picks).map(([c, s]) => [c, s.id]));

  const openPlan = (p: PlanId) => {
    const picks: Record<string, Section> = {};
    for (const [c, id] of Object.entries(saved.plans[p] ?? {})) {
      if (!courses.includes(c)) continue;
      const s = sectionByKey.get(`${c}/${id}`);
      if (s) picks[c] = s;
    }
    setPlan(p);
    setView({ kind: "editor", picks });
  };

  const picker = (
    <CoursePicker
      courses={data.indexState.index.courses}
      picked={courses}
      titles={data.titles}
      onChange={setCourses}
      fromPlan={fromPlan}
      elsewhere={elsewhere}
    />
  );

  return (
    <div className={styles.builder}>
      <div className={styles.modeRow}>
        <Segmented<"browse" | "own">
          label="How to build"
          options={[
            { value: "browse", label: "Browse layouts" },
            { value: "own", label: "Build my own" },
          ]}
          value={view.kind === "own" ? "own" : "browse"}
          onChange={(v) => setView(v === "own" ? { kind: "own" } : { kind: "gallery" })}
        />
        {PLAN_IDS.some((p) => planHasPicks(p)) ? (
          <div className={styles.savedPlans}>
            <span>Saved:</span>
            {PLAN_IDS.filter((p) => planHasPicks(p)).map((p) => (
              <button key={p} type="button" className={styles.planChip} onClick={() => openPlan(p)}>
                Plan {p}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {view.kind !== "editor" ? picker : null}

      {courses.length === 0 && view.kind !== "editor" ? (
        <div className={styles.panel}>
          <EmptyState title="Add your courses">
            Search above, e.g. CMSC351, STAT400 and ENGL394. SuperTerp lays out every way they fit, best first.
          </EmptyState>
        </div>
      ) : !ready ? (
        <SkeletonCard rows={3} />
      ) : view.kind === "own" ? (
        <WeekEditor
          mode="own"
          courseIds={courses}
          sectionsByCourse={sectionsByCourse}
          picks={ownPicks}
          onPick={(c, s) => update((st) => setOwnSection(st, c, s?.id ?? null))}
          ratings={data.ratings}
          titles={data.titles}
          scale={ownScale}
          gradesFor={data.gradesFor}
          loadGrades={data.loadGrades}
          initialOpen={courses.find((c) => !ownPicks[c]) ?? null}
          header={planHeader(saved.own, <h2 className={styles.editorTitle}>Your week</h2>)}
        />
      ) : view.kind === "editor" ? (
        <WeekEditor
          mode="layout"
          courseIds={courses}
          sectionsByCourse={sectionsByCourse}
          picks={view.picks}
          onPick={(c, s) => s && setView({ kind: "editor", picks: { ...view.picks, [c]: s } })}
          ratings={data.ratings}
          titles={data.titles}
          scale={result?.scale ?? ownScale}
          gradesFor={data.gradesFor}
          loadGrades={data.loadGrades}
          header={planHeader(
            idsOf(view.picks),
            <button type="button" className={styles.back} onClick={() => setView({ kind: "gallery" })}>
              ‹ All layouts
            </button>,
          )}
        />
      ) : (
        <>
          <WeekFilters filters={filters} onChange={setFilters} />
          <p className={styles.count} aria-live="polite">
            {!result || pending
              ? "Finding every layout…"
              : `${result.layouts.count.toLocaleString("en-US")} ${result.layouts.count === 1 ? "layout fits" : "layouts fit"} your week`}
          </p>
          {result && result.layouts.count === 0 && !pending ? (
            <div className={styles.empty}>
              <h3>No layouts fit your week</h3>
              {result.explanation ? <p>{result.explanation.message}</p> : null}
              <p>Relax a day below, or swap a course for another that meets the same requirement.</p>
              <div className={styles.relax}>
                {result.explanation
                  ? relaxOptions(result.explanation).map((o) => (
                      <button key={o.label} type="button" onClick={() => setFilters(relaxConstraint(filters, o.constraint))}>
                        {o.label}
                      </button>
                    ))
                  : null}
                <button type="button" className={styles.linkButton} onClick={() => setFilters({ ...filters, days: {} })}>
                  Reset my week
                </button>
              </div>
            </div>
          ) : result ? (
            <div style={{ opacity: pending ? 0.5 : 1, transition: "opacity 160ms ease" }}>
              <Gallery
                data={{ layouts: result.layouts, scale: result.scale, sectionByKey, ratings: data.ratings, courseIds: courses }}
                days={filters.days}
                onOpen={(picks) => setView({ kind: "editor", picks: Object.fromEntries(picks.map((s) => [s.courseId, s])) })}
              />
            </div>
          ) : (
            <SkeletonCard rows={3} />
          )}
        </>
      )}
    </div>
  );
}
