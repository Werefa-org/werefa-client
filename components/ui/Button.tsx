import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl px-5 text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-indigo-700",
  secondary:
    "border border-border bg-background text-foreground hover:bg-surface",
  ghost: "text-muted hover:text-foreground",
};

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button {...rest} className={`${base} ${variants[variant]} ${className}`} />
  );
}
