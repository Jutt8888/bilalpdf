import { Link, NavLink } from "react-router-dom";
import { Layers } from "lucide-react";
import "./Header.css";

export default function Header() {
  return (
    <header className="fp-header">
      <div className="container fp-header__inner">
        <Link to="/" className="fp-header__brand">
          <Layers size={20} strokeWidth={2.25} />
          <span>
            Fusion <em>PDF</em>
          </span>
        </Link>

        <nav className="fp-header__nav">
          <NavLink
            to="/merge"
            className={({ isActive }) =>
              isActive ? "fp-header__link fp-header__link--active" : "fp-header__link"
            }
          >
            Merge
          </NavLink>
          <NavLink
            to="/split"
            className={({ isActive }) =>
              isActive ? "fp-header__link fp-header__link--active" : "fp-header__link"
            }
          >
            Split
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
