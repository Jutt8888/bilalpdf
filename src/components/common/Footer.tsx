import { ShieldCheck } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="fp-footer">
      <div className="container fp-footer__inner">
        <div className="fp-footer__notice">
          <ShieldCheck size={16} strokeWidth={2.25} />
          <span>Processed locally in your browser. Files are never uploaded.</span>
        </div>
        <span className="fp-footer__copy">Fusion PDF</span>
      </div>
    </footer>
  );
}
