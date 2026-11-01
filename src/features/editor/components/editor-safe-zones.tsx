"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Grid, Smartphone, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type SafeZonePlatform = "reels" | "tiktok" | "shorts" | "youtube-16-9";

export interface EditorSafeZonesProps {
  isOpen: boolean;
  onClose: () => void;
  captionYPercent?: number;
  onToggleOverlay?: (visible: boolean) => void;
}

interface PlatformGuide {
  id: SafeZonePlatform;
  name: string;
  badge: string;
  topDangerPercent: number;
  bottomDangerPercent: number;
  rightDangerPercent: number;
  description: string;
}

const PLATFORM_GUIDES: PlatformGuide[] = [
  { id: "reels", name: "Instagram Reels", badge: "9:16", topDangerPercent: 14, bottomDangerPercent: 28, rightDangerPercent: 16, description: "Avoid bottom 28% for audio marquee, top 14% for story chrome" },
  { id: "tiktok", name: "TikTok Feed", badge: "9:16", topDangerPercent: 12, bottomDangerPercent: 32, rightDangerPercent: 18, description: "Avoid bottom 32% for caption box, right rail for engagement buttons" },
  { id: "shorts", name: "YouTube Shorts", badge: "9:16", topDangerPercent: 10, bottomDangerPercent: 24, rightDangerPercent: 15, description: "Avoid bottom 24% for channel info, right 15% for action buttons" },
  { id: "youtube-16-9", name: "YouTube 16:9", badge: "16:9", topDangerPercent: 8, bottomDangerPercent: 16, rightDangerPercent: 8, description: "Avoid bottom 16% for seekbar scrub preview and player overlay buttons" },
];

export function EditorSafeZones({
  isOpen,
  onClose,
  captionYPercent = 80,
  onToggleOverlay,
}: EditorSafeZonesProps) {
  const [activePlatform, setActivePlatform] = useState<SafeZonePlatform>("reels");
  const [opacity, setOpacity] = useState(70);
  const [showCenterGuide, setShowCenterGuide] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  if (!isOpen) return null;

  const currentGuide = PLATFORM_GUIDES.find((g) => g.id === activePlatform) ?? PLATFORM_GUIDES[0];
  const isCaptionInDangerZone =
    captionYPercent < currentGuide.topDangerPercent ||
    captionYPercent > 100 - currentGuide.bottomDangerPercent;

  const handleToggleVisibility = () => {
    const next = !isOverlayVisible;
    setIsOverlayVisible(next);
    onToggleOverlay?.(next);
  };

  return (
    <div className="absolute top-4 right-4 z-40 w-80 bg-surface/95 border border-hairline rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden animate-[fadeIn_0.15s_ease-out]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-surface-raised/60">
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-accent" />
          <h3 className="text-xs font-semibold text-cream">Social Safe Zones</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleVisibility}
            className="p-1 rounded text-dim hover:text-cream hover:bg-surface-raised transition-colors cursor-pointer"
            title={isOverlayVisible ? "Hide overlay" : "Show overlay"}
          >
            {isOverlayVisible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-dim hover:text-cream hover:bg-surface-raised transition-colors cursor-pointer"
            aria-label="Close safe zones panel"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3.5 text-xs">
        <div>
          <label className="text-[11px] font-semibold text-dim uppercase tracking-wider block mb-2">Target Platform</label>
          <div className="grid grid-cols-2 gap-1.5">
            {PLATFORM_GUIDES.map((guide) => (
              <button
                key={guide.id}
                type="button"
                onClick={() => setActivePlatform(guide.id)}
                className={cn(
                  "p-2 rounded-lg border text-left transition-all cursor-pointer",
                  activePlatform === guide.id
                    ? "border-accent bg-accent-soft text-cream font-medium"
                    : "border-hairline bg-surface-raised/30 hover:bg-surface-raised text-dim hover:text-body",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{guide.name}</span>
                  <span className="text-[10px] text-dim font-mono">{guide.badge}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {isCaptionInDangerZone && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg border border-amber/40 bg-amber-soft/50 text-amber animate-[fadeIn_0.2s_ease]">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold block">Caption Danger Zone</span>
              Position at {captionYPercent.toFixed(0)}% overlaps {currentGuide.name} native UI elements.
            </div>
          </div>
        )}

        <div className="p-2.5 rounded-lg bg-surface-raised/40 border border-hairline text-[11px] text-dim leading-relaxed">
          {currentGuide.description}
        </div>

        <div className="space-y-2.5 pt-2 border-t border-hairline">
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-dim">Overlay Opacity</span>
              <span className="text-dim font-mono">{opacity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={opacity}
              onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
              className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-dim hover:text-cream">
              <input
                type="checkbox"
                checked={showCenterGuide}
                onChange={(e) => setShowCenterGuide(e.target.checked)}
                className="rounded text-accent accent-accent"
              />
              <span className="text-[11px]">Center Crosshair</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-dim hover:text-cream">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded text-accent accent-accent"
              />
              <span className="text-[11px] flex items-center gap-1">
                <Grid size={12} /> Rule of Thirds
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface VideoSafeZoneCanvasProps {
  platform: SafeZonePlatform;
  opacityPercent?: number;
  showCenter?: boolean;
  showThirds?: boolean;
}

export function VideoSafeZoneCanvas({
  platform,
  opacityPercent = 70,
  showCenter = true,
  showThirds = true,
}: VideoSafeZoneCanvasProps) {
  const guide = PLATFORM_GUIDES.find((g) => g.id === platform) ?? PLATFORM_GUIDES[0];
  const opacityVal = opacityPercent / 100;

  return (
    <div
      aria-hidden="true"
      style={{ opacity: opacityVal }}
      className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between transition-opacity duration-150"
    >
      <div
        style={{ height: `${guide.topDangerPercent}%` }}
        className="w-full border-b border-dashed border-red-500/80 bg-red-500/10 flex items-start justify-center pt-1"
      >
        <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 bg-black/60 px-1.5 py-0.5 rounded">
          Top UI Zone ({guide.topDangerPercent}%)
        </span>
      </div>

      {showThirds && (
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10 relative">
            {showCenter && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 border border-accent/80 rounded-full" />
              </div>
            )}
          </div>
          <div className="border-b border-white/10" />
          <div className="border-r border-white/10" />
          <div className="border-r border-white/10" />
          <div />
        </div>
      )}

      <div
        style={{ height: `${guide.bottomDangerPercent}%` }}
        className="w-full border-t border-dashed border-red-500/80 bg-red-500/10 flex items-end justify-center pb-1 relative"
      >
        <div
          style={{ width: `${guide.rightDangerPercent}%` }}
          className="absolute top-0 bottom-0 right-0 border-l border-dashed border-red-500/80 bg-red-500/15"
        />
        <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 bg-black/60 px-1.5 py-0.5 rounded z-10">
          Bottom Social UI & Audio Zone ({guide.bottomDangerPercent}%)
        </span>
      </div>
    </div>
  );
}
