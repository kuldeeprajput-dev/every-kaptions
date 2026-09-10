"use client";

import { ArrowLeft, Download, FileText, ImageIcon, Pause, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Brand } from "@/shared/components/brand";
import { cn } from "@/shared/lib/cn";
import { captionStyles } from "../data/editor-config";
import { formatClockTime } from "../lib/captions";
import type { useCaptionEditor } from "../hooks/use-caption-editor";

type Props = {
  editor: ReturnType<typeof useCaptionEditor>;
};

export function MediaEditor({ editor }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const selectedStyle = useMemo(
    () => captionStyles.find((style) => style.id === editor.styleId) ?? captionStyles[0],
    [editor.styleId],
  );
  const isAudio = editor.file?.type.startsWith("audio/");

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play();
    else video.pause();
  };

  const seekTo = (seconds: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = seconds;
    editor.setCurrentTime(seconds);
  };

  return (
    <main className="min-h-screen bg-[#070808] text-[#d8d8d6]">
      <header className="sticky top-0 z-40 flex min-h-16 flex-wrap items-center gap-2 border-b border-white/8 bg-[#090a0a]/95 px-3 py-2 backdrop-blur sm:px-5 lg:h-[66px] lg:flex-nowrap lg:px-8 lg:py-0">
        <Brand large />
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={editor.reset}
            className="flex min-h-10 items-center gap-2 rounded-full border border-white/12 px-3 text-xs font-semibold text-cream sm:px-4"
          >
            <ArrowLeft size={15} /> <span className="hidden sm:inline">My reels</span>
          </button>
          <Link href="/pricing" className="hidden min-h-10 items-center rounded-full border border-white/12 px-4 text-xs font-semibold text-cream sm:flex">
            Upgrade
          </Link>
          <button
            type="button"
            onClick={() => editor.downloadCaptions("srt")}
            className="flex min-h-10 items-center gap-2 rounded-full bg-cream px-4 text-xs font-bold text-black"
          >
            <Download size={15} /> Export .SRT
          </button>
        </div>
        <div className="order-3 flex w-full items-center gap-2 border-t border-white/8 pt-2 lg:order-none lg:ml-2 lg:w-auto lg:min-w-0 lg:border-0 lg:pt-0">
          <span className="truncate text-xs text-[#81888b]">{editor.file?.name}</span>
          <span className="shrink-0 rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">Saved locally</span>
        </div>
      </header>

      <div className="grid lg:h-[calc(100vh-66px)] lg:grid-cols-[minmax(250px,320px)_minmax(360px,1fr)_280px]">
        <section className="order-2 border-white/8 bg-[#111210] lg:order-1 lg:overflow-y-auto lg:border-r">
          <div className="sticky top-0 z-10 border-b border-white/8 bg-[#111210] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#727c80]">Captions</p>
                <h1 className="mt-1 text-sm font-semibold text-cream">Review every line</h1>
              </div>
              <span className="rounded-full border border-amber/25 bg-amber/8 px-2.5 py-1 text-[10px] font-bold text-amber">{editor.segments.length} lines</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#727a7e]">Tap a line to jump to it. Edit the text directly before exporting.</p>
          </div>
          <div className="space-y-2 p-3 sm:p-4">
            {editor.segments.map((segment, index) => {
              const active = editor.activeSegment?.id === segment.id || editor.selectedSegmentId === segment.id;
              return (
                <article
                  key={segment.id}
                  className={cn("rounded-xl border p-3 transition", active ? "border-amber/50 bg-amber/7" : "border-white/8 bg-black/15")}
                >
                  <button
                    type="button"
                    onClick={() => {
                      editor.setSelectedSegmentId(segment.id);
                      seekTo(segment.start);
                    }}
                    className="flex w-full items-center justify-between gap-3 text-left"
                    aria-label={`Jump to caption ${index + 1}`}
                  >
                    <span className="text-[11px] font-bold text-amber">{formatClockTime(segment.start)}</span>
                    <span className="text-[10px] text-[#626b70]">Line {index + 1}</span>
                  </button>
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

        <section className="order-1 flex min-h-[430px] flex-col bg-black p-3 sm:p-5 lg:order-2 lg:min-h-0 lg:p-7">
          <div className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center">
            <div className="relative flex aspect-[9/16] max-h-[66vh] w-auto max-w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#121313] shadow-2xl shadow-black lg:max-h-[calc(100vh-190px)]">
              {isAudio ? (
                <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
                  <span className="grid size-16 place-items-center rounded-2xl bg-amber/10 text-amber"><FileText size={28} /></span>
                  <p className="mt-4 text-sm font-semibold text-cream">Audio caption preview</p>
                  <p className="mt-2 text-xs leading-5 text-[#747c80]">Play the audio to review each caption in time.</p>
                </div>
              ) : null}
              <video
                ref={videoRef}
                src={editor.mediaUrl}
                playsInline
                className={cn("h-full w-full object-contain", isAudio && "absolute opacity-0")}
                onLoadedMetadata={(event) => editor.setDuration(event.currentTarget.duration)}
                onTimeUpdate={(event) => editor.setCurrentTime(event.currentTarget.currentTime)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              {editor.activeSegment ? (
                <div className="pointer-events-none absolute inset-x-4 bottom-[16%] flex justify-center text-center">
                  <p className={cn("max-w-[92%] px-2 py-1 text-lg leading-tight sm:text-xl", selectedStyle?.previewClass, selectedStyle?.textClass)}>
                    {editor.activeSegment.text}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mx-auto mt-4 flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-[#111212] p-3">
            <button type="button" onClick={togglePlayback} className="grid size-10 shrink-0 place-items-center rounded-full bg-cream text-black" aria-label={isPlaying ? "Pause preview" : "Play preview"}>
              {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
            </button>
            <input
              type="range"
              min={0}
              max={Math.max(editor.duration, 0.1)}
              step={0.01}
              value={Math.min(editor.currentTime, editor.duration || 0)}
              onChange={(event) => seekTo(Number(event.target.value))}
              aria-label="Video position"
              className="min-w-0 flex-1 accent-[#ffc83d]"
            />
            <span className="shrink-0 text-[11px] text-[#8a9295]">{formatClockTime(editor.currentTime)} / {formatClockTime(editor.duration)}</span>
          </div>
        </section>

        <aside className="order-3 border-t border-white/8 bg-[#111210] p-4 lg:overflow-y-auto lg:border-l lg:border-t-0">
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#727c80]">Caption style</p>
          <h2 className="mt-1 text-sm font-semibold text-cream">Choose a readable look</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {captionStyles.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => editor.setStyleId(style.id)}
                className={cn("rounded-xl border p-3 text-left transition", editor.styleId === style.id ? "border-amber bg-amber/6" : "border-white/8 bg-black/15 hover:border-white/20")}
                aria-pressed={editor.styleId === style.id}
              >
                <span className={cn("block rounded-lg bg-black px-3 py-2 text-center text-sm", style.textClass)}>
                  Your <span className={style.activeWordClass}>story</span>
                </span>
                <span className="mt-2 block text-xs font-semibold text-[#a8adaf]">{style.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-amber/20 bg-amber/5 p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-amber"><Sparkles size={15} /> Beginner tip</p>
            <p className="mt-2 text-xs leading-5 text-[#8a9295]">Keep captions short and high-contrast. Two lines or fewer are easiest to read on a phone.</p>
          </div>
          <div className="mt-3 rounded-xl border border-dashed border-white/12 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-[#a8adaf]"><ImageIcon size={15} /> AI thumbnails</p>
              <span className="rounded-full bg-white/6 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#858d90]">Coming soon</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#687175]">Create a vertical cover from your video after this feature launches.</p>
          </div>
          <button type="button" onClick={() => editor.downloadCaptions("vtt")} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/12 text-xs font-semibold text-cream">
            <Download size={15} /> Download .VTT
          </button>
        </aside>
      </div>
    </main>
  );
}
