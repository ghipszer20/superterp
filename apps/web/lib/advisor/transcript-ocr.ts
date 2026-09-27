// Thin tesseract.js I/O for the OCR fallback (a PDF with no text layer -- the shape Testudo's own
// download button produces). Owner ruling: OCR runs on-device only, self-hosting the engine and
// language data from our own origin, loaded lazily only when this path actually runs (nothing here
// is imported eagerly by ImportTranscriptView; `tesseract.js` and transcript-pdf.ts's canvas
// rendering are both dynamic imports). Kept thin and not deeply unit-tested per the brief --
// `ocrAssetPaths` is the one piece worth testing in isolation (it's pure, and it's the thing that
// proves nothing is fetched from a CDN).

const OCR_VENDOR_BASE = "/vendor/tesseract";

export function ocrAssetPaths(): { workerPath: string; corePath: string; langPath: string } {
  return {
    workerPath: `${OCR_VENDOR_BASE}/worker.min.js`,
    corePath: `${OCR_VENDOR_BASE}/tesseract-core-lstm.wasm.js`,
    langPath: `${OCR_VENDOR_BASE}/`,
  };
}

/** OCRs one rendered page (a canvas from transcript-pdf.ts's renderPdfPageToCanvas). */
export async function ocrCanvasText(canvas: HTMLCanvasElement, onProgress?: (progress: number) => void): Promise<string> {
  const { createWorker, OEM } = await import("tesseract.js");
  const worker = await createWorker("eng", OEM.LSTM_ONLY, {
    ...ocrAssetPaths(),
    logger: onProgress ? (m) => { if (m.status === "recognizing text") onProgress(m.progress); } : undefined,
  });
  try {
    const { data } = await worker.recognize(canvas);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

/** OCRs every page of a PDF with no usable text layer, in order, and joins the pages' text. */
export async function ocrPdfText(
  file: Blob | ArrayBuffer,
  onProgress?: (page: number, totalPages: number, pageProgress: number) => void,
): Promise<string> {
  const { renderPdfPageToCanvas, pdfPageCount } = await import("./transcript-pdf");
  const totalPages = await pdfPageCount(file);
  const pages: string[] = [];
  for (let page = 1; page <= totalPages; page++) {
    const canvas = await renderPdfPageToCanvas(file, page);
    pages.push(await ocrCanvasText(canvas, (progress) => onProgress?.(page, totalPages, progress)));
  }
  return pages.join("\n");
}
