"use client";

import { ChevronsRight } from "lucide-react";
import { useActionState } from "react";

import { callNextAction, type QueueActionState } from "./actions";

const initial: QueueActionState = undefined;

export function CallNextButton({
  serviceId,
  waitingCount,
}: {
  serviceId: string;
  waitingCount: number;
}) {
  const action = callNextAction.bind(null, serviceId);
  const [state, dispatch, pending] = useActionState(action, initial);

  const empty = waitingCount === 0;

  return (
    <div className="flex flex-col gap-2">
      <form action={dispatch}>
        <button
          type="submit"
          disabled={pending || empty}
          aria-busy={pending}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-base font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-muted"
        >
          <ChevronsRight className="h-5 w-5" aria-hidden />
          {pending
            ? "Calling…"
            : empty
              ? "Line is empty"
              : `Call next · ${waitingCount} waiting`}
        </button>
      </form>
      {state && "ok" in state && state.ok ? (
        <p
          className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          role="status"
        >
          ✓ {state.message}
        </p>
      ) : null}
      {state && "error" in state && state.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
