import type { CaptionStyle } from "../types/captions";

export const MAX_CAPTION_FILE_BYTES = 25 * 1024 * 1024;

export const languageOptions = [
  { value: "auto", label: "Detect automatically" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
] as const;

export const captionStyles: CaptionStyle[] = [
  {
    id: "yellow",
    name: "Yellow",
    textClass: "font-extrabold uppercase text-white",
    activeWordClass: "text-[#ffc83d]",
    previewClass: "bg-black/80 text-white",
  },
  {
    id: "minimal",
    name: "Minimal",
    textClass: "font-semibold text-white",
    activeWordClass: "text-white",
    previewClass: "bg-transparent text-white drop-shadow-[0_2px_4px_rgba(0,0,0,.9)]",
  },
  {
    id: "classic",
    name: "Classic",
    textClass: "font-bold text-black",
    activeWordClass: "text-black",
    previewClass: "rounded-md bg-white px-2 py-1 text-black",
  },
  {
    id: "dark",
    name: "Dark",
    textClass: "font-bold text-white",
    activeWordClass: "text-[#ffc83d]",
    previewClass: "rounded-md border border-white/20 bg-black/90 px-3 py-1.5 text-white",
  },
];

export const freePlan = {
  name: "Free",
  transcriptionMinutes: 3,
  monthlyExports: 3,
  maxUploadBytes: MAX_CAPTION_FILE_BYTES,
  retentionMinutes: 60,
} as const;

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
