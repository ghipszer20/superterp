// Server-side data for the owner's review tool: the catalog cache (never committed;
// filled by packages/catalog/scripts/coverage.ts) and the committed sign-off file.
// Only /review and /api/review import this, behind reviewEnabled().

import { statSync } from "node:fs";
import path from "node:path";
import {
  HAND_ENCODED,
  buildDraftedReview,
  buildHandEncodedReview,
  indexEntry,
  parseProgramPage,
  readCatalogCache,
  readSignoffs,
  reviewId,
  type ReviewIndexEntry,
  type ReviewProgram,
} from "@superterp/catalog";

// `next dev` and `next start` run from apps/web.
const REPO = path.resolve(process.cwd(), "..", "..");

/** Override with SUPERTERP_CATALOG_CACHE. */
export const catalogCacheDir = () => process.env.SUPERTERP_CATALOG_CACHE ?? path.join(REPO, "packages", "catalog", ".cache", "catalog");
/** Override with SUPERTERP_SIGNOFFS. */
export const signoffsFile = () => process.env.SUPERTERP_SIGNOFFS ?? path.join(REPO, "packages", "catalog", "review", "signoffs.json");

type Loaded = { stamp: string; cache: ReturnType<typeof readCatalogCache>; programs: Map<string, ReviewProgram>; all: boolean };
let loaded: Loaded | null = null;

/** The cache, rebuilt when the cached program index changes (a re-scrape). */
function current(): Loaded {
  const dir = catalogCacheDir();
  let stamp = `${dir}:none`;
  try {
    stamp = `${dir}:${statSync(path.join(dir, "undergraduate_programs.html")).mtimeMs}`;
  } catch {}
  if (!loaded || loaded.stamp !== stamp) loaded = { stamp, cache: readCatalogCache(dir), programs: new Map(), all: false };
  return loaded;
}

function build(l: Loaded, id: string): ReviewProgram | undefined {
  const hit = l.programs.get(id);
  if (hit) return hit;
  let review: ReviewProgram | undefined;
  const hand = HAND_ENCODED.find((h) => h.id === id);
  if (hand) {
    const html = hand.catalogUrl ? l.cache.page(hand.catalogUrl) : null;
    review = buildHandEncodedReview(hand, html ? parseProgramPage(html) : null);
  } else {
    const link = l.cache.programs.find((p) => reviewId(p.url) === id);
    const html = link ? l.cache.page(link.url) : null;
    if (link && html) review = buildDraftedReview(link, parseProgramPage(html));
  }
  if (review) l.programs.set(id, review);
  return review;
}

const allIds = (l: Loaded) => [...HAND_ENCODED.map((h) => h.id), ...l.cache.programs.map((p) => reviewId(p.url))];

export function reviewProgram(id: string): ReviewProgram | undefined {
  return build(current(), id);
}

/** Every program (hand-encoded first, then the catalog index in order) with its sign-off status. */
export async function reviewIndex(): Promise<{ entries: ReviewIndexEntry[]; catalogCached: boolean }> {
  const l = current();
  const signoffs = await readSignoffs(signoffsFile());
  const entries = allIds(l).flatMap((id) => {
    const review = build(l, id);
    return review ? [indexEntry(review, signoffs[id])] : [];
  });
  return { entries, catalogCached: l.cache.programs.length > 0 };
}
