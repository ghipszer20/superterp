import type { ReviewStatus } from "@superterp/catalog";
import { STATUS_LABEL } from "./labels";
import styles from "./review.module.css";

export function StatusBadge({ status, short = false }: { status: ReviewStatus; short?: boolean }) {
  return (
    <span className={styles.badge} data-status={status}>
      {short && status === "changed" ? "Changed" : STATUS_LABEL[status]}
    </span>
  );
}
