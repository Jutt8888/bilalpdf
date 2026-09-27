import { PDFDocument } from "pdf-lib";

/**
 * Merge multiple PDFs, in the given order, into a single PDF.
 *
 * Architecture (mirrors splitPdf.ts):
 *   files[] -> for each: PDFDocument.load() -> copyPages() (all pages)
 *   -> append to a single output PDFDocument -> save() -> Uint8Array
 */
export async function mergePdfs(files: Uint8Array[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Add at least two PDFs to merge.");
  }

  const outputDoc = await PDFDocument.create();

  for (const fileBytes of files) {
    const sourceDoc = await PDFDocument.load(fileBytes);
    const pageIndices = sourceDoc.getPageIndices();
    const copiedPages = await outputDoc.copyPages(sourceDoc, pageIndices);
    copiedPages.forEach((page) => outputDoc.addPage(page));
  }

  return outputDoc.save();
}
