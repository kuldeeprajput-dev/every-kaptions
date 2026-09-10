"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Download,
  Keyboard,
  Move,
  Pause,
  Play,
  Redo2,
  Type,
  Undo2,
  Volume2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LogoWordmark } from "@/shared/components/logo-wordmark";
import { cn } from "@/shared/lib/cn";
import { captionStyles } from "../data/editor-config";
import type { useCaptionEditor } from "../hooks/use-caption-editor";
import { formatClockTime } from "../lib/captions";
import { CaptionTimeline } from "./caption-timeline";

type Props = {
  editor: ReturnType<typeof useCaptionEditor>;
  onBack?: () => void;
};

type PositionMode = "top" | "center" | "bottom" | "custom";
type FontSizeMode = "sm" | "md" | "lg" | "xl";
type TextAlignMode = "left" | "center" | "right";
type TextTransformMode = "uppercase" | "none" | "lowercase";
type AspectRatioMode = "9:16" | "1:1" | "16:9";

const HIGHLIGHT_COLORS = [
  { id: "yellow", name: "Yellow", hex: "#f6c453" },
  { id: "green", name: "Neon Green", hex: "#22c55e" },
  { id: "cyan", name: "Cyan", hex: "#06b6d4" },
  { id: "pink", name: "Pink", hex: "#ec4899" },
  { id: "red", name: "Red", hex: "#ef4444" },
];

type EditorHistoryButtonsProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  className?: string;
};

function EditorHistoryButtons({ canUndo, canRedo, onUndo, onRedo, className }: EditorHistoryButtonsProps) {
  return (
    <div
      role="group"
      aria-label="Edit history"
      className={cn("items-center gap-1 rounded-xl border border-white/10 bg-[#141311] p-1", className)}
    >
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label={canUndo ? "Undo last caption change" : "No caption changes to undo"}
        className="flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[#d8d8d6] transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:text-[#555957]"
        title="Undo (Ctrl or Command + Z)"
      >
        <Undo2 size={14} aria-hidden="true" />
        <span>Undo</span>
      </button>
      <span aria-hidden="true" className="h-4 w-px bg-white/10" />
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label={canRedo ? "Redo last caption change" : "No caption changes to redo"}
        className="flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-[#d8d8d6] transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:text-[#555957]"
        title="Redo (Ctrl or Command + Shift + Z)"
      >
        <Redo2 size={14} aria-hidden="true" />
        <span>Redo</span>
      </button>
    </div>
  );
}

export function MediaEditor({ editor, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState<PositionMode>("bottom");
  const [customYPercent, setCustomYPercent] = useState<number>(82);
  const [fontSize, setFontSize] = useState<FontSizeMode>("md");
  const [textAlign, setTextAlign] = useState<TextAlignMode>("center");
  const [textTransform, setTextTransform] = useState<TextTransformMode>("uppercase");
  const [activeHighlightHex, setActiveHighlightHex] = useState<string>("#f6c453");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>("9:16");
  const [isEditingCanvasText, setIsEditingCanvasText] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [isDraggingCaption, setIsDraggingCaption] = useState(false);

  const selectedStyle = useMemo(
    () => captionStyles.find((style) => style.id === editor.styleId) ?? captionStyles[0],
    [editor.styleId],
  );

  const isAudio = editor.file?.type.startsWith("audio/");

  const togglePlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = seconds;
    editor.setCurrentTime(seconds);
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          if (editor.canRedo) editor.redo();
        } else {
          e.preventDefault();
          if (editor.canUndo) editor.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        if (editor.canRedo) editor.redo();
      } else if (e.code === "Space") {
        e.preventDefault();
        void togglePlayback();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seekTo(Math.max(0, editor.currentTime - 0.5));
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seekTo(Math.min(editor.duration, editor.currentTime + 0.5));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editor, seekTo, togglePlayback]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingCaption(true);
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingCaption) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const percentage = Math.max(10, Math.min(90, (relativeY / rect.height) * 100));
    setCustomYPercent(Math.round(percentage));
    setPosition("custom");
  };

  const handlePointerUp = () => {
    setIsDraggingCaption(false);
  };

  const fontSizeClasses: Record<FontSizeMode, string> = {
    sm: "text-xs sm:text-sm leading-snug",
    md: "text-sm sm:text-lg leading-tight",
    lg: "text-lg sm:text-2xl leading-tight font-extrabold",
    xl: "text-xl sm:text-3xl leading-tight font-black tracking-wide",
  };

  const formatText = (text: string) => {
    if (textTransform === "uppercase") return text.toUpperCase();
    if (textTransform === "lowercase") return text.toLowerCase();
    return text;
  };

  const activeSeg = editor.activeSegment || editor.segments.find((segment) => segment.id === editor.selectedSegmentId) || editor.segments[0];

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#070808] font-sans text-[#d8d8d6] select-none">
      <header className="app-header sticky top-0 z-40 flex min-h-14 items-center justify-between gap-2 border-b border-white/8 bg-[#0c0b0ad1] px-3 py-2 text-[#c8c2b6] backdrop-blur-md sm:px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/studio" className="inline-flex shrink-0 items-center">
            <LogoWordmark className="h-auto w-[158px] sm:w-[190px] lg:w-[210px]" />
          </Link>
          {editor.file?.name ? (
            <span className="hidden truncate text-xs text-[#81888b] max-w-[180px] lg:inline-block border-l border-white/10 pl-3">
              {editor.file.name}
            </span>
          ) : null}
        </div>

        <EditorHistoryButtons
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          onUndo={editor.undo}
          onRedo={editor.redo}
          className="flex"
        />

        <div className="header-actions ml-auto flex min-w-0 items-center gap-1.5 text-[#c8c2b6] sm:gap-2">
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-semibold text-white transition hover:border-white/30 xl:flex"
            title="Keyboard shortcuts"
          >
            <Keyboard size={13} /> <span>Shortcuts</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else editor.reset();
            }}
            aria-label="Back to my reels"
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-2.5 text-xs font-semibold text-white transition hover:border-white/30 sm:px-3"
          >
            <ArrowLeft size={14} aria-hidden="true" /> <span className="hidden sm:inline">My reels</span>
          </button>
          <Link
            href="/pricing"
            className="hidden h-9 items-center rounded-full border border-white/20 px-3.5 text-xs font-semibold text-white transition hover:border-white/40 lg:flex"
          >
            Upgrade
          </Link>
          <button
            type="button"
            onClick={() => editor.downloadCaptions("srt")}
            className="flex h-9 items-center gap-1.5 rounded-full bg-[#f6c453] px-2.5 text-xs font-bold text-black transition hover:brightness-105 sm:px-3.5"
          >
            <Download size={14} aria-hidden="true" /> <span className="hidden sm:inline">Export .SRT</span><span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      {editor.error ? (
        <div role="alert" className="border-b border-red-400/20 bg-red-400/10 px-4 py-2 text-center text-xs text-red-200">
          {editor.error} <Link href="/pricing" className="ml-1 font-bold underline">View plans</Link>
        </div>
      ) : null}

      <div className="grid lg:h-[calc(100dvh-246px)] lg:grid-cols-[minmax(250px,320px)_minmax(360px,1fr)_320px]">
        <section className="order-2 border-white/8 bg-[#0e0f0d] lg:order-1 lg:overflow-y-auto lg:border-r custom-scrollbar">
          <div className="sticky top-0 z-10 border-b border-white/8 bg-[#0e0f0d]/95 backdrop-blur-md px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#727c80]">Captions</p>
                <h1 className="mt-1 text-sm font-semibold text-cream">Review every line</h1>
              </div>
              <span className="rounded-full border border-[#f6c453]/30 bg-[#f6c453]/10 px-2.5 py-1 text-[10px] font-bold text-[#f6c453]">
                {editor.segments.length} lines
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#727a7e]">Tap a line to jump to it. Edit the text directly before exporting.</p>
          </div>

          <div className="space-y-2 p-3 sm:p-4">
            {editor.segments.map((segment, index) => {
              const active = editor.activeSegment?.id === segment.id || editor.selectedSegmentId === segment.id;
              return (
                <article
                  key={segment.id}
                  className={cn(
                    "rounded-xl border p-3 transition",
                    active ? "border-[#f6c453]/50 bg-[#f6c453]/10" : "border-white/8 bg-black/15 hover:border-white/15",
                  )}
                >
                  <div className="flex items-center justify-between gap-3 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        editor.setSelectedSegmentId(segment.id);
                        seekTo(segment.start);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span className="text-[11px] font-bold text-[#f6c453]">{formatClockTime(segment.start)}</span>
                      <span className="text-[10px] text-[#626b70]">Line {index + 1}</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#888]">
                      <button
                        type="button"
                        onClick={() => editor.splitSegment(segment.id)}
                        className="hover:text-[#f6c453] transition cursor-pointer px-1 py-0.5"
                        title="Split segment at playhead"
                      >
                        Split
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => editor.mergeWithNext(segment.id)}
                        className="hover:text-[#f6c453] transition cursor-pointer px-1 py-0.5"
                        title="Merge with next segment"
                      >
                        Merge
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => editor.deleteSegment(segment.id)}
                        className="hover:text-red-400 transition cursor-pointer px-1 py-0.5"
                        title="Delete line"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={segment.text}
                    onFocus={() => editor.setSelectedSegmentId(segment.id)}
                    onChange={(event) => editor.updateSegment(segment.id, event.target.value)}
                    rows={2}
                    aria-label={`Caption ${index + 1} text`}
                    className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-cream outline-none placeholder:text-[#596064]"
                  />
                </article>
              );
            })}
          </div>
        </section>

        <section className="order-1 flex min-h-[500px] flex-col items-center justify-center bg-black p-2 sm:p-4 lg:order-2 lg:min-h-0 lg:h-full">
          <div className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center min-h-0 my-auto">
            <div
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={cn(
                "group relative flex w-auto max-w-full touch-none items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e0e] shadow-2xl shadow-black transition-all mx-auto my-auto",
                aspectRatio === "9:16" && "aspect-[9/16] h-full max-h-[64dvh] lg:max-h-[calc(100dvh-190px)]",
                aspectRatio === "1:1" && "aspect-square h-full max-h-[64dvh] lg:max-h-[calc(100dvh-190px)]",
                aspectRatio === "16:9" && "aspect-[16/9] w-full max-h-[64dvh] lg:max-h-[calc(100dvh-190px)]",
              )}
            >
              {isAudio ? (
                <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
                  <span className="grid size-16 place-items-center rounded-2xl bg-[#f6c453]/10 text-[#f6c453]">
                    <Volume2 size={28} />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-cream">Audio caption preview</p>
                  <p className="mt-2 text-xs leading-5 text-[#747c80]">Play the audio to review each caption in time.</p>
                </div>
              ) : null}

              <video
                ref={videoRef}
                src={editor.mediaUrl}
                playsInline
                onClick={togglePlayback}
                className={cn("h-full w-full object-contain cursor-pointer", isAudio && "absolute opacity-0")}
                onLoadedMetadata={(event) => editor.setDuration(event.currentTarget.duration)}
                onTimeUpdate={(event) => editor.setCurrentTime(event.currentTarget.currentTime)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />

              {!isPlaying && !isAudio ? (
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f6c453]"
                  aria-label="Play video"
                >
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#f6c453] text-black shadow-2xl transition transform group-hover:scale-110">
                    <Play size={24} className="ml-1 fill-black" />
                  </div>
                </button>
              ) : null}

              {activeSeg ? (
                <div
                  style={
                    position === "custom"
                      ? { top: `${customYPercent}%`, transform: "translateY(-50%)" }
                      : undefined
                  }
                  className={cn(
                    "absolute inset-x-3 flex justify-center text-center transition-all duration-100 z-20",
                    position === "top" && "top-[12%]",
                    position === "center" && "top-1/2 -translate-y-1/2",
                    position === "bottom" && "bottom-[14%]",
                  )}
                >
                  {isEditingCanvasText ? (
                    <div className="w-full max-w-[95%] bg-black/90 p-2 rounded-xl border border-[#f6c453] shadow-2xl">
                      <textarea
                        autoFocus
                        value={activeSeg.text}
                        onChange={(e) => editor.updateSegment(activeSeg.id, e.target.value)}
                        onBlur={() => setIsEditingCanvasText(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            setIsEditingCanvasText(false);
                          }
                        }}
                        rows={2}
                        className="w-full resize-none bg-transparent text-center text-base font-bold text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingCanvasText(false)}
                        className="mt-1 rounded bg-[#f6c453] px-3 py-1 text-[11px] font-bold text-black cursor-pointer"
                      >
                        Done Editing
                      </button>
                    </div>
                  ) : (
                    <div
                      onPointerDown={handlePointerDown}
                      onDoubleClick={() => setIsEditingCanvasText(true)}
                      className={cn(
                        "group/cap relative max-w-[94%] touch-none cursor-grab transition-transform hover:scale-[1.02] active:cursor-grabbing",
                        isDraggingCaption && "scale-[1.03] ring-2 ring-[#f6c453]/60 rounded-xl",
                      )}
                      title="Drag up/down to position, double-click to edit text"
                    >
                      <p
                        className={cn(
                          "px-3 py-1.5 transition-all",
                          selectedStyle?.previewClass,
                          selectedStyle?.textClass,
                          fontSizeClasses[fontSize],
                          textAlign === "left" && "text-left",
                          textAlign === "center" && "text-center",
                          textAlign === "right" && "text-right",
                        )}
                        style={{
                          color: selectedStyle?.id === "yellow" ? activeHighlightHex : undefined,
                        }}
                      >
                        {formatText(activeSeg.text)}
                      </p>

                      <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 opacity-0 group-hover/cap:opacity-100 sm:flex rounded-full bg-black/90 px-3 py-0.5 text-[10px] font-semibold text-[#f6c453] border border-[#f6c453]/40 shadow-lg pointer-events-none whitespace-nowrap">
                        <Move size={11} /> Drag to move · Double click to edit
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mx-auto mt-3 flex w-full max-w-3xl flex-nowrap items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#111212] px-3 py-2.5 font-sans [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={togglePlayback}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f4ecdc] text-black hover:bg-white transition cursor-pointer"
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
              >
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              </button>
              <span className="shrink-0 text-xs font-medium text-[#8a9295]">
                {formatClockTime(editor.currentTime)} / {formatClockTime(editor.duration)}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
              <span className="text-[10px] font-bold text-[#666] px-1 uppercase">Ratio</span>
              {(["9:16", "1:1", "16:9"] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  aria-pressed={aspectRatio === ratio}
                  aria-label={"Use " + ratio + " preview ratio"}
                  className={cn(
                    "min-h-8 rounded-lg px-2 py-1 text-[10px] font-bold transition",
                    aspectRatio === ratio ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                  )}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => setTextAlign("left")}
                aria-pressed={textAlign === "left"}
                aria-label="Align caption left"
                className={cn(
                  "grid size-8 place-items-center rounded-lg transition",
                  textAlign === "left" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
                title="Align Left"
              >
                <AlignLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => setTextAlign("center")}
                aria-pressed={textAlign === "center"}
                aria-label="Center caption text"
                className={cn(
                  "grid size-8 place-items-center rounded-lg transition",
                  textAlign === "center" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
                title="Align Center"
              >
                <AlignCenter size={13} />
              </button>
              <button
                type="button"
                onClick={() => setTextAlign("right")}
                aria-pressed={textAlign === "right"}
                aria-label="Align caption right"
                className={cn(
                  "grid size-8 place-items-center rounded-lg transition",
                  textAlign === "right" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
                title="Align Right"
              >
                <AlignRight size={13} />
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
              <span className="text-[10px] font-bold text-[#666] px-1 uppercase flex items-center gap-1">
                <Move size={11} /> Pos
              </span>
              {(["top", "center", "bottom"] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setPosition(pos)}
                  aria-pressed={position === pos}
                  aria-label={"Place caption at " + pos}
                  className={cn(
                    "min-h-8 rounded-lg px-2 py-1 text-[10px] font-semibold capitalize transition",
                    position === pos ? "bg-[#f6c453] text-black font-bold" : "text-[#888] hover:text-white",
                  )}
                >
                  {pos}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
              <span className="text-[10px] font-bold text-[#666] px-1 uppercase flex items-center gap-1">
                <Type size={11} /> Size
              </span>
              {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  aria-pressed={fontSize === sz}
                  aria-label={"Use " + sz + " caption size"}
                  className={cn(
                    "min-h-8 rounded-lg px-2 py-1 text-[10px] font-semibold uppercase transition",
                    fontSize === sz ? "bg-[#f6c453] text-black font-bold" : "text-[#888] hover:text-white",
                  )}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-2 flex w-full max-w-3xl items-center gap-3 rounded-xl border border-white/8 bg-[#111212] px-3 py-2">
            <input
              type="range"
              min={0}
              max={Math.max(editor.duration, 0.1)}
              step={0.01}
              value={Math.min(editor.currentTime, editor.duration || 0)}
              onChange={(event) => seekTo(Number(event.target.value))}
              aria-label="Video position"
              className="min-w-0 flex-1 accent-[#f6c453] cursor-pointer"
            />
          </div>
        </section>

        <aside className="order-3 border-t border-white/8 bg-[#0e0f0d] p-4 lg:overflow-y-auto lg:border-l lg:border-t-0 font-sans custom-scrollbar">
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#727c80]">Caption style</p>
          <h2 className="mt-1 text-sm font-semibold text-cream">Choose a viral look</h2>

          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#666]">Highlight Color</p>
            <div className="mt-1.5 flex items-center gap-2">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveHighlightHex(c.hex)}
                  aria-label={"Use " + c.name + " highlight"}
                  aria-pressed={activeHighlightHex === c.hex}
                  style={{ backgroundColor: c.hex }}
                  className={cn(
                    "size-8 rounded-full border border-white/20 transition hover:scale-105",
                    activeHighlightHex === c.hex && "ring-2 ring-white scale-110",
                  )}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#666]">Text Case</p>
            <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/40 p-1 text-center">
              <button
                type="button"
                onClick={() => setTextTransform("uppercase")}
                aria-pressed={textTransform === "uppercase"}
                className={cn(
                  "min-h-9 rounded-lg px-1 py-1 text-[10px] font-bold transition",
                  textTransform === "uppercase" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
              >
                UPPERCASE
              </button>
              <button
                type="button"
                onClick={() => setTextTransform("none")}
                aria-pressed={textTransform === "none"}
                className={cn(
                  "min-h-9 rounded-lg px-1 py-1 text-[10px] font-bold transition",
                  textTransform === "none" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
              >
                Original
              </button>
              <button
                type="button"
                onClick={() => setTextTransform("lowercase")}
                aria-pressed={textTransform === "lowercase"}
                className={cn(
                  "min-h-9 rounded-lg px-1 py-1 text-[10px] font-bold transition",
                  textTransform === "lowercase" ? "bg-[#f6c453] text-black" : "text-[#888] hover:text-white",
                )}
              >
                lowercase
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            {captionStyles.map((style) => {
              const isSelected = editor.styleId === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => editor.setStyleId(style.id)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition cursor-pointer",
                    isSelected
                      ? "border-[#f6c453] bg-[#f6c453]/10 shadow-md"
                      : "border-white/8 bg-black/20 hover:border-white/20 hover:bg-black/40",
                  )}
                  aria-pressed={isSelected}
                >
                  <span className={cn("block rounded-lg bg-black/80 px-3 py-2 text-center text-sm", style.textClass)}>
                    YOUR <span className={style.activeWordClass}>STORY</span>
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-[#a8adaf]">{style.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#666]">Export Formats</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => editor.downloadCaptions("srt")}
                className="flex h-9 items-center justify-center rounded-xl bg-[#f6c453] text-xs font-bold text-black hover:brightness-105 transition cursor-pointer"
              >
                .SRT
              </button>
              <button
                type="button"
                onClick={() => editor.downloadCaptions("vtt")}
                className="flex h-9 items-center justify-center rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
              >
                .VTT
              </button>
              <button
                type="button"
                onClick={() => editor.downloadCaptions("txt")}
                className="flex h-9 items-center justify-center rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
              >
                .TXT
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showShortcutsModal ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="shortcut-dialog-title" className="relative max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/10 bg-[#161513] p-5 font-sans text-white shadow-2xl sm:rounded-2xl sm:p-6">
            <button
              type="button"
              onClick={() => setShowShortcutsModal(false)}
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-[#888] transition hover:bg-white/8 hover:text-white"
              aria-label="Close keyboard shortcuts"
            >
              <X size={18} />
            </button>
            <h3 id="shortcut-dialog-title" className="flex items-center gap-2 text-lg font-bold">
              <Keyboard size={18} className="text-[#f6c453]" /> Keyboard Shortcuts
            </h3>
            <p className="mt-1 text-xs text-[#888]">Speed up your workflow with hotkeys.</p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-white/8 py-2">
                <span>Play / Pause</span>
                <kbd className="rounded bg-white/10 px-2 py-1 font-mono text-[10px]">Space</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-white/8 py-2">
                <span>Undo change</span>
                <kbd className="rounded bg-white/10 px-2 py-1 font-mono text-[10px]">Ctrl + Z</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-white/8 py-2">
                <span>Redo change</span>
                <kbd className="rounded bg-white/10 px-2 py-1 font-mono text-[10px]">Ctrl + Y / Ctrl + Shift + Z</kbd>
              </div>
              <div className="flex items-center justify-between border-b border-white/8 py-2">
                <span>Seek backwards / forwards</span>
                <kbd className="rounded bg-white/10 px-2 py-1 font-mono text-[10px]">← / →</kbd>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowShortcutsModal(false)}
              className="mt-6 w-full rounded-xl bg-[#f6c453] py-2.5 text-xs font-bold text-black cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}

      <CaptionTimeline editor={editor} onSeek={seekTo} />
    </main>
  );
}
