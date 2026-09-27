export interface SplitPagePreview {
  /** 1-indexed page number, matching pdf-lib and pdf.js page numbering. */
  pageNumber: number;
  thumbnailUrl: string;
}

export type SplitStatus =
  | { kind: "idle" }
  | { kind: "loading-preview" }
  | { kind: "ready" }
  | { kind: "processing"; label: string }
  | { kind: "error"; message: string };
