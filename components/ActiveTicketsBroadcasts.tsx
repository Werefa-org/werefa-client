"use client";

import { useEffect, useState } from "react";
import { useBroadcasts, type Broadcast } from "@/hooks/useBroadcasts";
import { BroadcastBanner } from "./BroadcastBanner";

type Ticket = {
  id: string;
  provider_id: string;
  service_item_id: string;
};

export function ActiveTicketsBroadcasts({
  tickets,
  token,
}: {
  tickets: Ticket[];
  token: string | null;
}) {
  const [allBroadcasts, setAllBroadcasts] = useState<Broadcast[]>([]);

  // Find unique provider IDs
  const uniqueProviders = Array.from(new Set(tickets.map((t) => t.provider_id)));

  useEffect(() => {
    let active = true;
    if (uniqueProviders.length === 0 || !token) return;

    async function loadAll() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const fetchPromises = uniqueProviders.map(async (providerId) => {
          const res = await fetch(`${baseUrl}/api/v1/providers/${providerId}/broadcasts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const json = await res.json();
            return json.data || [];
          }
          return [];
        });

        const results = await Promise.all(fetchPromises);
        const merged: Broadcast[] = results.flat();
        
        if (active) {
          // De-duplicate by ID
          const seen = new Set();
          const uniqueMerged = merged.filter((b) => {
            const duplicate = seen.has(b.id);
            seen.add(b.id);
            return !duplicate;
          });
          setAllBroadcasts(uniqueMerged);
        }
      } catch (e) {
        console.error("Failed to load broadcasts for tickets list", e);
      }
    }

    loadAll();
    return () => {
      active = false;
    };
  }, [tickets, token]);

  if (allBroadcasts.length === 0) return null;

  return <BroadcastBanner broadcasts={allBroadcasts} />;
}
