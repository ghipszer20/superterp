"use client";

// Loads the schedule builder's pre-built files (packages/course-data/SCHEDULE_FILES.md):
// the current term and course index once, each department's sections when one of its
// courses is picked, and each department's grades when the section panel needs them.
// Everything is kept for the session; the CDN caches the files for everyone else.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  decodeCourseIndex,
  decodeDepartmentSections,
  type CourseIndex,
  type DepartmentSections,
} from "@superterp/course-data/schedule-files";
import type { Section } from "@superterp/course-data/schedules";
import { decodeDepartment, type CourseGrades } from "@superterp/ratings";

export type IndexState = { status: "loading" } | { status: "missing" } | { status: "error" } | { status: "ready"; index: CourseIndex };

const deptOf = (courseId: string) => courseId.slice(0, 4);

async function getJson(url: string): Promise<unknown | null> {
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

export function useScheduleData(courseIds: string[]) {
  const [indexState, setIndexState] = useState<IndexState>({ status: "loading" });
  const [depts, setDepts] = useState<Record<string, DepartmentSections | "missing">>({});
  const [grades, setGrades] = useState<Record<string, Record<string, CourseGrades> | "missing">>({});
  const term = indexState.status === "ready" ? indexState.index.term : null;

  useEffect(() => {
    let live = true;
    (async () => {
      const current = (await getJson("/api/schedule/current")) as { term?: string } | null;
      if (!current?.term) return { status: "missing" } as const;
      const index = await getJson(`/api/schedule/${current.term}/index`);
      return index ? ({ status: "ready", index: decodeCourseIndex(index) } as const) : ({ status: "missing" } as const);
    })()
      .catch((err) => {
        console.warn(err);
        return { status: "error" } as const;
      })
      .then((s) => {
        if (live) setIndexState(s);
      });
    return () => {
      live = false;
    };
  }, []);

  const wanted = useMemo(() => [...new Set(courseIds.map(deptOf))].sort().join(","), [courseIds]);
  useEffect(() => {
    if (!term || !wanted) return;
    for (const dept of wanted.split(",")) {
      getJson(`/api/schedule/${term}/sections/${dept}`)
        .then((data) => (data ? decodeDepartmentSections(data) : ("missing" as const)))
        .catch((err) => {
          console.warn(err);
          return "missing" as const;
        })
        .then((d) => setDepts((prev) => (prev[dept] ? prev : { ...prev, [dept]: d })));
    }
  }, [term, wanted]);

  const loadGrades = useCallback(
    (courseId: string) => {
      const dept = deptOf(courseId);
      if (!term || grades[dept]) return;
      getJson(`/api/schedule/${term}/grades/${dept}`)
        .then((data) => (data ? decodeDepartment(data) : ("missing" as const)))
        .catch(() => "missing" as const)
        .then((g) => setGrades((prev) => (prev[dept] ? prev : { ...prev, [dept]: g })));
    },
    [term, grades],
  );

  const derived = useMemo(() => {
    const sections: Section[] = [];
    const ratings: Record<string, number> = {};
    const titles: Record<string, string> = {};
    let loaded = true;
    for (const dept of wanted ? wanted.split(",") : []) {
      const d = depts[dept];
      if (!d) {
        loaded = false;
        continue;
      }
      if (d === "missing") continue;
      Object.assign(ratings, d.ratings);
      for (const c of d.courses) titles[c.id] = c.title;
    }
    const chosen = new Set(courseIds);
    for (const dept of wanted ? wanted.split(",") : []) {
      const d = depts[dept];
      if (d && d !== "missing") for (const s of d.sections) if (chosen.has(s.courseId)) sections.push(s);
    }
    return { sections, ratings, titles, loaded };
  }, [depts, wanted, courseIds]);

  const gradesFor = useCallback(
    (courseId: string): Record<string, CourseGrades> | null | undefined => {
      const g = grades[deptOf(courseId)];
      return g === undefined ? undefined : g === "missing" ? null : g;
    },
    [grades],
  );

  return { indexState, term, ...derived, loadGrades, gradesFor };
}
