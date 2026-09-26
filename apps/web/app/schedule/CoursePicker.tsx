"use client";

import { useId, useMemo, useState } from "react";
import type { IndexedCourse } from "@superterp/course-data/schedule-files";
import { courseColor } from "@/lib/schedule/colors";
import { searchCourses } from "@/lib/schedule/search";
import cal from "./calendar.module.css";
import styles from "./builder.module.css";

/** Search courses by code or title; picked courses become removable chips in their block color. */
export function CoursePicker({
  courses,
  picked,
  titles,
  onChange,
}: {
  courses: readonly IndexedCourse[];
  picked: string[];
  titles: Record<string, string>;
  onChange: (courses: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const results = useMemo(
    () => searchCourses(courses, query, 12).filter((c) => !picked.includes(c.id)).slice(0, 8),
    [courses, query, picked],
  );
  const titleOf = useMemo(() => new Map(courses.map((c) => [c.id, c.title])), [courses]);

  const add = (id: string) => {
    onChange([...picked, id]);
    setQuery("");
    setActive(0);
  };

  return (
    <div className={styles.picker}>
      <div className={styles.searchWrap}>
        <input
          className={styles.search}
          type="search"
          placeholder="Add a course: code or title (e.g. CMSC351, calculus)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
            else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
            else if (e.key === "Enter" && results[active]) add(results[active].id);
            else if (e.key === "Escape") setQuery("");
            else return;
            e.preventDefault();
          }}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search courses"
        />
        {results.length > 0 ? (
          <ul className={styles.results} id={listId} role="listbox">
            {results.map((c, i) => (
              <li key={c.id} role="option" aria-selected={i === active}>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(c.id)}>
                  <b>{c.id}</b>
                  <span>{c.title}</span>
                  <small>
                    {c.credits.min === c.credits.max ? c.credits.min : `${c.credits.min}–${c.credits.max}`} cr ·{" "}
                    {c.sections} {c.sections === 1 ? "section" : "sections"}
                  </small>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {picked.length ? (
        <ul className={styles.chips} aria-label="Your courses">
          {picked.map((id) => (
            <li key={id} className={`${styles.courseChip} ${cal.course}`} data-color={courseColor(picked, id)}>
              <span className={styles.chipSwatch} />
              <b>{id}</b>
              <span className={styles.chipTitle}>{titles[id] ?? titleOf.get(id) ?? ""}</span>
              <button
                type="button"
                aria-label={`Remove ${id}`}
                onClick={() => onChange(picked.filter((c) => c !== id))}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
