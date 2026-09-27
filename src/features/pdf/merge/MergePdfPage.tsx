import { useCallback, useState } from "react";
import { ArrowUp, ArrowDown, X, Combine, RotateCcw } from "lucide-react";
import PdfDropzone from "../../../components/pdf/PdfDropzone";
import StatusBanner from "../../../components/common/StatusBanner";
import Button from "../../../components/common/Button";
import { downloadPdf } from "../../../utils/download";
import { mergePdfs } from "./mergePdf";
import type { MergeFileEntry, MergeStatus } from "./types";
import "./MergePdfPage.css";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function MergePdfPage() {
  const [entries, setEntries] = useState<MergeFileEntry[]>([]);
  const [status, setStatus] = useState<MergeStatus>({ kind: "idle" });

  const addFiles = useCallback(async (files: File[]) => {
    try {
      const newEntries = await Promise.all(
        files.map(async (file) => ({
          id: makeId(),
          name: file.name,
          sizeLabel: formatSize(file.size),
          bytes: new Uint8Array(await file.arrayBuffer()),
        }))
      );
      setEntries((prev) => [...prev, ...newEntries]);
      setStatus({ kind: "idle" });
    } catch (error) {
      console.error("Fusion PDF — failed to read files:", error);
      setStatus({ kind: "error", message: "One of those files couldn't be read. Try again." });
    }
  }, []);

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const moveEntry = (index: number, direction: -1 | 1) => {
    setEntries((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const reset = () => {
    setEntries([]);
    setStatus({ kind: "idle" });
  };

  const handleMerge = async () => {
    if (entries.length < 2) {
      setStatus({ kind: "error", message: "Add at least two PDFs to merge." });
      return;
    }

    setStatus({ kind: "processing" });
    try {
      const merged = await mergePdfs(entries.map((entry) => entry.bytes));
      downloadPdf(merged, "fusion-merged.pdf");
      setStatus({ kind: "idle" });
    } catch (error) {
      console.error("Fusion PDF — merge failed:", error);
      setStatus({
        kind: "error",
        message: "Something went wrong while merging. Make sure every file is a valid PDF.",
      });
    }
  };

  const isBusy = status.kind === "processing";

  return (
    <div className="container fp-merge">
      <header className="fp-tool-header">
        <h1>Merge PDF</h1>
        <p>Combine multiple PDFs into one file, in the order you set below.</p>
      </header>

      <PdfDropzone
        multiple
        onFiles={addFiles}
        title={entries.length === 0 ? "Drop PDFs here" : "Add more PDFs"}
        hint="or click to browse — you can select several files"
      />

      {status.kind === "error" && <StatusBanner kind="error" message={status.message} />}
      {status.kind === "processing" && (
        <StatusBanner kind="processing" message="Merging your PDFs…" />
      )}

      {entries.length > 0 && (
        <>
          <ol className="fp-merge-list">
            {entries.map((entry, index) => (
              <li key={entry.id} className="fp-merge-item">
                <span className="fp-merge-item__order">{index + 1}</span>
                <div className="fp-merge-item__info">
                  <strong>{entry.name}</strong>
                  <span>{entry.sizeLabel}</span>
                </div>
                <div className="fp-merge-item__controls">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => moveEntry(index, -1)}
                    disabled={index === 0 || isBusy}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => moveEntry(index, 1)}
                    disabled={index === entries.length - 1 || isBusy}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => removeEntry(entry.id)}
                    disabled={isBusy}
                  >
                    <X size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ol>

          <div className="fp-split__footer">
            <Button
              variant="primary"
              icon={<Combine size={16} />}
              onClick={handleMerge}
              disabled={isBusy || entries.length < 2}
            >
              Merge {entries.length} files
            </Button>
            <Button variant="ghost" icon={<RotateCcw size={16} />} onClick={reset} disabled={isBusy}>
              Start over
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
