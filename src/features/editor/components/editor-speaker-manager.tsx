"use client";

import { useId, useRef, useState } from "react";
import { Check, Plus, Trash2, Users, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface SpeakerProfile {
  id: string;
  name: string;
  colorHex: string;
  badgeLabel: string;
}

export interface SpeakerManagerSettings {
  speakers: SpeakerProfile[];
  showSpeakerBadge: boolean;
  prefixTranscriptWithName: boolean;
  colorizeHighlightWords: boolean;
}

export interface EditorSpeakerManagerProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplySpeakers: (settings: SpeakerManagerSettings) => void;
  initialSettings?: Partial<SpeakerManagerSettings>;
}

const PALETTE_COLORS = [
  { hex: "#10b981", name: "Emerald" }, { hex: "#8b5cf6", name: "Violet" },
  { hex: "#f59e0b", name: "Amber" }, { hex: "#06b6d4", name: "Cyan" },
  { hex: "#f43f5e", name: "Rose" }, { hex: "#3b82f6", name: "Sky" },
];

const DEFAULT_SPEAKERS: SpeakerProfile[] = [
  { id: "spk-1", name: "Speaker 1 (Host)", colorHex: "#10b981", badgeLabel: "Host" },
  { id: "spk-2", name: "Speaker 2 (Guest)", colorHex: "#8b5cf6", badgeLabel: "Guest" },
];

export function EditorSpeakerManager({
  isOpen,
  onClose,
  segments,
  onApplySpeakers,
  initialSettings,
}: EditorSpeakerManagerProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [speakers, setSpeakers] = useState<SpeakerProfile[]>(
    initialSettings?.speakers && initialSettings.speakers.length > 0
      ? initialSettings.speakers
      : DEFAULT_SPEAKERS,
  );
  const [showSpeakerBadge, setShowSpeakerBadge] = useState(
    initialSettings?.showSpeakerBadge ?? true,
  );
  const [prefixTranscriptWithName, setPrefixTranscriptWithName] = useState(
    initialSettings?.prefixTranscriptWithName ?? false,
  );
  const [colorizeHighlightWords, setColorizeHighlightWords] = useState(
    initialSettings?.colorizeHighlightWords ?? true,
  );

  if (!isOpen) return null;

  const handleAddSpeaker = () => {
    const nextIdx = speakers.length + 1;
    const color = PALETTE_COLORS[(nextIdx - 1) % PALETTE_COLORS.length];
    setSpeakers([
      ...speakers,
      {
        id: `spk-${Date.now()}`,
        name: `Speaker ${nextIdx}`,
        colorHex: color.hex,
        badgeLabel: `SPK ${nextIdx}`,
      },
    ]);
  };

  const handleUpdateSpeaker = (id: string, updates: Partial<SpeakerProfile>) => {
    setSpeakers(speakers.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleRemoveSpeaker = (id: string) => {
    if (speakers.length <= 1) return;
    setSpeakers(speakers.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    onApplySpeakers({
      speakers,
      showSpeakerBadge,
      prefixTranscriptWithName,
      colorizeHighlightWords,
    });
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
              <Users size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">
                Speaker Diarization & Colors
              </h2>
              <p className="text-xs text-dim">
                Assign distinct speaker labels and colors across {segments.length} transcript segments
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer"
            aria-label="Close speaker settings dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider">
              Configured Speakers ({speakers.length})
            </label>
            <button
              type="button"
              onClick={handleAddSpeaker}
              className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={14} /> Add Speaker
            </button>
          </div>

          <div className="space-y-3">
            {speakers.map((spk) => (
              <div
                key={spk.id}
                className="p-3.5 rounded-xl border border-hairline bg-surface-raised/40 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: spk.colorHex }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-black font-bold text-xs shrink-0 shadow-sm"
                  >
                    {spk.name.charAt(0).toUpperCase()}
                  </div>
                  <input
                    type="text"
                    value={spk.name}
                    onChange={(e) => handleUpdateSpeaker(spk.id, { name: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream font-medium focus:border-accent outline-none"
                    placeholder="Speaker Name"
                  />
                  <input
                    type="text"
                    value={spk.badgeLabel}
                    onChange={(e) => handleUpdateSpeaker(spk.id, { badgeLabel: e.target.value })}
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-dim focus:text-cream font-mono outline-none"
                    placeholder="Short Badge"
                  />
                  {speakers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(spk.id)}
                      className="p-1.5 rounded-lg text-dim hover:text-red-400 hover:bg-surface transition-colors cursor-pointer"
                      title="Remove speaker"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-hairline/60">
                  <span className="text-[11px] text-dim">Theme Color:</span>
                  <div className="flex items-center gap-1.5">
                    {PALETTE_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => handleUpdateSpeaker(spk.id, { colorHex: c.hex })}
                        style={{ backgroundColor: c.hex }}
                        className={cn(
                          "w-5 h-5 rounded-full transition-transform cursor-pointer flex items-center justify-center",
                          spk.colorHex === c.hex ? "scale-110 ring-2 ring-cream/60" : "opacity-80 hover:opacity-100",
                        )}
                        title={c.name}
                      >
                        {spk.colorHex === c.hex && <Check size={11} className="text-black" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="space-y-2 pt-3 border-t border-hairline text-xs">
            <span className="font-semibold text-dim uppercase tracking-wider block text-[11px]">Display Preferences</span>
            <label className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
              <input type="checkbox" checked={showSpeakerBadge} onChange={(e) => setShowSpeakerBadge(e.target.checked)} className="rounded text-accent accent-accent" />
              <span>Render speaker badge pill above active caption</span>
            </label>
            <label className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
              <input type="checkbox" checked={colorizeHighlightWords} onChange={(e) => setColorizeHighlightWords(e.target.checked)} className="rounded text-accent accent-accent" />
              <span>Colorize spoken word highlights with speaker palette</span>
            </label>
            <label className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
              <input type="checkbox" checked={prefixTranscriptWithName} onChange={(e) => setPrefixTranscriptWithName(e.target.checked)} className="rounded text-accent accent-accent" />
              <span>Prefix transcript lines with speaker name (e.g. &quot;Host: ...&quot;)</span>
            </label>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Assigns badges to timeline subtitle blocks</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer">
              Save Speaker Colors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
