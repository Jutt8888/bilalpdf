import { useCallback, useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";
import "./PdfDropzone.css";

interface PdfDropzoneProps {
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  title?: string;
  hint?: string;
}

export default function PdfDropzone({
  multiple = false,
  onFiles,
  title = "Drop a PDF here",
  hint = "or click to browse your files",
}: PdfDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;

      const pdfFiles = Array.from(fileList).filter(
        (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
      );

      if (pdfFiles.length === 0) return;

      onFiles(multiple ? pdfFiles : [pdfFiles[0]]);
    },
    [multiple, onFiles]
  );

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  return (
    <div
      className={isDragging ? "fp-dropzone fp-dropzone--active" : "fp-dropzone"}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          inputRef.current?.click();
        }
      }}
    >
      <UploadCloud size={28} strokeWidth={1.75} />
      <p className="fp-dropzone__title">{title}</p>
      <p className="fp-dropzone__hint">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple={multiple}
        onChange={onInputChange}
        hidden
      />
    </div>
  );
}
