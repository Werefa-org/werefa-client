import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      <header className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-accent-foreground">
            W
          </span>
          Werefa
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
