"use server";

import { redirect } from "next/navigation";

import { apiFetch, ApiRequestError } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";
import { getProviderId } from "@/lib/session";

type ServiceItemPublic = components["schemas"]["ServiceItemPublic"];

export type ServiceFormState =
  | {
      error?: string;
      fields?: {
        name?: string;
        avg_duration_minutes?: string;
        price?: string;
        is_active?: boolean;
      };
    }
  | undefined;

const PRICE_RE = /^(?!^[-+.]*$)0*\d*\.?\d*$/;

function parseFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const durationRaw = String(formData.get("avg_duration_minutes") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const is_active = formData.get("is_active") === "on";
  return {
    name,
    durationRaw,
    price,
    is_active,
    fields: {
      name,
      avg_duration_minutes: durationRaw,
      price,
      is_active,
    },
  };
}

function validate({
  name,
  durationRaw,
  price,
}: {
  name: string;
  durationRaw: string;
  price: string;
}): string | null {
  if (name.length < 1 || name.length > 120) {
    return "Name is required (1–120 characters).";
  }
  const duration = Number(durationRaw);
  if (!Number.isInteger(duration) || duration < 1 || duration > 1440) {
    return "Duration must be a whole number between 1 and 1440 minutes.";
  }
  if (!PRICE_RE.test(price)) {
    return "Price must be a non-negative number (e.g. 0, 5, 5.50).";
  }
  return null;
}

export async function createServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const providerId = await getProviderId();
  if (!providerId) redirect("/dashboard");

  const parsed = parseFields(formData);
  const err = validate(parsed);
  if (err) return { error: err, fields: parsed.fields };

  try {
    await apiFetch<ServiceItemPublic>(
      `/providers/${providerId}/services/`,
      {
        method: "POST",
        body: {
          name: parsed.name,
          avg_duration_minutes: Number(parsed.durationRaw),
          price: parsed.price,
          is_active: parsed.is_active,
        },
      },
    );
  } catch (e) {
    if (e instanceof ApiRequestError) {
      return { error: e.detail, fields: parsed.fields };
    }
    return { error: "Something went wrong. Try again.", fields: parsed.fields };
  }

  redirect("/dashboard/services");
}

export async function updateServiceAction(
  serviceId: string,
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const providerId = await getProviderId();
  if (!providerId) redirect("/dashboard");

  const parsed = parseFields(formData);
  const err = validate(parsed);
  if (err) return { error: err, fields: parsed.fields };

  try {
    await apiFetch<ServiceItemPublic>(
      `/providers/${providerId}/services/${serviceId}`,
      {
        method: "PATCH",
        body: {
          name: parsed.name,
          avg_duration_minutes: Number(parsed.durationRaw),
          price: parsed.price,
          is_active: parsed.is_active,
        },
      },
    );
  } catch (e) {
    if (e instanceof ApiRequestError) {
      return { error: e.detail, fields: parsed.fields };
    }
    return { error: "Something went wrong. Try again.", fields: parsed.fields };
  }

  redirect("/dashboard/services");
}
