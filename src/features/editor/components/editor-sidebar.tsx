"use client";

import { CircleHelp, Film, ImageIcon, MessageSquare, Plus, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { usePlanSummary } from "../store/plan-store";

const sidebarLinks = [
  { label: "My reels", icon: Film, href: "/studio" },
  { label: "Thumbnails", icon: ImageIcon, href: "", comingSoon: true },
  { label: "Help & support", icon: CircleHelp, href: "/support" },
  { label: "Share feedback", icon: MessageSquare, href: "mailto:hello@everykaptions.com" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
};

export function EditorSidebar({ open, onClose, onUpload }: Props) {
  const plan = usePlanSummary();

  return (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-[56px] z-30 flex w-[266px] flex-col border-r border-white/8 bg-[#0c0b0a] p-4 transition-transform md:translate-x-0 font-sans custom-scrollbar",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Mobile close button header */}
      <div className="flex items-center justify-between pb-2 md:hidden">
        <span className="text-xs font-bold uppercase tracking-wider text-[#788187]">Menu</span>
        <button
          type="button"
          className="grid size-8 place-items-center rounded-full text-[#888] hover:bg-white/10 hover:text-white transition cursor-pointer"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* New Caption Action Button */}
      <button
        type="button"
        onClick={onUpload}
        className="mt-1 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f6c453] via-[#fbd172] to-[#e0af3a] text-sm font-bold text-black shadow-[0_4px_20px_rgba(246,196,83,0.22)] transition hover:brightness-110 hover:shadow-[0_6px_24px_rgba(246,196,83,0.35)] active:scale-[0.98] cursor-pointer"
      >
        <Plus size={18} strokeWidth={2.5} />
        <span>New caption</span>
      </button>

      {/* Navigation items */}
      <nav className="mt-6 space-y-1.5">
        {sidebarLinks.map(({ label, icon: Icon, href, comingSoon }, index) => {
          const isActive = index === 0;
          const content = (
            <>
              <Icon
                size={17}
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-[#f6c453]" : "text-[#788187] group-hover:text-white",
                )}
              />
              <span>{label}</span>
              {comingSoon ? (
                <span className="ml-auto rounded-full bg-white/6 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#666]">
                  Soon
                </span>
              ) : null}
            </>
          );

          const className = cn(
            "group flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-medium transition cursor-pointer relative",
            isActive
              ? "bg-[#181714] text-white border border-[#f6c453]/20 shadow-sm"
              : "text-[#999] hover:bg-white/5 hover:text-white border border-transparent",
            comingSoon && "cursor-not-allowed opacity-60 hover:bg-transparent hover:text-[#999]",
          );

          if (comingSoon) {
            return (
              <button key={label} type="button" disabled className={className}>
                {content}
              </button>
            );
          }

          if (href) {
            return (
              <Link key={label} href={href} onClick={onClose} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <button key={label} type="button" onClick={onClose} className={className} aria-current="page">
              {content}
            </button>
          );
        })}
      </nav>

      {/* Bottom Usage Plan Box */}
      <div className="mt-auto rounded-2xl border border-white/8 bg-[#131210] p-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold tracking-[.14em] text-[#6f7b82]">YOUR PLAN</p>
          <span className="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[9px] font-bold uppercase text-[#a0a8ac]">
            {plan.planName}
          </span>
        </div>

        <PlanRow label="Transcription" value={`${plan.remainingMinutes.toFixed(1)} min left`} percent={plan.transcriptionPercent} />
        <PlanRow label="Exports" value={`${plan.remainingExports} of 3 left`} percent={plan.exportsPercent} />

        <p className="mt-3 text-[11px] text-[#667177]">
          Usage resets in <strong className="text-[#a0a8ac]">{plan.resetDays} days</strong>
        </p>

        <Link
          href="/pricing"
          className="mt-3.5 flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#f6c453] text-xs font-bold text-black shadow-md transition hover:bg-white active:scale-[0.98] !text-black"
        >
          <Sparkles size={13} />
          <span>Upgrade Plan</span>
        </Link>
      </div>
    </aside>
  );
}

function PlanRow({ label, value, percent }: { label: string; value: string; percent: number }) {
  const safePercent = Math.min(100, Math.max(0, percent));
  return (
    <div className="mt-3.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#889297] text-[11px] font-medium">{label}</span>
        <strong className="text-white text-xs font-bold">{value}</strong>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#262626]">
        <div
          className="h-full rounded-full bg-[#f6c453] transition-all duration-300"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}
