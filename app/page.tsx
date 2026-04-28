import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { Discover } from "@/components/Discover";
import { Button } from "@/components/ui/Button";
import { getMe } from "@/lib/dal";

export default async function Home() {
  const me = await getMe();

  return (
    <AppShell>
      <header className="mb-6 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-accent text-accent-foreground">
            W
          </span>
          Werefa
        </span>
        {!me ? (
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-foreground"
          >
            Log in
          </Link>
        ) : null}
      </header>

      {!me ? (
        <div className="mb-5 rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm font-medium">Skip the line.</p>
          <p className="mt-1 text-sm text-muted">
            Browse anonymously — sign in to join a queue.
          </p>
          <div className="mt-3">
            <Link href="/signup" className="contents">
              <Button>Create account</Button>
            </Link>
          </div>
        </div>
      ) : null}

      <Discover />
    </AppShell>
  );
}
