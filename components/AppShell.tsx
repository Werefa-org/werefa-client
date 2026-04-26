import { BottomNav } from "./BottomNav";

export function AppShell({
  children,
  showNav = true,
}: {
  children: React.ReactNode;
  showNav?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col pb-4">
        {children}
      </div>
      {showNav ? <BottomNav /> : null}
    </div>
  );
}
