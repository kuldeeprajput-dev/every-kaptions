"use client";

import { useId, useRef, useState } from "react";
import { Bookmark, Check, CheckCircle2, Clock, Download, Filter, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type MarkerCategory = "Edit" | "Audio" | "Caption" | "B-Roll" | "Pacing";

export interface TimelineMarker {
  id: string;
  timestamp: number;
  label: string;
  category: MarkerCategory;
  isResolved: boolean;
  createdAt: string;
}

export interface EditorTimelineMarkersProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimestamp: number;
  markers: TimelineMarker[];
  onUpdateMarkers: (markers: TimelineMarker[]) => void;
  onSeekToTimestamp?: (seconds: number) => void;
}

const CATEGORY_COLORS: Record<MarkerCategory, { badge: string; text: string }> = {
  Edit: { badge: "bg-blue-500/15 border-blue-500/30", text: "text-blue-400" },
  Audio: { badge: "bg-emerald-500/15 border-emerald-500/30", text: "text-emerald-400" },
  Caption: { badge: "bg-amber-500/15 border-amber-500/30", text: "text-amber-400" },
  "B-Roll": { badge: "bg-purple-500/15 border-purple-500/30", text: "text-purple-400" }, Pacing: { badge: "bg-rose-500/15 border-rose-500/30", text: "text-rose-400" },
};

const CATEGORIES: MarkerCategory[] = ["Edit", "Audio", "Caption", "B-Roll", "Pacing"];

export function EditorTimelineMarkers({
  isOpen,
  onClose,
  currentTimestamp,
  markers: initialMarkers,
  onUpdateMarkers,
  onSeekToTimestamp,
}: EditorTimelineMarkersProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [markers, setMarkers] = useState<TimelineMarker[]>(initialMarkers || []);
  const [filterCategory, setFilterCategory] = useState<MarkerCategory | "All">("All");
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState<MarkerCategory>("Edit");
  const [newTime, setNewTime] = useState(currentTimestamp || 0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAddMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const item: TimelineMarker = {
      id: `marker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Number(newTime.toFixed(1)), label: newLabel.trim(), category: newCategory,
      isResolved: false, createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMarkers([...markers, item].sort((a, b) => a.timestamp - b.timestamp));
    setNewLabel("");
  };

  const handleToggleResolve = (id: string) => {
    setMarkers((prev) => prev.map((m) => (m.id === id ? { ...m, isResolved: !m.isResolved } : m)));
  };

  const handleDeleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id === id));
  };

  const handleSave = () => {
    onUpdateMarkers(markers);
    onClose();
  };

  const handleExportMarkdown = () => {
    const text = markers.map((m) => `- [${m.isResolved ? "x" : " "}] ${m.timestamp.toFixed(1)}s [${m.category}] ${m.label}`).join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMarkers = markers.filter((m) => filterCategory === "All" || m.category === filterCategory);
  const unresolvedCount = markers.filter((m) => !m.isResolved).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-xl rounded-2xl border border-hairline bg-surface-raised shadow-2xl overflow-hidden flex flex-col max-h-[90vh] outline-none"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Bookmark size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Timeline Review Markers</h2>
              <p className="text-xs text-dim">{markers.length} total markers &bull; {unresolvedCount} pending edits</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close markers dialog">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <form onSubmit={handleAddMarker} className="p-3.5 rounded-xl border border-hairline bg-surface/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">Add Timestamp Marker</span>
              <button
                type="button"
                onClick={() => setNewTime(currentTimestamp)}
                className="text-[11px] text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Clock size={11} /> Grab Playhead ({currentTimestamp.toFixed(1)}s)
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                value={newTime}
                onChange={(e) => setNewTime(Number(e.target.value))}
                className="w-20 px-2.5 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as MarkerCategory)}
                className="w-24 px-2 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent cursor-pointer"
              >
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input
                type="text"
                placeholder="Note, typo, or audio fix..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!newLabel.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus size={13} /> Add
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-dim" />
              {(["All", ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={cn("px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer",
                    filterCategory === cat ? "bg-accent text-white font-bold" : "text-dim hover:text-cream")}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="text-[11px] text-dim hover:text-cream flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download size={11} /> {copied ? "Copied!" : "Export Notes"}
            </button>
          </div>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {filteredMarkers.length === 0 ? (
              <div className="text-center py-8 text-xs text-dim">No markers matching this category filter.</div>
            ) : (
              filteredMarkers.map((marker) => {
                const colors = CATEGORY_COLORS[marker.category];
                return (
                  <div
                    key={marker.id}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border border-hairline transition-all group",
                      marker.isResolved ? "bg-surface/20 opacity-60" : "bg-surface/50 hover:bg-surface",
                    )}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <button type="button" onClick={() => handleToggleResolve(marker.id)} className="text-dim hover:text-accent cursor-pointer transition-colors" title={marker.isResolved ? "Mark unresolved" : "Mark resolved"}>
                        <CheckCircle2 size={16} className={marker.isResolved ? "text-emerald-400" : "text-dim"} />
                      </button>
                      <button type="button" onClick={() => onSeekToTimestamp?.(marker.timestamp)} className="px-2 py-0.5 rounded border border-hairline bg-surface-raised font-mono text-[10px] text-accent hover:border-accent cursor-pointer" title="Jump to timeline position">
                        {marker.timestamp.toFixed(1)}s
                      </button>
                      <span className={cn("px-1.5 py-0.5 rounded border text-[9px] font-semibold", colors.badge, colors.text)}>
                        {marker.category}
                      </span>
                      <span className={cn("text-xs truncate", marker.isResolved ? "line-through text-dim" : "text-cream")}>
                        {marker.label}
                      </span>
                    </div>
                    <button type="button" onClick={() => handleDeleteMarker(marker.id)} className="p-1 rounded text-dim hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" aria-label="Delete marker">
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <span className="text-[11px] text-dim">{markers.length} total notes recorded</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check size={14} /> Save Markers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
