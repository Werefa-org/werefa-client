"use server";

import { redirect } from "next/navigation";

import { apiFetch, ApiRequestError } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";
import { clearSession, setSessionToken } from "@/lib/session";

export type AuthState = {
  error?: string;
  fields?: { email?: string; full_name?: string };
} | undefined;

type Token = components["schemas"]["Token"];

async function exchangePassword(
  email: string,
  password: string,
): Promise<Token> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);
  return apiFetch<Token>("/login/access-token", {
    method: "POST",
    body,
    authenticated: false,
  });
}

function emailLooksValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!emailLooksValid(email)) {
    return { error: "Enter a valid email.", fields: { email } };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", fields: { email } };
  }

  try {
    const token = await exchangePassword(email, password);
    await setSessionToken(token.access_token);
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return {
        error:
          err.status === 400 || err.status === 401
            ? "Wrong email or password."
            : err.detail,
        fields: { email },
      };
    }
    return { error: "Something went wrong. Try again.", fields: { email } };
  }

  redirect("/");
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim() || undefined;
  const userType = String(formData.get("user_type") ?? "customer");
  const user_type: "customer" | "provider" =
    userType === "provider" ? "provider" : "customer";

  if (!emailLooksValid(email)) {
    return { error: "Enter a valid email.", fields: { email, full_name } };
  }
  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters.",
      fields: { email, full_name },
    };
  }

  try {
    await apiFetch("/users/signup", {
      method: "POST",
      authenticated: false,
      body: { email, password, full_name, user_type },
    });
    const token = await exchangePassword(email, password);
    await setSessionToken(token.access_token);
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { error: err.detail, fields: { email, full_name } };
    }
    return { error: "Something went wrong. Try again.", fields: { email, full_name } };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
