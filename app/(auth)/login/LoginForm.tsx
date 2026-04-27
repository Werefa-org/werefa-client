"use client";

import { useActionState } from "react";

import { loginAction, type AuthState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const initial: AuthState = undefined;

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={state?.fields?.email}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        minLength={8}
        placeholder="••••••••"
      />
      {state?.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}
