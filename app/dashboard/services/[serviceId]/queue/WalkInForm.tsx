"use client";

import { UserPlus } from "lucide-react";
import { useActionState, useRef, useState } from "react";

import { type QueueActionState, walkInAction } from "./actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Sheet } from "@/components/ui/Sheet";

const initial: QueueActionState = undefined;

export function WalkInForm({ serviceId }: { serviceId: string }) {
  const action = walkInAction.bind(null, serviceId);
  const [state, dispatch, pending] = useActionState(action, initial);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 text-base font-medium text-foreground hover:bg-surface"
      >
        <UserPlus className="h-4 w-4" aria-hidden />
        Add walk-in
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Add walk-in">
        <form
          ref={formRef}
          action={async (fd) => {
            await dispatch(fd);
            formRef.current?.reset();
          }}
          className="flex flex-col gap-4 pb-4"
        >
          <Field
            label="Name (optional)"
            name="guest_name"
            maxLength={100}
            placeholder="Anna"
          />
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
          <Button type="submit" disabled={pending} aria-busy={pending}>
            {pending ? "Adding…" : "Add to queue"}
          </Button>
        </form>
      </Sheet>
    </>
  );
}
