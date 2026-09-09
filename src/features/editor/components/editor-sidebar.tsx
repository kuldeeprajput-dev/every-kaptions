import { CircleHelp, Film, ImageIcon, MessageSquare, Plus, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";

const sidebarLinks = [
  { label: "My reels", icon: Film },
  { label: "Thumbnails", icon: ImageIcon },
  { label: "Help & support", icon: CircleHelp },
  { label: "Share feedback", icon: MessageSquare },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload: () => void;
};

export function EditorSidebar({ open, onClose, onUpload }: Props) {
  return (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-16 z-30 flex w-[266px] flex-col border-r border-white/8 bg-[#0b0c0c] p-4 transition-transform md:translate-x-0",
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
        {sidebarLinks.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium",
              index === 0 ? "bg-[#181818] text-cream" : "text-[#949494] hover:bg-white/4 hover:text-cream",
            )}
          >
            <Icon size={17} className="md:hidden" />
            {label}
          </button>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/8 pt-5">
        <p className="text-[10px] font-bold tracking-[.12em] text-[#6f7b82]">YOUR PLAN</p>
        <PlanRow label="Transcription" value="3 min left" />
        <PlanRow label="Exports" value="3 of 3 left" />
        <p className="mt-3 text-xs text-[#667177]">Free minutes reset in 22 days</p>
        <Link href="/pricing" className="mt-4 flex min-h-10 items-center justify-center rounded-xl bg-amber text-sm font-bold text-black">
          Upgrade
        </Link>
      </div>
    </aside>
  );
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#6f7b82]">{label}</span>
        <strong className="text-white">{value}</strong>
      </div>
      <div className="mt-2 h-1 rounded-full bg-amber" />
    </div>
  );
}
