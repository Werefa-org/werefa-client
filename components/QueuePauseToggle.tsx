"use client";

import { useState, useTransition } from "react";
import { Loader2, Pause, Play, AlertCircle } from "lucide-react";
import { pauseProviderQueueAction, resumeProviderQueueAction } from "@/app/dashboard/services/[serviceId]/queue/actions";

export function QueuePauseToggle({
  providerId,
  isPaused,
  setIsPaused,
}: {
  providerId: string;
  isPaused: boolean;
  setIsPaused: (val: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleToggle() {
    setError("");
    startTransition(async () => {
      const res = isPaused
        ? await resumeProviderQueueAction(providerId)
        : await pauseProviderQueueAction(providerId);

      if (res.ok) {
        setIsPaused(!isPaused);
        setIsOpen(false);
      } else {
        setError(res.error || "Failed to update queue state.");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      {/* 1. Status Indicator Badge */}
      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border shadow-sm ${
        isPaused
          ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400"
          : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400"
      }`}>
        <span className={`h-1.5 w-1.5 rounded-full ${
          isPaused ? "bg-rose-500 animate-pulse" : "bg-emerald-500 animate-pulse"
        }`} />
        <span>Queue: {isPaused ? "Paused" : "Open"}</span>
      </div>

      {/* 2. Toggle trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold shadow-sm transition-all border cursor-pointer ${
          isPaused
            ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
            : "bg-background border-border text-foreground hover:bg-surface"
        }`}
      >
        {isPaused ? (
          <>
            <Play className="h-3 w-3" />
            Resume joins
          </>
        ) : (
          <>
            <Pause className="h-3 w-3 text-muted" />
            Pause joins
          </>
        )}
      </button>

      {/* 3. Confirmation Dialog Modal Overlay */}
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => {
              if (!isPending) setIsOpen(false);
            }}
          />
          
          {/* Card container */}
          <div className="relative w-full max-w-sm rounded-3xl border border-border bg-background p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                isPaused ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
              }`}>
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {isPaused ? "Resume remote joins?" : "Pause remote joins?"}
              </h3>
            </div>

            {error ? (
              <div className="mt-3.5 flex items-start gap-1.5 rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs font-semibold text-rose-950">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            ) : null}

            <p className="mt-3 text-xs text-muted leading-relaxed">
              {isPaused
                ? "Remote customers will once again be allowed to join the queue line using the mobile application."
                : "Remote customers will not be able to join the queue online. Staff can still register walk-in customers manually on the board."}
            </p>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-border bg-background py-2 text-xs font-semibold hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleToggle}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 ${
                  isPaused
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : isPaused ? (
                  "Confirm Resume"
                ) : (
                  "Confirm Pause"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
