export type DemoStyleId =
  | "yellow"
  | "hormozi"
  | "viral_alex"
  | "red_box"
  | "classic"
  | "minimal";

export interface StyleOption {
  id: DemoStyleId;
  name: string;
  badge: string;
  previewClass: string;
  activeClass: string;
  tileBg: string;
}

export interface DemoSegment {
  id: number;
  time: string;
  start: number;
  end: number;
  words: string[];
  fullText: string;
}

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "yellow",
    name: "Yellow Box",
    badge: "Pop",
    previewClass: "bg-black/90 text-white border border-white/10 shadow-2xl",
    activeClass: "text-[#f6c453]",
    tileBg: "bg-zinc-900 text-white",
  },
  {
    id: "hormozi",
    name: "Hormozi",
    badge: "Viral",
    previewClass: "bg-black/95 text-white border border-amber-400/40 shadow-2xl",
    activeClass: "bg-[#ffe600] text-black px-1.5 py-0.5 rounded font-black",
    tileBg: "bg-zinc-900 text-white",
  },
  {
    id: "viral_alex",
    name: "Viral Green",
    badge: "Trending",
    previewClass: "bg-black/85 text-white border border-green-500/30 shadow-2xl",
    activeClass: "text-[#22c55e] scale-105 inline-block font-black",
    tileBg: "bg-zinc-900 text-white",
  },
  {
    id: "red_box",
    name: "Red Box",
    badge: "High Impact",
    previewClass: "bg-[#ef4444] text-white border border-red-300/30 shadow-2xl",
    activeClass: "text-[#fef08a] font-black",
    tileBg: "bg-[#ef4444] text-white",
  },
  {
    id: "classic",
    name: "Classic Pill",
    badge: "Clean",
    previewClass: "bg-white text-black shadow-xl",
    activeClass: "text-black underline decoration-2 underline-offset-4",
    tileBg: "bg-white text-zinc-900 border border-zinc-200 shadow-xs",
  },
  {
    id: "minimal",
    name: "Minimal",
    badge: "Subtle",
    previewClass: "bg-transparent text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]",
    activeClass: "text-white underline decoration-[#f6c453] decoration-2 underline-offset-4",
    tileBg: "bg-zinc-800 text-white",
  },
];

export const DEMO_SEGMENTS: DemoSegment[] = [
  {
    id: 1,
    time: "00:00.0",
    start: 0,
    end: 3.2,
    words: ["Your", "words.", "Your", "way."],
    fullText: "Your words. Your way.",
  },
  {
    id: 2,
    time: "00:03.2",
    start: 3.2,
    end: 6.5,
    words: ["Turn", "speech", "into", "video", "captions."],
    fullText: "Turn speech into video captions.",
  },
  {
    id: 3,
    time: "00:06.5",
    start: 6.5,
    end: 9.0,
    words: ["Auto-synced", "in", "10+", "Indian", "languages."],
    fullText: "Auto-synced in 10+ Indian languages.",
  },
];

export const TOTAL_DURATION = 9.0;
