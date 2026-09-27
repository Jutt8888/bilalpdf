import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import "./StatusBanner.css";

interface StatusBannerProps {
  kind: "error" | "success" | "processing";
  message: string;
}

const ICONS = {
  error: AlertTriangle,
  success: CheckCircle2,
  processing: Loader2,
};

export default function StatusBanner({ kind, message }: StatusBannerProps) {
  const Icon = ICONS[kind];

  return (
    <div className={`fp-status fp-status--${kind}`} role="status">
      <Icon size={17} className={kind === "processing" ? "fp-status__spin" : undefined} />
      <span>{message}</span>
    </div>
  );
}
