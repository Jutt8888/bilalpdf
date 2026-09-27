import JSZip from "jszip";

export async function createSplitZip(files: Uint8Array[]): Promise<Uint8Array> {
  const zip = new JSZip();

  files.forEach((pdfBytes, index) => {
    zip.file(`fusion-page-${index + 1}.pdf`, pdfBytes);
  });

  const zipBuffer = await zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
  });

  const result = new Uint8Array(zipBuffer.byteLength);
  result.set(new Uint8Array(zipBuffer));

  return result;
}
