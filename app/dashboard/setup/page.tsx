import { SetupForm } from "./SetupForm";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SetupPage() {
  return (
    <AppShell>
      <PageHeader title="Create your business" back="/dashboard" />
      <p className="-mt-2 mb-4 text-sm text-muted">
        Add the basics so customers can find you nearby. Edit anything later.
      </p>
      <SetupForm />
    </AppShell>
  );
}
