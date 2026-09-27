"use client";

// The actual MapLibre map. Only ever loaded client-side, via the dynamic
// import in TransportMap.tsx -- this file (and maplibre-gl itself) must
// never be imported from a Server Component.

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { formatMinutes } from "@superterp/campus-data/hours";
import { LocationIcon } from "@/components/icons";
import { Card, EmptyState } from "@/components/ui";
import type { MapRoute, MapStop } from "./TransportMap";
import busStyles from "./buses.module.css";
import styles from "./map.module.css";

// Roughly the middle of the College Park campus (McKeldin Mall).
const CAMPUS_CENTER: [number, number] = [-76.9426, 38.9869];
const DEFAULT_ZOOM = 14.3;

const LIGHT_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const DARK_STYLE = "https://tiles.openfreemap.org/styles/dark";

const DEFAULT_STOP_COLOR = "#6e6e73";
const HERE_COLOR = "#0a84ff";

type Departure = {
  tripId: string;
  route: string;
  routeName: string;
  color: string;
  textColor: string;
  headsign: string;
  minutes: number;
};
type Board = { stopId: string; departures: Departure[] }[];

function currentTheme(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function casingColor(): string {
  return currentTheme() === "dark" ? "#000000" : "#ffffff";
}

function hasWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function MapView({
  routes,
  stops,
  stopRoutes,
}: {
  routes: MapRoute[];
  stops: MapStop[];
  stopRoutes: Record<string, string[]>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const hereMarkerRef = useRef<Marker | null>(null);
  const [unsupported] = useState(() => !hasWebGl());
  const [failed, setFailed] = useState(false);
  const [themeTick, setThemeTick] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [here, setHere] = useState<{ lat: number; lon: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  // The student's Light/Dark choice can change after the map is up; rebuild it
  // with the matching basemap when it does.
  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => setThemeTick((n) => n + 1));
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (unsupported || !containerRef.current) return;
    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        container: containerRef.current,
        style: currentTheme() === "dark" ? DARK_STYLE : LIGHT_STYLE,
        center: CAMPUS_CENTER,
        zoom: DEFAULT_ZOOM,
      });
    } catch {
      setFailed(true);
      return;
    }
    mapRef.current = map;
    // MapLibre logs uncaught errors to console.error unless something listens.
    map.on("error", (e) => console.warn("[transport map]", e.error?.message ?? e));
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      map.addSource("routes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: routes.flatMap((r) =>
            r.lines.map((line) => ({
              type: "Feature" as const,
              geometry: { type: "LineString" as const, coordinates: line },
              properties: { routeId: r.id },
            })),
          ),
        },
      });
      map.addLayer({
        id: "routes-casing",
        type: "line",
        source: "routes",
        filter: ["==", ["get", "routeId"], ""],
        paint: { "line-color": casingColor(), "line-width": 7, "line-opacity": 0.9 },
      });
      map.addLayer({
        id: "routes-line",
        type: "line",
        source: "routes",
        filter: ["==", ["get", "routeId"], ""],
        paint: { "line-color": "#6e6e73", "line-width": 4 },
      });

      map.addSource("stops", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: stops.map((s) => ({
            type: "Feature" as const,
            geometry: { type: "Point" as const, coordinates: [s.lon, s.lat] },
            properties: { id: s.id, name: s.name, routeIds: stopRoutes[s.id] ?? [] },
          })),
        },
      });
      map.addLayer({
        id: "stops-circle",
        type: "circle",
        source: "stops",
        paint: {
          "circle-radius": 5,
          "circle-color": DEFAULT_STOP_COLOR,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
        },
      });

      const onClick = (e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
        const id = e.features?.[0]?.properties?.id;
        if (typeof id === "string") setSelectedStop(id);
      };
      map.on("click", "stops-circle", onClick);
      map.on("mouseenter", "stops-circle", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "stops-circle", () => (map.getCanvas().style.cursor = ""));
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Rebuilding on themeTick swaps the basemap for Light/Dark; routes/stops/stopRoutes
    // come from a server fetch for "today" and don't change while this page is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeTick, unsupported]);

  // Highlight the selected route's line(s) and the stops it serves.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer("routes-line")) return;
    if (selectedRoute) {
      map.setFilter("routes-casing", ["==", ["get", "routeId"], selectedRoute]);
      map.setFilter("routes-line", ["==", ["get", "routeId"], selectedRoute]);
    } else {
      map.setFilter("routes-casing", ["==", ["get", "routeId"], ""]);
      map.setFilter("routes-line", ["==", ["get", "routeId"], ""]);
    }
    const route = routes.find((r) => r.id === selectedRoute);
    map.setPaintProperty(
      "routes-line",
      "line-color",
      route ? route.color : "#6e6e73",
    );
    map.setPaintProperty(
      "stops-circle",
      "circle-color",
      selectedRoute
        ? ["case", ["in", selectedRoute, ["get", "routeIds"]], route?.color ?? DEFAULT_STOP_COLOR, DEFAULT_STOP_COLOR]
        : DEFAULT_STOP_COLOR,
    );
    map.setPaintProperty(
      "stops-circle",
      "circle-radius",
      selectedRoute ? ["case", ["in", selectedRoute, ["get", "routeIds"]], 7, 4] : 5,
    );
  }, [selectedRoute, routes, themeTick]);

  // Fetch scheduled departures for the tapped stop.
  useEffect(() => {
    if (!selectedStop) {
      setBoard(null);
      return;
    }
    setBoard(null);
    let cancelled = false;
    fetch(`/api/buses/departures?stops=${encodeURIComponent(selectedStop)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((json: { departures: Board }) => {
        if (!cancelled) setBoard(json.departures);
      })
      .catch(() => {
        if (!cancelled) setBoard([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedStop]);

  // "Near me" is opt-in: nothing is requested until the student taps this.
  function locate() {
    if (!("geolocation" in navigator)) {
      setLocError("Location isn't available in this browser.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError("Couldn't get your location.");
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  }

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !here) return;
    if (!hereMarkerRef.current) {
      hereMarkerRef.current = new Marker({ color: HERE_COLOR }).setLngLat([here.lon, here.lat]).addTo(map);
    } else {
      hereMarkerRef.current.setLngLat([here.lon, here.lat]);
    }
    map.flyTo({ center: [here.lon, here.lat], zoom: 16 });
  }, [here, themeTick]);

  const stop = stops.find((s) => s.id === selectedStop);
  const servingRoutes = selectedStop
    ? (stopRoutes[selectedStop] ?? []).map((id) => routes.find((r) => r.id === id)).filter((r): r is MapRoute => Boolean(r))
    : [];

  if (unsupported || failed) {
    return (
      <Card className={styles.mapCard}>
        <EmptyState title="Map unavailable">
          This browser can&apos;t show the campus map. Use the stop search below to find departures.
        </EmptyState>
      </Card>
    );
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.routePicker} role="group" aria-label="Choose a route to show on the map">
          <button
            type="button"
            className={styles.routeChip}
            data-selected={selectedRoute === null || undefined}
            onClick={() => setSelectedRoute(null)}
          >
            All stops
          </button>
          {routes.map((r) => (
            <button
              key={r.id}
              type="button"
              className={styles.routeChip}
              data-selected={selectedRoute === r.id || undefined}
              style={selectedRoute === r.id ? { background: r.color, color: r.textColor, borderColor: r.color } : undefined}
              onClick={() => setSelectedRoute((cur) => (cur === r.id ? null : r.id))}
            >
              {r.shortName}
            </button>
          ))}
        </div>
        <button type="button" className={styles.locate} onClick={locate} disabled={locating}>
          <LocationIcon />
          {locating ? "Locating…" : here ? "Update location" : "Show my location"}
        </button>
      </div>
      {locError ? <p className={styles.hint}>{locError}</p> : null}

      <Card className={styles.mapCard}>
        <div ref={containerRef} className={styles.mapContainer} />
      </Card>

      {stop ? (
        <Card className={styles.stopCard}>
          <div className={styles.stopHead}>
            <p className={styles.stopName}>{stop.name}</p>
            <button type="button" className={styles.clear} onClick={() => setSelectedStop(null)}>
              Close
            </button>
          </div>
          {servingRoutes.length > 0 ? (
            <div className={`${busStyles.routes} ${styles.stopRoutes}`}>
              {servingRoutes.map((r) => (
                <span key={r.id} className={busStyles.routeChip}>
                  <span className={busStyles.badge} style={{ background: r.color, color: r.textColor }}>
                    {r.shortName}
                  </span>
                  {r.longName}
                </span>
              ))}
            </div>
          ) : null}
          <div className={styles.departures}>
            {board === null ? (
              <div className={busStyles.loading}>Loading departures…</div>
            ) : (board[0]?.departures.length ?? 0) === 0 ? (
              <EmptyState title="No more buses today" />
            ) : (
              board![0]!.departures.map((d) => (
                <div key={`${d.tripId}-${d.minutes}`} className={busStyles.dep}>
                  <span className={busStyles.badge} style={{ background: d.color, color: d.textColor }}>
                    {d.route}
                  </span>
                  <span className={busStyles.depText}>
                    <span className={busStyles.depName}>{d.routeName}</span>
                    <span className={busStyles.depSub}>
                      {d.headsign ? `To ${d.headsign} · ` : ""}
                      {formatMinutes(d.minutes)} · Scheduled
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      ) : null}
    </>
  );
}
