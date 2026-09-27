export interface MergeFileEntry {
  id: string;
  name: string;
  sizeLabel: string;
  bytes: Uint8Array;
}

export type MergeStatus =
  | { kind: "idle" }
  | { kind: "processing" }
  | { kind: "error"; message: string };
