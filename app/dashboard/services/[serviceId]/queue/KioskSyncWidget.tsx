"use client";

import { useActionState, useEffect } from "react";
import { TabletSmartphone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { syncKioskBatchAction } from "./actions";

export function KioskSyncWidget({ serviceId }: { serviceId: string }) {
  const [state, formAction, isPending] = useActionState(
    syncKioskBatchAction.bind(null, serviceId),
    undefined,
  );

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
        <TabletSmartphone className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium">Kiosk Sync Simulator</h3>
        <p className="text-xs text-muted mt-0.5">Test the offline kiosk batch sync endpoint</p>
        
        {state && "ok" in state && state.ok && (
          <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> {state.message}
          </p>
        )}
        {state && "error" in state && state.error && (
          <p className="mt-2 text-xs text-danger flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {state.error}
          </p>
        )}
      </div>
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <TabletSmartphone className="h-4 w-4" />
          )}
          Sync 3 Walk-ins
        </button>
      </form>
    </div>
  );
}
