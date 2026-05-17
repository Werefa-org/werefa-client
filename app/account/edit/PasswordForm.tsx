"use client";

import { useActionState, useEffect, useState } from "react";
import { KeyRound, Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { updatePasswordAction } from "./actions";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(updatePasswordAction, undefined);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [localSuccess, setLocalSuccess] = useState(false);

  // Clear inputs and show success status when password updates successfully
  useEffect(() => {
    if (state?.success) {
      setLocalSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      const timer = setTimeout(() => setLocalSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Real-time validations
  let validationError = "";
  if (!currentPassword) {
    validationError = "Current password is required.";
  } else if (newPassword.length < 8) {
    validationError = "New password must be at least 8 characters long.";
  } else if (newPassword === currentPassword) {
    validationError = "New password cannot be the same as current password.";
  } else if (newPassword !== confirmPassword) {
    validationError = "Passwords do not match.";
  }

  const isSubmitDisabled = !currentPassword || !newPassword || !confirmPassword || !!validationError || pending;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {localSuccess ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-950 p-4 text-center text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span>Password changed successfully!</span>
        </div>
      ) : null}

      {state?.error ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 text-rose-950 p-4 text-sm font-medium animate-in fade-in duration-200" role="alert">
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <Field
          label="Current Password"
          name="current_password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          placeholder="Enter current password"
        />

        <Field
          label="New Password"
          name="new_password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="Min 8 characters"
        />

        <Field
          label="Confirm New Password"
          name="confirm_password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Re-enter new password"
        />
      </div>

      {validationError && (currentPassword || newPassword || confirmPassword) ? (
        <p className="text-sm text-danger font-medium animate-in fade-in px-1" role="alert">
          {validationError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitDisabled}
        className="mt-2 flex gap-2 items-center justify-center"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating Password...
          </>
        ) : (
          <>
            <KeyRound className="h-4 w-4" />
            Change Password
          </>
        )}
      </Button>
    </form>
  );
}
