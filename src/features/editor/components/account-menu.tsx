"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { useAuth } from "@/features/auth/store/auth-store";
import { usePlanSummary } from "../store/plan-store";

const accountLinks = [
  { label: "Home", href: "/" },
  { label: "Help & support", href: "/support" },
  { label: "Share feedback", href: "mailto:hello@everykaptions.com" },
  { label: "Terms of Service", href: "/legal/terms", policy: true },
  { label: "Privacy Policy", href: "/legal/privacy", policy: true },
  { label: "Refund Policy", href: "/legal/refund", policy: true },
  { label: "Try the caption editor", href: "/editor/demo" },
  { label: "Upgrade", href: "/pricing" },
] as const;

export function AccountMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { user, signOut, openAuthModal } = useAuth();
  const plan = usePlanSummary();
  const router = useRouter();

  const resetDateString = new Date(
    Date.now() + plan.resetDays * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-7 sm:h-8 items-center gap-1 sm:gap-1.5 rounded-lg bg-surface hover:bg-surface border border-hairline px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-cream transition cursor-pointer shrink-0"
      >
        <span>My account</span>
        <span className="text-[8px] sm:text-[9px] text-body">▼</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 sm:top-11 z-50 w-[276px] max-w-[calc(100vw-24px)] rounded-2xl border border-hairline bg-surface p-4 sm:p-5 shadow-sm font-sans"
          >
            {/* Email */}
            <p className="truncate text-sm font-normal text-cream">
              {user?.email || "Guest workspace"}
            </p>

            {/* Plan Badge */}
            <div className="mt-3.5">
              <span className="inline-block rounded-lg border border-hairline bg-surface px-3 py-0.5 text-[11px] font-bold tracking-wider text-body uppercase">
                {plan.planName || "FREE"}
              </span>
            </div>

            {/* Minutes available */}
            <p className="mt-3 text-base font-bold text-cream">
              {plan.remainingMinutes.toFixed(2)} min available
            </p>

            {/* Exports used */}
            <p className="mt-1 text-xs text-body">
              Exports: {3 - plan.remainingExports} of 3 used this month
            </p>

            {/* Refresh date */}
            <p className="mt-1 text-xs text-dim">
              Refreshes on {resetDateString}
            </p>

            {/* Divider line */}
            <div className="my-3.5 h-px bg-surface" />

            {/* Navigation links */}
            <div className="space-y-2">
              {accountLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onToggle}
                  className={cn(
                    "block text-sm font-normal transition-colors py-0.5",
                    "policy" in item && item.policy
                      ? "!text-amber hover:!text-amber"
                      : "!text-cream hover:!text-cream",
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {/* Sign out */}
              <button
                type="button"
                onClick={async () => {
                  onToggle();
                  if (user) { await signOut(); router.push("/"); } else { openAuthModal("signin"); }
                }}
                className="mt-1 block w-full text-left py-0.5 text-sm font-normal !text-[#f87171] hover:!text-red-700 transition-colors cursor-pointer"
              >
                {user ? "Sign out" : "Sign in"}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
