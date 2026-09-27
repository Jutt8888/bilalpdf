# Fusion PDF

Private, browser-based PDF tools. Files never leave your device — everything
runs client-side with `pdf-lib` and `pdfjs-dist`.

## Setup

```bash
cd fusion-pdf
npm install
npm run dev
```

`npm install` automatically copies pdf.js's cmap/font assets into `public/`
(via the `postinstall` script) — no manual step needed. Open the URL Vite
prints (usually `http://localhost:5173`).

To use this as your working copy at `D:/DEVELOPMENT/fusion-pdf`, just
extract/copy this folder there and run the two commands above from inside it.

## ⚠️ Important — this was built without running it

This project was generated file-by-file in a sandboxed environment with
**no network access**, so `npm install` was never run here and the app has
**not** been built, started, or type-checked against real dependencies.
Everything is written carefully against the actual APIs of `pdf-lib`,
`pdfjs-dist`, `jszip`, and `react-router-dom`, but treat the first `npm
install && npm run dev` as the real first test — there may be a small
version-mismatch issue (e.g. a pdf.js API rename between minor versions)
that only shows up once it's actually running. If you hit an error or a
black screen, tell me exactly what you see and we'll fix it one change at a
time, per the project rules below.

## What's built (v0.1)

- **Home page** — grid of all 16 planned tools; the two that are built
  (Merge, Split) are clickable, the rest show "Coming soon".
- **Merge PDF** — add multiple PDFs, reorder with up/down, remove, merge,
  download.
- **Split PDF** — upload one PDF, see a thumbnail of every page, click to
  select/deselect, select all / clear selection, live selected-count,
  extract selected pages into a new PDF, **or** separate every page into
  its own PDF and download them all as `fusion-pages.zip`.
- Shared design system (cream background, white cards, charcoal type, one
  ink-indigo accent) in `src/styles/global.css`.
- Download helper (`src/utils/download.ts`) follows the ArrayBuffer /
  `revokeObjectURL` rules to avoid the `BlobPart` TypeScript issues and
  memory leaks called out in the project spec.

## Not built yet

Compress, Edit, Sign, PDF↔Images, Rotate, Remove/Extract/Rearrange Pages
(as standalone tools — Split already covers page extraction), Watermark,
Page Numbers, OCR, Redact, Compare. These are listed as disabled cards on
the home page but intentionally not implemented — say which one you want
next and we'll build it the same way, one change at a time.

## File structure

```text
fusion-pdf/
├── public/                      (cmaps/ and standard_fonts/ appear after npm install)
├── scripts/
│   └── copy-pdfjs-assets.mjs    postinstall: copies pdf.js runtime assets into public/
├── src/
│   ├── components/
│   │   ├── common/               Button, Header, Footer, StatusBanner
│   │   └── pdf/                  PdfDropzone, ToolCard
│   ├── features/pdf/
│   │   ├── merge/                MergePdfPage, mergePdf.ts, types.ts
│   │   └── split/                SplitPdfPage, splitPdf.ts, createSplitZip.ts, types.ts
│   ├── layouts/MainLayout.tsx
│   ├── pages/HomePage.tsx
│   ├── routes/routes.tsx
│   ├── types/tool.ts              roadmap/tool registry
│   ├── utils/
│   │   ├── download.ts           Blob + ArrayBuffer + revokeObjectURL helpers
│   │   └── pdfWorker.ts          pdf.js worker setup + thumbnail rendering
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig*.json
```

## Development rules going forward

Per the project spec: one change at a time. When something breaks —
"error" or "black screen" — say so and paste what you see; we stop adding
features and fix that first before anything else.
