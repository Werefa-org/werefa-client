"use client";

import { useActionState, useEffect, useState } from "react";

import { setupBusinessAction, type SetupState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import {
  cacheLocation,
  readCachedLocation,
  requestLocation,
} from "@/lib/geo";

const initial: SetupState = undefined;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function SetupForm() {
  const [state, action, pending] = useActionState(setupBusinessAction, initial);

  const [bizName, setBizName] = useState(state?.fields?.biz_name ?? "");
  const [slug, setSlug] = useState(state?.fields?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(
    Boolean(state?.fields?.slug),
  );
  const [latitude, setLatitude] = useState(state?.fields?.latitude ?? "");
  const [longitude, setLongitude] = useState(state?.fields?.longitude ?? "");
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude || longitude) return;
    const cached = readCachedLocation();
    if (cached) {
      setLatitude(String(cached.lat));
      setLongitude(String(cached.lng));
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(bizName));
  }, [bizName, slugTouched]);

  async function useDevice() {
    setLocating(true);
    setLocError(null);
    try {
      const c = await requestLocation();
      cacheLocation(c);
      setLatitude(String(c.lat));
      setLongitude(String(c.lng));
    } catch (e) {
      setLocError(e instanceof Error ? e.message : "Could not get location");
    } finally {
      setLocating(false);
    }
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field
        label="Business name"
        name="biz_name"
        required
        autoComplete="organization"
        value={bizName}
        onChange={(e) => setBizName(e.target.value)}
        placeholder="Cafe Aroma"
      />
      <Field
        label="Slug"
        name="slug"
        required
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value.toLowerCase());
        }}
        placeholder="cafe-aroma"
      />

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="mt-0.5 text-xs text-muted">
              Helps customers find you on Discover.
            </p>
          </div>
          <button
            type="button"
            onClick={useDevice}
            disabled={locating}
            className="shrink-0 cursor-pointer rounded-2xl border border-border bg-background px-3 py-2 text-xs text-foreground hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            {locating ? "Locating…" : "Use my location"}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field
            label="Latitude"
            name="latitude"
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="40.7128"
          />
          <Field
            label="Longitude"
            name="longitude"
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="-74.0060"
          />
        </div>
        {locError ? (
          <p className="mt-2 text-xs text-danger" role="alert">
            {locError}
          </p>
        ) : null}
      </div>

      <Field
        label="Join radius (meters)"
        name="join_radius_m"
        type="number"
        min={1}
        step={1}
        defaultValue={state?.fields?.join_radius_m ?? "200"}
        placeholder="200"
      />

      {state?.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? "Creating…" : "Create business"}
      </Button>
    </form>
  );
}
