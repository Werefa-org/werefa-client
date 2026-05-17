"use client";

import { useActionState } from "react";

import { forgotPasswordAction, type AuthState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const initial: AuthState = undefined;

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    forgotPasswordAction,
    initial,
  );

  if (state?.success) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center mx-auto">
          <svg
            className="w-6 h-6 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-sm font-medium">
          Check your email for recovery link
        </p>
        <p className="text-xs text-muted">
          We've sent a password reset link to your email. The link expires in 1
          hour.
        </p>
      </div>
    );
  }

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
      {state?.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Sending reset link…" : "Send reset link"}
      </Button>
      <a
        href="/login"
        className="text-sm text-muted hover:text-foreground transition-colors text-center"
      >
        Back to login
      </a>
    </form>
  );
}
