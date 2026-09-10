import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import { useAuth } from "@/features/auth/store/auth-store";

const accountLinks = [
  { label: "Home", href: "/" },
  { label: "Help & support", href: "/support" },
  { label: "Share feedback", href: "#" },
  { label: "Terms of Service", href: "#", policy: true },
  { label: "Privacy Policy", href: "#", policy: true },
  { label: "Refund Policy", href: "#", policy: true },
  { label: "Take tour", href: "#" },
  { label: "Keyboard shortcuts", href: "#" },
  { label: "Upgrade", href: "/pricing" },
] as const;

export function AccountMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="hidden min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-cream sm:flex"
      >
        My account <ChevronDown size={15} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 top-12 w-[278px] rounded-xl border border-white/15 bg-[#151515] p-4 shadow-2xl"
          >
            <p className="truncate text-sm font-medium text-[#f4ecdc]">
              {user?.email || "Signed in"}
            </p>
            <span className="mt-4 inline-block rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px]">FREE</span>
            <p className="mt-3 text-sm font-bold text-cream">3 min available</p>
            <p className="mt-1 text-xs text-[#8b8b8b]">Exports: 0 of 3 used this month</p>
            <p className="mt-2 text-xs text-[#777]">Refreshes on Oct 1, 2026</p>
            <div className="my-4 h-px bg-white/10" />
            {accountLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "block px-1 py-2 text-sm hover:text-cream",
                  "policy" in item && item.policy ? "text-amber" : "text-copy",
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="mt-1 block w-full text-left px-1 py-2 text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
