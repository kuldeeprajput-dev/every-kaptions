"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Edit2, Filter, Palette, Users, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface SpeakerProfile {
  id: string;
  name: string;
  color: string;
  accentClass: string; badgeClass: string;
}

export interface EditorSpeakerColorLegendProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  speakers?: SpeakerProfile[];
  onUpdateSpeakers: (speakers: SpeakerProfile[]) => void;
  onFilterSpeaker?: (speakerId: string | null) => void;
}

const DEFAULT_SPEAKERS: SpeakerProfile[] = [
  { id: "spk-1", name: "Speaker 1 (Host)", color: "#38bdf8", accentClass: "text-sky-400", badgeClass: "bg-sky-500/15 border-sky-500/30 text-sky-300" },
  { id: "spk-2", name: "Speaker 2 (Guest)", color: "#34d399", accentClass: "text-emerald-400", badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" },
  { id: "spk-3", name: "Speaker 3", color: "#fbbf24", accentClass: "text-amber-400", badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-300" }, { id: "spk-4", name: "Speaker 4", color: "#c084fc", accentClass: "text-purple-400", badgeClass: "bg-purple-500/15 border-purple-500/30 text-purple-300" },
];

const COLOR_PALETTE = [
  { color: "#38bdf8", accentClass: "text-sky-400", badgeClass: "bg-sky-500/15 border-sky-500/30 text-sky-300" },
  { color: "#34d399", accentClass: "text-emerald-400", badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" },
  { color: "#fbbf24", accentClass: "text-amber-400", badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-300" },
  { color: "#c084fc", accentClass: "text-purple-400", badgeClass: "bg-purple-500/15 border-purple-500/30 text-purple-300" },
  { color: "#fb7185", accentClass: "text-rose-400", badgeClass: "bg-rose-500/15 border-rose-500/30 text-rose-300" }, { color: "#2dd4bf", accentClass: "text-teal-400", badgeClass: "bg-teal-500/15 border-teal-500/30 text-teal-300" },
];

export function EditorSpeakerColorLegend({
  isOpen,
  onClose,
  segments,
  speakers: initialSpeakers,
  onUpdateSpeakers,
  onFilterSpeaker,
}: EditorSpeakerColorLegendProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [speakers, setSpeakers] = useState<SpeakerProfile[]>(initialSpeakers || DEFAULT_SPEAKERS);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const speakerStats = useMemo(() => {
    const totalDuration = segments.reduce((acc, s) => acc + Math.max(0, s.end - s.start), 0) || 1;
    const stats: Record<string, { count: number; duration: number; percent: number }> = {};

    speakers.forEach((spk) => {
      stats[spk.id] = { count: 0, duration: 0, percent: 0 };
    });

    segments.forEach((seg, idx) => {
      const assignedSpk = speakers[idx % speakers.length];
      if (stats[assignedSpk.id]) {
        stats[assignedSpk.id].count += 1;
        stats[assignedSpk.id].duration += Math.max(0, seg.end - seg.start);
      }
    });

    Object.keys(stats).forEach((k) => {
      stats[k].percent = Math.round((stats[k].duration / totalDuration) * 100);
    });

    return stats;
  }, [segments, speakers]);

  if (!isOpen) return null;

  const handleStartEdit = (spk: SpeakerProfile) => {
    setEditingId(spk.id);
    setEditingName(spk.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    setSpeakers((prev) => prev.map((s) => (s.id === id ? { ...s, name: editingName.trim() } : s)));
    setEditingId(null);
  };

  const handleColorChange = (id: string, paletteIndex: number) => {
    const choice = COLOR_PALETTE[paletteIndex % COLOR_PALETTE.length];
    setSpeakers((prev) => prev.map((s) => (s.id === id ? { ...s, ...choice } : s)));
  };

  const handleSave = () => {
    onUpdateSpeakers(speakers);
    onFilterSpeaker?.(selectedSpeakerId);
    onClose();
  };

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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Users size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Speaker Diarization & Colors</h2>
              <p className="text-xs text-dim">Customize speaker names, subtitle highlights, and filter cues</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close speaker modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-dim" />
              <button
                type="button"
                onClick={() => setSelectedSpeakerId(null)}
                className={cn("px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer",
                  selectedSpeakerId === null ? "bg-accent text-white" : "text-dim hover:text-cream bg-surface border border-hairline")}
              >
                All Speakers ({segments.length})
              </button>
              {speakers.map((spk) => (
                <button
                  key={spk.id}
                  type="button"
                  onClick={() => setSelectedSpeakerId(spk.id)}
                  className={cn("px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer",
                    selectedSpeakerId === spk.id ? "bg-accent text-white" : "text-dim hover:text-cream bg-surface border border-hairline")}
                >
                  {spk.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {speakers.map((spk) => {
              const stat = speakerStats[spk.id] || { count: 0, duration: 0, percent: 0 };
              const isEditing = editingId === spk.id;

              return (
                <div key={spk.id} className="p-3.5 rounded-xl border border-hairline bg-surface/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div
                        style={{ backgroundColor: spk.color }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-black shadow-sm shrink-0"
                      >
                        {spk.name.charAt(0).toUpperCase()}
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 flex-1 max-w-[240px]">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="px-2 py-1 rounded border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent w-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(spk.id)}
                            className="p-1 rounded bg-accent text-white hover:bg-accent-hover cursor-pointer"
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-cream">{spk.name}</span>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(spk)}
                            className="text-dim hover:text-cream p-1 cursor-pointer"
                            title="Edit speaker name"
                          >
                            <Edit2 size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-xs font-mono font-bold text-accent">{stat.percent}%</span>
                      <span className="text-[10px] text-dim">({stat.count} cues)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-hairline/40">
                    <div className="flex items-center gap-1 text-[11px] text-dim">
                      <Palette size={11} /> Color Highlight:
                    </div>
                    <div className="flex items-center gap-1.5">
                      {COLOR_PALETTE.map((pal, idx) => (
                        <button
                          key={pal.color}
                          type="button"
                          onClick={() => handleColorChange(spk.id, idx)}
                          style={{ backgroundColor: pal.color }}
                          className={cn(
                            "w-4 h-4 rounded-full transition-transform cursor-pointer",
                            spk.color === pal.color ? "scale-125 ring-2 ring-white" : "opacity-70 hover:opacity-100",
                          )}
                          title="Select color"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <span className="text-[11px] text-dim">{speakers.length} active speaker profiles</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check size={14} /> Apply Speakers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
