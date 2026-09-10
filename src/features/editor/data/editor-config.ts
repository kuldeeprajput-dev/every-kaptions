import type { CaptionOutputLanguage, CaptionStyle } from "../types/captions";

export const MAX_CAPTION_FILE_BYTES = 25 * 1024 * 1024;

export type LanguageOption = {
  value: string;
  label: string;
  nativeName: string;
  supported: boolean;
};

export const indianLanguageOptions: LanguageOption[] = [
  {
    value: "en",
    label: "English",
    nativeName: "English",
    supported: true,
  },
  {
    value: "hi",
    label: "Hindi",
    nativeName: "Hindi (हिंदी)",
    supported: true,
  },
  {
    value: "te",
    label: "Telugu",
    nativeName: "Telugu (తెలుగు)",
    supported: true,
  },
  {
    value: "ta",
    label: "Tamil",
    nativeName: "Tamil (தமிழ்)",
    supported: true,
  },
  {
    value: "kn",
    label: "Kannada",
    nativeName: "Kannada (ಕನ್ನಡ)",
    supported: true,
  },
  {
    value: "ml",
    label: "Malayalam",
    nativeName: "Malayalam (മലയാളം)",
    supported: true,
  },
  {
    value: "mr",
    label: "Marathi",
    nativeName: "Marathi (मराठी)",
    supported: true,
  },
  {
    value: "bn",
    label: "Bengali",
    nativeName: "Bengali (বাংলা)",
    supported: true,
  },
  {
    value: "gu",
    label: "Gujarati",
    nativeName: "Gujarati (ગુજરાતી)",
    supported: true,
  },
  {
    value: "pa",
    label: "Punjabi",
    nativeName: "Punjabi (ਪੰਜਾਬੀ)",
    supported: true,
  },
  {
    value: "or",
    label: "Odia",
    nativeName: "Odia (ଓଡ଼ିଆ)",
    supported: false,
  },
  {
    value: "as",
    label: "Assamese",
    nativeName: "Assamese (অসমীয়া)",
    supported: false,
  },
  {
    value: "bho",
    label: "Bhojpuri",
    nativeName: "Bhojpuri (भोजपुरी)",
    supported: false,
  },
  {
    value: "mai",
    label: "Maithili",
    nativeName: "Maithili (मैथिली)",
    supported: false,
  },
];

export const languageOptions = indianLanguageOptions.map((option) => ({
  value: option.value,
  label: option.supported ? option.nativeName : `${option.nativeName} (Coming soon)`,
}));

export function getLanguageOption(value: string) {
  return indianLanguageOptions.find((option) => option.value === value) ?? indianLanguageOptions[0];
}

export type CaptionOutputOption = {
  value: CaptionOutputLanguage;
  label: string;
  nativeName: string;
  description: string;
};

const captionOutputOptions: CaptionOutputOption[] = [
  {
    value: "same",
    label: "Same as spoken",
    nativeName: "Original language",
    description: "Fastest option. Keeps the words in the language used in the recording.",
  },
  {
    value: "hinglish",
    label: "Hinglish",
    nativeName: "Hindi + English",
    description: "Natural Hindi in English letters, with familiar English words kept where they sound better.",
  },
  {
    value: "hi",
    label: "Hindi",
    nativeName: "हिंदी",
    description: "Natural Hindi captions written in Devanagari.",
  },
  {
    value: "en",
    label: "English",
    nativeName: "English",
    description: "Clear English captions with names and meaning preserved.",
  },
  {
    value: "te",
    label: "Telugu",
    nativeName: "తెలుగు",
    description: "Natural Telugu captions written in Telugu script.",
  },
  {
    value: "ta",
    label: "Tamil",
    nativeName: "தமிழ்",
    description: "Natural Tamil captions written in Tamil script.",
  },
  {
    value: "kn",
    label: "Kannada",
    nativeName: "ಕನ್ನಡ",
    description: "Natural Kannada captions written in Kannada script.",
  },
  {
    value: "ml",
    label: "Malayalam",
    nativeName: "മലയാളം",
    description: "Natural Malayalam captions written in Malayalam script.",
  },
  {
    value: "mr",
    label: "Marathi",
    nativeName: "मराठी",
    description: "Natural Marathi captions written in Devanagari.",
  },
  {
    value: "bn",
    label: "Bengali",
    nativeName: "বাংলা",
    description: "Natural Bengali captions written in Bengali script.",
  },
  {
    value: "gu",
    label: "Gujarati",
    nativeName: "ગુજરાતી",
    description: "Natural Gujarati captions written in Gujarati script.",
  },
  {
    value: "pa",
    label: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    description: "Natural Punjabi captions written in Gurmukhi.",
  },
];

export function getCaptionOutputOptions(spokenLanguage: string) {
  return captionOutputOptions.filter(
    (option) => option.value === "same" || option.value === "hinglish" || option.value !== spokenLanguage,
  );
}

export function getCaptionOutputOption(value: CaptionOutputLanguage) {
  return captionOutputOptions.find((option) => option.value === value) ?? captionOutputOptions[0];
}

export const captionStyles: CaptionStyle[] = [
  {
    id: "yellow",
    name: "Yellow Box",
    textClass: "font-extrabold uppercase text-white tracking-wide",
    activeWordClass: "text-[#f6c453]",
    previewClass: "rounded-xl bg-black/85 px-4 py-2 text-white border border-white/10 shadow-2xl",
  },
  {
    id: "viral_alex",
    name: "Viral Green",
    textClass: "font-black uppercase text-white tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]",
    activeWordClass: "text-[#22c55e] scale-105 inline-block",
    previewClass: "bg-black/75 rounded-xl px-4 py-2 text-white border border-green-500/30",
  },
  {
    id: "hormozi",
    name: "Hormozi",
    textClass: "font-black uppercase text-white tracking-wider",
    activeWordClass: "bg-[#ffe600] text-black px-2 py-0.5 rounded-md font-black shadow-md",
    previewClass: "bg-black/90 rounded-xl px-4 py-2 text-white border border-amber-400/40",
  },
  {
    id: "minimal",
    name: "Minimal",
    textClass: "font-bold text-white tracking-normal",
    activeWordClass: "text-white underline decoration-[#f6c453] decoration-2 underline-offset-4",
    previewClass: "bg-transparent text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] px-3 py-1",
  },
  {
    id: "classic",
    name: "Classic Pill",
    textClass: "font-extrabold text-black tracking-tight",
    activeWordClass: "text-black underline",
    previewClass: "rounded-xl bg-white px-4 py-2 text-black shadow-lg",
  },
  {
    id: "dark",
    name: "Dark Pill",
    textClass: "font-bold text-white tracking-wide",
    activeWordClass: "text-[#f6c453] font-black",
    previewClass: "rounded-xl border border-white/20 bg-black/95 px-4 py-2 text-white shadow-xl",
  },
  {
    id: "neon",
    name: "Neon Glow",
    textClass: "font-extrabold uppercase text-[#06b6d4] drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]",
    activeWordClass: "text-[#ec4899] drop-shadow-[0_0_14px_rgba(236,72,153,0.9)]",
    previewClass: "rounded-xl bg-black/90 px-4 py-2 border border-cyan-500/30",
  },
  {
    id: "subtitles",
    name: "Subtitles",
    textClass: "font-semibold text-white tracking-wide",
    activeWordClass: "text-[#f6c453]",
    previewClass: "w-full bg-black/75 px-4 py-2 text-white text-center rounded-lg border-y border-white/10",
  },
  {
    id: "red_box",
    name: "Red Box",
    textClass: "font-black uppercase text-white tracking-wider",
    activeWordClass: "text-yellow-200",
    previewClass: "rounded-xl bg-[#ef4444] px-4 py-2 text-white shadow-xl border border-red-400/30",
  },
  {
    id: "gradient",
    name: "Gradient Pop",
    textClass: "font-black uppercase bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]",
    activeWordClass: "from-white to-amber-200",
    previewClass: "rounded-xl bg-black/85 px-4 py-2 border border-amber-500/30",
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
