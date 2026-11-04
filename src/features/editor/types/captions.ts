export type CaptionWord = {
  id: string;
  text: string;
  start: number;
  end: number;
};

export type CaptionSegment = {
  id: string;
  text: string;
  start: number;
  end: number;
  words: CaptionWord[];
};

export type CaptionStyleId =
  | "yellow"
  | "minimal"
  | "classic"
  | "dark"
  | "viral_alex"
  | "hormozi"
  | "neon"
  | "subtitles"
  | "red_box"
  | "gradient";

export type CaptionExportFormat = "srt" | "vtt" | "txt";

export const captionOutputLanguages = [
  "same",
  "hinglish",
  "en",
  "hi",
  "te",
  "ta",
  "kn",
  "ml",
  "mr",
  "bn",
  "gu",
  "pa",
] as const;

export type CaptionOutputLanguage = (typeof captionOutputLanguages)[number];

const captionOutputLanguageSet = new Set<string>(captionOutputLanguages);

export function isCaptionOutputLanguage(value: unknown): value is CaptionOutputLanguage {
  return typeof value === "string" && captionOutputLanguageSet.has(value);
}

export type CaptionStyle = {
  id: CaptionStyleId;
  name: string;
  textClass: string;
  activeWordClass: string;
  previewClass: string;
};

export type TranscriptPayload = {
  text?: string;
  duration?: number;
  language?: string;
  segments?: Array<{
    id?: number | string;
    text?: string;
    start?: number;
    end?: number;
    words?: Array<{
      word?: string;
      start?: number;
      end?: number;
    }>;
  }>;
  words?: Array<{
    word?: string;
    start?: number;
    end?: number;
  }>;
};

export type TranscriptionResult = {
  text: string;
  duration: number;
  language: string;
  segments: CaptionSegment[];
};

export type TranscriptionState =
  | "idle"
  | "uploading"
  | "transcribing"
  | "translating"
  | "preparing"
  | "ready"
  | "error";


export type CaptionAppearance = {
  highlightHex: string;
  position: "top" | "center" | "bottom" | "custom";
  customYPercent: number;
  fontSize: "sm" | "md" | "lg" | "xl";
  textAlign: "left" | "center" | "right";
  textTransform: "uppercase" | "none" | "lowercase";
};
export const defaultCaptionAppearance: CaptionAppearance = {
  highlightHex: "#c63838", position: "bottom", customYPercent: 82,
  fontSize: "md", textAlign: "center", textTransform: "none",
};
