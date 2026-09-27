import type { RouteObject } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import MergePdfPage from "../features/pdf/merge/MergePdfPage";
import SplitPdfPage from "../features/pdf/split/SplitPdfPage";

// Fusion PDF currently ships two tools (Merge, Split). Additional tools
// listed in the product roadmap are intentionally not routed here yet —
// add them one at a time as they are built.
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "merge", element: <MergePdfPage /> },
      { path: "split", element: <SplitPdfPage /> },
    ],
  },
];
