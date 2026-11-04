"use client";
import {
  ArrowUpRight,
  CircleHelp,
  FolderOpen,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { usePlanSummary } from "../store/plan-store";
const sidebarLinks = [
  { label: "My projects", icon: FolderOpen, href: "/studio" },
  { label: "Help & support", icon: CircleHelp, href: "/support" },
  {
    label: "Share feedback",
    icon: MessageSquare,
    href: "mailto:hello@everykaptions.com",
  },
];
export function EditorSidebar({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
}) {
  const plan = usePlanSummary();
  return (
    <aside id="studio-sidebar" className={cn("studio-sidebar z-[30] [background:var(--surface)] [border-right:1px_solid_var(--hairline)] flex-col w-[224px] [padding:26px_17px_20px] flex fixed [top:72px] [bottom:0] [left:0] [&_nav]:flex-col [&_nav]:gap-[6px] [&_nav]:flex [&_nav_a]:[color:var(--body)] [&_nav_a]:rounded-[7px] [&_nav_a]:items-center [&_nav_a]:gap-[11px] [&_nav_a]:[padding:12px] [&_nav_a]:text-[12px] [&_nav_a]:flex [&_nav_a:hover]:[color:var(--cream)] [&_nav_a:hover]:[background:var(--surface-raised)] [&_nav_a[aria-current]]:[color:var(--accent)] [&_nav_a[aria-current]]:[background:var(--accent-soft)] [&_nav_a[aria-current]]:font-[550] product-max-767:[transition:transform_.2s] product-max-767:[top:64px] product-max-767:[transform:translateX(-100%)] product-max-767:[&.is-open]:[transform:translateX(0)]", open && "is-open")}>
      <div className="studio-sidebar-mobile-heading">
        <span className="text-xs text-dim">WORKSPACE</span>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="grid size-8 place-items-center"
        >
          <X size={18} />
        </button>
      </div>
      <button type="button" onClick={() => { onClose(); onUpload(); }} className="sidebar-create [color:var(--accent)] [border:1px_solid_var(--hairline)] rounded-[8px] items-center gap-[9px] min-h-[42px] mb-[23px] [padding:10px] text-[12px] font-[600] flex [&:hover]:[background:var(--accent-soft)] [&:hover]:[border-color:#f1c9ba]">
        <Plus size={16} /> Create a caption
      </button>
      <nav aria-label="Workspace navigation">
        {sidebarLinks.map(({ label, icon: Icon, href }, i) => (
          <Link
            key={label}
            href={href}
            onClick={onClose}
            aria-current={i === 0 ? "page" : undefined}
          >
            <Icon size={17} strokeWidth={1.7} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom mt-[auto] pt-[30px] [&_>_p]:text-center [&_>_p]:[color:var(--dim)] [&_>_p]:mb-[12px] [&_>_p]:text-[10px]">
        <p>Made for the way you create.</p>
        <div className="usage-panel [border:1px_solid_var(--hairline)] rounded-[9px] [padding:14px] [&_>_small]:[color:var(--dim)] [&_>_small]:text-[9px] [&_>_small]:block [&_>_a]:[color:var(--accent)] [&_>_a]:[border-top:1px_solid_var(--hairline)] [&_>_a]:justify-between [&_>_a]:items-center [&_>_a]:gap-[8px] [&_>_a]:mt-[14px] [&_>_a]:pt-[13px] [&_>_a]:text-[10px] [&_>_a]:font-[600] [&_>_a]:flex">
          <span className="usage-title tracking-[.1em] [color:var(--dim)] mb-[22px] text-[9px] block">
            {plan.planName} plan
          </span>
          <PlanRow
            label="Transcription"
            value={`${plan.remainingMinutes.toFixed(1)} min left`}
            percent={plan.transcriptionPercent}
          />
          <PlanRow
            label="Exports"
            value={`${plan.remainingExports} left`}
            percent={plan.exportsPercent}
          />
          <small>Resets in {plan.resetDays} days</small>
          <Link href="/pricing">
            View plans <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
function PlanRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: number;
}) {
  return (
    <div className="usage-row mb-[20px] [&_>_div:first-child]:justify-between [&_>_div:first-child]:items-center [&_>_div:first-child]:gap-[4px] [&_>_div:first-child]:mb-[8px] [&_>_div:first-child]:text-[10px] [&_>_div:first-child]:flex [&_strong]:[color:var(--body)] [&_strong]:text-[10px] [&_strong]:font-[550]">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="usage-track [background:var(--surface-raised)] rounded-[9px] h-[3px] [&_span]:[background:var(--accent)] [&_span]:rounded-[9px] [&_span]:h-[100%] [&_span]:block">
        <span style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
    </div>
  );
}
