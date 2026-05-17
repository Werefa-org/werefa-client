import { Bell } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { apiFetch } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";
import { NotificationsList } from "@/components/NotificationsList";

type NotificationsPublic = components["schemas"]["NotificationsPublic"];
type Notification = components["schemas"]["NotificationPublic"];

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
        <NotificationsList initialNotifications={notifications} />
      )}
    </AppShell>
  );
}
