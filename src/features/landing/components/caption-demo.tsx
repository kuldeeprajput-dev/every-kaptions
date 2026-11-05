"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, Layers, Music, Pause, Play, Redo2, Scissors, Search, Undo2, Video } from "lucide-react";
import { CaptionDemoStyles } from "./caption-demo-styles";
import { DEMO_SEGMENTS, STYLE_OPTIONS, TOTAL_DURATION, type DemoStyleId } from "../data/caption-demo-data";

export function CaptionDemo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(1.4);
  const [styleId, setStyleId] = useState<DemoStyleId>("yellow");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + 0.1 >= TOTAL_DURATION ? 0 : Number((prev + 0.1).toFixed(1))));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeSegment = useMemo(
    () => DEMO_SEGMENTS.find((s) => currentTime >= s.start && currentTime < s.end) ?? DEMO_SEGMENTS[0],
    [currentTime],
  );

  const activeWordIndex = useMemo(() => {
    const elapsed = currentTime - activeSegment.start;
    const duration = activeSegment.end - activeSegment.start;
    const progress = Math.min(1, Math.max(0, elapsed / duration));
    return Math.min(activeSegment.words.length - 1, Math.max(0, Math.floor(progress * activeSegment.words.length)));
  }, [activeSegment, currentTime]);

  const currentStyle = useMemo(
    () => STYLE_OPTIONS.find((s) => s.id === styleId) ?? STYLE_OPTIONS[0],
    [styleId],
  );

  const playheadPercent = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div
      className="w-full max-w-[1180px] mx-auto rounded-2xl bg-white border border-[#e4e4e7] shadow-[0_16px_50px_-10px_rgba(24,24,27,0.08),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col text-[#18181b]"
      aria-label="EveryKaptions Studio Editor Showcase"
    >
      {/* Header Bar */}
      <header className="flex items-center justify-between p-[10px_18px] bg-[#fafafc] border-b border-[#f0f0f4] gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
          <div className="w-px h-4 bg-[#e4e4e7]" />
          <div className="flex items-center gap-2">
            <span className="bg-[#c63838] text-white font-black text-[10px] px-1.5 py-0.5 rounded tracking-tighter shadow-xs">
              ek
            </span>
            <span className="text-[11px] font-semibold text-[#18181b]">
              podcast_reel_final.mp4
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#15803d] bg-[#f0fdf4] border border-[#dcfce7] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] shadow-[0_0_0_2px_#bbf7d0]" />
              Saved locally
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center">
          <div className="flex items-center bg-[#f4f4f6] border border-[#e4e4e7] rounded-lg p-0.5 gap-0.5" role="group" aria-label="Undo Redo">
            <button type="button" className="text-[#71717a] hover:text-[#18181b] hover:bg-[#e4e4e7] p-1 rounded transition-colors" title="Undo (Ctrl+Z)" aria-label="Undo">
              <Undo2 size={13} />
            </button>
            <span className="w-px h-3 bg-[#e4e4e7]" />
            <button type="button" className="text-[#71717a] hover:text-[#18181b] hover:bg-[#e4e4e7] p-1 rounded transition-colors" title="Redo (Ctrl+Y)" aria-label="Redo">
              <Redo2 size={13} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-[#f4f4f6] border border-[#e4e4e7] p-0.5 rounded-lg gap-0.5" role="group" aria-label="Aspect Ratio">
            <button
              type="button"
              className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer ${
                aspectRatio === "16:9" ? "bg-white text-[#18181b] shadow-xs" : "text-[#71717a]"
              }`}
              onClick={() => setAspectRatio("16:9")}
            >
              16:9
            </button>
            <button
              type="button"
              className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-all cursor-pointer ${
                aspectRatio === "9:16" ? "bg-white text-[#18181b] shadow-xs" : "text-[#71717a]"
              }`}
              onClick={() => setAspectRatio("9:16")}
            >
              9:16
            </button>
          </div>
          <Link
            href="/studio"
            className="flex items-center gap-1.5 bg-[#c63838] hover:bg-[#b52f2f] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Download size={13} />
            <span>Export Video</span>
          </Link>
        </div>
      </header>

      {/* Main 3-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_220px] lg:min-h-[380px] bg-[#f4f4f7]">
        {/* Left Panel: Captions List */}
        <aside className="hidden lg:flex flex-col bg-white border-r border-[#f0f0f4] p-[14px_12px] gap-2.5 overflow-hidden" aria-label="Captions transcript list">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers size={13} className="text-[#c63838]" />
              <strong className="text-[11px] font-bold tracking-wider text-[#18181b]">CAPTIONS</strong>
              <small className="text-[9px] text-[#71717a]">Review & sync</small>
            </div>
            <span className="text-[9px] font-bold text-[#c63838] bg-[#fff1f2] border border-[#ffe4e6] px-2 py-0.5 rounded-full">
              3 lines
            </span>
          </div>

          <div className="relative flex items-center">
            <Search size={11} className="absolute left-2 text-[#9ca3af] pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              readOnly
              value="Search caption lines..."
              className="w-full bg-[#f8f8fa] border border-[#e8e8ee] rounded-md py-1 pl-6 pr-2 text-[10px] text-[#18181b] outline-none"
              aria-label="Search captions"
            />
          </div>

          <div className="flex items-center justify-between bg-[#f8f8fa] border border-[#e8e8ee] p-1 px-1.5 rounded-md">
            <span className="text-[9px] font-semibold text-[#71717a]">Voice Sync</span>
            <div className="flex gap-1">
              <span className="text-[8px] font-bold bg-white border border-[#e2e2e8] text-[#3f3f46] px-1 py-0.5 rounded shadow-2xs hover:border-[#c63838] hover:text-[#c63838] cursor-pointer">-0.2s</span>
              <span className="text-[8px] font-bold bg-white border border-[#e2e2e8] text-[#3f3f46] px-1 py-0.5 rounded shadow-2xs hover:border-[#c63838] hover:text-[#c63838] cursor-pointer">-0.1s</span>
              <span className="text-[8px] font-bold bg-white border border-[#e2e2e8] text-[#3f3f46] px-1 py-0.5 rounded shadow-2xs hover:border-[#c63838] hover:text-[#c63838] cursor-pointer">+0.1s</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 overflow-y-auto">
            {DEMO_SEGMENTS.map((seg) => {
              const isCurrent = activeSegment.id === seg.id;
              return (
                <div
                  key={seg.id}
                  onClick={() => setCurrentTime(seg.start)}
                  className={`bg-white border rounded-lg p-2 cursor-pointer transition-all ${
                    isCurrent
                      ? "border-[#c63838] bg-[#fff8f8] shadow-[0_2px_8px_rgba(198,56,56,0.08)]"
                      : "border-[#e4e4e7] hover:border-[#d4d4d8]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[8px]">
                    <span className="flex items-center gap-1 text-[#c63838] font-bold font-mono">
                      <Play size={8} fill="currentColor" /> {seg.time}
                    </span>
                    <span className="text-[#9ca3af]">#{seg.id}</span>
                    <span className="text-[#9ca3af]">Split · Merge</span>
                  </div>
                  <p className="text-[10px] text-[#27272a] font-medium leading-[1.35] m-0">
                    {seg.fullText}
                  </p>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center Stage: Video Canvas */}
        <section className="flex items-center justify-center p-4 relative bg-[radial-gradient(circle_at_center,#ffffff_0%,#f0f0f4_100%)] overflow-hidden lg:h-[400px]" aria-label="Video preview viewport">
          <div className={`relative overflow-hidden rounded-xl bg-black border border-[#e2e2e8] shadow-[0_14px_40px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all ${
            aspectRatio === "16:9"
              ? "w-full max-w-[520px] aspect-video lg:h-full lg:w-full lg:max-w-none"
              : "h-[340px] aspect-[9/16] lg:h-full"
          }`}>
            <Image
              src="/landing/creator-podcast.webp"
              alt="Male creator recording a podcast video with captions"
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover object-[50%_38%]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/70 pointer-events-none" />

            <div className="absolute top-2 left-2 bg-white/92 backdrop-blur-md text-[#27272a] text-[9px] font-semibold font-mono px-2 py-0.5 rounded border border-black/8 shadow-xs z-10">
              00:0{Math.floor(currentTime)}s / 00:09s
            </div>

            <div className="absolute bottom-[16%] inset-x-[6%] flex justify-center z-10 pointer-events-none">
              <div className={`max-w-[92%] px-3 py-1.5 rounded-lg text-sm sm:text-base font-extrabold text-center leading-[1.35] ${currentStyle.previewClass}`}>
                {activeSegment.words.map((word, idx) => (
                  <span
                    key={idx}
                    className={`transition-all duration-150 ${
                      idx === activeWordIndex ? currentStyle.activeClass : "opacity-85"
                    }`}
                  >
                    {word}{" "}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute size-12 max-sm:size-9 max-sm:top-2 max-sm:right-2 rounded-full bg-[#c63838] hover:bg-[#b52f2f] border-2 border-white cursor-pointer flex items-center justify-center shadow-[0_4px_18px_rgba(198,56,56,0.45)] hover:scale-105 transition-all z-20"
              aria-label={isPlaying ? "Pause preview" : "Play preview"}
            >
              {isPlaying ? <Pause size={18} fill="white" className="text-white" /> : <Play size={18} className="ml-1 fill-white text-white" />}
            </button>
          </div>
        </section>

        {/* Right Panel: Style Selector */}
        <CaptionDemoStyles
          styleId={styleId}
          onSelectStyle={(id) => setStyleId(id)}
        />
      </div>

      {/* Bottom Timeline */}
      <footer className="bg-white border-t border-[#f0f0f4] flex flex-col">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-[#f0f0f4] bg-[#fafafc] text-[10px]">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="size-[22px] rounded-sm bg-[#c63838] text-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[#b52f2f] transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={11} fill="white" /> : <Play size={11} className="ml-0.5 fill-white" />}
            </button>
            <div className="font-mono text-[10px] flex gap-1">
              <strong className="text-[#18181b] font-bold">
                00:0{Math.floor(currentTime)}.{(currentTime % 1).toFixed(1).slice(2)}
              </strong>
              <span className="text-[#71717a]">/ 00:09.0</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] font-semibold text-[#71717a] cursor-pointer">
              <Scissors size={11} /> Split
            </span>
            <span className="text-[9px] font-semibold text-[#71717a] cursor-pointer">Merge next</span>
            <span className="bg-[#f4f4f6] border border-[#e4e4e7] px-1.5 py-0.5 rounded text-[8px] font-bold text-[#3f3f46]">
              -0.1s SYNC +0.1s
            </span>
          </div>
        </div>

        <div className="relative flex flex-col p-[8px_14px_12px] gap-1.5 bg-[#fbfbfc]">
          <div className="flex items-center h-7 gap-2">
            <div className="w-[72px] shrink-0 flex items-center gap-1 text-[9px] font-semibold text-[#71717a]">
              <Video size={11} />
              <span>Video</span>
            </div>
            <div className="flex-1 h-full relative bg-[#f4f4f8] rounded border border-[#e5e5eb] overflow-hidden flex items-center px-2">
              <span className="text-[9px] font-medium text-[#71717a]">podcast_reel_final.mp4</span>
              <small className="ml-auto text-[8px] text-[#a1a1aa]">9.0s</small>
            </div>
          </div>

          <div className="flex items-center h-7 gap-2">
            <div className="w-[72px] shrink-0 flex items-center gap-1 text-[9px] font-semibold text-[#71717a]">
              <Layers size={11} />
              <span>Captions</span>
            </div>
            <div className="flex-1 h-full relative bg-[#f8f8fb] rounded border border-[#e5e5eb] overflow-hidden">
              {DEMO_SEGMENTS.map((seg) => (
                <div
                  key={seg.id}
                  onClick={() => setCurrentTime(seg.start)}
                  style={{
                    left: `${(seg.start / TOTAL_DURATION) * 100}%`,
                    width: `${((seg.end - seg.start) / TOTAL_DURATION) * 100 - 0.8}%`,
                  }}
                  className={`absolute top-0.5 bottom-0.5 rounded border flex items-center px-1.5 gap-1 text-[8px] cursor-pointer overflow-hidden whitespace-nowrap shadow-2xs transition-all ${
                    activeSegment.id === seg.id
                      ? "bg-[#fff1f2] border-[#c63838] text-[#c63838] font-bold"
                      : "bg-white border-[#d8d8e0] text-[#27272a]"
                  }`}
                >
                  <span className="font-mono text-[7px] text-[#71717a]">
                    {(seg.end - seg.start).toFixed(1)}s
                  </span>
                  <span className="truncate">{seg.fullText}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center h-7 gap-2">
            <div className="w-[72px] shrink-0 flex items-center gap-1 text-[9px] font-semibold text-[#71717a]">
              <Music size={11} />
              <span>Voice</span>
            </div>
            <div className="flex-1 h-full relative bg-white rounded border border-[#e5e5eb] overflow-hidden flex items-center px-1.5">
              <div className="flex items-center justify-between w-full h-[18px] gap-px" aria-hidden="true">
                {Array.from({ length: 40 }, (_, i) => {
                  const h = 4 + ((i * 13) % 12);
                  const isPast = (i / 40) * 100 <= playheadPercent;
                  return (
                    <span
                      key={i}
                      className={`flex-1 rounded-xs transition-colors ${isPast ? "bg-[#c63838]" : "bg-[#d4d4d8]"}`}
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Needle / Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#c63838] pointer-events-none z-20 shadow-[0_0_6px_rgba(198,56,56,0.4)]"
            style={{ left: `calc(72px + 8px + (100% - 72px - 8px - 28px) * ${playheadPercent / 100})` }}
          >
            <div className="w-2.5 h-2.5 bg-[#c63838] absolute top-0 -left-1 [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
