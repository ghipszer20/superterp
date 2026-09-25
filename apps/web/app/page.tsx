import { Suspense } from "react";
import { connection } from "next/server";
import { campusDate, campusMinutes, DINING_HALLS, recWellOnDate } from "@superterp/campus-data";
import { BusIcon, DiningIcon, GymIcon, LibraryIcon, RoomIcon } from "@/components/icons";
import { LiveStatus } from "@/components/LiveStatus";
import { Card, IconTile, Page, Row, Section, SkeletonCard } from "@/components/ui";
import { getAllDiningMenus, getLibraryHours, getRecWellAreas, getRoutesOn, safe } from "@/lib/campus";
import { currentMealName, mealHighlights } from "@/lib/status";

export default function TodayPage() {
  return (
    <Suspense fallback={<TodaySkeleton />}>
      <Today />
    </Suspense>
  );
}

function TodaySkeleton() {
  return (
    <Page title="Today">
      <SkeletonCard rows={3} />
      <Section>
        <SkeletonCard rows={4} />
      </Section>
    </Page>
  );
}

async function Today() {
  await connection();
  const now = new Date();
  const today = campusDate(now);
  const minutes = campusMinutes(now);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return (
    <Page title="Today" subtitle={dateLabel}>
      <Section title="Eat">
        <Suspense fallback={<SkeletonCard rows={3} />}>
          <Dining today={today} minutes={minutes} />
        </Suspense>
      </Section>
      <Section title="Study">
        <Suspense fallback={<SkeletonCard rows={3} />}>
          <Libraries today={today} minutes={minutes} />
        </Suspense>
      </Section>
      <Section title="Work out">
        <Suspense fallback={<SkeletonCard rows={2} />}>
          <Gyms today={today} minutes={minutes} />
        </Suspense>
      </Section>
      <Section title="Get around">
        <Suspense fallback={<SkeletonCard rows={1} />}>
          <Buses today={today} />
        </Suspense>
      </Section>
    </Page>
  );
}

async function Dining({ today, minutes }: { today: string; minutes: number }) {
  const menus = await getAllDiningMenus(today);
  const meal = currentMealName(minutes);
  return (
    <Card>
      {DINING_HALLS.map((hall, i) => {
        const r = menus[i]!;
        const m = r.ok ? (r.data.meals.find((x) => x.name === meal) ?? r.data.meals[0]) : undefined;
        return (
          <Row
            key={hall.id}
            href="/campus/dining"
            leading={
              <IconTile>
                <DiningIcon />
              </IconTile>
            }
            title={hall.short}
            subtitle={!r.ok ? "Menu unavailable" : m ? `${m.name}: ${mealHighlights(m)}` : "No menu posted today"}
          />
        );
      })}
    </Card>
  );
}

async function Libraries({ today, minutes }: { today: string; minutes: number }) {
  const res = await safe(getLibraryHours);
  const libs = res.ok ? res.data.filter((l) => l.kind === "library").slice(0, 3) : [];
  return (
    <Card>
      {libs.map((lib) => (
        <Row
          key={lib.id}
          href="/campus/libraries"
          leading={
            <IconTile tone="neutral">
              <LibraryIcon />
            </IconTile>
          }
          title={lib.name}
          subtitle={<LiveStatus hours={lib.days[today]} initialMinutes={minutes} inline />}
        />
      ))}
      <Row
        href="/campus/rooms"
        leading={
          <IconTile>
            <RoomIcon />
          </IconTile>
        }
        title="Find a study room"
        subtitle="Open rooms at every library, right now"
      />
    </Card>
  );
}

async function Gyms({ today, minutes }: { today: string; minutes: number }) {
  const res = await safe(getRecWellAreas);
  // The building-level row for each facility (its name matches its group).
  const buildings = res.ok
    ? recWellOnDate(res.data, today)
        .filter((a) => a.name === a.group)
        .slice(0, 3)
    : [];
  return (
    <Card>
      {buildings.length === 0 ? (
        <Row href="/campus/gym" title="Gyms & Rec" subtitle="See today's hours" />
      ) : (
        buildings.map((b) => (
          <Row
            key={b.group}
            href="/campus/gym"
            leading={
              <IconTile tone="neutral">
                <GymIcon />
              </IconTile>
            }
            title={b.name}
            subtitle={<LiveStatus hours={b.hours} initialMinutes={minutes} inline />}
          />
        ))
      )}
    </Card>
  );
}

async function Buses({ today }: { today: string }) {
  const res = await safe(() => getRoutesOn(today));
  const count = res.ok ? res.data.routes.length : null;
  return (
    <Card>
      <Row
        href="/campus/buses"
        leading={
          <IconTile>
            <BusIcon />
          </IconTile>
        }
        title="Shuttle-UM"
        subtitle={count === null ? "Departures near you" : `${count} routes running today · departures near you`}
      />
    </Card>
  );
}
