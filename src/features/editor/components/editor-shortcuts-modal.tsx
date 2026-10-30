"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Command, HelpCircle, Keyboard, Search, X } from "lucide-react";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface ShortcutItem {
  id: string;
  category: "playback" | "caption" | "studio";
  action: string;
  keys: string[];
  description: string;
}

const SHORTCUT_ITEMS: ShortcutItem[] = [
  {
    id: "toggle-play",
    category: "playback",
    action: "Play / Pause",
    keys: ["Space"],
    description: "Toggle playback of active video or audio track",
  },
  {
    id: "scrub-back",
    category: "playback",
    action: "Step Backward 0.5s",
    keys: ["←"],
    description: "Seek playhead backward by half a second",
  },
  {
    id: "scrub-forward",
    category: "playback",
    action: "Step Forward 0.5s",
    keys: ["→"],
    description: "Seek playhead forward by half a second",
  },
  {
    id: "edit-canvas-text",
    category: "caption",
    action: "Edit Caption Text",
    keys: ["Double Click"],
    description: "Directly edit caption text on the video stage",
  },
  {
    id: "drag-caption",
    category: "caption",
    action: "Reposition Caption",
    keys: ["Drag Y-Axis"],
    description: "Drag caption up or down to set custom vertical position",
  },
  {
    id: "split-segment",
    category: "caption",
    action: "Split Segment",
    keys: ["Split Button"],
    description: "Divide current segment into two balanced parts",
  },
  {
    id: "merge-next",
    category: "caption",
    action: "Merge With Next",
    keys: ["Merge Button"],
    description: "Combine current segment with subsequent subtitle",
  },
  {
    id: "delete-segment",
    category: "caption",
    action: "Delete Segment",
    keys: ["Delete Button"],
    description: "Permanently delete selected caption line",
  },
  {
    id: "open-templates",
    category: "studio",
    action: "Creator Templates",
    keys: ["⌘", "T"],
    description: "Open video preset template picker dialog",
  },
  {
    id: "open-find-replace",
    category: "caption",
    action: "Find & Replace",
    keys: ["⌘", "F"],
    description: "Search and batch replace words across all subtitles",
  },
  {
    id: "open-export",
    category: "studio",
    action: "Open Export Modal",
    keys: ["⌘", "E"],
    description: "Open dialog for MP4 burn-in or subtitle download",
  },
  {
    id: "close-modal",
    category: "studio",
    action: "Dismiss / Close Modal",
    keys: ["Esc"],
    description: "Close open dialogs, menus, or mobile drawers",
  },
  {
    id: "toggle-help",
    category: "studio",
    action: "Shortcuts Cheatsheet",
    keys: ["?"],
    description: "Toggle keyboard shortcuts reference dialog",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Shortcuts",
  playback: "Playback",
  caption: "Caption Editing",
  studio: "Studio & Export",
};

export interface EditorShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditorShortcutsModal({ isOpen, onClose }: EditorShortcutsModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useDialogFocus(modalRef, isOpen);

  const filteredShortcuts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SHORTCUT_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        q === "" ||
        item.action.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keys.some((k) => k.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-[#0c0d0d] font-sans text-white shadow-2xl overflow-hidden focus-visible:outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#f6c453]/15 text-[#f6c453] border border-[#f6c453]/20">
              <Keyboard size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 id={titleId} className="text-base font-bold text-cream">Keyboard Shortcuts</h2>
              <p className="text-xs text-[#788084]">Studio speed controls and creator hotkeys</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts dialog"
            className="grid size-8 place-items-center rounded-full text-[#888] hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-white/8 bg-[#111214] px-6 py-3 space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666]" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shortcuts by action or key..."
              className="w-full rounded-xl border border-white/10 bg-black/50 py-2 pl-9 pr-4 text-xs text-white placeholder-[#555] outline-none focus:border-[#f6c453]/60 focus:ring-1 focus:ring-[#f6c453]/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" role="tablist" aria-label="Shortcut categories">
            {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => {
              const isSelected = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(catKey)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? "bg-[#f6c453] text-black shadow-sm"
                      : "bg-white/5 text-[#888] hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2.5 custom-scrollbar">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#777]">
              <HelpCircle size={24} className="mx-auto mb-2 text-[#555]" aria-hidden="true" />
              No shortcuts found matching &quot;{search}&quot;.
            </div>
          ) : (
            filteredShortcuts.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#121315] px-4 py-2.5 hover:border-white/10 transition"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-cream">{item.action}</p>
                  <p className="text-[11px] text-[#788084] truncate">{item.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {item.keys.map((key) => (
                    <kbd
                      key={key}
                      className="inline-flex min-w-6 items-center justify-center rounded-lg border border-white/15 bg-black/60 px-2 py-1 text-[11px] font-mono font-bold text-[#f6c453] shadow-sm"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/8 bg-[#0c0d0d] px-6 py-3 text-xs text-[#788084]">
          <span className="flex items-center gap-1.5">
            <Command size={13} className="text-[#f6c453]" aria-hidden="true" />
            Press <kbd className="font-mono text-[#f6c453] font-bold">?</kbd> anywhere in studio to open
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
