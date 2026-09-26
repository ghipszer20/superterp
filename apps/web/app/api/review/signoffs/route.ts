import { connection } from "next/server";
import { campusDate } from "@superterp/campus-data";
import { reviewStatus, updateSignoffs, type SignoffUpdate } from "@superterp/catalog";
import { parseSignoffRequest, reviewEnabled, sameOrigin } from "@/lib/review-guard";
import { reviewProgram, signoffsFile } from "@/lib/review";

// POST /api/review/signoffs { id, update } → { signoff, status }
// Owner-only (proxy.ts, and again here): writes packages/catalog/review/signoffs.json,
// which the owner commits. The date and hashes come from the server, never the page.

// One write at a time, so quick successive saves don't lose each other.
let queue: Promise<unknown> = Promise.resolve();

export async function POST(request: Request) {
  await connection();
  if (!reviewEnabled()) return new Response(null, { status: 404 });
  if (!sameOrigin(request.headers)) return Response.json({ error: "Cross-origin request" }, { status: 403 });
  const parsed = parseSignoffRequest(await request.json().catch(() => null));
  if (!parsed) return Response.json({ error: "Malformed sign-off request" }, { status: 400 });
  const program = reviewProgram(parsed.id);
  if (!program) return Response.json({ error: `No program ${parsed.id}` }, { status: 404 });

  const update: SignoffUpdate = parsed.update.action === "verify" ? { action: "verify", date: campusDate() } : parsed.update;
  const now = { catalogYear: program.catalogYear, catalogHash: program.catalogHash, requirementsHash: program.requirementsHash };
  const write = queue.then(() => updateSignoffs(signoffsFile(), program.id, update, now));
  queue = write.catch(() => undefined);
  try {
    const signoff = await write;
    return Response.json({ signoff, status: reviewStatus(signoff, program) });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Couldn't write the sign-off file" }, { status: 500 });
  }
}
