"use client";

import { useId, useRef, useState } from "react";
import { Check, Plus, Trash2, Volume2, Waves, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface AttachedSoundEffect {
  id: string;
  sfxId: string;
  name: string;
  segmentId: string;
  timestampSecond: number;
  volumePercent: number;
}

export interface EditorSfxLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplySfx: (attached: AttachedSoundEffect[]) => void;
  initialAttached?: AttachedSoundEffect[];
}

interface SfxItem {
  id: string;
  name: string;
  category: "Whoosh" | "Pop" | "Impact" | "UI";
  durationSeconds: number;
  previewColor: string;
}

const SFX_LIBRARY_ITEMS: SfxItem[] = [
  { id: "sfx-whoosh-fast", name: "Fast Air Whoosh", category: "Whoosh", durationSeconds: 0.35, previewColor: "#3b82f6" },
  { id: "sfx-pop-bubble", name: "Bubble Text Pop", category: "Pop", durationSeconds: 0.2, previewColor: "#10b981" },
  { id: "sfx-boom-cinematic", name: "Deep Cinematic Sub-Boom", category: "Impact", durationSeconds: 0.85, previewColor: "#f43f5e" },
  { id: "sfx-bell-ding", name: "Bright Notification Ding", category: "UI", durationSeconds: 0.45, previewColor: "#f59e0b" },
  { id: "sfx-camera-click", name: "Camera Shutter Snap", category: "UI", durationSeconds: 0.25, previewColor: "#8b5cf6" },
  { id: "sfx-whoosh-heavy", name: "Heavy Swoosh Transition", category: "Whoosh", durationSeconds: 0.5, previewColor: "#06b6d4" },
];

export function EditorSfxLibrary({
  isOpen,
  onClose,
  segments,
  onApplySfx,
  initialAttached = [],
}: EditorSfxLibraryProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [attached, setAttached] = useState<AttachedSoundEffect[]>(initialAttached);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSegmentId, setActiveSegmentId] = useState<string>(segments[0]?.id ?? "");

  if (!isOpen) return null;

  const currentSegment = segments.find((s) => s.id === activeSegmentId) ?? segments[0];

  const filteredItems = selectedCategory === "All"
    ? SFX_LIBRARY_ITEMS
    : SFX_LIBRARY_ITEMS.filter((i) => i.category === selectedCategory);

  const handleAttachSfx = (item: SfxItem) => {
    if (!currentSegment) return;
    const newEntry: AttachedSoundEffect = {
      id: `att-${Date.now()}`,
      sfxId: item.id,
      name: item.name,
      segmentId: currentSegment.id,
      timestampSecond: Math.round(currentSegment.start * 10) / 10,
      volumePercent: 80,
    };
    setAttached([...attached, newEntry]);
  };

  const handleRemove = (id: string) => {
    setAttached(attached.filter((a) => a.id !== id));
  };

  const handleUpdateVolume = (id: string, vol: number) => {
    setAttached(attached.map((a) => (a.id === id ? { ...a, volumePercent: vol } : a)));
  };

  const handleSave = () => {
    onApplySfx(attached);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl bg-surface border border-hairline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
              <Waves size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Sound Effects & Stingers Library</h2>
              <p className="text-xs text-dim">Attach whooshes, pops, and impacts to sync with subtitle transitions</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close SFX library">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-dim uppercase tracking-wider">Sync To Segment</label>
              <span className="text-[11px] text-accent font-mono">{currentSegment ? `${currentSegment.start.toFixed(1)}s` : "0.0s"}</span>
            </div>
            <select
              value={activeSegmentId}
              onChange={(e) => setActiveSegmentId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent cursor-pointer"
            >
              {segments.map((seg, idx) => (
                <option key={seg.id} value={seg.id}>
                  #{idx + 1} ({seg.start.toFixed(1)}s): {seg.text.slice(0, 45)}
                </option>
              ))}
            </select>
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-dim uppercase tracking-wider">SFX Sound Catalog</label>
              <div className="flex items-center gap-1">
                {(["All", "Whoosh", "Pop", "Impact", "UI"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer",
                      selectedCategory === cat ? "bg-accent text-white font-bold" : "text-dim hover:text-cream",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAttachSfx(item)}
                  className="p-2.5 rounded-xl border border-hairline bg-surface-raised/40 hover:bg-surface-raised text-left text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-cream group-hover:text-accent truncate">{item.name}</span>
                    <Plus size={13} className="text-dim group-hover:text-accent shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-dim">
                    <span style={{ color: item.previewColor }}>{item.category}</span>
                    <span>{item.durationSeconds}s</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-2 pt-2 border-t border-hairline text-xs">
            <span className="font-semibold text-dim uppercase tracking-wider block">
              Attached Audio Triggers ({attached.length})
            </span>
            {attached.length === 0 ? (
              <p className="text-xs text-dim text-center py-3 bg-surface-raised/20 rounded-xl border border-dashed border-hairline">
                No sound effects attached. Click any sound above to pin to current caption timestamp.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {attached.map((att) => (
                  <div key={att.id} className="p-2.5 rounded-xl border border-hairline bg-surface text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <Volume2 size={13} className="text-accent shrink-0" />
                      <span className="font-medium text-cream truncate">{att.name}</span>
                      <span className="text-[10px] text-dim font-mono">at {att.timestampSecond}s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={att.volumePercent}
                        onChange={(e) => handleUpdateVolume(att.id, parseInt(e.target.value, 10))}
                        className="w-16 accent-accent h-1 bg-surface-raised rounded cursor-pointer"
                        title={`Volume ${att.volumePercent}%`}
                      />
                      <button type="button" onClick={() => handleRemove(att.id)} className="text-dim hover:text-red-400 p-0.5 cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">{attached.length} sound stingers synchronized</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Sound Effects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
