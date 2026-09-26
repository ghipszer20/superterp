"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ReviewIndexEntry, ReviewStatus } from "@superterp/catalog";
import { Card, EmptyState, Notice } from "@/components/ui";
import { Segmented } from "@/components/Segmented";
import { KIND_LABEL, STATUS_LABEL, formatDate, plural } from "./labels";
import { StatusBadge } from "./StatusBadge";
import styles from "./review.module.css";

type Filter = "all" | ReviewStatus;
const FILTERS: Filter[] = ["all", "not-started", "in-review", "verified", "changed"];

export function ReviewIndexView({ entries, catalogCached }: { entries: ReviewIndexEntry[]; catalogCached: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: entries.length, "not-started": 0, "in-review": 0, verified: 0, changed: 0 };
    for (const e of entries) c[e.status]++;
    return c;
  }, [entries]);

  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return entries.filter((e) => (filter === "all" || e.status === filter) && words.every((w) => e.name.toLowerCase().includes(w)));
  }, [entries, filter, query]);

  const hand = shown.filter((e) => e.source === "hand-encoded");
  const drafted = shown.filter((e) => e.source === "draft");

  return (
    <>
      <div className={styles.progress} aria-label="Sign-off progress">
        <div className={styles.progressText}>
          <strong>{counts.verified}</strong> of {entries.length} programs verified
          {counts.changed ? <span className={styles.progressWarn}> · {counts.changed} changed since verified</span> : null}
        </div>
        <div className={styles.progressBar}>
          <span style={{ width: `${entries.length ? (100 * counts.verified) / entries.length : 0}%` }} />
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="search"
          className={styles.search}
          placeholder="Search programs"
          aria-label="Search programs by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Segmented
          label="Sign-off status"
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((f) => ({ value: f, label: `${f === "all" ? "All" : f === "changed" ? "Changed" : STATUS_LABEL[f]} ${counts[f]}` }))}
        />
      </div>

      {!catalogCached ? (
        <Notice>
          The catalog cache is missing, so only hand-encoded programs are listed. Fill it with{" "}
          <code>node scripts/coverage.ts</code> in packages/catalog.
        </Notice>
      ) : null}

      {shown.length === 0 ? (
        <Card>
          <EmptyState title="No programs match">Try another name or status.</EmptyState>
        </Card>
      ) : null}
      <ProgramList title="Hand-encoded" note="Encoded by hand in packages/audit/programs" entries={hand} />
      <ProgramList title="Drafted from the catalog" entries={drafted} />
    </>
  );
}

function ProgramList({ title, note, entries }: { title: string; note?: string; entries: ReviewIndexEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <section className={styles.listSection}>
      <div className={styles.listHead}>
        <h2 className={styles.listTitle}>{title}</h2>
        <span className={styles.listCount}>
          {note ? <span className={styles.listNote}>{note} · </span> : null}
          {entries.length}
        </span>
      </div>
      <Card>
        <ul className={styles.programList}>
          {entries.map((e) => (
            <li key={e.id}>
              <Link href={`/review/${e.id}`} className={styles.programRow}>
                <span className={styles.programName}>
                  {e.name}
                  <span className={styles.programMeta}>
                    {KIND_LABEL[e.kind]} · {e.source === "hand-encoded" ? `${plural(e.stats.check, "review note")}` : plural(e.stats.tables, "table")}
                    {e.verifiedAt ? ` · verified ${formatDate(e.verifiedAt)}` : ""}
                  </span>
                </span>
                {e.source === "draft" ? (
                  <span className={styles.programStats}>
                    <Stat n={e.stats.converted} label="rows drafted" />
                    <Stat n={e.stats.review} label="rows to review" />
                    <Stat n={e.stats.check} label="check" tone="check" />
                    <Stat n={e.stats.manual} label="manual" tone="manual" />
                  </span>
                ) : (
                  <span className={styles.programStats}>
                    <span className={styles.handTag}>Hand-encoded</span>
                  </span>
                )}
                <StatusBadge status={e.status} short />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

function Stat({ n, label, tone }: { n: number; label: string; tone?: "check" | "manual" }) {
  return (
    <span className={styles.stat} data-tone={n > 0 ? tone : undefined}>
      <b>{n}</b> {label}
    </span>
  );
}
