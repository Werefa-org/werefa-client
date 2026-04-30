"use client";

import { useActionState } from "react";

import {
  createServiceAction,
  updateServiceAction,
  type ServiceFormState,
} from "./actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import type { components } from "@/lib/api/schema";

type Service = components["schemas"]["ServiceItemPublic"];

const initial: ServiceFormState = undefined;

export function ServiceForm({ service }: { service?: Service }) {
  const action = service
    ? updateServiceAction.bind(null, service.id)
    : createServiceAction;

  const [state, formAction, pending] = useActionState(action, initial);

  const defaults = {
    name: state?.fields?.name ?? service?.name ?? "",
    avg_duration_minutes:
      state?.fields?.avg_duration_minutes ??
      (service ? String(service.avg_duration_minutes) : "15"),
    price: state?.fields?.price ?? service?.price ?? "0",
    is_active:
      state?.fields?.is_active ??
      (service ? service.is_active : true),
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Name"
        name="name"
        required
        maxLength={120}
        defaultValue={defaults.name}
        placeholder="Haircut"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Duration (min)"
          name="avg_duration_minutes"
          type="number"
          min={1}
          max={1440}
          step={1}
          required
          defaultValue={defaults.avg_duration_minutes}
        />
        <Field
          label="Price"
          name="price"
          inputMode="decimal"
          required
          defaultValue={defaults.price}
          placeholder="0"
        />
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
        <span className="text-sm font-medium">Active</span>
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={defaults.is_active}
          className="h-5 w-5 cursor-pointer accent-accent"
        />
      </label>

      {state?.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending
          ? service
            ? "Saving…"
            : "Creating…"
          : service
            ? "Save changes"
            : "Add service"}
      </Button>
    </form>
  );
}
