import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { campusDate, campusMinutes } from "@superterp/campus-data";
import { LiveStatus } from "@/components/LiveStatus";
import { Card, Notice, Page, Row, Section, SkeletonCard, SourceError } from "@/components/ui";
import { getLibraryHours, safe } from "@/lib/campus";

export const metadata: Metadata = { title: "Libraries" };

export default function LibrariesPage() {
  return (
    <Page title="Libraries" subtitle="Campus">
      <Suspense fallback={<SkeletonCard rows={6} />}>
        <LibraryList />
      </Suspense>
      <Notice>
        Hours from UMD Libraries. Need a room? <Link href="/campus/rooms">Find an open study room</Link>.
      </Notice>
    </Page>
  );
}

async function LibraryList() {
  await connection();
  const today = campusDate();
  const minutes = campusMinutes();
  const res = await safe(getLibraryHours);
  if (!res.ok) return <SourceError source="UMD Libraries" />;

  const groups = [
    { title: "Libraries", items: res.data.filter((l) => l.kind === "library") },
    { title: "Collections & spaces", items: res.data.filter((l) => l.kind === "department") },
  ];

  return groups.map((g) =>
    g.items.length === 0 ? null : (
      <Section key={g.title} title={g.title}>
        <Card>
          {g.items.map((lib) => (
            <Row
              key={lib.id}
              title={lib.name}
              subtitle={<LiveStatus hours={lib.days[today]} initialMinutes={minutes} inline />}
              trailing={lib.days[today]?.kind === "ranges" ? lib.days[today].label : undefined}
              href={lib.url}
              external
            />
          ))}
        </Card>
      </Section>
    ),
  );
}
