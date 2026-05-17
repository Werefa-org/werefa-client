"use client";

import { useActionState, useEffect, useState } from "react";

import { addMemberAction, type AddMemberState } from "./actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Sheet } from "@/components/ui/Sheet";

const initial: AddMemberState = undefined;

export function AddMemberModal({ providerId }: { providerId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    addMemberAction.bind(null, providerId),
    initial,
  );

  useEffect(() => {
    if (state?.success) setOpen(false);
  }, [state?.success]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="h-9 px-3 text-sm"
        onClick={() => setOpen(true)}
      >
        Add member
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Add member">
        <form action={action} className="flex flex-col gap-3">
          <div>
            <Field
              label="User ID"
              name="user_id"
              required
              defaultValue={state?.fields?.user_id}
              placeholder="2b0c87c7-5a9b-4d72-8f33-9bb55d3a3a63"
            />
            <p className="mt-1 text-xs text-muted">
              Paste the staff member's user ID from their account.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-sm font-medium">Role</p>
            <p className="mt-0.5 text-xs text-muted">
              Staff can operate the queue. Owners can manage staff.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
                <span>Staff</span>
                <input
                  type="radio"
                  name="role"
                  value="staff"
                  defaultChecked
                  className="h-4 w-4 accent-accent"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
                <span>Owner</span>
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  className="h-4 w-4 accent-accent"
                />
              </label>
            </div>
          </div>

          {state?.error ? (
            <p className="text-sm text-danger" role="alert">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" disabled={pending} aria-busy={pending}>
            {pending ? "Adding…" : "Add member"}
          </Button>
        </form>
      </Sheet>
    </>
  );
}
