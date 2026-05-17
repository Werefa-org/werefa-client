"use client";

import { useEffect, useState } from "react";

export type Broadcast = {
  id: string;
  body: string;
  severity: "info" | "warning" | "critical";
  created_at: string;
  service_item_id: string | null;
};

export function useBroadcasts({
  providerId,
  token,
  wsClient,
}: {
  providerId?: string | null;
  token: string | null;
  wsClient: any;
}) {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  // 1. Load initial broadcasts from REST API
  useEffect(() => {
    let active = true;
    async function load() {
      if (!token || !providerId) {
        setLoading(false);
        return;
      }
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/api/v1/providers/${providerId}/broadcasts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const json = await res.json();
        if (active) {
          setBroadcasts(json.data || []);
        }
      } catch (err) {
        console.error("Error loading broadcasts:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [providerId, token, refreshTrigger]);

  // 2. Subscribe to WebSocket broadcast notifications
  useEffect(() => {
    if (!wsClient) return;

    const unsubscribe = wsClient.onMessage((msg: any) => {
      if (msg.type === "broadcast_v1") {
        const newBroadcast: Broadcast = {
          id: msg.broadcast_id,
          body: msg.body,
          severity: msg.severity,
          created_at: msg.occurred_at,
          service_item_id: msg.service_item_id,
        };

        // Prevent duplicates and add to start
        setBroadcasts((prev) => {
          if (prev.some((b) => b.id === newBroadcast.id)) return prev;
          return [newBroadcast, ...prev];
        });
      }
    });

    return () => { unsubscribe(); };
  }, [wsClient]);

  return { broadcasts, setBroadcasts, loading, refresh };
}
