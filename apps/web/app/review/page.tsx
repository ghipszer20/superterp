import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { SkeletonCard } from "@/components/ui";
import { reviewEnabled } from "@/lib/review-guard";
import { reviewIndex } from "@/lib/review";
import { ReviewIndexView } from "./ReviewIndexView";
import styles from "./review.module.css";

export default function ReviewPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Owner tool</p>
        <h1 className={styles.title}>Program review</h1>
        <p className={styles.lede}>
          Check each program against the catalog, resolve its review items, then sign it off. Only verified programs ship.
        </p>
      </header>
      <Suspense fallback={<SkeletonCard rows={10} />}>
        <Index />
      </Suspense>
    </main>
  );
}

async function Index() {
  await connection();
  if (!reviewEnabled()) notFound();
  const { entries, catalogCached } = await reviewIndex();
  return <ReviewIndexView entries={entries} catalogCached={catalogCached} />;
}
