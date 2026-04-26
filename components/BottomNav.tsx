"use client";

import { Bell, Home, Ticket, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/me/tickets",
    label: "Tickets",
    icon: Ticket,
    match: (p: string) => p.startsWith("/me/tickets"),
  },
  {
    href: "/me/notifications",
    label: "Inbox",
    icon: Bell,
    match: (p: string) => p.startsWith("/me/notifications"),
  },
  {
    href: "/account",
    label: "Account",
    icon: User,
    match: (p: string) =>
      p === "/account" ||
      p.startsWith("/dashboard") ||
      p.startsWith("/admin"),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 -mx-6 mt-auto border-t border-border bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <ul className="grid grid-cols-4 gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex h-12 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-medium transition-colors ${
                  active
                    ? "text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
