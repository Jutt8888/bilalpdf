import * as pdfjsLib from "pdfjs-dist";

// Spec section 9 — do not replace this unless there is a specific worker
// problem. Resolving the worker via import.meta.url lets Vite bundle and
// fingerprint the worker file correctly for both dev and production.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * Load a PDF document from raw bytes.
 *
 * Spec section 10 — these loading options (cMaps, standard fonts) are
 * intentional and should not be silently dropped. The corresponding
 * files must be present under /public/cmaps, /public/standard_fonts,
 * and /public/wasm (copied from node_modules/pdfjs-dist during setup —
 * see README.md "One-time asset copy" step).
 */
export async function loadPdfDocument(bytes: Uint8Array) {
  const loadingTask = pdfjsLib.getDocument({
    data: bytes,
    cMapUrl: "/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "/standard_fonts/",
    disableFontFace: false,
    fontExtraProperties: true,
  });

  return loadingTask.promise;
}

export type PdfDocumentProxy = Awaited<ReturnType<typeof loadPdfDocument>>;

/**
 * Render a single page of a loaded PDF document onto an offscreen canvas
 * and return it as a data URL, for use as a thumbnail <img src>.
 */
export async function renderPageThumbnail(
  pdf: PdfDocumentProxy,
  pageNumber: number,
  targetWidth = 220
): Promise<string> {
  const page = await pdf.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Fusion PDF: could not acquire 2D canvas context.");
  }

  await page.render({ canvasContext: context, viewport }).promise;

  return canvas.toDataURL("image/png");
}
