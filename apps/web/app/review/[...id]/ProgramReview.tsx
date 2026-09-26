"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CatalogRow, ReviewItemView, ReviewProgram, ReviewRequirement, ReviewStatus, ReviewTable, Signoff } from "@superterp/catalog";
import { EmptyState } from "@/components/ui";
import { Segmented } from "@/components/Segmented";
import { ChevronIcon, ExternalIcon } from "@/components/icons";
import type { ClientUpdate } from "@/lib/review-guard";
import { KIND_LABEL, REASON_LABEL, formatDate, plural } from "../labels";
import { StatusBadge } from "../StatusBadge";
import styles from "../review.module.css";

/** Rows to highlight in one catalog table. */
type Target = { table: number; rows: number[]; key: string };
type Pane = "catalog" | "superterp";

const rowId = (table: number, row: number) => `catalog-t${table}-r${row}`;

export function ProgramReview({
  program,
  initialSignoff,
  initialStatus,
}: {
  program: ReviewProgram;
  initialSignoff: Signoff | null;
  initialStatus: ReviewStatus;
}) {
  const [signoff, setSignoff] = useState(initialSignoff);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | { error: string }>("idle");
  const [hover, setHover] = useState<Target | null>(null);
  const [pinned, setPinned] = useState<Target | null>(null);
  const [pane, setPane] = useState<Pane>("superterp");

  const active = hover ?? pinned;
  const allItems = useMemo(() => [...program.tables.flatMap((t) => t.items), ...(program.encoded?.items ?? [])], [program]);
  const resolved = allItems.filter((i) => signoff?.items[i.key]?.resolved).length;

  async function save(update: ClientUpdate) {
    setSaving("saving");
    try {
      const res = await fetch("/api/review/signoffs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: program.id, update }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setSignoff(body.signoff);
      setStatus(body.status);
      setSaving("saved");
    } catch (err) {
      setSaving({ error: err instanceof Error ? err.message : String(err) });
    }
  }

  /** Pin a highlight and bring its first row into view (on phones, switch to the catalog). */
  function show(target: Target) {
    const same = pinned?.key === target.key;
    setPinned(same ? null : target);
    if (same || target.rows.length === 0) return;
    setPane("catalog");
    requestAnimationFrame(() => document.getElementById(rowId(target.table, target.rows[0]!))?.scrollIntoView({ block: "center", behavior: "smooth" }));
  }

  const link = { active, onHover: setHover, onShow: show };

  return (
    <>
      <header className={styles.programHeader}>
        <Link href="/review" className={styles.back}>
          <ChevronIcon className={styles.backChevron} /> All programs
        </Link>
        <p className={styles.eyebrow}>
          {KIND_LABEL[program.kind]} · {program.source === "hand-encoded" ? "Hand-encoded" : "Drafted from the catalog"} · Catalog {program.catalogYear}
        </p>
        <h1 className={styles.programTitle}>{program.name}</h1>
        <div className={styles.metaRow}>
          <StatusBadge status={status} />
          {signoff?.verifiedAt ? <span>Verified {formatDate(signoff.verifiedAt)}</span> : null}
          {program.url ? (
            <a href={program.url} target="_blank" rel="noreferrer" className={styles.external}>
              Live catalog page <ExternalIcon size={14} />
            </a>
          ) : null}
        </div>
      </header>

      {status === "changed" ? (
        <p className={styles.banner} role="status">
          The catalog tables or SuperTerp&rsquo;s requirements changed since you verified this on {formatDate(signoff!.verifiedAt!)}. Compare them again,
          then verify.
        </p>
      ) : null}

      <SignoffBar
        signoff={signoff}
        status={status}
        resolved={resolved}
        total={allItems.length}
        saving={saving}
        onVerify={() => save({ action: "verify" })}
        onReopen={() => save({ action: "reopen" })}
        onNotes={(notes) => save({ action: "notes", notes })}
      />

      <div className={styles.paneSwitch}>
        <Segmented<Pane>
          label="Show"
          value={pane}
          onChange={setPane}
          options={[
            { value: "catalog", label: "Catalog" },
            { value: "superterp", label: "SuperTerp" },
          ]}
        />
      </div>

      <div className={styles.split} data-pane={pane}>
        <div className={`${styles.pane} ${styles.catalogPane}`} aria-label="Catalog requirement tables">
          <h2 className={styles.paneTitle}>Catalog</h2>
          {program.tables.length === 0 ? (
            <div className={styles.paneCard}>
              <EmptyState title={program.url ? "Catalog page not cached" : "No catalog requirement table"}>
                {program.url ? "Run the coverage script to cache it." : "These rules come from catalog prose, not a table."}
              </EmptyState>
            </div>
          ) : (
            program.tables.map((t, n) => <CatalogTable key={n} table={t} index={n} many={program.tables.length > 1} active={active} />)
          )}
        </div>

        <div className={`${styles.pane} ${styles.draftPane}`} aria-label="What SuperTerp checks">
          <h2 className={styles.paneTitle}>SuperTerp</h2>
          {program.encoded ? (
            <div className={styles.paneCard}>
              <Requirements requirements={program.encoded.requirements} table={-1} {...link} />
              <Items title="Review notes" items={program.encoded.items} table={-1} signoff={signoff} save={save} {...link} />
            </div>
          ) : (
            program.tables.map((t, n) => (
              <div className={styles.paneCard} key={n}>
                {program.tables.length > 1 ? <h3 className={styles.tableHeading}>{t.heading ?? `Table ${n + 1}`}</h3> : null}
                <Requirements requirements={t.requirements} table={n} {...link} />
                <Items title="Review items" items={t.items} table={n} signoff={signoff} save={save} {...link} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

function SignoffBar({
  signoff,
  status,
  resolved,
  total,
  saving,
  onVerify,
  onReopen,
  onNotes,
}: {
  signoff: Signoff | null;
  status: ReviewStatus;
  resolved: number;
  total: number;
  saving: "idle" | "saving" | "saved" | { error: string };
  onVerify: () => void;
  onReopen: () => void;
  onNotes: (notes: string) => void;
}) {
  const verified = status === "verified";
  return (
    <section className={styles.signoff} aria-label="Sign-off">
      <div className={styles.signoffMain}>
        <div className={styles.signoffCount}>
          <strong>
            {resolved} of {total}
          </strong>{" "}
          items resolved
          <div className={styles.progressBar}>
            <span style={{ width: `${total ? (100 * resolved) / total : 100}%` }} />
          </div>
        </div>
        <textarea
          key={signoff?.notes ?? ""}
          className={styles.notes}
          rows={2}
          placeholder="Notes on this program"
          aria-label="Notes on this program"
          defaultValue={signoff?.notes ?? ""}
          onBlur={(e) => {
            if (e.target.value !== (signoff?.notes ?? "")) onNotes(e.target.value);
          }}
        />
      </div>
      <div className={styles.signoffActions}>
        {verified ? (
          <button type="button" className={styles.secondaryButton} onClick={onReopen}>
            Reopen review
          </button>
        ) : (
          <button type="button" className={styles.primaryButton} onClick={onVerify} disabled={saving === "saving"}>
            Verified ✅
          </button>
        )}
        <span className={styles.saveState} aria-live="polite" data-error={typeof saving === "object" || undefined}>
          {saving === "saving"
            ? "Saving…"
            : saving === "saved"
              ? "Saved to signoffs.json"
              : typeof saving === "object"
                ? `Couldn't save: ${saving.error}`
                : verified
                  ? ""
                  : total - resolved > 0
                    ? `${plural(total - resolved, "item")} unresolved`
                    : "All items resolved"}
        </span>
      </div>
    </section>
  );
}

function CatalogTable({ table, index, many, active }: { table: ReviewTable; index: number; many: boolean; active: Target | null }) {
  const lit = active && active.table === index ? new Set(active.rows) : null;
  return (
    <section className={styles.paneCard}>
      {table.heading || many ? <h3 className={styles.tableHeading}>{table.heading ?? `Table ${index + 1}`}</h3> : null}
      <div className={styles.catalogRows} role="table" aria-label={table.heading ?? "Requirements"}>
        {table.rows.map((row, i) => (
          <CatalogRowView key={i} row={row} id={rowId(index, i)} lit={lit?.has(i) ?? false} />
        ))}
        {table.total ? (
          <div className={styles.totalRow} role="row">
            <span role="cell">Total credits</span>
            <span role="cell" className={styles.credits}>
              {table.total}
            </span>
          </div>
        ) : null}
      </div>
      {table.footnotes.length > 0 ? (
        <ol className={styles.footnotes} aria-label="Footnotes">
          {table.footnotes.map((f) => (
            <li key={f.marker}>
              <sup>{f.marker}</sup>
              <span>{f.text}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

const Markers = ({ markers }: { markers: string[] }) => (markers.length ? <sup className={styles.marker}>{markers.join(",")}</sup> : null);

function CatalogRowView({ row, id, lit }: { row: CatalogRow; id: string; lit: boolean }) {
  const common = { id, role: "row", "data-lit": lit || undefined } as const;
  if (row.kind === "header") {
    return (
      <div {...common} className={`${styles.catalogRow} ${styles.headerRow}`}>
        <span role="cell">
          {row.text}
          <Markers markers={row.footnotes} />
        </span>
      </div>
    );
  }
  if (row.kind === "text") {
    return (
      <div {...common} className={`${styles.catalogRow} ${styles.textRow}`}>
        <span role="cell">
          {row.text}
          <Markers markers={row.footnotes} />
        </span>
        <span role="cell" className={styles.credits}>
          {row.credits}
        </span>
      </div>
    );
  }
  return (
    <div {...common} className={styles.catalogRow} data-or={row.alternative || undefined}>
      <span role="cell" className={styles.code}>
        {row.alternative ? <span className={styles.or}>or </span> : null}
        {row.codes.join(" & ")}
      </span>
      <span role="cell" className={styles.courseTitle}>
        {row.title}
        <Markers markers={row.footnotes} />
      </span>
      <span role="cell" className={styles.credits}>
        {row.credits}
      </span>
    </div>
  );
}

type LinkProps = { table: number; active: Target | null; onHover: (t: Target | null) => void; onShow: (t: Target) => void };

function Requirements({ requirements, table, active, onHover, onShow }: LinkProps & { requirements: ReviewRequirement[] }) {
  if (requirements.length === 0) return <p className={styles.none}>Nothing drafted from this table.</p>;
  return (
    <>
      <h4 className={styles.groupTitle}>Requirements · {requirements.length}</h4>
      <ul className={styles.requirements}>
        {requirements.map((r) => {
          const target = { table, rows: r.rows, key: `req:${table}:${r.id}` };
          const linked = r.rows.length > 0;
          const body = (
            <>
              <span className={styles.reqText}>{r.text}</span>
              {r.details.length ? (
                <ul className={styles.details}>
                  {r.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              ) : null}
              <span className={styles.reqName}>
                {r.name}
                {r.notes.map((n) => (
                  <span key={n} className={styles.tag}>
                    {n}
                  </span>
                ))}
              </span>
            </>
          );
          return (
            <li key={r.id} data-active={active?.key === target.key || undefined}>
              {linked ? (
                <button
                  type="button"
                  className={styles.requirement}
                  onMouseEnter={() => onHover(target)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(target)}
                  onBlur={() => onHover(null)}
                  onClick={() => onShow(target)}
                  aria-pressed={active?.key === target.key}
                >
                  {body}
                </button>
              ) : (
                <div className={styles.requirement}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Items({
  title,
  items,
  table,
  signoff,
  save,
  active,
  onHover,
  onShow,
}: LinkProps & { title: string; items: ReviewItemView[]; signoff: Signoff | null; save: (u: ClientUpdate) => void }) {
  if (items.length === 0) return null;
  return (
    <>
      <h4 className={styles.groupTitle}>
        {title} · {items.length}
      </h4>
      <ul className={styles.items}>
        {items.map((item) => {
          const target = { table, rows: item.rows, key: `item:${table}:${item.key}` };
          const state = signoff?.items[item.key];
          return (
            <li
              key={item.key}
              className={styles.item}
              data-resolved={state?.resolved || undefined}
              data-active={active?.key === target.key || undefined}
              onMouseEnter={item.rows.length ? () => onHover(target) : undefined}
              onMouseLeave={item.rows.length ? () => onHover(null) : undefined}
            >
              <div className={styles.itemHead}>
                <span className={styles.confidence} data-confidence={item.confidence}>
                  {item.confidence === "manual" ? "Manual" : "Check"}
                </span>
                <span className={styles.reason}>{REASON_LABEL[item.reason] ?? item.reason}</span>
                {item.rows.length ? (
                  <button type="button" className={styles.showRows} onClick={() => onShow(target)} aria-pressed={active?.key === target.key}>
                    {plural(item.rows.length, "row")}
                  </button>
                ) : null}
              </div>
              <p className={styles.itemText}>{item.text}</p>
              <div className={styles.itemActions}>
                <label className={styles.resolve}>
                  <input type="checkbox" checked={state?.resolved ?? false} onChange={(e) => save({ action: "item", key: item.key, resolved: e.target.checked })} />
                  Resolved
                </label>
                <input
                  key={state?.note ?? ""}
                  className={styles.itemNote}
                  placeholder="Add a note"
                  aria-label="Note on this item"
                  defaultValue={state?.note ?? ""}
                  onBlur={(e) => {
                    if (e.target.value !== (state?.note ?? "")) save({ action: "item", key: item.key, note: e.target.value });
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
