import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { apiFetch, ApiRequestError } from "./api/server";
import type { components } from "./api/schema";
import { clearProviderId, getProviderId, getSessionToken } from "./session";

export type Me = components["schemas"]["UserPublic"];
export type MyProvider = components["schemas"]["MyProviderPublic"];
export type MyService = components["schemas"]["ServiceItemPublic"];
type MyProvidersList = components["schemas"]["MyProvidersPublic"];
export type DiscoveredProvider =
  components["schemas"]["ProviderDiscoveryPublic"];
export type Discoveries = components["schemas"]["ProviderDiscoveriesPublic"];
export type MyTicket = components["schemas"]["QueueEntryPublic"];
type MyTickets = components["schemas"]["QueueEntriesPublic"];

export const getMe = cache(async (): Promise<Me | null> => {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await apiFetch<Me>("/users/me", { method: "GET" });
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401) return null;
    throw err;
  }
});

export async function requireMe(): Promise<Me> {
  const me = await getMe();
  if (!me) redirect("/login");
  return me;
}

export async function requireAdmin(): Promise<Me> {
  const me = await requireMe();
  if (!me.is_superuser) redirect("/");
  return me;
}

export const listMyProviders = cache(async (): Promise<MyProvider[]> => {
  try {
    const res = await apiFetch<MyProvidersList>("/users/me/providers/", {
      method: "GET",
    });
    return res.data;
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401) return [];
    throw err;
  }
});

export const getMyProvider = cache(async (): Promise<MyProvider | null> => {
  const providers = await listMyProviders();
  if (providers.length === 0) return null;
  const selectedId = await getProviderId();
  if (selectedId) {
    const match = providers.find((p) => p.id === selectedId);
    if (match) return match;
    await clearProviderId();
  }
  return providers[0];
});

export const listMyServices = cache(async (): Promise<MyService[]> => {
  const id = await getProviderId();
  if (!id) return [];
  try {
    return await apiFetch<MyService[]>(`/providers/${id}/services/`, {
      method: "GET",
    });
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) return [];
    throw err;
  }
});

export const getMyService = cache(
  async (serviceId: string): Promise<MyService | null> => {
    const id = await getProviderId();
    if (!id) return null;
    const services = await listMyServices();
    return services.find((s) => s.id === serviceId) ?? null;
  },
);

export const listMyTickets = cache(async (): Promise<MyTicket[]> => {
  const res = await apiFetch<MyTickets>("/service-items/me/tickets", {
    method: "GET",
  });
  return res.data;
});

export const listAllProviders = cache(async (): Promise<DiscoveredProvider[]> => {
  const res = await apiFetch<Discoveries>("/providers/discover", {
    method: "GET",
    query: {
      latitude: 0,
      longitude: 0,
      radius_m: 20_000_000,
      include_unverified: true,
      include_paused: true,
      include_private: true,
      only_open: false,
      limit: 100,
    },
  });
  return res.data;
});
