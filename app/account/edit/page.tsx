import { EditProfileClient } from "./EditProfileClient";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireMe } from "@/lib/dal";

export default async function EditAccountPage() {
  const me = await requireMe();

  return (
    <AppShell>
      <PageHeader
        title="Edit Account"
        subtitle="Manage your profile & security"
        back="/account"
      />

      <EditProfileClient user={me} />
    </AppShell>
  );
}
