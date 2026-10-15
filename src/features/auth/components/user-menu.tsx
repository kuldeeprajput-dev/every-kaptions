"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../store/auth-store";

export function UserMenu() {
  const { user, openAuthModal } = useAuth();
  return user ? (
    <Link
      href="/studio"
      className="action-primary !min-h-10 !px-4 !py-2 !text-xs"
    >
      Open studio <ArrowUpRight size={15} />
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => openAuthModal("signin")}
      className="action-secondary !min-h-10 !px-4 !py-2 !text-xs"
    >
      Sign in
    </button>
  );
}
