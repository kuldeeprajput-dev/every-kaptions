"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node)) onToggle(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onToggle(); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, onToggle]);


  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="studio-account-options"
        aria-label="My account"
        className="studio-account-trigger"
      >
        <UserRound size={15} aria-hidden="true" /><span>My account</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="studio-account-options"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="studio-account-dropdown"
          >
            <div className="studio-account-heading"><span className="studio-account-avatar"><UserRound size={19} aria-hidden="true" /></span><div><strong>My account</strong><p title={user?.email}>{user?.email || "Guest workspace"}</p></div><span className="studio-plan-badge">{plan.planName}</span></div>
            <div className="studio-account-usage"><strong>{plan.remainingMinutes.toFixed(2)} min available</strong><p>{plan.remainingExports} exports left · resets in {plan.resetDays} days</p></div>
            <nav className="studio-account-navigation" aria-label="Account navigation">
              {accountLinks.filter(item => !("policy" in item)).map(item => <Link key={item.href} href={item.href} onClick={onToggle} className="studio-account-link">{item.label}</Link>)}
            </nav>
            <nav className="studio-account-policies" aria-label="Account policies">{accountLinks.filter(item => "policy" in item).map(item => <Link key={item.href} href={item.href} onClick={onToggle}>{item.label.replace(" of Service", "").replace(" Policy", "")}</Link>)}</nav>
            <div>
              {/* Sign out */}
              <button
                type="button"
                onClick={async () => {
                  onToggle();
                  if (user) { await signOut(); router.push("/"); } else { openAuthModal("signin"); }
                }}
                className="studio-account-link studio-account-signout"
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
