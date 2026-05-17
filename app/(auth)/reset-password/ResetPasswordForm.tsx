"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { resetPasswordAction, type AuthState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const initial: AuthState = undefined;

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPasswordAction, initial);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-danger/20 flex items-center justify-center mx-auto">
          <svg
            className="w-6 h-6 text-danger"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="text-sm font-medium">Invalid reset link</p>
        <p className="text-xs text-muted">
          The password reset link is missing or invalid.
        </p>
        <a
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Request a new reset link
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <Field
          label="New Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="••••••••"
        />
        <p className="mt-1 text-xs text-muted">At least 8 characters</p>
      </div>
      <Field
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
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
        {pending ? "Resetting password…" : "Reset password"}
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
