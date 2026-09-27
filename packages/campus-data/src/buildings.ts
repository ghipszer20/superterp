// UMD building locations, from umd.io's map API (https://api.umd.io/v1/map/buildings).
// Feeds the trip planner's "search a place" boxes -- students pick a building by name
// instead of a bus stop. Snapshotted like the other campus data (SNAPSHOTS.md): never
// fetched per page view.

import { fetchJson, SourceError } from "./http.ts";

export type Building = { id: string; name: string; lat: number; lon: number };

type RawBuilding = { name?: unknown; id?: unknown; lat?: unknown; long?: unknown };

export function parseBuildings(raw: unknown): Building[] {
  if (!Array.isArray(raw)) throw new SourceError("umd-buildings", "feed format changed: not an array");
  const buildings = (raw as RawBuilding[])
    .map((b): Building | null => {
      const name = typeof b.name === "string" ? b.name.trim() : "";
      const id = typeof b.id === "string" ? b.id : typeof b.id === "number" ? String(b.id) : "";
      const lat = Number(b.lat);
      const lon = Number(b.long);
      if (!name || !id || !Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) return null;
      return { id, name, lat, lon };
    })
    .filter((b): b is Building => b !== null);
  if (buildings.length === 0) throw new SourceError("umd-buildings", "feed format changed: no buildings");
  return buildings;
}

export async function fetchBuildings(): Promise<Building[]> {
  return parseBuildings(await fetchJson("umd-buildings", "https://api.umd.io/v1/map/buildings"));
}
