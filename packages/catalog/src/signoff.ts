// Owner sign-offs (PROJECT_MEMORY.md section 6, steps 5 and 6). The owner reviews
// each program in the review tool and marks it verified; sign-offs live in a
// committed JSON file (review/signoffs.json), program id -> Signoff.
//
// Each sign-off records hashes of what the owner saw: the catalog's requirement
// tables (parsed, so markup and navigation changes don't count) and the drafted
// or hand-encoded requirements. When next year's scrape or an encoding change
// makes either differ, the program is "changed since verified".

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import type { CourseList } from "./program.ts";

export type ItemReview = { resolved: boolean; note: string };

export type Signoff = {
  status: "in-review" | "verified";
  /** YYYY-MM-DD the owner signed off; null until verified. */
  verifiedAt: string | null;
  catalogYear: string;
  /** Hash of the catalog's requirement tables; null for a program with no catalog page (Gen Ed). */
  catalogHash: string | null;
  /** Hash of the drafted or hand-encoded requirements. */
  requirementsHash: string;
  notes: string;
  /** Review item key (itemKey) -> the owner's resolution. */
  items: Record<string, ItemReview>;
};

export type Signoffs = Record<string, Signoff>;

export type ReviewStatus = "not-started" | "in-review" | "verified" | "changed";

/** What the program looks like now, to compare against (and record in) a sign-off. */
export type CurrentState = { catalogYear: string; catalogHash: string | null; requirementsHash: string };

export type SignoffUpdate =
  | { action: "item"; key: string; resolved?: boolean; note?: string }
  | { action: "notes"; notes: string }
  | { action: "verify"; date: string }
  | { action: "reopen" };

/** JSON with object keys sorted at every level. */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, canonical((value as Record<string, unknown>)[k])]),
    );
  }
  return value;
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

/** A short hash of any JSON value, independent of key order. */
export const contentHash = (value: unknown): string => sha(JSON.stringify(canonical(value))).slice(0, 16);

/** Hash of a page's requirement tables: headings, rows, totals and footnotes. */
export const catalogHash = (lists: CourseList[]): string => contentHash(lists);

/** A review item's key: stable while its reason and text stay the same. */
export const itemKey = (item: { reason: string; text: string }): string => `${item.reason}-${sha(item.text).slice(0, 8)}`;

export function reviewStatus(signoff: Signoff | undefined, now: Pick<CurrentState, "catalogHash" | "requirementsHash">): ReviewStatus {
  if (!signoff) return "not-started";
  if (signoff.status !== "verified") return "in-review";
  const same = signoff.catalogHash === now.catalogHash && signoff.requirementsHash === now.requirementsHash;
  return same ? "verified" : "changed";
}

/** The file with one program's sign-off updated; other programs are untouched. */
export function applyUpdate(file: Signoffs, id: string, update: SignoffUpdate, now: CurrentState): Signoffs {
  const base: Signoff = file[id] ?? { status: "in-review", verifiedAt: null, ...now, notes: "", items: {} };
  let next: Signoff;
  switch (update.action) {
    case "item": {
      const old = base.items[update.key] ?? { resolved: false, note: "" };
      const item = { resolved: update.resolved ?? old.resolved, note: update.note ?? old.note };
      const items = { ...base.items };
      if (item.resolved || item.note) items[update.key] = item;
      else delete items[update.key];
      next = { ...base, items };
      break;
    }
    case "notes":
      next = { ...base, notes: update.notes };
      break;
    case "verify":
      next = { ...base, ...now, status: "verified", verifiedAt: update.date };
      break;
    case "reopen":
      next = { ...base, status: "in-review", verifiedAt: null };
      break;
  }
  return { ...file, [id]: next };
}

export function parseSignoffs(json: string): Signoffs {
  if (!json.trim()) return {};
  const parsed: unknown = JSON.parse(json);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("signoffs file must hold a JSON object");
  return parsed as Signoffs;
}

/** Sorted keys and a trailing newline, so git diffs stay small. */
export const serializeSignoffs = (file: Signoffs): string => `${JSON.stringify(canonical(file), null, 2)}\n`;

export async function readSignoffs(path: string): Promise<Signoffs> {
  try {
    return parseSignoffs(await readFile(path, "utf8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

/** Read-modify-write of one program's sign-off; returns it as saved. */
export async function updateSignoffs(path: string, id: string, update: SignoffUpdate, now: CurrentState): Promise<Signoff> {
  const next = applyUpdate(await readSignoffs(path), id, update, now);
  await writeFile(path, serializeSignoffs(next));
  return next[id]!;
}
