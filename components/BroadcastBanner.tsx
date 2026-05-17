"use client";

import { useEffect, useState } from "react";
import { Megaphone, X, Bell } from "lucide-react";
import type { Broadcast } from "@/hooks/useBroadcasts";

function formatTimestamp(isoString: string) {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function BroadcastBanner({
  broadcasts,
}: {
  broadcasts: Broadcast[];
}) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Load dismissed IDs on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dismissed_broadcasts");
      if (stored) {
        setDismissedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load dismissed announcements", e);
    }
  }, []);

  function handleDismiss(id: string) {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem("dismissed_broadcasts", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to store dismissed announcements", e);
    }
  }

  // Filter out dismissed broadcasts
  const activeBroadcasts = broadcasts.filter((b) => !dismissedIds.includes(b.id));

  if (activeBroadcasts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mb-4 animate-in slide-in-from-top duration-300">
      {activeBroadcasts.map((b) => {
        const isCritical = b.severity === "critical";
        const isWarning = b.severity === "warning";

        let bannerStyle = "bg-blue-50/90 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900";
        let iconStyle = "text-blue-600 dark:text-blue-400";
        let badgeText = "Announcement";

        if (isCritical) {
          bannerStyle = "bg-rose-50/90 border-rose-200 text-rose-900 dark:bg-rose-950/25 dark:border-rose-900 animate-pulse-subtle";
          iconStyle = "text-rose-600 dark:text-rose-400";
          badgeText = "Urgent Announcement";
        } else if (isWarning) {
          bannerStyle = "bg-amber-50/90 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900";
          iconStyle = "text-amber-600 dark:text-amber-400";
          badgeText = "Important Notice";
        }

        return (
          <div
            key={b.id}
            className={`flex items-start justify-between gap-3 rounded-2xl border p-4 shadow-sm backdrop-blur-sm transition-all ${bannerStyle}`}
            role="alert"
          >
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {isCritical ? (
                  <Bell className={`h-5 w-5 animate-bounce ${iconStyle}`} />
                ) : (
                  <Megaphone className={`h-5 w-5 ${iconStyle}`} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">
                    {badgeText}
                  </span>
                  <span className="text-[10px] opacity-60">
                    {formatTimestamp(b.created_at || new Date().toISOString())}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium leading-relaxed">{b.body}</p>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(b.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
