import "server-only";

import { cookies } from "next/headers";

import {
  PROVIDER_ID_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "./env";

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
} as const;

export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, cookieOpts);
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function getProviderId(): Promise<string | null> {
  const store = await cookies();
  return store.get(PROVIDER_ID_COOKIE)?.value ?? null;
}

export async function selectProvider(id: string): Promise<void> {
  const store = await cookies();
  store.set(PROVIDER_ID_COOKIE, id, cookieOpts);
}

export async function setProviderId(id: string): Promise<void> {
  await selectProvider(id);
}

export async function clearProviderId(): Promise<void> {
  const store = await cookies();
  store.delete(PROVIDER_ID_COOKIE);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(PROVIDER_ID_COOKIE);
}
