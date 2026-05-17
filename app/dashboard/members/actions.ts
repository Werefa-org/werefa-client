"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiRequestError } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";
import { getMe } from "@/lib/dal";

export type AddMemberState =
  | {
      error?: string;
      success?: boolean;
      fields?: { user_id?: string; role?: string };
    }
  | undefined;

export type RemoveMemberState =
  | {
      error?: string;
      success?: boolean;
    }
  | undefined;

type MembershipRole = components["schemas"]["MembershipRole"];

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeRole(raw: string): MembershipRole {
  return raw === "owner" ? "owner" : "staff";
}

export async function addMemberAction(
  providerId: string,
  _prev: AddMemberState,
  formData: FormData,
): Promise<AddMemberState> {
  const user_id = String(formData.get("user_id") ?? "").trim();
  const role = normalizeRole(String(formData.get("role") ?? "staff"));

  const fields = { user_id, role };

  if (!UUID_RE.test(user_id)) {
    return { error: "Enter a valid user ID.", fields };
  }

  const me = await getMe();
  if (me?.id === user_id) {
    return { error: "You are already a member.", fields };
  }

  try {
    await apiFetch(`/providers/${providerId}/members`, {
      method: "POST",
      body: { user_id, role },
    });
    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { error: err.detail, fields };
    }
    return { error: "Something went wrong. Try again.", fields };
  }
}

export async function removeMemberAction(
  providerId: string,
  memberUserId: string,
  _prev: RemoveMemberState,
): Promise<RemoveMemberState> {
  const me = await getMe();
  if (me?.id === memberUserId) {
    return { error: "You cannot remove yourself." };
  }

  try {
    await apiFetch(`/providers/${providerId}/members/${memberUserId}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/members");
    return { success: true };
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { error: err.detail };
    }
    return { error: "Failed to remove member. Try again." };
  }
}
