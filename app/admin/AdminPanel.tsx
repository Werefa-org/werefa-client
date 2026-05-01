"use client";

import { useActionState } from "react";

import type { AdminState } from "./actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

type Action = (prev: AdminState, formData: FormData) => Promise<AdminState>;

const initial: AdminState = undefined;

export function AdminPanel({
  title,
  description,
  idLabel,
  idName,
  placeholder,
  submitLabel,
  pendingLabel,
  action,
}: {
  title: string;
  description?: string;
  idLabel: string;
  idName: "provider_id" | "user_id";
  placeholder?: string;
  submitLabel: string;
  pendingLabel: string;
  action: Action;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4"
    >
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        ) : null}
      </div>
      <Field
        label={idLabel}
        name={idName}
        required
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder={placeholder}
      />
      {state && "error" in state && state.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      {state && "ok" in state && state.ok ? (
        <p
          className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          role="status"
        >
          ✓ {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
