import { PDFDocument } from "pdf-lib";

/**
 * Extract a set of pages from a source PDF into a single new PDF.
 *
 * Architecture (spec section 21):
 *   Original PDF -> PDFDocument.load() -> selected indices -> copyPages()
 *   -> new PDFDocument -> save() -> Uint8Array
 *
 * @param sourceBytes Raw bytes of the original PDF.
 * @param pageIndices 0-indexed page numbers to include, in output order.
 */
export async function extractPages(
  sourceBytes: Uint8Array,
  pageIndices: number[]
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error("No pages were selected.");
  }

  const sourceDoc = await PDFDocument.load(sourceBytes);
  const outputDoc = await PDFDocument.create();

  const copiedPages = await outputDoc.copyPages(sourceDoc, pageIndices);
  copiedPages.forEach((page) => outputDoc.addPage(page));

  return outputDoc.save();
}

/**
 * Split every page of a source PDF into its own single-page PDF.
 *
 * Architecture (spec section 22):
 *   Original PDF -> load once -> for each page -> create new PDF
 *   -> copy one page -> save -> Uint8Array -> array of PDFs
 *
 * @param sourceBytes Raw bytes of the original PDF.
 * @param onProgress Optional callback fired after each page is produced,
 *   with the 1-indexed page number just completed and the total page count.
 */
export async function splitEveryPage(
  sourceBytes: Uint8Array,
  onProgress?: (completed: number, total: number) => void
): Promise<Uint8Array[]> {
  const sourceDoc = await PDFDocument.load(sourceBytes);
  const pageCount = sourceDoc.getPageCount();
  const results: Uint8Array[] = [];

  for (let i = 0; i < pageCount; i += 1) {
    const singlePageDoc = await PDFDocument.create();
    const [copiedPage] = await singlePageDoc.copyPages(sourceDoc, [i]);
    singlePageDoc.addPage(copiedPage);
    results.push(await singlePageDoc.save());
    onProgress?.(i + 1, pageCount);
  }

  return results;
}

export async function getPageCount(sourceBytes: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(sourceBytes);
  return doc.getPageCount();
}
