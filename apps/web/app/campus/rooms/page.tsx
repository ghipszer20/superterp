import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { campusDate, campusMinutes } from "@superterp/campus-data";
import { Notice, Page, SkeletonCard, SourceError } from "@/components/ui";
import { getRoomAvailability, getRoomCatalog, safe } from "@/lib/campus";
import { RoomsView, type RoomRow } from "./RoomsView";

export const metadata: Metadata = { title: "Study Rooms" };

// Not study space for students: equipment loans and faculty-only offices.
const EXCLUDED_CATEGORY = /equipment|faculty/i;

export default function RoomsPage() {
  return (
    <Page title="Study Rooms" subtitle="Libraries">
      <Suspense fallback={<SkeletonCard rows={8} />}>
        <Rooms />
      </Suspense>
      <Notice>
        Availability from UMD Libraries&apos; booking system, refreshed every few minutes. You book on the Libraries&apos;
        site with your UMD email; SuperTerp never books for you.
      </Notice>
    </Page>
  );
}

async function Rooms() {
  await connection();
  const today = campusDate();
  const catalog = await safe(getRoomCatalog);
  if (!catalog.ok) return <SourceError source="UMD Libraries" />;

  const { locations, rooms } = catalog.data;
  const categories = [
    ...new Map(
      rooms
        .filter((r) => !EXCLUDED_CATEGORY.test(r.categoryName))
        .map((r) => [r.categoryId, { locationId: r.locationId, categoryId: r.categoryId }]),
    ).values(),
  ];
  const results = await Promise.all(
    categories.map((c) => safe(() => getRoomAvailability(c.locationId, c.categoryId, today))),
  );

  const rows: RoomRow[] = results.flatMap((r) =>
    r.ok
      ? r.data.map((room) => ({
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          library: locations.find((l) => l.id === room.locationId)?.name ?? "",
          locationId: room.locationId,
          category: room.categoryName,
          bookingUrl: room.bookingUrl,
          open: room.open,
        }))
      : [],
  );
  const failed = results.filter((r) => !r.ok).length;

  return (
    <RoomsView
      rooms={rows}
      libraries={locations.map((l) => ({ id: l.id, name: shortLibraryName(l.name) }))}
      today={today}
      initialMinutes={campusMinutes()}
      partial={failed > 0}
    />
  );
}

function shortLibraryName(name: string) {
  return name
    .replace(/\s+in\s+.*$/i, "")
    .replace(/^Michelle Smith\s+/i, "")
    .replace(/\s+Library$/i, "");
}
