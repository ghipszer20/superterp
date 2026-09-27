import { describe, expect, it } from "vitest";
import { ocrAssetPaths } from "../advisor/transcript-ocr";

describe("ocrAssetPaths", () => {
  it("points every OCR asset at our own origin, never a CDN", () => {
    const paths = ocrAssetPaths();
    expect(paths.workerPath).toMatch(/^\/vendor\/tesseract\//);
    expect(paths.corePath).toMatch(/^\/vendor\/tesseract\//);
    expect(paths.langPath).toMatch(/^\/vendor\/tesseract\//);
    for (const p of Object.values(paths)) {
      expect(p).not.toMatch(/^https?:\/\//);
      expect(p).not.toMatch(/cdn|jsdelivr|unpkg/i);
    }
  });
});
