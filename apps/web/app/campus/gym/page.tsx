import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { campusDate, campusMinutes, recWellOnDate } from "@superterp/campus-data";
import { LiveStatus } from "@/components/LiveStatus";
import { Card, Notice, Page, Row, Section, SkeletonCard, SourceError } from "@/components/ui";
import { getRecWellAreas, safe } from "@/lib/campus";

export const metadata: Metadata = { title: "Gyms & Rec" };

export default function GymPage() {
  return (
    <Page title="Gyms & Rec" subtitle="Campus">
      <Suspense fallback={<SkeletonCard rows={6} />}>
        <GymList />
      </Suspense>
      <Notice>
        Hours from UMD RecWell. Closures can happen on short notice; check{" "}
        <a href="https://recwell.umd.edu/facility-alerts" target="_blank" rel="noreferrer">
          facility alerts
        </a>
        .
      </Notice>
    </Page>
  );
}

async function GymList() {
  await connection();
  const today = campusDate();
  const minutes = campusMinutes();
  const res = await safe(getRecWellAreas);
  if (!res.ok) return <SourceError source="RecWell" />;

  const areas = recWellOnDate(res.data, today);
  // Group by facility, keeping sheet order but putting Eppley first.
  const groups = new Map<string, typeof areas>();
  for (const a of areas) groups.set(a.group, [...(groups.get(a.group) ?? []), a]);
  const ordered = [...groups.entries()].sort(([a], [b]) => Number(b.startsWith("Eppley")) - Number(a.startsWith("Eppley")));

  return ordered.map(([group, items]) => (
    <Section key={group} title={group}>
      <Card>
        {items.map((a) => (
          <Row
            key={`${a.group}-${a.name}`}
            title={a.name === group ? "Building" : a.name}
            subtitle={<LiveStatus hours={a.hours} initialMinutes={minutes} inline />}
            trailing={a.hours.kind === "ranges" ? a.hours.label : undefined}
            href={a.url ?? undefined}
            external
          />
        ))}
      </Card>
    </Section>
  ));
}
