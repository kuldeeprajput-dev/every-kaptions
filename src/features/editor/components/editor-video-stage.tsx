"use client";

import { useMemo, useRef, useState } from "react";
import { Move, Volume2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { ensureSegmentWords } from "../lib/captions";
import type { CaptionSegment, CaptionStyle } from "../types/captions";
import type {
  AspectRatioMode,
  FontSizeMode,
  PositionMode,
  TextAlignMode,
  TextTransformMode,
} from "./editor-style-inspector";

export interface EditorVideoStageProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mediaUrl: string;
  isAudio: boolean;
  aspectRatio: AspectRatioMode;
  position: PositionMode;
  customYPercent: number;
  onCustomYChange: (val: number) => void;
  onPositionChange: (pos: PositionMode) => void;
  currentVoiceSeg: CaptionSegment | null;
  currentTime: number;
  selectedStyle: CaptionStyle | undefined;
  activeHighlightHex: string;
  fontSize: FontSizeMode;
  textAlign: TextAlignMode;
  textTransform: TextTransformMode;
  onTogglePlayback: () => void;
}

const fontSizeClasses: Record<FontSizeMode, string> = {
  sm: "text-xs sm:text-sm",
  md: "text-sm sm:text-base font-bold",
  lg: "text-base sm:text-xl font-bold",
  xl: "text-xl sm:text-2xl font-black",
};

export function EditorVideoStage({
  videoRef,
  mediaUrl,
  isAudio,
  aspectRatio,
  position,
  customYPercent,
  onCustomYChange,
  onPositionChange,
  currentVoiceSeg,
  currentTime,
  selectedStyle,
  activeHighlightHex,
  fontSize,
  textAlign,
  textTransform,
  onTogglePlayback,
}: EditorVideoStageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const percent = Math.round((offsetY / rect.height) * 100);
    const clamped = Math.min(90, Math.max(10, percent));
    onCustomYChange(clamped);
    onPositionChange("custom");
  };

  const handlePointerUp = () => {
    if (isDragging) setIsDragging(false);
  };

  const formatText = (text: string) => {
    if (textTransform === "uppercase") return text.toUpperCase();
    if (textTransform === "lowercase") return text.toLowerCase();
    return text;
  };

  const wordsList = useMemo(() => {
    if (!currentVoiceSeg) return [];
    return currentVoiceSeg.words && currentVoiceSeg.words.length > 0
      ? currentVoiceSeg.words
      : ensureSegmentWords(currentVoiceSeg);
  }, [currentVoiceSeg]);

  const activeWordIndex = useMemo(() => {
    return wordsList.findIndex(
      (w) => currentTime >= w.start && currentTime < w.end,
    );
  }, [wordsList, currentTime]);

  return (
    <div className="caption-canvas flex-1 min-w-0 flex flex-col items-center justify-center p-4 relative overflow-hidden h-full">
      <div className="mx-auto flex w-full max-w-5xl h-full flex-1 items-center justify-center min-h-0 my-auto p-2">
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={cn(
            "group relative flex w-auto max-w-full h-full max-h-full touch-none items-center justify-center overflow-hidden rounded-2xl border border-hairline bg-surface shadow-sm transition-all mx-auto my-auto select-none",
            aspectRatio === "9:16" && "aspect-[9/16]",
            aspectRatio === "1:1" && "aspect-square",
            aspectRatio === "16:9" && "aspect-[16/9] w-full",
          )}
        >
          {/* Audio Placeholder */}
          {isAudio ? (
            <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
              <span className="grid size-20 place-items-center rounded-3xl bg-amber/10 text-amber border border-amber/20 shadow-sm">
                <Volume2 size={36} aria-hidden="true" />
              </span>
              <p className="mt-4 text-base font-bold text-cream">Audio Caption Preview</p>
              <p className="mt-2 text-xs leading-5 text-body">
                Play the track to test caption timing in sync.
              </p>
            </div>
          ) : null}

          {/* HTML Video Element */}
          <video
            ref={videoRef}
            src={mediaUrl}
            playsInline
            preload="auto"
            onClick={onTogglePlayback}
            className={cn(
              "h-full w-full object-contain cursor-pointer",
              isAudio && "hidden",
            )}
          />

          {/* Subtitles Overlay */}
          {currentVoiceSeg ? (
            <div
              onPointerDown={handlePointerDown}
              style={{
                top:
                  position === "top"
                    ? "12%"
                    : position === "center"
                    ? "50%"
                    : position === "bottom"
                    ? "78%"
                    : `${customYPercent}%`,
              }}
              className={cn(
                "group/cap absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing max-w-[88%] z-30 transition-transform",
                isDragging && "scale-105",
              )}
            >
              <div
                className={cn(
                  "px-3.5 py-1.5 transition-all flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5",
                  selectedStyle?.previewClass,
                  selectedStyle?.textClass,
                  fontSizeClasses[fontSize],
                  textAlign === "left" && "justify-start text-left",
                  textAlign === "center" && "justify-center text-center",
                  textAlign === "right" && "justify-end text-right",
                )}
              >
                {wordsList.map((word, wIdx) => {
                  const isCurrentWord = wIdx === activeWordIndex;
                  const isPastWord = currentTime >= word.end;

                  let wordStyle: React.CSSProperties | undefined = undefined;
                  if (isCurrentWord) {
                    if (selectedStyle?.id === "yellow") {
                      wordStyle = { color: activeHighlightHex };
                    } else if (selectedStyle?.id === "hormozi") {
                      wordStyle = {
                        backgroundColor: activeHighlightHex || "#ffe600",
                        color: "#000000",
                      };
                    } else if (selectedStyle?.id === "viral_alex") {
                      wordStyle = {
                        color: activeHighlightHex === "#f6c453" ? "#22c55e" : activeHighlightHex,
                      };
                    } else if (selectedStyle?.id === "neon") {
                      wordStyle = {
                        color: activeHighlightHex === "#f6c453" ? "#ec4899" : activeHighlightHex,
                      };
                    }
                  }

                  return (
                    <span
                      key={word.id || wIdx}
                      style={wordStyle}
                      className={cn(
                        "transition-all duration-75 inline-block",
                        isCurrentWord && cn("scale-110 font-black", selectedStyle?.activeWordClass),
                        !isCurrentWord && isPastWord && "opacity-95",
                        !isCurrentWord && !isPastWord && "opacity-80",
                      )}
                    >
                      {formatText(word.text)}
                    </span>
                  );
                })}
              </div>

              {/* Repositioning Helper Pill */}
              <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 opacity-0 group-hover/cap:opacity-100 sm:flex rounded-lg bg-black/90 px-3 py-1 text-[11px] font-semibold text-amber border border-amber/40 shadow-sm pointer-events-none whitespace-nowrap">
                <Move size={11} aria-hidden="true" /> Drag to move · Double click to edit
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
