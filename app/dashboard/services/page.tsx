import { ChevronRight, Clock, Plus, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { getMyProvider, listMyServices } from "@/lib/dal";

function formatPrice(p: string): string {
  const n = Number(p);
  if (!Number.isFinite(n)) return p;
  if (n === 0) return "Free";
  return n.toFixed(2);
}

export default async function ServicesPage() {
  const provider = await getMyProvider();
  if (!provider) redirect("/dashboard");

  const verified = provider.verification_status === "verified";
  const services = verified ? await listMyServices() : [];

  return (
    <AppShell>
      <PageHeader
        title="Services"
        subtitle={provider.biz_name}
        back="/dashboard"
      />

      {!verified ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <p className="text-sm font-medium">
            Service editing locked
          </p>
          <p className="mt-1 text-sm">
            An admin needs to verify <strong>{provider.biz_name}</strong>{" "}
            before you can add services. Current status:{" "}
            <StatusPill status={provider.verification_status} />
          </p>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">No services yet</p>
          <p className="mt-1 text-sm text-muted">
            Add the first thing customers can queue for.
          </p>
          <Link
            href="/dashboard/services/new"
            className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-accent px-4 text-sm font-medium text-accent-foreground hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add service
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {services.map((s) => (
              <li
                key={s.id}
                className="overflow-hidden rounded-2xl border border-border bg-background"
              >
                <Link
                  href={`/dashboard/services/${s.id}`}
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-surface"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-semibold tracking-tight">
                        {s.name}
                      </h3>
                      {!s.is_active ? (
                        <StatusPill status="closed">Inactive</StatusPill>
                      ) : null}
                    </div>
                    <p className="mt-0.5 inline-flex items-center gap-3 text-sm text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {s.avg_duration_minutes} min
                      </span>
                      <span>{formatPrice(s.price)}</span>
                    </p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted"
                    aria-hidden
                  />
                </Link>
                <Link
                  href={`/dashboard/services/${s.id}/queue`}
                  className="flex h-11 items-center justify-center gap-1.5 border-t border-border text-sm font-medium text-accent hover:bg-surface"
                >
                  <Users className="h-4 w-4" aria-hidden />
                  View queue
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard/services/new"
            className="mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-sm font-medium text-muted hover:border-accent hover:bg-surface hover:text-accent"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add service
          </Link>
        </>
      )}
    </AppShell>
  );
}
