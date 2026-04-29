import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { logoutAction } from "../(auth)/actions";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireMe } from "@/lib/dal";

export default async function AccountPage() {
  const me = await requireMe();

  const isProvider = me.user_type === "provider";

  return (
    <AppShell>
      <PageHeader title="Account" subtitle={me.email} />

      <section className="rounded-2xl border border-border bg-background">
        {isProvider ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface"
          >
            <LayoutDashboard className="h-5 w-5 text-muted" aria-hidden />
            <span className="flex-1 text-sm font-medium">
              Business dashboard
            </span>
            <ChevronRight className="h-4 w-4 text-muted" aria-hidden />
          </Link>
        ) : (
          <Link
            href="/dashboard/setup"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface"
          >
            <LayoutDashboard className="h-5 w-5 text-muted" aria-hidden />
            <span className="flex-1 text-sm font-medium">
              Run a business
            </span>
            <ChevronRight className="h-4 w-4 text-muted" aria-hidden />
          </Link>
        )}
        {me.is_superuser ? (
          <Link
            href="/admin"
            className="flex items-center gap-3 border-t border-border px-4 py-3.5 transition-colors hover:bg-surface"
          >
            <ShieldCheck className="h-5 w-5 text-muted" aria-hidden />
            <span className="flex-1 text-sm font-medium">Admin tools</span>
            <ChevronRight className="h-4 w-4 text-muted" aria-hidden />
          </Link>
        ) : null}
      </section>

      <form action={logoutAction} className="mt-4">
        <button
          type="submit"
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 text-sm font-medium text-rose-700 hover:bg-rose-50"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Log out
        </button>
      </form>
    </AppShell>
  );
}
