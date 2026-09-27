export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  path: string | null; // null = not built yet
}

// The full product roadmap (section 3 of the spec). Only tools with a
// non-null `path` are actually routed and clickable — the rest render
// as "coming soon" on the home page so the roadmap stays visible
// without implying features that don't exist yet.
export const TOOLS: ToolDefinition[] = [
  {
    id: "merge",
    name: "Merge PDF",
    description: "Combine multiple PDFs into a single file, in the order you choose.",
    path: "/merge",
  },
  {
    id: "split",
    name: "Split PDF",
    description: "Pull specific pages out of a PDF, or split every page into its own file.",
    path: "/split",
  },
  { id: "compress", name: "Compress PDF", description: "Shrink file size for sharing and storage.", path: null },
  { id: "edit", name: "Edit PDF", description: "Add text, shapes, and annotations.", path: null },
  { id: "sign", name: "Sign PDF", description: "Add a signature to a document.", path: null },
  { id: "pdf-to-images", name: "PDF to Images", description: "Export pages as PNG or JPG images.", path: null },
  { id: "images-to-pdf", name: "Images to PDF", description: "Turn a set of images into one PDF.", path: null },
  { id: "rotate", name: "Rotate PDF", description: "Fix sideways or upside-down pages.", path: null },
  { id: "remove-pages", name: "Remove Pages", description: "Delete unwanted pages from a PDF.", path: null },
  { id: "extract-pages", name: "Extract Pages", description: "Save a page range as a new PDF.", path: null },
  { id: "rearrange", name: "Rearrange Pages", description: "Reorder pages by dragging them into place.", path: null },
  { id: "watermark", name: "Watermark PDF", description: "Stamp text or a logo across every page.", path: null },
  { id: "page-numbers", name: "Page Numbers", description: "Add page numbers in a style you choose.", path: null },
  { id: "ocr", name: "OCR PDF", description: "Make scanned pages searchable and selectable.", path: null },
  { id: "redact", name: "Redact PDF", description: "Permanently black out sensitive content.", path: null },
  { id: "compare", name: "Compare PDF", description: "See what changed between two versions.", path: null },
];
