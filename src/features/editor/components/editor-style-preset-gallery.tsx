"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Flame, Palette, Search, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export type PresetCategory = "All" | "High Energy" | "Clean" | "Cinematic" | "Neon";

export interface StylePreset {
  id: string;
  name: string;
  creatorTag: string;
  category: "High Energy" | "Clean" | "Cinematic" | "Neon";
  fontFamily: string;
  textColor: string;
  highlightColor: string;
  strokeColor: string;
  strokeWidth: number;
  backgroundColor?: string;
  isPopular?: boolean;
}

export interface EditorStylePresetGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPresetId?: string;
  onSelectPreset: (preset: StylePreset) => void;
}

const PRESET_COLLECTION: StylePreset[] = [
  {
    id: "hormozi-punch", name: "Hormozi Punch", creatorTag: "Alex Hormozi", category: "High Energy",
    fontFamily: "Impact, sans-serif", textColor: "#ffffff", highlightColor: "#eab308", strokeColor: "#000000", strokeWidth: 4, isPopular: true,
  },
  {
    id: "mrbeast-pop", name: "Beast Pop", creatorTag: "MrBeast", category: "High Energy",
    fontFamily: "var(--font-heading), sans-serif", textColor: "#ffffff", highlightColor: "#ef4444", strokeColor: "#000000", strokeWidth: 3, isPopular: true,
  },
  {
    id: "clean-minimal", name: "Clean Minimalist", creatorTag: "Ali Abdaal", category: "Clean",
    fontFamily: "Inter, sans-serif", textColor: "#f8fafc", highlightColor: "#38bdf8", strokeColor: "transparent", strokeWidth: 0, backgroundColor: "rgba(15, 23, 42, 0.75)",
  },
  {
    id: "neon-cyberpunk", name: "Neon Cyberpunk", creatorTag: "Tech & Sci-Fi", category: "Neon",
    fontFamily: "monospace", textColor: "#22d3ee", highlightColor: "#f43f5e", strokeColor: "#0f172a", strokeWidth: 2, isPopular: true,
  },
  {
    id: "cinematic-documentary", name: "Cinematic Serif", creatorTag: "Vox / Johnny Harris", category: "Cinematic",
    fontFamily: "Georgia, serif", textColor: "#fef3c7", highlightColor: "#f59e0b", strokeColor: "rgba(0, 0, 0, 0.8)", strokeWidth: 1,
  },
  {
    id: "tokyo-retro", name: "Tokyo Pop Art", creatorTag: "Lifestyle Reels", category: "High Energy",
    fontFamily: "sans-serif", textColor: "#fbcfe8", highlightColor: "#a855f7", strokeColor: "#1e1b4b", strokeWidth: 3,
  },
];

const CATEGORIES: PresetCategory[] = ["All", "High Energy", "Clean", "Cinematic", "Neon"];

export function EditorStylePresetGallery({
  isOpen,
  onClose,
  selectedPresetId,
  onSelectPreset,
}: EditorStylePresetGalleryProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [activeCategory, setActiveCategory] = useState<PresetCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewPreset, setPreviewPreset] = useState<StylePreset>(
    PRESET_COLLECTION.find((p) => p.id === selectedPresetId) || PRESET_COLLECTION[0],
  );

  const filteredPresets = useMemo(() => {
    return PRESET_COLLECTION.filter((preset) => {
      const matchesCategory = activeCategory === "All" || preset.category === activeCategory;
      const matchesQuery =
        searchQuery === "" ||
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.creatorTag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  const handleApply = (preset: StylePreset) => {
    onSelectPreset(preset);
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
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Palette size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Caption Style Presets</h2>
              <p className="text-xs text-dim">Viral font styles used by top creators and editors</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close style gallery">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 rounded-xl border border-hairline bg-surface/50 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[90px]">
            <span className="text-[10px] uppercase font-mono text-dim tracking-wider mb-2">Live Preset Preview</span>
            <div
              style={{
                fontFamily: previewPreset.fontFamily,
                backgroundColor: previewPreset.backgroundColor || "transparent",
                padding: previewPreset.backgroundColor ? "4px 12px" : "0",
                borderRadius: "8px",
              }}
              className="text-xl font-black uppercase tracking-tight"
            >
              <span style={{ color: previewPreset.textColor, textShadow: previewPreset.strokeWidth ? `0 0 ${previewPreset.strokeWidth * 2}px ${previewPreset.strokeColor}` : "none" }}>
                MAKE REELS{" "}
              </span>
              <span style={{ color: previewPreset.highlightColor, textShadow: previewPreset.strokeWidth ? `0 0 ${previewPreset.strokeWidth * 2}px ${previewPreset.strokeColor}` : "none" }}>
                STAND OUT
              </span>
            </div>
            <span className="mt-2 text-[11px] text-accent font-semibold">{previewPreset.name} &bull; {previewPreset.creatorTag}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
              <input
                type="text"
                placeholder="Search styles by creator or aesthetic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
              />
            </div>
            <div className="flex items-center gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn("px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer",
                    activeCategory === cat ? "bg-accent text-white" : "text-dim hover:text-cream bg-surface border border-hairline")}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredPresets.map((preset) => {
              const isSelected = preset.id === previewPreset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setPreviewPreset(preset)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between",
                    isSelected ? "border-accent bg-accent/15" : "border-hairline bg-surface/30 hover:bg-surface/60",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-cream group-hover:text-accent">{preset.name}</span>
                      {preset.isPopular && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-[9px] font-bold text-rose-300">
                          <Flame size={10} /> HOT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-dim">{preset.creatorTag}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-hairline/40">
                    <span className="text-[9px] text-dim uppercase font-mono">{preset.category}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleApply(preset); }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface hover:bg-accent hover:text-white text-cream border border-hairline transition-colors cursor-pointer"
                    >
                      Use Style
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <span className="text-xs text-dim">Selected: <strong className="text-cream">{previewPreset.name}</strong></span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleApply(previewPreset)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check size={14} /> Apply Selected Preset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
