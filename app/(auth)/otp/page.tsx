import { redirect } from "next/navigation";
import { OtpVerifyForm } from "./OtpVerifyForm";

export default function OtpVerificationPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email?.trim();

  if (!email) {
    redirect("/login/otp");
  }

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        Enter Verification Code
      </h1>
      <p className="mb-6 text-sm text-muted">
        We sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>.
      </p>

      <OtpVerifyForm email={email} />
    </div>
  );
}
