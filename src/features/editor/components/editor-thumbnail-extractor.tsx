"use client";

import { useId, useRef, useState } from "react";
import { Camera, Download, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";

export interface ThumbnailConfig {
  timestampSeconds: number;
  overlayText: string;
  badgeLabel: string;
  badgeColorHex: string;
  imageFormat: "png" | "jpg";
  includeCaptions: boolean;
}

export interface EditorThumbnailExtractorProps {
  isOpen: boolean;
  onClose: () => void;
  videoDurationSeconds?: number;
  currentPlaybackSeconds?: number;
  onDownloadSnapshot: (config: ThumbnailConfig) => void;
}

const BADGE_PRESETS = [
  { label: "MUST WATCH", colorHex: "#ff4b4b" },
  { label: "NEW TRICK", colorHex: "#3b82f6" },
  { label: "VIRAL HACK", colorHex: "#f59e0b" },
  { label: "SECRET REVEALED", colorHex: "#10b981" },
];

export function EditorThumbnailExtractor({
  isOpen,
  onClose,
  videoDurationSeconds = 60,
  currentPlaybackSeconds = 0,
  onDownloadSnapshot,
}: EditorThumbnailExtractorProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [timestamp, setTimestamp] = useState<number>(Math.round(currentPlaybackSeconds * 10) / 10);
  const [headline, setHeadline] = useState<string>("HOW TO GET 1M VIEWS");
  const [activeBadge, setActiveBadge] = useState<string>("MUST WATCH");
  const [badgeColor, setBadgeColor] = useState<string>("#ff4b4b");
  const [format, setFormat] = useState<"png" | "jpg">("jpg");
  const [includeCaptions, setIncludeCaptions] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSelectBadge = (b: (typeof BADGE_PRESETS)[0]) => {
    setActiveBadge(b.label);
    setBadgeColor(b.colorHex);
  };

  const handleDownload = () => {
    onDownloadSnapshot({
      timestampSeconds: timestamp,
      overlayText: headline,
      badgeLabel: activeBadge,
      badgeColorHex: badgeColor,
      imageFormat: format,
      includeCaptions,
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
              <Camera size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Video Thumbnail Frame Extractor</h2>
              <p className="text-xs text-dim">Capture high-resolution still frame and create clickable cover art</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close thumbnail modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-4 rounded-xl border border-hairline bg-black/60 flex flex-col items-center justify-center min-h-[140px] text-center relative overflow-hidden shadow-inner">
            <span className="text-[10px] font-mono text-dim absolute top-2 left-3 uppercase tracking-wider">Cover Art Snapshot</span>
            {activeBadge && (
              <span
                style={{ backgroundColor: badgeColor }}
                className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider mb-2 shadow-md"
              >
                {activeBadge}
              </span>
            )}
            <h3 className="text-base font-black text-white uppercase tracking-tight max-w-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-snug">
              {headline || "Your Thumbnail Headline"}
            </h3>
            <span className="text-[10px] text-dim/80 mt-3 font-mono">Frame at {timestamp.toFixed(1)}s • 1080x1920 HD</span>
          </div>

          <section className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-cream">Capture Timestamp Frame</span>
                <span className="text-dim font-mono">{timestamp.toFixed(1)}s / {videoDurationSeconds.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(1, videoDurationSeconds)}
                step="0.5"
                value={timestamp}
                onChange={(e) => setTimestamp(parseFloat(e.target.value))}
                className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-dim uppercase tracking-wider block mb-1">Thumbnail Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Punchy curiosity title"
                className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent font-bold"
              />
            </div>
          </section>

          <section className="space-y-2">
            <label className="text-xs font-semibold text-dim uppercase tracking-wider block">Attention Badges</label>
            <div className="grid grid-cols-4 gap-1.5">
              {BADGE_PRESETS.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => handleSelectBadge(b)}
                  className={cn(
                    "p-2 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer truncate",
                    activeBadge === b.label ? "border-accent bg-accent-soft text-accent" : "border-hairline text-dim hover:text-cream bg-surface-raised/30",
                  )}
                >
                  <span className="text-[10px]">{b.label}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={activeBadge}
              onChange={(e) => setActiveBadge(e.target.value.toUpperCase())}
              placeholder="Or type custom badge text"
              className="w-full px-3 py-1 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent font-mono uppercase"
            />
          </section>

          <section className="space-y-2.5 pt-2 border-t border-hairline text-xs">
            <div className="flex items-center justify-between">
              <span className="text-dim">Export Image Format</span>
              <div className="flex items-center gap-1.5">
                {(["jpg", "png"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={cn(
                      "px-3 py-1 rounded-md text-xs font-mono uppercase border transition-colors cursor-pointer",
                      format === fmt ? "border-accent bg-accent-soft text-accent font-bold" : "border-hairline text-dim hover:text-cream",
                    )}
                  >
                    .{fmt}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
              <input type="checkbox" checked={includeCaptions} onChange={(e) => setIncludeCaptions(e.target.checked)} className="rounded text-accent accent-accent" />
              <span>Bake active subtitle overlay into thumbnail frame</span>
            </label>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Full quality 1080p frame snapshot</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download size={14} /> Download Cover ({format.toUpperCase()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
