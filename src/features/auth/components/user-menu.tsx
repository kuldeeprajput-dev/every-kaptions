"use client";

import Link from "next/link";
import { useAuth } from "../store/auth-store";

export function UserMenu() {
  const { user, openAuthModal } = useAuth();

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal("signin")}
        className="inline-flex items-center justify-center px-4 py-2 min-h-[38px] text-[13px] font-semibold text-[#f4ecdc] border border-[rgba(244,236,220,0.22)] rounded-full hover:border-[rgba(244,236,220,0.45)] hover:bg-[rgba(244,236,220,0.04)] transition-all cursor-pointer whitespace-nowrap"
      >
        Sign in
      </button>
    );
  }

  return (
    <Link
      href="/studio"
      className="btn-open-app inline-flex items-center justify-center box-border no-underline bg-cream !text-[#0c0b0a] text-[13px] font-semibold rounded-full cursor-pointer px-[18px] min-h-[44px] shadow-[var(--gold-glow)] hover:-translate-y-px hover:shadow-[var(--gold-glow-hover)] transition-[transform,box-shadow] duration-150 whitespace-nowrap max-[420px]:min-h-[40px] max-[420px]:px-3.5 max-[420px]:text-xs max-[360px]:px-2.5"
    >
      Open app
    </Link>
  );
}
