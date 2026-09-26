import { ratingTone } from "@/lib/schedule/sections";
import styles from "./builder.module.css";

/** PlanetTerp average rating, colored by tone; "–" when unrated. */
export function RatingBadge({ rating }: { rating: number | undefined }) {
  return (
    <span
      className={styles.rating}
      data-tone={ratingTone(rating)}
      title={rating === undefined ? "No PlanetTerp rating" : `PlanetTerp rating ${rating.toFixed(1)} of 5`}
    >
      {rating === undefined ? "–" : rating.toFixed(1)}
    </span>
  );
}
