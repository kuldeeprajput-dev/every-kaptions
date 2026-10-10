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
    <aside className={cn("studio-sidebar", open && "is-open")}>
      <div className="mb-5 flex items-center justify-between md:hidden">
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
      <button type="button" onClick={onUpload} className="sidebar-create">
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
      <div className="sidebar-bottom">
        <p>Made for the way you create.</p>
        <div className="usage-panel">
          <span className="usage-title">
            YOUR {plan.planName.toUpperCase()} PLAN
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
            A little more room <ArrowUpRight size={14} />
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
    <div className="usage-row">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="usage-track">
        <span style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
    </div>
  );
}
