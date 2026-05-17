"use client";

import { RemoveMemberDialog } from "./RemoveMemberDialog";
import { StatusPill } from "@/components/ui/StatusPill";

type MemberItem = {
  membership: {
    id: string;
    user_id: string;
    role: string;
  };
  user?: {
    id: string;
    email: string;
    full_name?: string | null;
  } | null;
};

export function MembersList({
  providerId,
  currentUserId,
  canManage,
  items,
}: {
  providerId: string;
  currentUserId?: string | null;
  canManage: boolean;
  items: MemberItem[];
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-sm font-medium">No members yet</p>
        <p className="mt-1 text-sm text-muted">
          Add your first staff or co-owner.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const label =
          item.user?.full_name || item.user?.email || item.membership.user_id;
        const secondary = item.user?.email
          ? item.user.email
          : `User ID: ${item.membership.user_id}`;
        const isSelf = currentUserId === item.membership.user_id;

        return (
          <li
            key={item.membership.id}
            className="rounded-2xl border border-border bg-background p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{label}</p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {secondary}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={item.membership.role} />
                {isSelf ? (
                  <span className="text-[10px] font-medium text-muted">
                    You
                  </span>
                ) : null}
              </div>
            </div>
            {canManage ? (
              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>Member ID: {item.membership.user_id}</span>
                <RemoveMemberDialog
                  providerId={providerId}
                  memberUserId={item.membership.user_id}
                  label={label}
                  disabled={isSelf}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
