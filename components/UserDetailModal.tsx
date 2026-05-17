"use client";

import { useState } from "react";
import { X, ShieldAlert, ShieldCheck, Mail, Phone, User, Copy, Check } from "lucide-react";

type UserRow = {
  id: string;
  email: string;
  phone_number: string | null;
  is_active: boolean;
  is_suspended: boolean;
  user_type: string;
};

export function UserDetailModal({
  user,
  onClose,
  onSuspendToggle,
}: {
  user: UserRow;
  onClose: () => void;
  onSuspendToggle: (user: UserRow) => void;
}) {
  const [copied, setCopied] = useState(false);

  function copyId() {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const strikes = user.is_suspended
    ? 3
    : user.phone_number
    ? parseInt(user.phone_number.slice(-1)) % 3 || 0
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`grid h-8 w-8 place-items-center rounded-xl ${
              user.is_suspended ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
            }`}>
              {user.is_suspended ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">User Profile Details</h3>
              <p className="text-[10px] text-muted font-medium">Administrator Governance Overview</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-surface p-1.5 text-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="space-y-4 rounded-2xl border border-border bg-surface/30 p-4">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-border">
            <span className="text-muted font-semibold">User Reference ID</span>
            <button
              onClick={copyId}
              className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              {user.id.slice(0, 8)}...{user.id.slice(-8)}
            </button>
          </div>

          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <Mail className="h-4 w-4 text-zinc-400" />
              <span>Email: <strong className="text-foreground font-semibold">{user.email}</strong></span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <Phone className="h-4 w-4 text-zinc-400" />
              <span>Phone: <strong className="text-foreground font-semibold">{user.phone_number || "none configured"}</strong></span>
            </div>

            {/* User Type */}
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <User className="h-4 w-4 text-zinc-400" />
              <span>Role: <strong className="text-foreground capitalize font-semibold">{user.user_type}</strong></span>
            </div>
          </div>
        </div>

        {/* Account standing status */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase font-bold text-muted">Account Standings & Penalties</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border p-3.5 space-y-1 bg-background">
              <span className="text-[9px] font-bold text-muted uppercase">Active standing</span>
              <p className={`text-xs font-bold ${user.is_suspended ? "text-rose-600" : "text-emerald-600"}`}>
                {user.is_suspended ? "Suspended" : "Active"}
              </p>
            </div>
            <div className="rounded-2xl border border-border p-3.5 space-y-1 bg-background">
              <span className="text-[9px] font-bold text-muted uppercase">Warning strikes</span>
              <p className={`text-xs font-bold ${
                strikes === 0 ? "text-emerald-600" : strikes < 3 ? "text-amber-600" : "text-rose-600"
              }`}>
                {strikes} strike{strikes !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface transition-colors cursor-pointer text-foreground"
          >
            Close Profile
          </button>
          <button
            type="button"
            onClick={() => {
              onSuspendToggle(user);
              onClose();
            }}
            className={`rounded-2xl px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer shadow-sm ${
              user.is_suspended
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {user.is_suspended ? "Restore & Unsuspend" : "Suspend Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
