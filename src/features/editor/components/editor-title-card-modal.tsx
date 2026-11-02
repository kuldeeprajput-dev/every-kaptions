"use client";

import { useId, useRef, useState } from "react";
import { Check, Tv, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface TitleCardConfig {
  headline: string;
  subheadline: string;
  styleId: "yellow-highlight" | "breaking-news" | "gradient-pill" | "minimal-box";
  durationSeconds: number;
  positionPercent: number;
  entranceAnimation: "spring-drop" | "slide-left" | "zoom-fade";
}

export interface EditorTitleCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTitleCard: (config: TitleCardConfig) => void;
  initialConfig?: Partial<TitleCardConfig>;
}

const TITLE_CARD_STYLES = [
  { id: "yellow-highlight", name: "Viral Yellow", desc: "Black on bold yellow highlighter box", bg: "bg-yellow-400 text-black font-black" },
  { id: "breaking-news", name: "Breaking Alert", desc: "Urgent red badge headline for news hooks", bg: "bg-red-600 text-white font-extrabold" },
  { id: "gradient-pill", name: "Cyber Gradient", desc: "Neon purple to rose gradient pill frame", bg: "bg-gradient-to-r from-violet-600 to-rose-600 text-white font-bold" },
  { id: "minimal-box", name: "Editorial Dark", desc: "Refined dark charcoal matte container", bg: "bg-zinc-900 text-zinc-100 font-semibold border border-zinc-700" },
];

export function EditorTitleCardModal({
  isOpen,
  onClose,
  onApplyTitleCard,
  initialConfig,
}: EditorTitleCardModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [headline, setHeadline] = useState<string>(initialConfig?.headline ?? "Stop Scrolling! Watch This");
  const [subheadline, setSubheadline] = useState<string>(initialConfig?.subheadline ?? "The 3 rules you need to know today");
  const [styleId, setStyleId] = useState<TitleCardConfig["styleId"]>(initialConfig?.styleId ?? "yellow-highlight");
  const [duration, setDuration] = useState<number>(initialConfig?.durationSeconds ?? 3.0);
  const [position, setPosition] = useState<number>(initialConfig?.positionPercent ?? 25);
  const [animation, setAnimation] = useState<TitleCardConfig["entranceAnimation"]>(initialConfig?.entranceAnimation ?? "spring-drop");

  if (!isOpen) return null;

  const currentStyle = TITLE_CARD_STYLES.find((s) => s.id === styleId) ?? TITLE_CARD_STYLES[0];

  const handleSave = () => {
    onApplyTitleCard({
      headline,
      subheadline,
      styleId,
      durationSeconds: duration,
      positionPercent: position,
      entranceAnimation: animation,
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
              <Tv size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Video Intro Hook & Title Card</h2>
              <p className="text-xs text-dim">Display high-retention opening title cards during the first 3 seconds</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close title card modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-4 rounded-xl border border-hairline bg-black/50 flex flex-col items-center justify-center min-h-[105px] text-center relative overflow-hidden">
            <span className="text-[10px] font-mono text-dim absolute top-2 left-3 uppercase tracking-wider">Preview Card</span>
            <div className={cn("px-4 py-2.5 rounded-xl shadow-xl max-w-sm mt-2 transition-all", currentStyle.bg)}>
              <span className="text-sm uppercase tracking-wide block leading-tight">{headline || "Your Hook Title"}</span>
              {subheadline && <span className="text-[11px] opacity-90 block mt-0.5 leading-snug">{subheadline}</span>}
            </div>
            <span className="text-[10px] text-dim/70 mt-2 font-mono">Visible 0.0s – {duration.toFixed(1)}s ({animation})</span>
          </div>

          <section className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-1">Headline Text</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="High impact opening hook"
                className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-1">Subheadline Teaser</label>
              <input
                type="text"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="Supporting description or takeaway"
                className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
              />
            </div>
          </section>

          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Visual Theme Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {TITLE_CARD_STYLES.map((s) => {
                const isSelected = styleId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyleId(s.id as TitleCardConfig["styleId"])}
                    className={cn(
                      "p-3 rounded-xl border text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                        : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{s.name}</span>
                      {isSelected && <Check size={13} className="text-accent" />}
                    </div>
                    <p className="text-[11px] text-dim line-clamp-1">{s.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3 pt-2 border-t border-hairline text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-dim">Card Duration</span>
                  <span className="text-dim font-mono">{duration.toFixed(1)}s</span>
                </div>
                <input type="range" min="1.5" max="6.0" step="0.5" value={duration} onChange={(e) => setDuration(parseFloat(e.target.value))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-dim">Vertical Anchor Position</span>
                  <span className="text-dim font-mono">{position}%</span>
                </div>
                <input type="range" min="15" max="75" step="5" value={position} onChange={(e) => setPosition(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-dim">Entrance Animation</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: "spring-drop", label: "Spring Drop" },
                  { id: "slide-left", label: "Slide Left" },
                  { id: "zoom-fade", label: "Zoom Fade" },
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAnimation(a.id as TitleCardConfig["entranceAnimation"])}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] border capitalize transition-colors cursor-pointer",
                      animation === a.id ? "border-accent bg-accent-soft text-accent font-semibold" : "border-hairline text-dim hover:text-cream",
                    )}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Card automatically fades out at {duration.toFixed(1)}s</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Title Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
