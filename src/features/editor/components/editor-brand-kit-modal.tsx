"use client";

import { useId, useRef, useState } from "react";
import { Check, Crown, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface BrandKitProfile {
  id: string;
  name: string;
  accentColorHex: string;
  highlightColorHex: string;
  fontFamily: string;
  defaultPositionPercent: number;
  watermarkText: string;
  watermarkOpacity: number;
}

export interface EditorBrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBrandKit: (profile: BrandKitProfile) => void;
  activeProfileId?: string;
}

const DEFAULT_BRAND_KITS: BrandKitProfile[] = [
  { id: "brand-creator", name: "Personal Creator", accentColorHex: "#ff4b4b", highlightColorHex: "#fbbf24", fontFamily: "Inter", defaultPositionPercent: 80, watermarkText: "@creator", watermarkOpacity: 60 },
  { id: "brand-tech", name: "Tech Breakdown", accentColorHex: "#3b82f6", highlightColorHex: "#06b6d4", fontFamily: "Montserrat", defaultPositionPercent: 78, watermarkText: "Tech Daily", watermarkOpacity: 50 },
  { id: "brand-minimal", name: "Editorial Clean", accentColorHex: "#18181b", highlightColorHex: "#e4e4e7", fontFamily: "Georgia", defaultPositionPercent: 82, watermarkText: "", watermarkOpacity: 0 },
];

export function EditorBrandKitModal({
  isOpen,
  onClose,
  onApplyBrandKit,
  activeProfileId = "brand-creator",
}: EditorBrandKitModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [profiles, setProfiles] = useState<BrandKitProfile[]>(DEFAULT_BRAND_KITS);
  const [selectedId, setSelectedId] = useState<string>(activeProfileId);

  if (!isOpen) return null;

  const currentProfile = profiles.find((p) => p.id === selectedId) ?? profiles[0];

  const handleUpdateCurrent = (updates: Partial<BrandKitProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === currentProfile.id ? { ...p, ...updates } : p)),
    );
  };

  const handleCreateNew = () => {
    const newKit: BrandKitProfile = {
      id: `brand-${Date.now()}`,
      name: `Brand Kit ${profiles.length + 1}`,
      accentColorHex: "#10b981",
      highlightColorHex: "#a7f3d0",
      fontFamily: "Inter",
      defaultPositionPercent: 80,
      watermarkText: "@handle",
      watermarkOpacity: 50,
    };
    setProfiles([...profiles, newKit]);
    setSelectedId(newKit.id);
  };

  const handleDelete = (id: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);
    setSelectedId(remaining[0].id);
  };

  const handleApply = () => {
    onApplyBrandKit(currentProfile);
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
              <Crown size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Creator Brand Kit</h2>
              <p className="text-xs text-dim">Saved brand colors, watermark overlays, and typography presets</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close brand kit modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider">Brand Profiles</label>
            <button
              type="button"
              onClick={handleCreateNew}
              className="text-xs font-semibold text-accent hover:text-accent-hover flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={14} /> New Kit
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all cursor-pointer",
                  p.id === selectedId
                    ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                    : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span style={{ backgroundColor: p.accentColorHex }} className="w-3.5 h-3.5 rounded-full inline-block" />
                    <span style={{ backgroundColor: p.highlightColorHex }} className="w-3.5 h-3.5 rounded-full inline-block" />
                  </div>
                  {p.id === selectedId && <Check size={14} className="text-accent" />}
                </div>
                <span className="text-xs font-semibold block truncate">{p.name}</span>
                <span className="text-[10px] text-dim block">{p.fontFamily}</span>
              </button>
            ))}
          </div>

          <section className="space-y-3.5 pt-3 border-t border-hairline text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-dim font-medium block mb-1">Kit Name</label>
                <input
                  type="text"
                  value={currentProfile.name}
                  onChange={(e) => handleUpdateCurrent({ name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-dim font-medium block mb-1">Font Family</label>
                <select
                  value={currentProfile.fontFamily}
                  onChange={(e) => handleUpdateCurrent({ fontFamily: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent cursor-pointer"
                >
                  <option value="Inter">Inter (Sans-serif)</option>
                  <option value="Montserrat">Montserrat (Modern Bold)</option>
                  <option value="Georgia">Georgia (Editorial Serif)</option>
                  <option value="Impact">Impact (Bold Condensed)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-dim font-medium block mb-1">Primary Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentProfile.accentColorHex}
                    onChange={(e) => handleUpdateCurrent({ accentColorHex: e.target.value })}
                    className="w-8 h-8 rounded border border-hairline bg-surface cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={currentProfile.accentColorHex}
                    onChange={(e) => handleUpdateCurrent({ accentColorHex: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream font-mono outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-dim font-medium block mb-1">Highlight Word Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentProfile.highlightColorHex}
                    onChange={(e) => handleUpdateCurrent({ highlightColorHex: e.target.value })}
                    className="w-8 h-8 rounded border border-hairline bg-surface cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={currentProfile.highlightColorHex}
                    onChange={(e) => handleUpdateCurrent({ highlightColorHex: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-dim font-medium block mb-1">Watermark Handle / Text</label>
              <input
                type="text"
                value={currentProfile.watermarkText}
                onChange={(e) => handleUpdateCurrent({ watermarkText: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
                placeholder="@yourhandle or Brand Channel"
              />
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          {profiles.length > 1 ? (
            <button
              type="button"
              onClick={() => handleDelete(currentProfile.id)}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 size={13} /> Delete Kit
            </button>
          ) : <div />}
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Brand Kit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
