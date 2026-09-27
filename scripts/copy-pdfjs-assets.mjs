// Runs automatically after `npm install` (see package.json "postinstall").
// pdf.js needs its cmaps and standard font files available at runtime for
// certain PDFs (CJK text, non-embedded fonts). This copies them from
// node_modules into public/, matching the paths configured in
// src/utils/pdfWorker.ts (cMapUrl: "/cmaps/", standardFontDataUrl: "/standard_fonts/").
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pdfjsDist = join(root, "node_modules", "pdfjs-dist");

const copies = [
  { from: join(pdfjsDist, "cmaps"), to: join(root, "public", "cmaps") },
  { from: join(pdfjsDist, "standard_fonts"), to: join(root, "public", "standard_fonts") },
];

for (const { from, to } of copies) {
  if (!existsSync(from)) {
    console.warn(`[fusion-pdf] Skipping copy — not found: ${from}`);
    continue;
  }
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[fusion-pdf] Copied ${from} -> ${to}`);
}
