import { requireMe } from "@/lib/dal";

export default async function MeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireMe();
  return <>{children}</>;
}
