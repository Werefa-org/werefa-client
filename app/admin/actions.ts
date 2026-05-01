"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiRequestError } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";
import { requireAdmin } from "@/lib/dal";

type ProviderPublic = components["schemas"]["ProviderPublic"];
type UserPublic = components["schemas"]["UserPublic"];

export type AdminState =
  | { ok: true; message: string }
  | { error: string }
  | undefined;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readId(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim().toLowerCase();
}

async function verifyProvider(id: string): Promise<AdminState> {
  await requireAdmin();
  if (!UUID_RE.test(id)) return { error: "Provider id must be a valid UUID." };
  try {
    const p = await apiFetch<ProviderPublic>(
      `/admin/providers/${id}/verify`,
      { method: "POST" },
    );
    revalidatePath("/admin");
    return { ok: true, message: `${p.biz_name} → ${p.verification_status}` };
  } catch (e) {
    if (e instanceof ApiRequestError) return { error: e.detail };
    return { error: "Something went wrong. Try again." };
  }
}

async function rejectProvider(id: string): Promise<AdminState> {
  await requireAdmin();
  if (!UUID_RE.test(id)) return { error: "Provider id must be a valid UUID." };
  try {
    const p = await apiFetch<ProviderPublic>(
      `/admin/providers/${id}/reject`,
      { method: "POST" },
    );
    revalidatePath("/admin");
    return { ok: true, message: `${p.biz_name} → ${p.verification_status}` };
  } catch (e) {
    if (e instanceof ApiRequestError) return { error: e.detail };
    return { error: "Something went wrong. Try again." };
  }
}

async function unblockUser(id: string): Promise<AdminState> {
  await requireAdmin();
  if (!UUID_RE.test(id)) return { error: "User id must be a valid UUID." };
  try {
    const u = await apiFetch<UserPublic>(`/admin/users/${id}/unblock`, {
      method: "POST",
    });
    return {
      ok: true,
      message: `${u.email} unblocked (joins_blocked_until: ${u.joins_blocked_until ?? "—"})`,
    };
  } catch (e) {
    if (e instanceof ApiRequestError) return { error: e.detail };
    return { error: "Something went wrong. Try again." };
  }
}

export async function verifyProviderAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return verifyProvider(readId(formData, "provider_id"));
}

export async function rejectProviderAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return rejectProvider(readId(formData, "provider_id"));
}

export async function unblockUserAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  return unblockUser(readId(formData, "user_id"));
}

export async function inlineVerifyProvider(
  id: string,
  _prev: AdminState,
  _fd: FormData,
): Promise<AdminState> {
  return verifyProvider(id);
}

export async function inlineRejectProvider(
  id: string,
  _prev: AdminState,
  _fd: FormData,
): Promise<AdminState> {
  return rejectProvider(id);
}
