import { Bell, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { apiFetch } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";

type NotificationsPublic = components["schemas"]["NotificationsPublic"];
type Notification = components["schemas"]["NotificationPublic"];

function relativeTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  const diff = Date.now() - t;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default async function NotificationsPage() {
  const res = await apiFetch<NotificationsPublic>("/me/notifications", {
    method: "GET",
    query: { limit: 50 },
  });
  const notifications: Notification[] = res.data;

  return (
    <AppShell>
      <PageHeader title="Inbox" subtitle="Updates about your tickets" />

      {notifications.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface text-muted">
            <Bell className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">No notifications yet</p>
          <p className="max-w-[260px] text-sm text-muted">
            You&apos;ll see updates here when your line moves.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {notifications.map((n) => {
            const inner = (
              <>
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <StatusPill status={n.kind} />
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted">
                        <Clock className="h-3 w-3" aria-hidden />
                        {relativeTime(n.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{n.body}</p>
                    {n.position != null ? (
                      <p className="mt-1 text-xs text-muted">
                        Position {n.position}
                      </p>
                    ) : null}
                  </div>
                  {n.ticket_id ? (
                    <ChevronRight
                      className="h-4 w-4 shrink-0 self-center text-muted"
                      aria-hidden
                    />
                  ) : null}
                </div>
              </>
            );
            return (
              <li
                key={n.id}
                className="rounded-2xl border border-border bg-background p-4"
              >
                {n.ticket_id ? (
                  <Link
                    href={`/me/tickets/${n.ticket_id}`}
                    className="block transition-colors hover:opacity-80"
                  >
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
