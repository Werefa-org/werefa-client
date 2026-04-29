"use client";

import { ChevronRight, Clock, X as XIcon } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { cancelTicketAction, type CancelState } from "./actions";
import { StatusPill } from "@/components/ui/StatusPill";
import type { components } from "@/lib/api/schema";

type Ticket = components["schemas"]["QueueEntryPublic"];

const initial: CancelState = undefined;

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

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const action = cancelTicketAction.bind(
    null,
    ticket.service_item_id,
    ticket.id,
  );
  const [state, dispatch, pending] = useActionState(action, initial);
  const cancellable = ticket.status === "waiting";

  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-background">
      <Link
        href={`/me/tickets/${ticket.id}`}
        className="flex items-center gap-3 p-4 transition-colors hover:bg-surface"
      >
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
          <span className="text-lg font-semibold tracking-tight">
            #{ticket.ticket_number}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusPill status={ticket.status} />
          </div>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
            <Clock className="h-3 w-3" aria-hidden />
            Joined {relativeTime(ticket.joined_at) ?? "—"}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />
      </Link>

      {state?.error ? (
        <p className="border-t border-border px-4 py-2 text-xs text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      {cancellable ? (
        <form action={dispatch} className="border-t border-border">
          <button
            type="submit"
            disabled={pending}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 px-3 text-xs font-medium text-muted hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XIcon className="h-3.5 w-3.5" aria-hidden />
            {pending ? "Cancelling…" : "Cancel ticket"}
          </button>
        </form>
      ) : null}
    </li>
  );
}
