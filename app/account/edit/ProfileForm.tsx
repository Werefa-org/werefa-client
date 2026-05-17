"use client";

import { useActionState, useEffect, useState } from "react";
import { Info, Save, RotateCcw, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { updateProfileAction } from "./actions";
import type { Me } from "@/lib/dal";

export function ProfileForm({ user }: { user: Me }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, undefined);

  const [fullName, setFullName] = useState(user.full_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");

  const [localSuccess, setLocalSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setLocalSuccess(true);
      const timer = setTimeout(() => setLocalSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  function handleCancel() {
    setFullName(user.full_name || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phone_number || "");
  }

  const hasChanges =
    fullName !== (user.full_name || "") ||
    email !== (user.email || "") ||
    phoneNumber !== (user.phone_number || "");

  // Real-time validations
  let validationError = "";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^\+\d{7,15}$/;

  if (fullName && (fullName.trim().length < 2 || fullName.trim().length > 100)) {
    validationError = "Full name must be between 2 and 100 characters.";
  } else if (!email) {
    validationError = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    validationError = "Please enter a valid email address.";
  } else if (phoneNumber && !PHONE_RE.test(phoneNumber)) {
    validationError = "Phone number must be in E.164 international format (e.g., +1234567890).";
  }

  const isSaveDisabled = !hasChanges || !!validationError || pending;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {localSuccess ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-950 p-4 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200">
          Profile updated successfully!
        </div>
      ) : null}

      {state?.error ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 text-rose-950 p-4 text-sm font-medium animate-in fade-in duration-200" role="alert">
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <Field
          label="Full Name"
          name="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. John Doe"
          maxLength={100}
        />

        <div className="flex flex-col gap-1.5">
          <Field
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g. john@example.com"
          />
          {email !== user.email ? (
            <div className="flex items-start gap-1.5 px-1 text-xs text-amber-600 leading-normal animate-in fade-in duration-200">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>Warning: Changing your email will alter your login credentials.</span>
            </div>
          ) : null}
        </div>

        <Field
          label="Phone Number"
          name="phone_number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g. +1234567890"
        />
      </div>

      {validationError ? (
        <p className="text-sm text-danger font-medium animate-in fade-in px-1" role="alert">
          {validationError}
        </p>
      ) : null}

      <div className="flex gap-3 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={!hasChanges || pending}
          className="flex-1"
        >
          <RotateCcw className="h-4 w-4 mr-1.5" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaveDisabled}
          className="flex-1 flex gap-2 items-center justify-center"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
