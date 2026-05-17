"use client";

import { useState } from "react";
import { User, KeyRound } from "lucide-react";

import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";
import type { Me } from "@/lib/dal";

export function EditProfileClient({ user }: { user: Me }) {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Selector */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-all duration-200 focus:outline-none ${
            activeTab === "profile"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <User className="h-4.5 w-4.5" />
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-all duration-200 focus:outline-none ${
            activeTab === "password"
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <KeyRound className="h-4.5 w-4.5" />
          Change Password
        </button>
      </div>

      {/* Tab Contents with elegant animations */}
      <div className="mt-2 transition-all duration-300">
        {activeTab === "profile" ? (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <ProfileForm user={user} />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            <PasswordForm />
          </div>
        )}
      </div>
    </div>
  );
}
