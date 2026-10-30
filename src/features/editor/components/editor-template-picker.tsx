"use client";

import { useId, useMemo, useRef, useState } from "react";
import { LayoutTemplate, Sparkles, X } from "lucide-react";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type {
  AspectRatioMode,
  FontSizeMode,
  PositionMode,
  TextAlignMode,
  TextTransformMode,
} from "./editor-style-inspector";

export interface CreatorTemplateConfig {
  id: string;
  name: string;
  category: "viral" | "podcast" | "tech" | "minimal";
  description: string;
  badge: string;
  styleId: string;
  highlightHex: string;
  aspectRatio: AspectRatioMode;
  position: PositionMode;
  customYPercent: number;
  fontSize: FontSizeMode;
  textAlign: TextAlignMode;
  textTransform: TextTransformMode;
}

export const CREATOR_TEMPLATES: CreatorTemplateConfig[] = [
  {
    id: "hormozi-viral",
    name: "Alex Viral Punch",
    category: "viral",
    description: "High retention yellow box highlight with bold centered uppercase text",
    badge: "Trending",
    styleId: "hormozi",
    highlightHex: "#ffe600",
    aspectRatio: "9:16",
    position: "center",
    customYPercent: 55,
    fontSize: "lg",
    textAlign: "center",
    textTransform: "uppercase",
  },
  {
    id: "tech-monospace",
    name: "Neon Tech Review",
    category: "tech",
    description: "Cyberpunk green accent, compact lower position for screen shares",
    badge: "Coding & Gadgets",
    styleId: "neon",
    highlightHex: "#22c55e",
    aspectRatio: "9:16",
    position: "bottom",
    customYPercent: 78,
    fontSize: "md",
    textAlign: "center",
    textTransform: "none",
  },
  {
    id: "storytime-bold",
    name: "Storytime & Drama",
    category: "viral",
    description: "Striking red highlight box that commands viewer attention on TikTok",
    badge: "High Retention",
    styleId: "red_box",
    highlightHex: "#ef4444",
    aspectRatio: "9:16",
    position: "center",
    customYPercent: 50,
    fontSize: "xl",
    textAlign: "center",
    textTransform: "uppercase",
  },
  {
    id: "podcast-clean",
    name: "Subtle Studio Podcast",
    category: "podcast",
    description: "Understated classic white subtitles for conversational long-form interviews",
    badge: "Podcasts",
    styleId: "subtitles",
    highlightHex: "#ffffff",
    aspectRatio: "16:9",
    position: "bottom",
    customYPercent: 82,
    fontSize: "sm",
    textAlign: "center",
    textTransform: "none",
  },
  {
    id: "fitness-hustle",
    name: "Workout & Energy",
    category: "viral",
    description: "Electric cyan active words with maximum tracking for gym reels",
    badge: "Gym & Sports",
    styleId: "viral_alex",
    highlightHex: "#06b6d4",
    aspectRatio: "9:16",
    position: "custom",
    customYPercent: 62,
    fontSize: "xl",
    textAlign: "center",
    textTransform: "uppercase",
  },
  {
    id: "minimal-clean",
    name: "Minimalist Aesthetic",
    category: "minimal",
    description: "Clean aesthetic typography tailored for lifestyle and travel vlogs",
    badge: "Aesthetic",
    styleId: "minimal",
    highlightHex: "#f6c453",
    aspectRatio: "1:1",
    position: "bottom",
    customYPercent: 80,
    fontSize: "md",
    textAlign: "center",
    textTransform: "none",
  },
];

export interface EditorTemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: CreatorTemplateConfig) => void;
}

export function EditorTemplatePicker({
  isOpen,
  onClose,
  onApplyTemplate,
}: EditorTemplatePickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useDialogFocus(modalRef, isOpen);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return CREATOR_TEMPLATES;
    return CREATOR_TEMPLATES.filter((tpl) => tpl.category === activeCategory);
  }, [activeCategory]);

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
        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col rounded-3xl border border-white/10 bg-[#0c0d0d] font-sans text-white shadow-2xl overflow-hidden focus-visible:outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#f6c453]/15 text-[#f6c453] border border-[#f6c453]/20">
              <LayoutTemplate size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 id={titleId} className="text-base font-bold text-cream">Style Templates</h2>
              <p className="text-xs text-[#788084]">One-click preset looks for viral reels, shorts, and podcasts</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close template picker" className="grid size-8 place-items-center rounded-full text-[#888] hover:bg-white/10 hover:text-white transition cursor-pointer">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-white/8 bg-[#111214] px-6 py-3 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All Templates" },
            { id: "viral", label: "Viral Shorts" },
            { id: "podcast", label: "Podcasts" },
            { id: "tech", label: "Tech & Gaming" },
            { id: "minimal", label: "Minimal" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#f6c453] text-black shadow-sm"
                  : "bg-white/5 text-[#888] hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group flex flex-col justify-between rounded-2xl border border-white/8 bg-[#121315] p-5 hover:border-[#f6c453]/40 transition space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#f6c453] bg-[#f6c453]/10 px-2 py-0.5 rounded-full border border-[#f6c453]/20">
                    {template.badge}
                  </span>
                  <span className="text-[10px] font-mono text-[#666]">{template.aspectRatio} · {template.fontSize}</span>
                </div>
                <h3 className="text-sm font-bold text-cream group-hover:text-[#f6c453] transition">{template.name}</h3>
                <p className="text-xs text-[#788084] leading-relaxed">{template.description}</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-black/60 p-3 flex items-center justify-center">
                <span className="text-xs font-bold tracking-wide" style={{ color: template.highlightHex }}>
                  VIRAL <span className="text-white underline decoration-2">CAPTION</span> LOOK
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onApplyTemplate(template);
                  onClose();
                }}
                className="w-full flex h-9 items-center justify-center gap-1.5 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-[#f6c453] hover:text-black transition cursor-pointer"
              >
                <Sparkles size={13} aria-hidden="true" /> Apply Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
