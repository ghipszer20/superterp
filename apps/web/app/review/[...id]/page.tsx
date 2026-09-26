import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { readSignoffs, reviewStatus } from "@superterp/catalog";
import { SkeletonCard } from "@/components/ui";
import { reviewEnabled } from "@/lib/review-guard";
import { reviewProgram, signoffsFile } from "@/lib/review";
import { ProgramReview } from "./ProgramReview";
import styles from "../review.module.css";

// The root Nav reads usePathname(), which is runtime data under this catch-all
// route; an internal tool may block on it rather than change the shared Nav.
export const instant = false;

export default function ProgramReviewPage({ params }: PageProps<"/review/[...id]">) {
  return (
    <main className={`${styles.page} ${styles.wide}`}>
      <Suspense fallback={<SkeletonCard rows={12} />}>
        <Program params={params} />
      </Suspense>
    </main>
  );
}

async function Program({ params }: { params: PageProps<"/review/[...id]">["params"] }) {
  await connection();
  if (!reviewEnabled()) notFound();
  const { id } = await params;
  const program = reviewProgram(id.map(decodeURIComponent).join("/"));
  if (!program) notFound();
  const signoff = (await readSignoffs(signoffsFile()))[program.id] ?? null;
  return <ProgramReview program={program} initialSignoff={signoff} initialStatus={reviewStatus(signoff ?? undefined, program)} />;
}
