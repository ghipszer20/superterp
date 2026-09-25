import type { Metadata } from "next";
import { BusIcon, DiningIcon, GymIcon, LibraryIcon, RoomIcon } from "@/components/icons";
import { Card, IconTile, Page, Row, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Campus" };

const PLACES = [
  { href: "/campus/dining", title: "Dining", subtitle: "Today's menus at all three dining halls", Icon: DiningIcon },
  { href: "/campus/buses", title: "Buses", subtitle: "Shuttle-UM departures near you", Icon: BusIcon },
  { href: "/campus/rooms", title: "Study Rooms", subtitle: "Open rooms at every library", Icon: RoomIcon },
  { href: "/campus/libraries", title: "Libraries", subtitle: "Hours for every library", Icon: LibraryIcon },
  { href: "/campus/gym", title: "Gyms & Rec", subtitle: "Eppley, Ritchie, pools, climbing and more", Icon: GymIcon },
];

export default function CampusPage() {
  return (
    <Page title="Campus">
      <Section>
        <Card>
          {PLACES.map(({ href, title, subtitle, Icon }) => (
            <Row
              key={href}
              href={href}
              title={title}
              subtitle={subtitle}
              leading={
                <IconTile>
                  <Icon />
                </IconTile>
              }
            />
          ))}
        </Card>
      </Section>
    </Page>
  );
}
