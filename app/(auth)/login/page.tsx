import Link from "next/link";

import { AuthTabs } from "../AuthTabs";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        Welcome back
      </h1>
      <p className="mb-6 text-sm text-muted">
        Log in to skip the line.
      </p>
      <AuthTabs active="login" />
      <LoginForm />
      <Link
        href="/forgot"
        className="mt-4 self-center text-sm text-muted hover:text-foreground"
      >
        Forgot your password?
      </Link>
    </div>
  );
}
