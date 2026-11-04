"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Captions, Check, Palette, SlidersHorizontal } from "lucide-react";

type DemoStyle = "Clean" | "Bold" | "Highlight";
const demoStyles: DemoStyle[] = ["Clean", "Bold", "Highlight"];
const words = ["Your", "words.", "Your", "way."];
const previewFrameClasses = "relative z-10 mx-auto flex h-[460px] w-full min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#e2e2e8] bg-white shadow-[0_12px_35px_rgba(24,24,27,0.09)] sm:h-[292px]";
const contentClasses = "grid min-h-0 flex-1 grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1";
const inspectorClasses = "flex min-h-0 min-w-0 flex-col overflow-y-auto border-b border-[#ededf1] bg-white p-3.5 sm:border-b-0 sm:border-r";

function PreviewHeader({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-[#ededf1] bg-[#fcfcfd] px-3.5">
      <span className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-[#27272a]">
        <span className="text-[#c63838]" aria-hidden="true">{icon}</span>{title}
      </span>
      <span className="shrink-0 text-[9px] font-medium tabular-nums text-[#8b8b95]">{detail}</span>
    </div>
  );
}

function CreatorStage({ image, alt, children }: { image: string; alt: string; children: ReactNode }) {
  return (
    <div className="relative min-h-0 overflow-hidden bg-[#eeeae5]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-[4/5] h-full max-w-full overflow-hidden rounded-xl">
          <Image
            src={`/media/landing/${image}.webp`}
            alt={alt}
            fill
            unoptimized
            className="object-cover object-center"
          />
        </div>
      </div>
      <div className="absolute inset-x-2 bottom-3 flex justify-center">
        <div className="max-w-full rounded-lg bg-[#18181b]/90 px-3 py-2 text-center text-[11px] font-semibold leading-[1.5] text-white shadow-sm" aria-live="polite" aria-atomic="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export function TranscriptPreview() {
  const [lines, setLines] = useState(["Your words. Your way.", "Make your next story count."]);
  const [active, setActive] = useState(0);
  return (
    <div className={previewFrameClasses} aria-label="Editable caption preview">
      <PreviewHeader icon={<Captions size={15} />} title="Caption Editor" detail="Live preview" />
      <div className={contentClasses}>
        <div className={inspectorClasses}>
          <div className="mb-3 flex items-center justify-between gap-2 text-[10px]">
            <span className="font-semibold text-[#52525b]">Transcript</span><span className="text-[#a1a1aa]">Click a line to edit</span>
          </div>
          <div className="flex flex-col gap-2">
            {lines.map((line, index) => (
              <label key={index} className={`flex cursor-text flex-col gap-1.5 rounded-lg border px-3 py-2.5 transition-colors ${active === index ? "border-[#c63838]/45 bg-[#fdf4f3]" : "border-[#ededf1] bg-[#fafafa] hover:border-[#d4d4d8]"}`}>
                <span className="flex justify-between gap-2"><time className="font-mono text-[9px] text-[#8b8b95]">00:0{index * 4}</time>{active === index && <Check size={11} className="text-[#c63838]" aria-hidden="true" />}</span>
                <input value={line} aria-label={`Preview caption line ${index + 1}`} onFocus={() => setActive(index)} onChange={event => setLines(previous => previous.map((value, i) => i === index ? event.target.value : value))} className="w-full border-0 bg-transparent p-0 text-[11px] font-medium text-[#27272a] outline-none" />
              </label>
            ))}
          </div>
          <span className="mt-auto pt-2 text-[9px] text-[#a1a1aa]">Your edits appear in the preview.</span>
        </div>
        <CreatorStage image="caption-editing-v2" alt="Creator shown in full without a dark overlay">{lines[active] || "Your next story."}</CreatorStage>
      </div>
    </div>
  );
}

export function TimingPreview() {
  const [time, setTime] = useState(2.5);
  const active = Math.min(3, Math.floor(time / 2));
  return (
    <div className={previewFrameClasses} aria-label="Word timing editor">
      <PreviewHeader icon={<SlidersHorizontal size={15} />} title="Word Timing & Sync" detail={`${time.toFixed(1)}s / 8.0s`} />
      <div className={contentClasses}>
        <div className={inspectorClasses}>
          <span className="mb-3 text-[10px] font-semibold text-[#52525b]">Follow every word</span>
          <div className="mb-3 flex h-10 shrink-0 items-center gap-0.5 rounded-lg bg-[#f7f7f9] px-2" aria-hidden="true">
            {Array.from({ length: 28 }, (_, i) => <span key={i} className="min-w-0 flex-1 rounded-[2px]" style={{ height: `${8 + ((i * 17) % 24)}px`, background: (i / 28) * 8 <= time ? "#c63838" : "#dedee5" }} />)}
          </div>
          <label className="mb-3 flex flex-col gap-2">
            <span className="flex justify-between text-[9px] text-[#8b8b95]"><span>Adjust timing</span><span className="font-mono text-[#c63838]">{time.toFixed(1)}s</span></span>
            <input type="range" min={0} max={7.9} step={0.1} value={time} aria-label="Preview caption timing" onChange={event => setTime(Number(event.target.value))} className="m-0 w-full cursor-pointer accent-[#c63838]" />
          </label>
          <div className="mt-auto grid grid-cols-2 gap-1.5">
            {words.map((word, index) => <button key={index} type="button" onClick={() => setTime(index * 2)} aria-pressed={active === index} className={`flex min-h-8 items-center justify-between gap-1 rounded-md border px-2 text-left transition-colors ${active === index ? "border-[#c63838]/45 bg-[#fdf4f3] text-[#c63838]" : "border-[#ededf1] bg-[#fafafa] text-[#52525b] hover:border-[#d4d4d8]"}`}><time className="font-mono text-[8px] opacity-70">00:0{index * 2}</time><span className="text-[10px] font-semibold">{word}</span></button>)}
          </div>
        </div>
        <CreatorStage image="caption-timing-v2" alt="Podcaster with headphones and microphone, clearly visible">
          <span className="flex flex-wrap justify-center gap-1">{words.map((word, index) => <button key={index} type="button" onClick={() => setTime(index * 2)} aria-label={`Select word ${word} at ${index * 2} seconds`} aria-pressed={active === index} className={`rounded px-0.5 transition-colors ${index === active ? "bg-[#c63838] text-white" : "text-white hover:bg-white/15"}`}>{word}</button>)}</span>
        </CreatorStage>
      </div>
    </div>
  );
}

export function CaptionStyleFeature() {
  const [style, setStyle] = useState<DemoStyle>("Bold");
  return (
    <div className={previewFrameClasses} aria-label="Caption style preview">
      <PreviewHeader icon={<Palette size={15} />} title="Caption Styles" detail="Make it yours" />
      <div className={contentClasses}>
        <div className={inspectorClasses}>
          <span className="mb-3 text-[10px] font-semibold text-[#52525b]">Choose your look</span>
          <div className="flex flex-col gap-2" role="group" aria-label="Try a caption style">
            {demoStyles.map(name => <button key={name} type="button" onClick={() => setStyle(name)} aria-pressed={style === name} className={`flex min-h-11 items-center gap-3 rounded-lg border px-3 text-left transition-colors ${style === name ? "border-[#c63838]/45 bg-[#fdf4f3] text-[#c63838]" : "border-[#ededf1] bg-[#fafafa] text-[#52525b] hover:border-[#d4d4d8]"}`}><span className={`w-7 text-[19px] leading-none text-[#27272a] ${name === "Bold" ? "font-black" : name === "Highlight" ? "rounded bg-[#f2d7d4] px-0.5 font-bold" : "font-normal"}`}>Aa</span><span className="flex-1 text-[11px] font-medium">{name}</span>{style === name && <Check size={12} aria-hidden="true" />}</button>)}
          </div>
        </div>
        <CreatorStage image="preset-red-v2" alt="Male creator with customizable caption styling">
          <span className={style === "Bold" ? "text-[15px] font-black uppercase" : style === "Highlight" ? "rounded bg-[#c63838] px-2 py-0.5 text-[14px] font-bold" : "text-[13px] font-medium"}>Make it yours.</span>
        </CreatorStage>
      </div>
    </div>
  );
}
