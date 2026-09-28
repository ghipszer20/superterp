import type { Section } from "@superterp/course-data/schedules";
import { courseColor } from "@/lib/schedule/colors";
import { bestRating, instructorLabel } from "@/lib/schedule/sections";
import { RatingBadge } from "./RatingBadge";
import cal from "./calendar.module.css";
import styles from "./builder.module.css";

/**
 * Teacher info, option B (owner): under each calendar, one row per course, color-matched
 * to its blocks: swatch, course, professor, PlanetTerp rating.
 */
export function TeacherStrip({
  picks,
  groups,
  courseIds,
  ratings,
  size = "mini",
}: {
  picks: Section[];
  groups?: Section[][];
  courseIds: string[];
  ratings: Readonly<Record<string, number>>;
  size?: "mini" | "zoom" | "large";
}) {
  return (
    <ul className={styles.strip} data-size={size}>
      {picks.map((s, k) => (
        <li key={s.courseId} className={cal.course} data-color={courseColor(courseIds, s.courseId)}>
          <span className={styles.swatch} />
          <b>{s.courseId}</b>
          <span className={styles.stripWho}>{instructorLabel(s, groups?.[k])}</span>
          <RatingBadge rating={bestRating(s, ratings)} />
        </li>
      ))}
    </ul>
  );
}
