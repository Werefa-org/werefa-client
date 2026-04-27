import Link from "next/link";

type Mode = "login" | "signup";

export function AuthTabs({ active }: { active: Mode }) {
  const tab = (mode: Mode, label: string, href: string) => {
    const isActive = mode === active;
    return (
      <Link
        href={href}
        className={`flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? "bg-background text-foreground shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        {label}
      </Link>
    );
  };
  return (
    <div className="mb-6 flex gap-1 rounded-2xl bg-surface p-1">
      {tab("login", "Log in", "/login")}
      {tab("signup", "Sign up", "/signup")}
    </div>
  );
}
