import { requireMe } from "@/lib/dal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireMe();
  return <>{children}</>;
}
