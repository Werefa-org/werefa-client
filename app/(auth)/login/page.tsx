import Link from "next/link";
import { Suspense } from "react";

import { AuthTabs } from "../AuthTabs";
import { LoginForm } from "./LoginForm";

function LoginMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg bg-success/20 p-3 text-sm text-success">
      {message}
    </div>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        Welcome back
      </h1>
      <p className="mb-6 text-sm text-muted">Log in to skip the line.</p>
      <AuthTabs active="login" />
      <Suspense>
        <LoginMessage message={searchParams?.message ?? null} />
      </Suspense>
      <LoginForm />
    </div>
  );
}
