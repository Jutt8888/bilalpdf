/**
 * Fusion PDF download helpers.
 *
 * Rule (spec section 12): never pass a Uint8Array's `.buffer` straight into
 * `new Blob()` — TypeScript widens it to `ArrayBufferLike`, which can
 * include `SharedArrayBuffer` and trips BlobPart typing. Always copy into
 * a real `ArrayBuffer` first.
 *
 * Rule (spec section 17): always revoke the object URL after the download
 * has been triggered, via a temporary, invisible <a> element.
 */

export function toRealArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export function downloadBytes(
  bytes: Uint8Array,
  filename: string,
  mimeType: string
): void {
  const buffer = toRealArrayBuffer(bytes);
  const blob = new Blob([buffer], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function downloadPdf(bytes: Uint8Array, filename: string): void {
  downloadBytes(bytes, filename, "application/pdf");
}

export function downloadZip(bytes: Uint8Array, filename: string): void {
  downloadBytes(bytes, filename, "application/zip");
}
