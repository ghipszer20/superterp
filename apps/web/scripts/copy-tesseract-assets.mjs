// Self-hosts the three runtime pieces tesseract.js needs for in-browser OCR (transcript import's
// OCR fallback for PDFs with no text layer): the worker script, the wasm OCR engine core, and the
// English language data. Owner ruling: OCR runs on-device only, engine + language data served from
// our own origin -- no third-party upload, no CDN (tesseract.js's own default fetches its core and
// langPath from jsdelivr, which we don't want).
//
// Copied here, unhashed, so ImportTranscriptView can pass fixed same-origin paths
// (/vendor/tesseract/...) to createWorker's workerPath/corePath/langPath options, and so the OCR
// worker's own `importScripts`/fetch calls (which don't go through Next's bundler) resolve.
//
// - worker.min.js: tesseract.js's worker bundle.
// - tesseract-core-lstm.wasm.js: tesseract.js-core's LSTM-only engine, Emscripten "single file"
//   build (the wasm binary inlined as base64 inside the .js) -- one file, no separate .wasm fetch,
//   no SIMD feature-detection branch to serve alternatives for. LSTM-only matches the OEM
//   createWorker is called with (plenty for machine-printed transcript text).
// - eng.traineddata.gz: the official @tesseract.js-data/eng language-data package's "best_int"
//   (LSTM-only, quantized) variant, matching the LSTM-only core above; tesseract.js gunzips this
//   itself, so shipping the .gz as-is is normal.
//
// Runs as apps/web's "postinstall" (see package.json), so a fresh `npm install`/`npm ci` always has
// a copy matching the installed tesseract.js version. public/vendor/ is gitignored (build output,
// not source) -- see the repo root .gitignore.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const outDir = join(import.meta.dirname, "..", "public", "vendor", "tesseract");
mkdirSync(outDir, { recursive: true });

function copy(src, name) {
  if (!existsSync(src)) {
    console.warn(`Skipped ${name}: ${src} not found (tesseract.js / @tesseract.js-data/eng not installed?)`);
    return;
  }
  copyFileSync(src, join(outDir, name));
}

const workerDir = dirname(require.resolve("tesseract.js/dist/worker.min.js"));
copy(join(workerDir, "worker.min.js"), "worker.min.js");

const coreDir = dirname(require.resolve("tesseract.js-core/tesseract-core-lstm.wasm.js"));
copy(join(coreDir, "tesseract-core-lstm.wasm.js"), "tesseract-core-lstm.wasm.js");

const engDir = join(dirname(require.resolve("@tesseract.js-data/eng/package.json")), "4.0.0_best_int");
copy(join(engDir, "eng.traineddata.gz"), "eng.traineddata.gz");

console.log(`Copied tesseract.js's OCR runtime assets to ${outDir}`);
