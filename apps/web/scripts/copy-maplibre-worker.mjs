// maplibre-gl's ESM worker bundle (dist/maplibre-gl-worker.mjs) imports its
// sibling dist/maplibre-gl-shared.mjs by a relative specifier. Next/Turbopack
// only ever sees that worker file through `new URL(..., import.meta.url)` in
// MapView.tsx, which copies it as an opaque static asset under a hashed name
// -- it doesn't re-bundle the file, so the relative import inside it still
// points at "./maplibre-gl-shared.mjs", a name that never exists next to the
// hashed copy, and loading the worker fails (see MapView.tsx for the
// runtime symptom).
//
// Fix: copy both files here into public/vendor/ under their original,
// unhashed names, so that relative import resolves against a real sibling
// file once more. Next serves public/ as static files verbatim.
//
// Runs as apps/web's "postinstall" (see package.json), so a fresh
// `npm install`/`npm ci` always has a copy matching the installed
// maplibre-gl version. public/vendor/ is gitignored (build output, not
// source) -- see the repo root .gitignore.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const distDir = dirname(require.resolve("maplibre-gl/dist/maplibre-gl-worker.mjs"));
const outDir = join(import.meta.dirname, "..", "public", "vendor");

mkdirSync(outDir, { recursive: true });

for (const name of ["maplibre-gl-worker.mjs", "maplibre-gl-worker.mjs.map", "maplibre-gl-shared.mjs", "maplibre-gl-shared.mjs.map"]) {
  const src = join(distDir, name);
  if (!existsSync(src)) continue; // .map files are best-effort (debugging only)
  copyFileSync(src, join(outDir, name));
}

console.log(`Copied maplibre-gl's worker bundle to ${outDir}`);
