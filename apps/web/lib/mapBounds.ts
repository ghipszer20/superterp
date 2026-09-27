// Bounding the campus map to campus itself (owner ruling, "Transport map v2": "you went
// overkill on the campus map - only need UMD campus"), plus the pure geometry for showing
// where a route's line leaves that box.

import type { LonLat } from "@superterp/campus-data";

export type CampusBounds = { west: number; south: number; east: number; north: number };

// The campus footprint, not a box drawn around every bus stop: this is the bounding box of
// OpenStreetMap's "University of Maryland, College Park" university-amenity relation
// (osm_type=relation, osm_id=14718558), fetched from Nominatim on 2026-09-26:
//   https://nominatim.openstreetmap.org/search?q=University+of+Maryland+College+Park&format=json
//   -> boundingbox: ["38.9671728","39.0075665","-76.9658076","-76.9184134"]
// That polygon covers the university's own property line (academic core, the golf course at
// the north edge, North/South Campus housing, and the ROTC/ag fields near the Metro station),
// which is the right shape for "only need UMD campus" -- a shuttle stop just past that line
// (e.g. across Route 1 or Adelphi Rd) is genuinely off campus, not merely off the mall.
export const CAMPUS_BOUNDS: CampusBounds = {
  west: -76.9658076,
  south: 38.9671728,
  east: -76.9184134,
  north: 39.0075665,
};

// A floor under how far a student can zoom out, on top of maxBounds itself. maxBounds already
// stops the camera from *panning* past the campus edge, but a sensible minZoom keeps a very
// wide/short viewport from rendering a lot of dead space around a tiny campus box. The campus
// box is roughly 4.5km (E-W) x 4.5km (N-S); zoom 13 comfortably fits that within a phone-width
// map card, so nothing shorter than that is useful here.
export const CAMPUS_MIN_ZOOM = 13;

/** MapLibre's `LngLatBoundsLike` tuple order: `[[west, south], [east, north]]`. */
export function toMapLibreBounds(bounds: CampusBounds): [[number, number], [number, number]] {
  return [
    [bounds.west, bounds.south],
    [bounds.east, bounds.north],
  ];
}

export function isInCampusBounds([lon, lat]: LonLat, bounds: CampusBounds): boolean {
  return lon >= bounds.west && lon <= bounds.east && lat >= bounds.south && lat <= bounds.north;
}

/** Where a route's line crosses out of the campus bounds, and which way it's heading. */
export type RouteExit = {
  lon: number;
  lat: number;
  /** Compass bearing of travel at the crossing: 0 = north, 90 = east, 180 = south, 270 = west. */
  bearingDeg: number;
};

/**
 * Given a route's shape (its line(s), e.g. one per direction) and the campus bounds, returns
 * every point where the route crosses from inside campus to outside it, with the heading it was
 * travelling at that point. The line coming back onto campus afterwards isn't reported -- only
 * the "it leaves here" crossing is, since that's the one the map needs to mark. A line that
 * never enters the bounds at all (or never leaves them) reports no exits.
 */
export function findRouteExits(lines: LonLat[][], bounds: CampusBounds): RouteExit[] {
  const exits: RouteExit[] = [];
  for (const line of lines) {
    for (let i = 0; i < line.length - 1; i++) {
      const a = line[i]!;
      const b = line[i + 1]!;
      if (!isInCampusBounds(a, bounds) || isInCampusBounds(b, bounds)) continue;

      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      if (dx === 0 && dy === 0) continue;

      // Liang-Barsky-style exit clip: since `a` is inside and `b` is outside, the segment
      // leaves through whichever of the (up to two) relevant box edges it reaches first.
      const candidates: number[] = [];
      if (dx > 0) candidates.push((bounds.east - a[0]) / dx);
      else if (dx < 0) candidates.push((bounds.west - a[0]) / dx);
      if (dy > 0) candidates.push((bounds.north - a[1]) / dy);
      else if (dy < 0) candidates.push((bounds.south - a[1]) / dy);

      const t = Math.min(...candidates.filter((c) => c >= 0 && c <= 1));
      const lon = a[0] + t * dx;
      const lat = a[1] + t * dy;

      // Longitude degrees are narrower than latitude degrees away from the equator; scale by
      // cos(latitude) so the bearing points the right way instead of skewing east/west.
      const scaledDx = dx * Math.cos((a[1] * Math.PI) / 180);
      const bearingDeg = (Math.atan2(scaledDx, dy) * 180) / Math.PI;

      exits.push({ lon, lat, bearingDeg: (bearingDeg + 360) % 360 });
    }
  }
  return exits;
}

/** The nearest of `stops` to `point` that is itself outside the bounds, or null if none is. */
export function nearestOffCampusStop<T extends { lat: number; lon: number }>(
  [lon, lat]: LonLat,
  stops: T[],
  bounds: CampusBounds,
): T | null {
  let best: T | null = null;
  let bestDist = Infinity;
  for (const stop of stops) {
    if (isInCampusBounds([stop.lon, stop.lat], bounds)) continue;
    const dist = (stop.lon - lon) ** 2 + (stop.lat - lat) ** 2;
    if (dist < bestDist) {
      best = stop;
      bestDist = dist;
    }
  }
  return best;
}
