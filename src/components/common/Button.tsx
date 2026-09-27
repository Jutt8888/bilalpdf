import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = ["fp-button", `fp-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {icon && <span className="fp-button__icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
