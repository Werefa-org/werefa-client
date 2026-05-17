"use server";

import { redirect } from "next/navigation";
import { apiFetch, ApiRequestError } from "@/lib/api/server";
import { setSessionToken } from "@/lib/session";
import type { components } from "@/lib/api/schema";

export type OtpState =
  | {
      error?: string;
      success?: boolean;
      email?: string;
    }
  | undefined;

type Token = components["schemas"]["Token"];

function emailLooksValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function requestOtpAction(
  _prev: OtpState,
  formData: FormData,
): Promise<OtpState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!emailLooksValid(email)) {
    return { error: "Enter a valid email address.", email };
  }

  try {
    await apiFetch("/login/otp/request", {
      method: "POST",
      authenticated: false,
      body: { email },
    });
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { error: err.detail, email };
    }
    return { error: "Failed to request OTP code. Try again later.", email };
  }

  redirect(`/otp?email=${encodeURIComponent(email)}`);
}

export async function verifyOtpAction(
  email: string,
  code: string,
): Promise<{ error?: string; success?: boolean }> {
  if (!email || !emailLooksValid(email)) {
    return { error: "Invalid email session. Please request a new code." };
  }

  if (code.length !== 6 || /\D/.test(code)) {
    return { error: "Verification code must be exactly 6 digits." };
  }

  try {
    const token = await apiFetch<Token>("/login/otp/verify", {
      method: "POST",
      authenticated: false,
      body: { email, code },
    });

    await setSessionToken(token.access_token);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { error: err.detail || "Invalid verification code." };
    }
    return { error: "System error during OTP verification." };
  }
}
