import { Compass, Ticket as TicketIcon } from "lucide-react";
import Link from "next/link";

import { TicketCard } from "./TicketCard";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { listMyTickets } from "@/lib/dal";

export default async function MyTicketsPage() {
  const tickets = await listMyTickets();

  const sorted = [...tickets].sort((a, b) => {
    const ta = a.joined_at ? Date.parse(a.joined_at) : 0;
    const tb = b.joined_at ? Date.parse(b.joined_at) : 0;
    return tb - ta;
  });

  return (
    <AppShell>
      <PageHeader title="My tickets" subtitle="Active queue entries" />

      {sorted.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface text-muted">
            <TicketIcon className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium">No active tickets</p>
          <p className="max-w-[260px] text-sm text-muted">
            Find a place on the home page to join a queue.
          </p>
          <Link href="/" className="mt-2 contents">
            <Button>
              <span className="inline-flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Browse nearby
              </span>
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {sorted.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </ul>
      )}
    </AppShell>
  );
}
