"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { LocationPrompt } from "./LocationPrompt";
import { ProviderCard } from "./ProviderCard";
import { api } from "@/lib/api/client";
import type { components } from "@/lib/api/schema";
import {
  cacheLocation,
  clearCachedLocation,
  type Coords,
  readCachedLocation,
} from "@/lib/geo";

type DiscoveryResponse = components["schemas"]["ProviderDiscoveriesPublic"];

function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function Discover() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search.trim(), 300);

  useEffect(() => {
    setCoords(readCachedLocation());
    setHydrated(true);
  }, []);

  const query = useQuery<DiscoveryResponse>({
    enabled: !!coords,
    queryKey: [
      "discover",
      coords?.lat,
      coords?.lng,
      debouncedSearch || null,
    ],
    queryFn: () =>
      api<DiscoveryResponse>("/providers/discover", {
        query: {
          latitude: coords!.lat,
          longitude: coords!.lng,
          query: debouncedSearch || undefined,
          limit: 20,
        },
      }),
  });

  if (!hydrated) return null;

  if (!coords) {
    return (
      <LocationPrompt
        onLocation={(c) => {
          cacheLocation(c);
          setCoords(c);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            inputMode="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nearby"
            className="block h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-base placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            clearCachedLocation();
            setCoords(null);
          }}
          aria-label="Change location"
          className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-2xl border border-border bg-background text-muted hover:bg-surface hover:text-foreground"
        >
          <MapPin className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {query.isLoading ? (
        <SkeletonList />
      ) : query.isError ? (
        <p className="text-sm text-danger" role="alert">
          {(query.error as Error)?.message ?? "Could not load providers."}
        </p>
      ) : query.data && query.data.count > 0 ? (
        <ul className="flex flex-col gap-3">
          {query.data.data.map((p) => (
            <li key={p.id}>
              <ProviderCard p={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">Nothing nearby</p>
          <p className="mt-1 text-sm text-muted">
            Try a different search or move closer to a city.
          </p>
        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="h-[88px] animate-pulse rounded-2xl border border-border bg-surface"
        />
      ))}
    </ul>
  );
}
