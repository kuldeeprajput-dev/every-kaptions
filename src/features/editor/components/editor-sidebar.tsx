"use client";

import { CircleHelp, Film, ImageIcon, MessageSquare, Plus, X } from "lucide-react";
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
        "fixed bottom-0 left-0 top-[56px] z-30 flex w-[266px] flex-col border-r border-white/8 bg-[#0b0c0c] p-4 transition-transform md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <button
        type="button"
        className="absolute right-3 top-3 grid size-9 place-items-center text-dim md:hidden"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X size={20} />
      </button>
      <button
        type="button"
        onClick={onUpload}
        className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber font-bold text-black"
      >
        <Plus size={16} /> New caption
      </button>
      <nav className="mt-5 space-y-1">
        {sidebarLinks.map(({ label, icon: Icon, href, comingSoon }, index) => {
          const content = (
            <>
              <Icon size={17} className="shrink-0 md:hidden" />
              <span>{label}</span>
              {comingSoon ? <span className="ml-auto rounded-full bg-white/6 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#737b7f]">Soon</span> : null}
            </>
          );
          const className = cn(
            "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium",
            index === 0 ? "bg-[#181818] text-cream" : "text-[#949494] hover:bg-white/4 hover:text-cream",
            comingSoon && "cursor-not-allowed opacity-70 hover:bg-transparent hover:text-[#949494]",
          );

          if (comingSoon) return <button key={label} type="button" disabled className={className}>{content}</button>;
          if (href) return <Link key={label} href={href} onClick={onClose} className={className}>{content}</Link>;
          return <button key={label} type="button" onClick={onClose} className={className} aria-current="page">{content}</button>;
        })}
      </nav>
      <div className="mt-auto border-t border-white/8 pt-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold tracking-[.12em] text-[#6f7b82]">YOUR PLAN</p>
          <span className="rounded-full bg-white/6 px-2 py-1 text-[9px] font-bold uppercase text-[#899195]">{plan.planName}</span>
        </div>
        <PlanRow label="Transcription" value={`${plan.remainingMinutes.toFixed(1)} min left`} percent={plan.transcriptionPercent} />
        <PlanRow label="Exports" value={`${plan.remainingExports} of 3 left`} percent={plan.exportsPercent} />
        <p className="mt-3 text-xs text-[#667177]">Usage resets in {plan.resetDays} days</p>
        <Link href="/pricing" className="mt-4 flex min-h-10 items-center justify-center rounded-xl bg-amber text-sm font-bold !text-black">
          Upgrade
        </Link>
      </div>
    </aside>
  );
}

function PlanRow({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#6f7b82]">{label}</span>
        <strong className="text-white">{value}</strong>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-amber transition-[width]" style={{ width: `${Math.max(3, percent)}%` }} />
      </div>
    </div>
  );
}
