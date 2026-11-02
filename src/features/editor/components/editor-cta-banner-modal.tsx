"use client";

import { useId, useRef, useState } from "react";
import { Bell, Check, ExternalLink, Heart, MessageCircle, Share2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface CtaBannerConfig {
  callToActionText: string;
  creatorHandle: string;
  platform: "instagram" | "tiktok" | "youtube" | "generic";
  displayTiming: "last-3s" | "last-5s" | "persistent";
  bannerPosition: "bottom-pill" | "top-bar" | "center-card";
  includePulseAnimation: boolean;
}

export interface EditorCtaBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoDurationSeconds?: number;
  onApplyCta: (config: CtaBannerConfig) => void;
  initialConfig?: Partial<CtaBannerConfig>;
}

const CTA_PRESETS = [
  { text: "Follow for part 2 & daily tips", icon: Heart, defaultTiming: "last-3s" as const },
  { text: "Check link in bio for template", icon: ExternalLink, defaultTiming: "last-5s" as const },
  { text: "Subscribe & turn on notifications", icon: Bell, defaultTiming: "last-3s" as const },
  { text: "Drop your thoughts in comments", icon: MessageCircle, defaultTiming: "last-5s" as const },
];

export function EditorCtaBannerModal({
  isOpen,
  onClose,
  videoDurationSeconds = 60,
  onApplyCta,
  initialConfig,
}: EditorCtaBannerModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [ctaText, setCtaText] = useState<string>(initialConfig?.callToActionText ?? "Follow for more creative hacks");
  const [handle, setHandle] = useState<string>(initialConfig?.creatorHandle ?? "@creator");
  const [platform, setPlatform] = useState<CtaBannerConfig["platform"]>(initialConfig?.platform ?? "instagram");
  const [timing, setTiming] = useState<CtaBannerConfig["displayTiming"]>(initialConfig?.displayTiming ?? "last-3s");
  const [position, setPosition] = useState<CtaBannerConfig["bannerPosition"]>(initialConfig?.bannerPosition ?? "bottom-pill");
  const [pulse, setPulse] = useState<boolean>(initialConfig?.includePulseAnimation ?? true);

  if (!isOpen) return null;

  const handleSave = () => {
    onApplyCta({
      callToActionText: ctaText,
      creatorHandle: handle,
      platform,
      displayTiming: timing,
      bannerPosition: position,
      includePulseAnimation: pulse,
    });
    onClose();
  };

  const timingLabel =
    timing === "last-3s"
      ? `Last 3.0s (${Math.max(0, videoDurationSeconds - 3).toFixed(1)}s - ${videoDurationSeconds.toFixed(1)}s)`
      : timing === "last-5s"
        ? `Last 5.0s (${Math.max(0, videoDurationSeconds - 5).toFixed(1)}s - ${videoDurationSeconds.toFixed(1)}s)`
        : "Always visible throughout video";

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
              <Share2 size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Outro Call-to-Action & Handle</h2>
              <p className="text-xs text-dim">Drive profile follows and engagement with branded outro prompts</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close CTA banner modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-4 rounded-xl border border-hairline bg-black/50 flex flex-col items-center justify-center min-h-[90px] text-center relative overflow-hidden">
            <span className="text-[10px] font-mono text-dim absolute top-2 left-3 uppercase tracking-wider">Live Banner Look</span>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent text-white shadow-xl text-xs font-semibold mt-2">
              <Heart size={14} className="fill-white" />
              <span>{ctaText}</span>
              {handle && <span className="bg-black/25 px-2 py-0.5 rounded-full text-[10px] font-mono">{handle}</span>}
            </div>
            <span className="text-[10px] text-dim/70 mt-2 font-mono">{timingLabel}</span>
          </div>

          <section>
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-2">Popular Outro Prompts</label>
            <div className="grid grid-cols-2 gap-2">
              {CTA_PRESETS.map((preset) => (
                <button
                  key={preset.text}
                  type="button"
                  onClick={() => { setCtaText(preset.text); setTiming(preset.defaultTiming); }}
                  className="p-2.5 rounded-xl border border-hairline bg-surface-raised/40 hover:bg-surface-raised text-left text-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <preset.icon size={14} className="text-accent shrink-0" />
                  <span className="truncate text-body hover:text-cream">{preset.text}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3 pt-2 border-t border-hairline text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-dim font-medium block mb-1">Custom Action Prompt</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. Save for later"
                  className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-dim font-medium block mb-1">Creator Handle Tag</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "instagram", label: "Instagram" },
                { id: "tiktok", label: "TikTok" },
                { id: "youtube", label: "YouTube" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as CtaBannerConfig["platform"])}
                  className={cn(
                    "py-1.5 px-2 rounded-lg border text-center text-xs transition-colors cursor-pointer",
                    platform === p.id ? "border-accent bg-accent-soft text-accent font-semibold" : "border-hairline text-dim hover:text-cream",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-dim font-medium block mb-1">Display Window</label>
                <select
                  value={timing}
                  onChange={(e) => setTiming(e.target.value as CtaBannerConfig["displayTiming"])}
                  className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent cursor-pointer"
                >
                  <option value="last-3s">Final 3 Seconds of Video</option>
                  <option value="last-5s">Final 5 Seconds of Video</option>
                  <option value="persistent">Persistent Floating Badge</option>
                </select>
              </div>
              <div>
                <label className="text-dim font-medium block mb-1">Banner Layout</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as CtaBannerConfig["bannerPosition"])}
                  className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent cursor-pointer"
                >
                  <option value="bottom-pill">Floating Bottom Pill</option>
                  <option value="top-bar">Top Notification Bar</option>
                  <option value="center-card">Centered Outro Card</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
              <input type="checkbox" checked={pulse} onChange={(e) => setPulse(e.target.checked)} className="rounded text-accent accent-accent" />
              <span>Subtle gentle pulse animation to draw viewer eye</span>
            </label>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Outro trigger attaches to final timeline frame</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply CTA Banner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
