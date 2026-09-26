// Guards for the owner's review tool (/review, /api/review). It is never shipped to
// students: proxy.ts answers 404 for those paths unless reviewEnabled, and the
// pages and API route check again. Kept free of Node APIs so proxy.ts can import it.

import type { SignoffUpdate } from "@superterp/catalog";

type Env = { NODE_ENV?: string; SUPERTERP_REVIEW?: string };

/** On in `next dev`; in a production build only with SUPERTERP_REVIEW=1 (for checking a local `next start`). */
export function reviewEnabled(env: Env = process.env): boolean {
  return env.NODE_ENV === "development" || env.SUPERTERP_REVIEW === "1";
}

/** A write must come from the review page itself: its Origin names the same host. */
export function sameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  const host = headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** What the page may ask for; the server adds the date to "verify" and takes the hashes from the catalog. */
export type ClientUpdate = Exclude<SignoffUpdate, { action: "verify" }> | { action: "verify" };

const MAX_TEXT = 20_000;
const isText = (v: unknown) => typeof v === "string" && v.length <= MAX_TEXT;
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function parseUpdate(u: unknown): ClientUpdate | null {
  if (!isRecord(u)) return null;
  switch (u.action) {
    case "item": {
      if (typeof u.key !== "string" || !u.key || u.key.length > 200) return null;
      if (u.resolved !== undefined && typeof u.resolved !== "boolean") return null;
      if (u.note !== undefined && !isText(u.note)) return null;
      return {
        action: "item",
        key: u.key,
        ...(u.resolved !== undefined ? { resolved: u.resolved as boolean } : {}),
        ...(u.note !== undefined ? { note: u.note as string } : {}),
      };
    }
    case "notes":
      return isText(u.notes) ? { action: "notes", notes: u.notes as string } : null;
    case "verify":
      return { action: "verify" };
    case "reopen":
      return { action: "reopen" };
    default:
      return null;
  }
}

/** The API route's request body, validated; null if malformed. */
export function parseSignoffRequest(body: unknown): { id: string; update: ClientUpdate } | null {
  if (!isRecord(body) || typeof body.id !== "string" || !body.id || body.id.length > 300) return null;
  const update = parseUpdate(body.update);
  return update ? { id: body.id, update } : null;
}
