"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-3 flex w-full cursor-pointer items-center gap-2 rounded-xl bg-surface px-3 py-2 text-left text-xs text-muted transition-colors hover:bg-zinc-100"
      aria-label={copied ? "Copied" : "Copy id"}
    >
      <code className="flex-1 truncate font-mono">{id}</code>
      {copied ? (
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden />
      )}
    </button>
  );
}
