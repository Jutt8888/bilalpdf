import { useCallback, useState } from "react";
import {
  CheckSquare,
  Square,
  RotateCcw,
  Scissors,
  PackageOpen,
} from "lucide-react";
import PdfDropzone from "../../../components/pdf/PdfDropzone";
import StatusBanner from "../../../components/common/StatusBanner";
import Button from "../../../components/common/Button";
import { loadPdfDocument, renderPageThumbnail } from "../../../utils/pdfWorker";
import { downloadPdf, downloadZip } from "../../../utils/download";
import { extractPages, splitEveryPage } from "./splitPdf";
import { createSplitZip } from "./createSplitZip";
import type { SplitPagePreview, SplitStatus } from "./types";
import "./SplitPdfPage.css";

function baseName(fileName: string): string {
  return fileName.replace(/\.pdf$/i, "");
}

export default function SplitPdfPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [sourceBytes, setSourceBytes] = useState<Uint8Array | null>(null);
  const [previews, setPreviews] = useState<SplitPagePreview[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<SplitStatus>({ kind: "idle" });

  const reset = useCallback(() => {
    setFileName(null);
    setSourceBytes(null);
    setPreviews([]);
    setSelected(new Set());
    setStatus({ kind: "idle" });
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setStatus({ kind: "loading-preview" });
    setPreviews([]);
    setSelected(new Set());

    try {
      const buffer = await file.arrayBuffer();
      // Keep an untouched copy for pdf-lib; pdf.js is given its own copy
      // since it may transfer/detach the buffer it's handed.
      const bytesForStorage = new Uint8Array(buffer);
      const bytesForPreview = new Uint8Array(buffer.slice(0));

      const pdf = await loadPdfDocument(bytesForPreview);
      const pageCount = pdf.numPages;

      const nextPreviews: SplitPagePreview[] = [];
      for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
        const thumbnailUrl = await renderPageThumbnail(pdf, pageNumber);
        nextPreviews.push({ pageNumber, thumbnailUrl });
      }

      setFileName(file.name);
      setSourceBytes(bytesForStorage);
      setPreviews(nextPreviews);
      setStatus({ kind: "ready" });
    } catch (error) {
      console.error("Fusion PDF — failed to load preview:", error);
      setStatus({
        kind: "error",
        message:
          "This file couldn't be opened. It may be corrupted, password-protected, or not a valid PDF.",
      });
    }
  }, []);

  const togglePage = (pageNumber: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) {
        next.delete(pageNumber);
      } else {
        next.add(pageNumber);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(previews.map((page) => page.pageNumber)));
  };

  const clearSelection = () => setSelected(new Set());

  const handleExtractSelected = async () => {
    if (!sourceBytes) return;

    if (selected.size === 0) {
      setStatus({ kind: "error", message: "Select at least one page to split." });
      return;
    }

    setStatus({ kind: "processing", label: "Building your PDF…" });

    try {
      const zeroIndexed = Array.from(selected)
        .sort((a, b) => a - b)
        .map((pageNumber) => pageNumber - 1);

      const resultBytes = await extractPages(sourceBytes, zeroIndexed);
      downloadPdf(resultBytes, `fusion-split-${baseName(fileName ?? "document")}.pdf`);
      setStatus({ kind: "ready" });
    } catch (error) {
      console.error("Fusion PDF — split failed:", error);
      setStatus({
        kind: "error",
        message: "Something went wrong while building the PDF. Please try again.",
      });
    }
  };

  const handleSeparateEveryPage = async () => {
    if (!sourceBytes) return;

    try {
      const perPagePdfs = await splitEveryPage(sourceBytes, (completed, total) => {
        setStatus({
          kind: "processing",
          label: `Splitting page ${completed} of ${total}…`,
        });
      });

      setStatus({ kind: "processing", label: "Packing pages into a ZIP…" });
      const zipBytes = await createSplitZip(perPagePdfs);
      downloadZip(zipBytes, "fusion-pages.zip");
      setStatus({ kind: "ready" });
    } catch (error) {
      console.error("Fusion PDF — separate-every-page failed:", error);
      setStatus({
        kind: "error",
        message: "Something went wrong while creating the ZIP file. Please try again.",
      });
    }
  };

  const isBusy = status.kind === "loading-preview" || status.kind === "processing";

  return (
    <div className="container fp-split">
      <header className="fp-tool-header">
        <h1>Split PDF</h1>
        <p>Pick the pages you want, or break every page into its own file.</p>
      </header>

      {!sourceBytes && (
        <PdfDropzone
          onFiles={handleFiles}
          title="Drop a PDF here"
          hint="or click to browse — one file at a time"
        />
      )}

      {status.kind === "loading-preview" && (
        <StatusBanner kind="processing" message="Rendering page previews…" />
      )}
      {status.kind === "error" && <StatusBanner kind="error" message={status.message} />}
      {status.kind === "processing" && (
        <StatusBanner kind="processing" message={status.label} />
      )}

      {sourceBytes && previews.length > 0 && (
        <>
          <div className="fp-split__toolbar">
            <div className="fp-split__file">
              <strong>{fileName}</strong>
              <span>
                {previews.length} page{previews.length === 1 ? "" : "s"} · {selected.size}{" "}
                selected
              </span>
            </div>

            <div className="fp-split__actions">
              <Button variant="ghost" icon={<CheckSquare size={16} />} onClick={selectAll} disabled={isBusy}>
                Select all
              </Button>
              <Button variant="ghost" icon={<Square size={16} />} onClick={clearSelection} disabled={isBusy}>
                Clear selection
              </Button>
              <Button variant="ghost" icon={<RotateCcw size={16} />} onClick={reset} disabled={isBusy}>
                Start over
              </Button>
            </div>
          </div>

          <div className="fp-page-grid" role="list">
            {previews.map((page) => {
              const isSelected = selected.has(page.pageNumber);
              return (
                <button
                  key={page.pageNumber}
                  role="listitem"
                  type="button"
                  className={
                    isSelected ? "fp-page-card fp-page-card--selected" : "fp-page-card"
                  }
                  onClick={() => togglePage(page.pageNumber)}
                  aria-pressed={isSelected}
                >
                  <img src={page.thumbnailUrl} alt={`Page ${page.pageNumber}`} />
                  <span className="fp-page-card__badge">{page.pageNumber}</span>
                  <span className="fp-page-card__check" aria-hidden="true">
                    <CheckSquare size={16} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="fp-split__footer">
            <Button
              variant="primary"
              icon={<Scissors size={16} />}
              onClick={handleExtractSelected}
              disabled={isBusy || selected.size === 0}
            >
              Split selected pages ({selected.size})
            </Button>
            <Button
              variant="secondary"
              icon={<PackageOpen size={16} />}
              onClick={handleSeparateEveryPage}
              disabled={isBusy}
            >
              Separate every page (ZIP)
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
