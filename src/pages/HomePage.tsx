import { TOOLS } from "../types/tool";
import ToolCard from "../components/pdf/ToolCard";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="container">
      <section className="fp-hero">
        <h1 className="fp-hero__title">
          PDF tools that stay on your machine.
        </h1>
        <p className="fp-hero__subtitle">
          Merge, split, and manage PDF files entirely in your browser. Nothing
          uploads, nothing is stored — the processing happens right here.
        </p>
      </section>

      <section className="fp-tool-grid" aria-label="Available tools">
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </section>
    </div>
  );
}
