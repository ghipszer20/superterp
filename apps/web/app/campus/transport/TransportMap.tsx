"use client";

// MapLibre is heavy and touches `window`/WebGL, so it's loaded only in the
// browser (dynamic import, ssr: false) and only on this page -- it must
// never end up in another route's bundle.

import dynamic from "next/dynamic";
import { Card } from "@/components/ui";
import styles from "./map.module.css";

export type MapRoute = {
  id: string;
  shortName: string;
  longName: string;
  color: string;
  textColor: string;
  /** One or more disconnected lines (e.g. each direction), as [lon, lat] pairs. */
  lines: [number, number][][];
  stopIds: string[];
};
export type MapStop = { id: string; name: string; lat: number; lon: number };

const MapView = dynamic(() => import("./MapView").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <Card className={styles.mapCard}>
      <div className={styles.mapLoading}>Loading map…</div>
    </Card>
  ),
});

export function TransportMap(props: { routes: MapRoute[]; stops: MapStop[]; stopRoutes: Record<string, string[]> }) {
  return <MapView {...props} />;
}
