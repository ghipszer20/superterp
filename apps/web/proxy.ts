// The owner's review tool is never shipped to students. Outside `next dev` (or a
// local build started with SUPERTERP_REVIEW=1), /review and /api/review answer
// with the app's ordinary 404 page, before any of their code runs.

import { NextResponse, type NextRequest } from "next/server";
import { reviewEnabled } from "./lib/review-guard";

export function proxy(request: NextRequest) {
  if (reviewEnabled()) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/")) return new NextResponse(null, { status: 404 });
  return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
}

export const config = {
  matcher: ["/review", "/review/:path*", "/api/review/:path*"],
};
