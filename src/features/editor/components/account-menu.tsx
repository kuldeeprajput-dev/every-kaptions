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
  { label: "Take tour", href: "#" },
  { label: "Keyboard shortcuts", href: "#" },
  { label: "Upgrade", href: "/pricing" },
] as const;

export function AccountMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { user, signOut } = useAuth();
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
        className="flex h-8 items-center gap-1.5 rounded-full bg-[#181818] hover:bg-[#222222] border border-white/10 px-3.5 py-1 text-xs font-semibold text-white transition cursor-pointer"
      >
        <span>My account</span>
        <span className="text-[9px] text-[#999]">▼</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 z-50 w-[276px] rounded-2xl border border-[#262626] bg-[#141414] p-5 shadow-2xl font-sans"
          >
            {/* Email */}
            <p className="truncate text-sm font-normal text-[#cccccc]">
              {user?.email || "Signed in"}
            </p>

            {/* Plan Badge */}
            <div className="mt-3.5">
              <span className="inline-block rounded-full border border-[#383838] bg-[#222222] px-3 py-0.5 text-[11px] font-bold tracking-wider text-[#999999] uppercase">
                {plan.planName || "FREE"}
              </span>
            </div>

            {/* Minutes available */}
            <p className="mt-3 text-base font-bold text-white">
              {plan.remainingMinutes.toFixed(2)} min available
            </p>

            {/* Exports used */}
            <p className="mt-1 text-xs text-[#888888]">
              Exports: {3 - plan.remainingExports} of 3 used this month
            </p>

            {/* Refresh date */}
            <p className="mt-1 text-xs text-[#555555]">
              Refreshes on {resetDateString}
            </p>

            {/* Divider line */}
            <div className="my-3.5 h-px bg-[#262626]" />

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
                      ? "!text-[#f6c453] hover:!text-[#fbe09b]"
                      : "!text-[#cccccc] hover:!text-white",
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
                  await signOut();
                  router.push("/");
                }}
                className="mt-1 block w-full text-left py-0.5 text-sm font-normal !text-[#f87171] hover:!text-red-300 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
