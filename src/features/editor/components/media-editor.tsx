"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Check,
  Download,
  Film,
  FileText,
  Keyboard,
  Layers,
  Layout,
  Minus,
  Move,
  Palette,
  Pause,
  Play,
  Plus,
  Redo2,
  Search,
  Sliders,
  Sparkles,
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
import { useResizableEditorLayout } from "../hooks/use-resizable-editor-layout";
import { ensureSegmentWords } from "../lib/captions";
import { renderAndExportVideo } from "../lib/export-video";
import { usePlanSummary } from "../store/plan-store";
import { CaptionTimeline } from "./caption-timeline";
import { EditorExportModal } from "./editor-export-modal";
import { EditorCaptionList } from "./editor-caption-list";
import { EditorShortcutsModal } from "./editor-shortcuts-modal";
import { EditorMobileDrawer } from "./editor-mobile-drawer";
import { EditorResizeHandle } from "./editor-resize-handle";
import { EditorFindReplaceModal } from "./editor-find-replace-modal";

type Props = {
  editor: ReturnType<typeof useCaptionEditor>;
  onBack?: () => void;
};

type PositionMode = "top" | "center" | "bottom" | "custom";
type FontSizeMode = "sm" | "md" | "lg" | "xl";
type TextAlignMode = "left" | "center" | "right";
type TextTransformMode = "uppercase" | "none" | "lowercase";
type AspectRatioMode = "9:16" | "1:1" | "16:9";
type ActiveRightTab = "styles" | "customize" | "canvas";

const HIGHLIGHT_COLORS = [
  { id: "yellow", name: "Yellow", hex: "#f6c453" },
  { id: "green", name: "Neon Green", hex: "#22c55e" },
  { id: "cyan", name: "Cyan", hex: "#06b6d4" },
  { id: "pink", name: "Pink", hex: "#ec4899" },
  { id: "red", name: "Red", hex: "#ef4444" },
  { id: "purple", name: "Purple", hex: "#a855f7" },
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
      className={cn("flex items-center gap-1 rounded-xl border border-white/10 bg-[#141311] p-1 shadow-inner", className)}
    >
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label={canUndo ? "Undo last caption change" : "No caption changes to undo"}
        className="grid size-8 place-items-center rounded-lg text-[#d8d8d6] transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
        title="Undo (Ctrl + Z)"
      >
        <Undo2 size={16} aria-hidden="true" />
      </button>
      <span aria-hidden="true" className="h-4 w-px bg-white/10" />
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        aria-label={canRedo ? "Redo last caption change" : "No caption changes to redo"}
        className="grid size-8 place-items-center rounded-lg text-[#d8d8d6] transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
        title="Redo (Ctrl + Y)"
      >
        <Redo2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export function MediaEditor({ editor, onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const plan = usePlanSummary();

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
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<null | "captions" | "styles">(null);
  const [isDraggingCaption, setIsDraggingCaption] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<ActiveRightTab>("styles");

  // Adjustable Panel Layout
  const layout = useResizableEditorLayout();

  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [exportError, setExportError] = useState("");

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

  const currentVoiceSeg = editor.activeSegment;
  // During playback or scrubbing, active segment strictly tracks the speaker's voice.
  // When paused, fall back to selected segment or the first segment.
  const activeSegmentId = isPlaying
    ? (currentVoiceSeg?.id || editor.selectedSegmentId)
    : (currentVoiceSeg?.id || editor.selectedSegmentId || editor.segments[0]?.id);

  // For displaying on video canvas:
  // - During playback: strictly show what is currently spoken. When silent, show nothing.
  // - When paused: show what is spoken at current playhead. If playhead is in silence,
  //   show selected segment ONLY if the user is explicitly editing it on canvas.
  const displaySeg = isPlaying
    ? currentVoiceSeg
    : (currentVoiceSeg || (isEditingCanvasText && editor.selectedSegmentId ? editor.segments.find((s) => s.id === editor.selectedSegmentId) : null));

  // Auto-scroll left sidebar to follow the spoken voice in real time
  useEffect(() => {
    if (!isPlaying || !currentVoiceSeg) return;
    const card = document.getElementById(`caption-card-${currentVoiceSeg.id}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentVoiceSeg, isPlaying]);

  // Keyboard shortcuts for export modal and quick dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setShowFindReplaceModal(true);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setShowExportModal(true);
      } else if (e.key === "Escape") {
        if (!isRenderingVideo) setShowExportModal(false);
        setShowShortcutsModal(false);
        setShowFindReplaceModal(false);
        setMobileDrawer(null);
      } else if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        setShowShortcutsModal((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRenderingVideo]);

  // Video Export Handler
  const handleExportVideo = async () => {
    setExportError("");
    if (!videoRef.current || editor.segments.length === 0) return;

    if (!plan.canExport) {
      setExportError("Your monthly export limit has been reached. Upgrade to export more video files.");
      return;
    }

    setIsRenderingVideo(true);
    setRenderProgress(0);

    try {
      const success = await renderAndExportVideo({
        videoElement: videoRef.current,
        segments: editor.segments,
        styleId: editor.styleId,
        highlightHex: activeHighlightHex,
        position,
        customYPercent,
        fontSize,
        textAlign,
        textTransform,
        filename: editor.file?.name || "everykaptions-video.mp4",
        onProgress: (pct) => setRenderProgress(pct),
      });

      if (success) {
        // Strictly ONLY record export quota after successful completion!
        plan.recordExport();
        setShowExportModal(false);
      }
    } catch {
      setExportError("Video export encountered an error. Your export quota was NOT used.");
    } finally {
      setIsRenderingVideo(false);
    }
  };

  // Subtitle Export Handler
  const handleDownloadCaptions = (format: "srt" | "vtt" | "txt") => {
    setExportError("");
    if (!plan.canExport) {
      setExportError("Your monthly export limit has been reached. Upgrade to export more caption files.");
      return;
    }
    const success = editor.downloadCaptions(format);
    if (success) {
      setShowExportModal(false);
    }
  };

  const [replaceNotification, setReplaceNotification] = useState<string | null>(null);

  const handleBatchReplaceCaptions = useCallback(
    (newSegments: typeof editor.segments) => {
      let count = 0;
      newSegments.forEach((newSeg) => {
        const oldSeg = editor.segments.find((s) => s.id === newSeg.id);
        if (oldSeg && oldSeg.text !== newSeg.text) {
          editor.updateSegment(newSeg.id, newSeg.text);
          count++;
        }
      });
      if (count > 0) {
        setReplaceNotification(`Batch replaced words across ${count} ${count === 1 ? "line" : "lines"}`);
        setTimeout(() => setReplaceNotification(null), 3000);
      }
    },
    [editor],
  );

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#070808] font-sans text-[#d8d8d6] select-none flex flex-col">
      {/* Top Header */}
      <header className="app-header sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-white/8 bg-[#0c0b0ad1] px-3 py-2 text-[#c8c2b6] backdrop-blur-md sm:px-5 lg:px-8 relative">
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

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <EditorHistoryButtons
            canUndo={editor.canUndo}
            canRedo={editor.canRedo}
            onUndo={editor.undo}
            onRedo={editor.redo}
          />
        </div>

        <div className="header-actions ml-auto flex min-w-0 items-center gap-1.5 text-[#c8c2b6] sm:gap-2">
          {/* Mobile panel toggles */}
          <button
            type="button"
            onClick={() => setMobileDrawer((curr) => (curr === "captions" ? null : "captions"))}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold transition lg:hidden cursor-pointer",
              mobileDrawer === "captions"
                ? "bg-[#f6c453] text-black border-[#f6c453]"
                : "border-white/15 text-white hover:border-white/30",
            )}
            title="Toggle Captions List"
          >
            <Layers size={13} /> <span className="hidden sm:inline">Captions</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileDrawer((curr) => (curr === "styles" ? null : "styles"))}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold transition lg:hidden cursor-pointer",
              mobileDrawer === "styles"
                ? "bg-[#f6c453] text-black border-[#f6c453]"
                : "border-white/15 text-white hover:border-white/30",
            )}
            title="Toggle Styles"
          >
            <Sparkles size={13} /> <span className="hidden sm:inline">Styles</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFindReplaceModal(true)}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-semibold text-white transition hover:border-white/30 sm:flex cursor-pointer"
            title="Batch find and replace (Ctrl+F)"
          >
            <Search size={13} className="text-[#f6c453]" aria-hidden="true" />
            <span>Find & Replace</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs font-semibold text-white transition hover:border-white/30 xl:flex cursor-pointer"
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
            className="flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-2.5 text-xs font-semibold text-white transition hover:border-white/30 sm:px-3 cursor-pointer"
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
            onClick={() => setShowExportModal(true)}
            className="flex h-9 items-center gap-1.5 rounded-full bg-[#f6c453] px-3.5 text-xs font-bold text-black transition hover:brightness-105 cursor-pointer shadow-[0_0_20px_rgba(246,196,83,0.35)]"
          >
            <Download size={14} aria-hidden="true" /> <span>Export</span>
          </button>
        </div>
      </header>

      {editor.error ? (
        <div role="alert" className="border-b border-red-400/20 bg-red-400/10 px-4 py-2 text-center text-xs text-red-200 shrink-0">
          {editor.error} <Link href="/pricing" className="ml-1 font-bold underline">View plans</Link>
        </div>
      ) : null}

      {replaceNotification ? (
        <div role="status" className="border-b border-[#22c55e]/30 bg-[#22c55e]/15 px-4 py-2 text-center text-xs font-semibold text-[#22c55e] shrink-0 animate-in fade-in duration-150">
          ✓ {replaceNotification}
        </div>
      ) : null}

      {/* Main Studio Flex Workspace */}
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row overflow-hidden relative">
        {/* Column 1 (Left): Captions List */}
        <section
          style={{ width: `${layout.layout.captions}px` }}
          aria-label="Captions transcript"
          className="shrink-0 border-r border-white/8 bg-[#0c0d0d] flex-col h-full hidden lg:flex overflow-hidden"
        >
          <EditorCaptionList
            segments={editor.segments}
            activeSegmentId={activeSegmentId}
            currentVoiceSegId={currentVoiceSeg?.id}
            onSelectSegment={(id, start) => {
              editor.setSelectedSegmentId(id);
              seekTo(start);
            }}
            onUpdateText={(id, text) => {
              editor.updateSegment(id, text);
            }}
            onSplit={(id) => {
              editor.splitSegment(id);
            }}
            onMergeWithNext={(id) => {
              editor.mergeWithNext(id);
            }}
            onDelete={(id) => {
              editor.deleteSegment(id);
            }}
            onNudgeTiming={(offset) => {
              editor.nudgeTiming(offset);
            }}
            onOpenFindReplace={() => setShowFindReplaceModal(true)}
            className="h-full border-0 bg-transparent"
          />
        </section>

        {/* Left Drag Resize Handle */}
        <EditorResizeHandle
          panel="captions"
          orientation="vertical"
          active={layout.activePanel === "captions"}
          onPointerDown={layout.beginResize}
          onResizeBy={layout.resizeBy}
        />

        {/* Column 2 (Middle): Media Video Preview Box */}
        <section className="flex-1 min-w-0 flex flex-col items-center justify-center bg-black p-3 relative overflow-hidden h-full">
          <div className="mx-auto flex w-full max-w-5xl h-full flex-1 items-center justify-center min-h-0 my-auto p-2">
            <div
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={cn(
                "group relative flex w-auto max-w-full h-full max-h-full touch-none items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0b] shadow-2xl shadow-black transition-all mx-auto my-auto",
                aspectRatio === "9:16" && "aspect-[9/16]",
                aspectRatio === "1:1" && "aspect-square",
                aspectRatio === "16:9" && "aspect-[16/9] w-full",
              )}
            >
              {isAudio ? (
                <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center bg-gradient-to-b from-[#121315] to-[#080809]">
                  <span className="grid size-20 place-items-center rounded-3xl bg-[#f6c453]/10 text-[#f6c453] border border-[#f6c453]/20 shadow-xl">
                    <Volume2 size={36} />
                  </span>
                  <p className="mt-4 text-base font-bold text-cream">Audio Caption Preview</p>
                  <p className="mt-2 text-xs leading-5 text-[#747c80]">Play the track to test caption timing in sync.</p>
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
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition hover:bg-black/40 focus-visible:outline-none"
                  aria-label="Play video"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-[#f6c453] text-black shadow-[0_0_30px_rgba(246,196,83,0.5)] transition transform group-hover:scale-110">
                    <Play size={28} className="ml-1 fill-black" />
                  </div>
                </button>
              ) : null}

              {displaySeg ? (
                <div
                  style={
                    position === "custom"
                      ? { top: `${customYPercent}%`, transform: "translateY(-50%)" }
                      : undefined
                  }
                  className={cn(
                    "absolute inset-x-3 flex justify-center text-center transition-all duration-100 z-20 pointer-events-none",
                    position === "top" && "top-[12%]",
                    position === "center" && "top-1/2 -translate-y-1/2",
                    position === "bottom" && "bottom-[14%]",
                  )}
                >
                  {isEditingCanvasText ? (
                    <div className="w-full max-w-[95%] bg-black/95 p-3 rounded-2xl border border-[#f6c453] shadow-2xl backdrop-blur-md pointer-events-auto">
                      <textarea
                        autoFocus
                        value={displaySeg.text}
                        onChange={(e) => editor.updateSegment(displaySeg.id, e.target.value)}
                        onBlur={() => setIsEditingCanvasText(false)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            setIsEditingCanvasText(false);
                          }
                        }}
                        rows={2}
                        className="w-full resize-none bg-transparent text-center text-base font-bold text-white outline-none border-0 focus:border-0 focus:outline-none focus:ring-0 shadow-none"
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingCanvasText(false)}
                        className="mt-2 rounded-lg bg-[#f6c453] px-4 py-1 text-xs font-bold text-black cursor-pointer hover:brightness-105"
                      >
                        Done Editing
                      </button>
                    </div>
                  ) : (
                    <div
                      onPointerDown={handlePointerDown}
                      onDoubleClick={() => setIsEditingCanvasText(true)}
                      className={cn(
                        "group/cap relative max-w-[94%] touch-none cursor-grab transition-transform hover:scale-[1.02] active:cursor-grabbing pointer-events-auto",
                        isDraggingCaption && "scale-[1.03] ring-2 ring-[#f6c453]/60 rounded-xl",
                      )}
                      title="Drag up/down to position, double-click to edit text"
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
                        {(() => {
                          const wordsList =
                            displaySeg.words && displaySeg.words.length > 0
                              ? displaySeg.words
                              : ensureSegmentWords(displaySeg);

                          const activeWordIndex = wordsList.findIndex(
                            (w) => editor.currentTime >= w.start && editor.currentTime < w.end,
                          );

                          return wordsList.map((word, wIdx) => {
                            const isCurrentWord = wIdx === activeWordIndex;
                            const isPastWord = editor.currentTime >= word.end;

                            let wordStyle: React.CSSProperties | undefined = undefined;
                            if (isCurrentWord) {
                              if (selectedStyle?.id === "yellow") {
                                wordStyle = { color: activeHighlightHex };
                              } else if (selectedStyle?.id === "hormozi") {
                                wordStyle = { backgroundColor: activeHighlightHex || "#ffe600", color: "#000000" };
                              } else if (selectedStyle?.id === "viral_alex") {
                                wordStyle = { color: activeHighlightHex === "#f6c453" ? "#22c55e" : activeHighlightHex };
                              } else if (selectedStyle?.id === "neon") {
                                wordStyle = { color: activeHighlightHex === "#f6c453" ? "#ec4899" : activeHighlightHex };
                              }
                            }

                            return (
                              <span
                                key={word.id || wIdx}
                                style={wordStyle}
                                className={cn(
                                  "transition-all duration-75 inline-block",
                                  isCurrentWord && cn(
                                    "scale-110 font-black",
                                    selectedStyle?.activeWordClass,
                                  ),
                                  !isCurrentWord && isPastWord && "opacity-95",
                                  !isCurrentWord && !isPastWord && "opacity-80",
                                )}
                              >
                                {formatText(word.text)}
                              </span>
                            );
                          });
                        })()}
                      </div>

                      <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 opacity-0 group-hover/cap:opacity-100 sm:flex rounded-full bg-black/90 px-3 py-1 text-[10px] font-semibold text-[#f6c453] border border-[#f6c453]/40 shadow-xl pointer-events-none whitespace-nowrap">
                        <Move size={11} /> Drag to move · Double click to edit
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Right Drag Resize Handle */}
        <EditorResizeHandle
          panel="styles"
          orientation="vertical"
          active={layout.activePanel === "styles"}
          onPointerDown={layout.beginResize}
          onResizeBy={layout.resizeBy}
        />

        {/* Column 3 (Right): Styles & Customization Sidebar */}
        <aside
          style={{ width: `${layout.layout.styles}px` }}
          className="shrink-0 border-l border-white/8 bg-[#0c0d0d] p-4 overflow-y-auto font-sans custom-scrollbar flex flex-col h-full hidden lg:flex"
        >
          {/* Tabbed Navigation Header */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/50 p-1 mb-4">
            <button
              type="button"
              onClick={() => setActiveRightTab("styles")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer",
                activeRightTab === "styles"
                  ? "bg-[#f6c453] text-black shadow-md"
                  : "text-[#888] hover:text-white",
              )}
            >
              <Sparkles size={13} /> Styles
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab("customize")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer",
                activeRightTab === "customize"
                  ? "bg-[#f6c453] text-black shadow-md"
                  : "text-[#888] hover:text-white",
              )}
            >
              <Palette size={13} /> Text & Color
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab("canvas")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer",
                activeRightTab === "canvas"
                  ? "bg-[#f6c453] text-black shadow-md"
                  : "text-[#888] hover:text-white",
              )}
            >
              <Sliders size={13} /> Layout
            </button>
          </div>

          {/* TAB 1: STYLES */}
          {activeRightTab === "styles" ? (
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[.15em] text-[#788084]">Preset Look</h3>
                <p className="text-sm font-bold text-cream mt-0.5">10 Viral Caption Presets</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {captionStyles.map((style) => {
                  const isSelected = editor.styleId === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => editor.setStyleId(style.id)}
                      className={cn(
                        "group relative rounded-xl border p-3.5 text-left transition cursor-pointer overflow-hidden",
                        isSelected
                          ? "border-[#f6c453] bg-[#f6c453]/15 shadow-[0_0_20px_rgba(246,196,83,0.15)] ring-1 ring-[#f6c453]/50"
                          : "border-white/10 bg-[#121315] hover:border-white/25 hover:bg-[#18191c]",
                      )}
                      aria-pressed={isSelected}
                    >
                      <span className={cn("block rounded-xl bg-black/80 px-3.5 py-2.5 text-center text-sm font-bold shadow-inner", style.textClass)}>
                        YOUR <span className={style.activeWordClass}>STORY</span>
                      </span>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#b4baba] group-hover:text-white transition">
                          {style.name}
                        </span>
                        {isSelected ? (
                          <span className="rounded-full bg-[#f6c453] px-2 py-0.5 text-[9px] font-black text-black">
                            ACTIVE
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* TAB 2: TEXT & COLOR */}
          {activeRightTab === "customize" ? (
            <div className="space-y-5 flex-1">
              {/* Highlight Color */}
              <div className="rounded-2xl border border-white/10 bg-[#111214] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#81898e]">Highlight Color</span>
                  <span className="text-xs font-mono font-bold text-[#f6c453]">{activeHighlightHex}</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveHighlightHex(c.hex)}
                      aria-label={"Use " + c.name + " highlight"}
                      aria-pressed={activeHighlightHex === c.hex}
                      style={{ backgroundColor: c.hex }}
                      className={cn(
                        "size-9 rounded-full border border-white/20 transition hover:scale-110 cursor-pointer shadow-md",
                        activeHighlightHex === c.hex && "ring-2 ring-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.5)]",
                      )}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Text Case */}
              <div className="rounded-2xl border border-white/10 bg-[#111214] p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#81898e]">Text Case</span>
                <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1 text-center">
                  <button
                    type="button"
                    onClick={() => setTextTransform("uppercase")}
                    aria-pressed={textTransform === "uppercase"}
                    className={cn(
                      "min-h-9 rounded-lg px-1 py-1 text-[10px] font-bold transition cursor-pointer",
                      textTransform === "uppercase" ? "bg-[#f6c453] text-black shadow-md" : "text-[#888] hover:text-white",
                    )}
                  >
                    UPPERCASE
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextTransform("none")}
                    aria-pressed={textTransform === "none"}
                    className={cn(
                      "min-h-9 rounded-lg px-1 py-1 text-[10px] font-bold transition cursor-pointer",
                      textTransform === "none" ? "bg-[#f6c453] text-black shadow-md" : "text-[#888] hover:text-white",
                    )}
                  >
                    Original
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextTransform("lowercase")}
                    aria-pressed={textTransform === "lowercase"}
                    className={cn(
                      "min-h-9 rounded-lg px-1 py-1 text-[10px] font-bold transition cursor-pointer",
                      textTransform === "lowercase" ? "bg-[#f6c453] text-black shadow-md" : "text-[#888] hover:text-white",
                    )}
                  >
                    lowercase
                  </button>
                </div>
              </div>

              {/* Font Size & Alignment */}
              <div className="rounded-2xl border border-white/10 bg-[#111214] p-4 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#81898e]">Font Size</span>
                  <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1">
                    {(["sm", "md", "lg", "xl"] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setFontSize(sz)}
                        className={cn(
                          "min-h-9 rounded-lg px-2 py-1 text-xs font-bold uppercase transition cursor-pointer",
                          fontSize === sz ? "bg-[#f6c453] text-black shadow-md" : "text-[#888] hover:text-white",
                        )}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#81898e]">Text Alignment</span>
                  <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1">
                    <button
                      type="button"
                      onClick={() => setTextAlign("left")}
                      className={cn(
                        "flex min-h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                        textAlign === "left" ? "bg-[#f6c453] text-black shadow-md" : "text-[#888] hover:text-white",
                      )}
                    >
                      <AlignLeft size={14} /> Left
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextAlign("center")}
                      className={cn(
                        "flex min-h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                        textAlign === "center" ? "bg-[#f6c453] text-black shadow-md" : "text-[#888] hover:text-white",
                      )}
                    >
                      <AlignCenter size={14} /> Center
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextAlign("right")}
                      className={cn(
                        "flex min-h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition cursor-pointer",
                        textAlign === "right" ? "bg-[#f6c453] text-black shadow-md" : "text-[#888] hover:text-white",
                      )}
                    >
                      <AlignRight size={14} /> Right
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* TAB 3: CANVAS & EXPORT */}
          {activeRightTab === "canvas" ? (
            <div className="space-y-5 flex-1">
              {/* Aspect Ratio */}
              <div className="rounded-2xl border border-white/10 bg-[#111214] p-4 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#81898e]">Aspect Ratio</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["9:16", "1:1", "16:9"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border p-3 transition cursor-pointer",
                        aspectRatio === ratio
                          ? "border-[#f6c453] bg-[#f6c453]/15 text-white font-bold"
                          : "border-white/10 bg-black/40 text-[#888] hover:border-white/20 hover:text-white",
                      )}
                    >
                      <Layout size={18} className={aspectRatio === ratio ? "text-[#f6c453]" : "text-[#666]"} />
                      <span className="mt-1 text-xs font-bold">{ratio}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vertical Position */}
              <div className="rounded-2xl border border-white/10 bg-[#111214] p-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#81898e]">Vertical Position</span>
                <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-white/10 bg-black/60 p-1 text-center">
                  {(["top", "center", "bottom"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setPosition(pos)}
                      className={cn(
                        "min-h-9 rounded-lg px-1 py-1 text-xs font-bold capitalize transition cursor-pointer",
                        position === pos ? "bg-[#f6c453] text-black shadow-md" : "text-[#888] hover:text-white",
                      )}
                    >
                      {pos}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#788084] mb-1.5">
                    <span>Custom Y Height</span>
                    <span className="font-mono text-[#f6c453] font-bold">{customYPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={90}
                    value={customYPercent}
                    onChange={(e) => {
                      setCustomYPercent(Number(e.target.value));
                      setPosition("custom");
                    }}
                    className="w-full accent-[#f6c453] cursor-pointer"
                  />
                </div>
              </div>

              {/* Open Export Dialog */}
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-[#f6c453] text-xs font-bold text-black hover:brightness-105 transition cursor-pointer shadow-[0_0_20px_rgba(246,196,83,0.3)]"
              >
                <Download size={15} /> Export Options (.MP4, .SRT, .VTT)
              </button>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Export Studio Modal */}
      <EditorExportModal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
        }}
        onExportVideo={() => {
          void handleExportVideo();
        }}
        onExportSubtitles={(format) => {
          handleDownloadCaptions(format);
        }}
        isRenderingVideo={isRenderingVideo}
        renderProgress={renderProgress}
        exportError={exportError}
        remainingExports={plan.remainingExports}
      />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <EditorShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Batch Find & Replace Modal */}
      <EditorFindReplaceModal
        isOpen={showFindReplaceModal}
        onClose={() => setShowFindReplaceModal(false)}
        segments={editor.segments}
        onBatchReplace={handleBatchReplaceCaptions}
      />

      {/* Mobile Drawer Modal for Captions & Styles */}
      <EditorMobileDrawer
        drawer={mobileDrawer}
        onClose={() => setMobileDrawer(null)}
        segments={editor.segments}
        activeSegmentId={activeSegmentId}
        currentTime={editor.currentTime}
        onSelectSegment={(id, start) => {
          editor.setSelectedSegmentId(id);
          seekTo(start);
          setMobileDrawer(null);
        }}
        onUpdateText={(id, text) => {
          editor.updateSegment(id, text);
        }}
        onSplitSegment={(id) => {
          editor.splitSegment(id);
        }}
        onDeleteSegment={(id) => {
          editor.deleteSegment(id);
        }}
        styleId={editor.styleId}
        onSelectStyle={(id) => {
          editor.setStyleId(id as Parameters<typeof editor.setStyleId>[0]);
          setMobileDrawer(null);
        }}
        highlightColor={activeHighlightHex}
        onSelectHighlightColor={(color) => {
          setActiveHighlightHex(color);
        }}
        onOpenExport={() => {
          setMobileDrawer(null);
          setShowExportModal(true);
        }}
      />

      {/* Bottom Drag Resize Handle */}
      <EditorResizeHandle
        panel="timeline"
        orientation="horizontal"
        active={layout.activePanel === "timeline"}
        onPointerDown={layout.beginResize}
        onResizeBy={layout.resizeBy}
      />

      {/* Bottom Timeline Dock */}
      <div style={{ height: `${layout.layout.timeline}px` }} className="shrink-0 min-h-0 overflow-hidden">
        <CaptionTimeline
          editor={editor}
          onSeek={seekTo}
          isPlaying={isPlaying}
          onTogglePlayback={togglePlayback}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          textAlign={textAlign}
          setTextAlign={setTextAlign}
          position={position}
          setPosition={setPosition}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      </div>
    </main>
  );
}
