export function formatDistance(m: number | null | undefined): string {
  if (m == null) return "";
  if (m < 950) return `${Math.round(m / 10) * 10} m`;
  return `${(m / 1000).toFixed(m < 9500 ? 1 : 0)} km`;
}

export function formatWait(min: number | null | undefined): string {
  if (min == null) return "—";
  if (min < 1) return "no wait";
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60);
  const r = min % 60;
  return r ? `~${h}h ${r}m` : `~${h}h`;
}

export function loadColor(load: string | null | undefined): string {
  switch (load) {
    case "low":
      return "bg-emerald-500";
    case "medium":
      return "bg-amber-500";
    case "high":
      return "bg-rose-500";
    default:
      return "bg-zinc-300";
  }
}
