"use client";

import { useActionState, useEffect, useState } from "react";

import { removeMemberAction, type RemoveMemberState } from "./actions";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";

const initial: RemoveMemberState = undefined;

export function RemoveMemberDialog({
  providerId,
  memberUserId,
  label,
  disabled,
}: {
  providerId: string;
  memberUserId: string;
  label: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    removeMemberAction.bind(null, providerId, memberUserId),
    initial,
  );

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state?.success]);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-danger disabled:cursor-not-allowed disabled:opacity-40"
      >
        Remove
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Remove member">
        <div className="flex flex-col gap-4">
          <p className="text-sm">
            Are you sure you want to remove <strong>{label}</strong>? They will
            lose access to this provider.
          </p>
          {state?.error ? (
            <p className="text-sm text-danger" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <form action={action}>
            <Button type="submit" disabled={pending} aria-busy={pending}>
              {pending ? "Removing…" : "Remove member"}
            </Button>
          </form>
        </div>
      </Sheet>
    </>
  );
}
