"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import type { Section } from "@superterp/course-data/schedules";
import { Segmented } from "@/components/Segmented";
import { EmptyState, SkeletonCard } from "@/components/ui";
import { timeScale } from "@/lib/schedule/calendar";
import { DEFAULT_FILTERS, readQuery, relaxConstraint, relaxOptions, toScheduleFilters, writeQuery, type FilterState } from "@/lib/schedule/filters";
import type { GenerateRequest } from "@/lib/schedule/generate";
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

  // A link like ?c=CMSC351,STAT400&off=F sets up the builder once; afterwards the URL follows the state.
  const fromUrl = useRef(false);
  useEffect(() => {
    if (!term || fromUrl.current) return;
    fromUrl.current = true;
    const q = readQuery(new URLSearchParams(window.location.search));
    if (q.courses || q.filters) {
      update((s) => {
        const next = q.courses ? withCourses(s, q.courses) : s;
        return q.filters ? { ...next, filters: q.filters } : next;
      });
    }
  }, [term, update]);

  const courses = useMemo(() => saved?.courses ?? [], [saved]);
  const filters = saved?.filters ?? DEFAULT_FILTERS;
  useEffect(() => {
    // Mirror the saved courses into the data loader (a separate state so loading starts as soon as they're known).
    const t = setTimeout(() => setCourseList((prev) => (prev.join() === courses.join() ? prev : courses)), 0);
    return () => clearTimeout(t);
  }, [courses]);

  useEffect(() => {
    if (!saved || !fromUrl.current) return;
    const q = writeQuery(saved.courses, saved.filters);
    const viewParam = view.kind === "own" ? `${q ? "&" : ""}view=own` : "";
    const next = `${window.location.pathname}${q || viewParam ? `?${q}${viewParam}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [saved, view.kind]);

  const sectionsByCourse = useMemo(() => {
    const m = new Map<string, Section[]>();
    for (const s of data.sections) m.set(s.courseId, [...(m.get(s.courseId) ?? []), s]);
    return m;
  }, [data.sections]);
  const sectionByKey = useMemo(() => new Map(data.sections.map((s) => [sectionKey(s), s])), [data.sections]);

  const ready = data.loaded && courseList.join() === courses.join();
  const request = useMemo<GenerateRequest | null>(
    () =>
      ready && courses.length
        ? { courseIds: courses, sections: data.sections, filters: toScheduleFilters(filters), sort: filters.sort, ratings: data.ratings }
        : null,
    // filters is rebuilt from saved on every change; key on its serialized form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, courses, data.sections, data.ratings, JSON.stringify(filters)],
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
    for (const [c, id] of Object.entries(saved?.own ?? {})) {
      const s = sectionByKey.get(`${c}/${id}`);
      if (s) out[c] = s;
    }
    return out;
  }, [saved, sectionByKey]);

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

  const setCourses = (next: string[]) => update((s) => withCourses(s, next));
  const setFilters = (f: FilterState) => update((s) => ({ ...s, filters: f }));
  const save = (picks: Record<string, string>) => {
    update((s) => savePlan(s, plan, picks));
    setSavedNote(`Saved as Plan ${plan}`);
    setTimeout(() => setSavedNote(null), 2500);
  };
  const planHeader = (picks: Record<string, string>, back: React.ReactNode) => (
    <div className={styles.editorTop}>
      {back}
      <Segmented<PlanId>
        label="Plan"
        options={PLAN_IDS.map((p) => ({ value: p, label: `Plan ${p}${saved.plans[p] ? " ✓" : ""}` }))}
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
      const s = sectionByKey.get(`${c}/${id}`);
      if (s) picks[c] = s;
    }
    setPlan(p);
    setView({ kind: "editor", picks });
  };

  const picker = (
    <CoursePicker courses={data.indexState.index.courses} picked={courses} titles={data.titles} onChange={setCourses} />
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
        {PLAN_IDS.some((p) => saved.plans[p]) ? (
          <div className={styles.savedPlans}>
            <span>Saved:</span>
            {PLAN_IDS.filter((p) => saved.plans[p]).map((p) => (
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
