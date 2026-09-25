import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { campusDate, campusMinutes, DINING_HALLS } from "@superterp/campus-data";
import { Notice, Page, SkeletonCard } from "@/components/ui";
import { getAllDiningMenus } from "@/lib/campus";
import { DiningView } from "./DiningView";

export const metadata: Metadata = { title: "Dining" };

export default function DiningPage() {
  return (
    <Page title="Dining" subtitle="Campus">
      <Suspense fallback={<SkeletonCard rows={8} />}>
        <Menus />
      </Suspense>
      <Notice>
        Menus from UMD Dining (nutrition.umd.edu) and can change. Always check allergen labels at the station if you
        have an allergy. Tap an item for its full nutrition label.
      </Notice>
    </Page>
  );
}

async function Menus() {
  await connection();
  const today = campusDate();
  const results = await getAllDiningMenus(today);
  const halls = DINING_HALLS.map((h, i) => {
    const r = results[i]!;
    return { id: h.id, name: h.short, meals: r.ok ? r.data.meals : null };
  });
  return <DiningView halls={halls} initialMinutes={campusMinutes()} />;
}
