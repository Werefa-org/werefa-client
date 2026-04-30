"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiRequestError } from "@/lib/api/server";
import type { components } from "@/lib/api/schema";

type QueueEntry = components["schemas"]["QueueEntryPublic"];

export type QueueActionState =
  | { ok: true; message: string }
  | { error: string }
  | undefined;

export async function callNextAction(
  serviceId: string,
  _prev: QueueActionState,
  _fd: FormData,
): Promise<QueueActionState> {
  try {
    const next = await apiFetch<QueueEntry | null>(
      `/service-items/${serviceId}/call-next`,
      { method: "POST" },
    );
    revalidatePath(`/dashboard/services/${serviceId}/queue`);
    if (!next) return { ok: true, message: "Line is empty." };
    const who = next.guest_name ? ` — ${next.guest_name}` : "";
    return { ok: true, message: `Now serving #${next.ticket_number}${who}.` };
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.detail };
    return { error: "Could not call next. Try again." };
  }
}

async function patchStatus(
  serviceId: string,
  ticketId: string,
  status: "completed" | "no_show",
): Promise<QueueActionState> {
  try {
    const updated = await apiFetch<QueueEntry>(
      `/service-items/${serviceId}/tickets/${ticketId}/status`,
      { method: "PATCH", body: { status } },
    );
    revalidatePath(`/dashboard/services/${serviceId}/queue`);
    const label = status === "completed" ? "Completed" : "Marked no-show";
    return { ok: true, message: `${label} #${updated.ticket_number}.` };
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.detail };
    return { error: "Could not update ticket. Try again." };
  }
}

export async function completeTicketAction(
  serviceId: string,
  ticketId: string,
  _prev: QueueActionState,
  _fd: FormData,
): Promise<QueueActionState> {
  return patchStatus(serviceId, ticketId, "completed");
}

export async function noShowTicketAction(
  serviceId: string,
  ticketId: string,
  _prev: QueueActionState,
  _fd: FormData,
): Promise<QueueActionState> {
  return patchStatus(serviceId, ticketId, "no_show");
}

export async function walkInAction(
  serviceId: string,
  _prev: QueueActionState,
  formData: FormData,
): Promise<QueueActionState> {
  const guest_name = String(formData.get("guest_name") ?? "").trim();
  if (guest_name.length > 100) {
    return { error: "Name must be 100 characters or fewer." };
  }
  try {
    const t = await apiFetch<QueueEntry>(
      `/service-items/${serviceId}/walk-in`,
      {
        method: "POST",
        body: { guest_name: guest_name === "" ? null : guest_name },
      },
    );
    revalidatePath(`/dashboard/services/${serviceId}/queue`);
    const who = guest_name ? ` — ${guest_name}` : "";
    return { ok: true, message: `Added #${t.ticket_number}${who}.` };
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.detail };
    return { error: "Could not add walk-in. Try again." };
  }
}
