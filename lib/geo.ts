"use client";

const KEY = "werefa.location.v1";

export type Coords = { lat: number; lng: number };

export function readCachedLocation(): Coords | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Coords;
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number" &&
      Number.isFinite(parsed.lat) &&
      Number.isFinite(parsed.lng)
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function cacheLocation(c: Coords): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // ignore
  }
}

export function clearCachedLocation(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function requestLocation(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (
      typeof navigator === "undefined" ||
      !("geolocation" in navigator)
    ) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || "Location permission denied")),
      { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 10_000 },
    );
  });
}
