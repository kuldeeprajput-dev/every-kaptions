"use client";

import { useId, useRef, useState } from "react";
import { Check, Film, Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface BrollOverlayItem {
  id: string;
  segmentId: string;
  mediaType: "video" | "image";
  mediaUrl: string;
  label: string;
  startSecond: number;
  durationSeconds: number;
  opacityPercent: number;
  blendMode: "normal" | "screen" | "multiply";
}

export interface EditorBrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplyOverlays: (overlays: BrollOverlayItem[]) => void;
  initialOverlays?: BrollOverlayItem[];
}

const STOCK_BROLL_SUGGESTIONS = [
  { id: "stock-1", label: "Office Workspace Coding", mediaType: "video" as const, duration: 3.5, url: "/media/broll/workspace.mp4" },
  { id: "stock-2", label: "Mobile Phone Notification", mediaType: "video" as const, duration: 2.8, url: "/media/broll/mobile.mp4" },
  { id: "stock-3", label: "Data Growth Analytics Chart", mediaType: "image" as const, duration: 3.0, url: "/media/broll/chart.webp" },
  { id: "stock-4", label: "City Street Commute Timelapse", mediaType: "video" as const, duration: 4.0, url: "/media/broll/city.mp4" },
];

export function EditorBrollModal({
  isOpen,
  onClose,
  segments,
  onApplyOverlays,
  initialOverlays = [],
}: EditorBrollModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [overlays, setOverlays] = useState<BrollOverlayItem[]>(initialOverlays);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(segments[0]?.id ?? "");

  if (!isOpen) return null;

  const currentSegment = segments.find((s) => s.id === selectedSegmentId) ?? segments[0];

  const handleAddStockOverlay = (stock: (typeof STOCK_BROLL_SUGGESTIONS)[0]) => {
    if (!currentSegment) return;
    const newItem: BrollOverlayItem = {
      id: `broll-${Date.now()}`,
      segmentId: currentSegment.id,
      mediaType: stock.mediaType,
      mediaUrl: stock.url,
      label: stock.label,
      startSecond: currentSegment.start,
      durationSeconds: Math.min(stock.duration, Math.max(1, currentSegment.end - currentSegment.start)),
      opacityPercent: 90,
      blendMode: "normal",
    };
    setOverlays([...overlays, newItem]);
  };

  const handleRemoveOverlay = (id: string) => {
    setOverlays(overlays.filter((o) => o.id !== id));
  };

  const handleUpdateOverlay = (id: string, updates: Partial<BrollOverlayItem>) => {
    setOverlays(overlays.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const handleSave = () => {
    onApplyOverlays(overlays);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-2xl bg-surface border border-hairline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
              <Film size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">B-Roll Cutaway & Media Inserter</h2>
              <p className="text-xs text-dim">Sync visual cutaways and stock media over speech segments</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close B-roll modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Sync to Caption Segment</label>
            <select
              value={selectedSegmentId}
              onChange={(e) => setSelectedSegmentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent cursor-pointer"
            >
              {segments.map((seg, idx) => (
                <option key={seg.id} value={seg.id}>
                  #{idx + 1} ({seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s): {seg.text.slice(0, 50)}
                </option>
              ))}
            </select>
          </section>

          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Stock Cutaway Library</label>
            <div className="grid grid-cols-2 gap-2">
              {STOCK_BROLL_SUGGESTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAddStockOverlay(item)}
                  className="p-3 rounded-xl border border-hairline bg-surface-raised/40 hover:bg-surface-raised text-left text-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-cream group-hover:text-accent truncate">{item.label}</span>
                    {item.mediaType === "video" ? <Film size={13} className="text-dim" /> : <ImageIcon size={13} className="text-dim" />}
                  </div>
                  <span className="text-[10px] text-dim">{item.duration}s duration suggestion</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-2 border-t border-hairline">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">Active B-Roll Layers ({overlays.length})</span>
            </div>
            {overlays.length === 0 ? (
              <p className="text-xs text-dim text-center py-4 bg-surface-raised/20 rounded-xl border border-dashed border-hairline">
                No B-roll overlays added. Select a stock asset or upload footage above.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {overlays.map((ov) => (
                  <div key={ov.id} className="p-3 rounded-xl border border-hairline bg-surface space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cream truncate">{ov.label}</span>
                      <button type="button" onClick={() => handleRemoveOverlay(ov.id)} className="text-dim hover:text-red-400 p-1 cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-dim block mb-0.5">Start Time</span>
                        <input
                          type="number"
                          step="0.1"
                          value={ov.startSecond}
                          onChange={(e) => handleUpdateOverlay(ov.id, { startSecond: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1 rounded border border-hairline bg-surface-raised text-xs font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-dim block mb-0.5">Duration</span>
                        <input
                          type="number"
                          step="0.1"
                          value={ov.durationSeconds}
                          onChange={(e) => handleUpdateOverlay(ov.id, { durationSeconds: parseFloat(e.target.value) || 1 })}
                          className="w-full px-2 py-1 rounded border border-hairline bg-surface-raised text-xs font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-dim block mb-0.5">Opacity ({ov.opacityPercent}%)</span>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          value={ov.opacityPercent}
                          onChange={(e) => handleUpdateOverlay(ov.id, { opacityPercent: parseInt(e.target.value, 10) })}
                          className="w-full accent-accent h-1.5 bg-surface-raised rounded mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">{overlays.length} visual cutaway layers configured</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply B-Roll Overlays
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
