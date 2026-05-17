"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiRequestError } from "@/lib/api/server";
import { requireMe } from "@/lib/dal";

export type ProfileUpdateState =
  | {
      error?: string;
      success?: boolean;
      fields?: {
        biz_name?: string;
        latitude?: string;
        longitude?: string;
        join_radius_m?: string;
        is_open?: boolean;
        is_paused?: boolean;
        is_private?: boolean;
      };
    }
  | undefined;

function parseOptionalNumber(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export async function updateProviderAction(
  providerId: string,
  _prev: ProfileUpdateState,
  formData: FormData,
): Promise<ProfileUpdateState> {
  await requireMe();

  const biz_name = String(formData.get("biz_name") ?? "").trim();
  const latRaw = String(formData.get("latitude") ?? "");
  const lngRaw = String(formData.get("longitude") ?? "");
  const radiusRaw = String(formData.get("join_radius_m") ?? "");
  const is_open = formData.get("is_open") === "true";
  const is_paused = formData.get("is_paused") === "true";
  const is_private = formData.get("is_private") === "true";

  const fields = {
    biz_name,
    latitude: latRaw,
    longitude: lngRaw,
    join_radius_m: radiusRaw,
    is_open,
    is_paused,
    is_private,
  };

  if (biz_name.length < 2) {
    return { error: "Business name is required.", fields };
  }

  const latitude = parseOptionalNumber(latRaw);
  const longitude = parseOptionalNumber(lngRaw);
  if (latitude === null || longitude === null) {
    return { error: "Latitude and longitude must be numbers.", fields };
  }
  if ((latitude === undefined) !== (longitude === undefined)) {
    return { error: "Set both latitude and longitude, or neither.", fields };
  }

  const join_radius_m = parseOptionalNumber(radiusRaw);
  if (join_radius_m === null || (join_radius_m !== undefined && join_radius_m < 1)) {
    return { error: "Join radius must be a positive number.", fields };
  }

  try {
    await apiFetch(`/providers/${providerId}`, {
      method: "PATCH",
      body: {
        biz_name,
        is_open,
        is_paused,
        is_private,
        latitude: latitude === undefined ? null : latitude,
        longitude: longitude === undefined ? null : longitude,
        join_radius_m: join_radius_m === undefined ? null : join_radius_m,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings/profile");
    revalidatePath("/dashboard/services");

    return { success: true };
  } catch (err) {
    if (err instanceof ApiRequestError) {
      return { error: err.detail, fields };
    }
    return { error: "Something went wrong. Try again.", fields };
  }
}
