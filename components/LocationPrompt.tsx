"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { cacheLocation, type Coords, requestLocation } from "@/lib/geo";

export function LocationPrompt({
  onLocation,
}: {
  onLocation: (c: Coords) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState(false);

  async function useDevice() {
    setBusy(true);
    setError(null);
    try {
      const c = await requestLocation();
      cacheLocation(c);
      onLocation(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not get location");
      setManual(true);
    } finally {
      setBusy(false);
    }
  }

  function submitManual(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const lat = Number(fd.get("lat"));
    const lng = Number(fd.get("lng"));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setError("Enter valid latitude and longitude.");
      return;
    }
    const c = { lat, lng };
    cacheLocation(c);
    onLocation(c);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Find places near you
        </h2>
        <p className="mt-1 text-sm text-muted">
          Werefa needs your location to show queues nearby.
        </p>
      </div>
      <Button onClick={useDevice} disabled={busy}>
        {busy ? "Locating…" : "Use my location"}
      </Button>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {manual ? (
        <form onSubmit={submitManual} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field
              name="lat"
              label="Latitude"
              type="number"
              step="any"
              required
              placeholder="40.7128"
            />
            <Field
              name="lng"
              label="Longitude"
              type="number"
              step="any"
              required
              placeholder="-74.0060"
            />
          </div>
          <Button type="submit" variant="secondary">
            Set location manually
          </Button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setManual(true)}
          className="self-center text-sm text-muted hover:text-foreground"
        >
          Enter coordinates instead
        </button>
      )}
    </div>
  );
}
