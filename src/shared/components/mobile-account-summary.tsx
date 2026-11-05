"use client";

import { UserRound } from "lucide-react";
import { useAuth } from "@/features/auth/store/auth-store";

export function MobileAccountSummary() {
  const { user } = useAuth();
  if (!user) return null;

  return <div className="mb-2 flex items-center gap-3 rounded-lg border border-[#ededf0] bg-[#fafafa] p-3">
    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#e4e4e7] bg-white text-[#62626c]"><UserRound size={17} aria-hidden="true" /></span>
    <div className="min-w-0">
      <p className="truncate text-[13px] font-semibold text-[#27272a]">{user.user_metadata?.full_name || "My account"}</p>
      <p className="mt-0.5 truncate text-[11px] text-[#71717a]" title={user.email}>{user.email}</p>
    </div>
  </div>;
}
