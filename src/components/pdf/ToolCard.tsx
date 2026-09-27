import { Link } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import type { ToolDefinition } from "../../types/tool";
import "./ToolCard.css";

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  const isAvailable = tool.path !== null;

  const content = (
    <>
      <div className="fp-tool-card__body">
        <h3 className="fp-tool-card__title">{tool.name}</h3>
        <p className="fp-tool-card__description">{tool.description}</p>
      </div>
      <div className="fp-tool-card__footer">
        {isAvailable ? (
          <span className="fp-tool-card__cta">
            Open tool <ArrowRight size={15} />
          </span>
        ) : (
          <span className="fp-tool-card__soon">
            <Lock size={13} /> Coming soon
          </span>
        )}
      </div>
    </>
  );

  if (!isAvailable) {
    return (
      <div className="fp-tool-card fp-tool-card--disabled" aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link to={tool.path as string} className="fp-tool-card">
      {content}
    </Link>
  );
}
