import { ChevronRight, Plus, Settings } from "lucide-react";
import Link from "next/link";

import { manageBusinessAction, selectBusinessAction } from "./actions";
import { CopyId } from "./CopyId";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { getMe, getMyProvider, listMyProviders } from "@/lib/dal";

export default async function DashboardPage() {
  const [me, providers, selected] = await Promise.all([
    getMe(),
    listMyProviders(),
    getMyProvider(),
  ]);

  const isProvider = me?.user_type === "provider";
  const selectedId = selected?.id ?? null;

  return (
    <AppShell>
      <PageHeader title="Business" back="/account" />

      {providers.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {providers.map((p) => {
            const isSelected = p.id === selectedId;
            const verified = p.verification_status === "verified";
            const manage = manageBusinessAction.bind(null, p.id);
            const select = selectBusinessAction.bind(null, p.id);
            return (
              <li
                key={p.id}
                className={`overflow-hidden rounded-2xl border bg-background ${
                  isSelected ? "border-accent" : "border-border"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-semibold tracking-tight">
                        {p.biz_name}
                      </h2>
                      <p className="mt-0.5 truncate text-sm text-muted">
                        /{p.slug}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusPill status={p.verification_status} />
                      {p.membership_role ? (
                        <StatusPill status={p.membership_role} />
                      ) : null}
                    </div>
                  </div>
                  <CopyId id={p.id} />
                </div>

                <div className="grid grid-cols-2 border-t border-border">
                  {verified ? (
                    <form action={manage}>
                      <button
                        type="submit"
                        className="flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 text-sm font-medium text-accent hover:bg-surface"
                      >
                        <Settings className="h-4 w-4" aria-hidden />
                        Manage
                      </button>
                    </form>
                  ) : (
                    <span className="flex h-12 items-center justify-center text-xs text-muted">
                      Locked until verified
                    </span>
                  )}
                  {!isSelected ? (
                    <form
                      action={select}
                      className="border-l border-border"
                    >
                      <button
                        type="submit"
                        className="h-12 w-full cursor-pointer text-sm font-medium text-muted hover:bg-surface"
                      >
                        Set active
                      </button>
                    </form>
                  ) : (
                    <span className="flex h-12 items-center justify-center border-l border-border text-xs font-medium text-accent">
                      Active
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {providers.length === 0 && isProvider ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">No businesses yet</p>
          <p className="mt-1 text-sm text-muted">
            Create your first one below.
          </p>
        </div>
      ) : null}

      <Link
        href="/dashboard/setup"
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-sm font-medium text-muted hover:border-accent hover:bg-surface hover:text-accent"
      >
        <Plus className="h-4 w-4" aria-hidden />
        {providers.length === 0 ? "Create your first business" : "Add another business"}
      </Link>
    </AppShell>
  );
}
