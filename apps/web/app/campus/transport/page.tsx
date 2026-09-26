import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { campusDate, campusMinutes } from "@superterp/campus-data";
import { Notice, Page, SkeletonCard, SourceError } from "@/components/ui";
import { getBusStops, getRoutesOn, safe } from "@/lib/campus";
import { BusBoard } from "./BusBoard";

export const metadata: Metadata = { title: "Transport" };

export default function TransportPage() {
  return (
    <Page title="Transport" subtitle="Shuttle-UM">
      <Suspense fallback={<SkeletonCard rows={6} />}>
        <Board />
      </Suspense>
      <Notice>
        Times are from the published Shuttle-UM schedule, not live GPS. For live bus locations, use{" "}
        <a href="https://transitapp.com" target="_blank" rel="noreferrer">
          Transit
        </a>
        , UMD&apos;s official shuttle app.
      </Notice>
    </Page>
  );
}

async function Board() {
  await connection();
  const today = campusDate();
  const [stops, routes] = await Promise.all([safe(() => getBusStops(today)), safe(() => getRoutesOn(today))]);
  if (!stops.ok || !routes.ok) return <SourceError source="Shuttle-UM" />;
  return (
    <BusBoard
      stops={stops.data.map(({ id, name, lat, lon }) => ({ id, name, lat, lon }))}
      routes={routes.data.routes}
      initialMinutes={campusMinutes()}
    />
  );
}
