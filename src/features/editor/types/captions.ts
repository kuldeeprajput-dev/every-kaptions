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

export type CaptionOutputLanguage = "same" | "en" | "hi" | "hinglish";

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

export type TranscriptionState = "idle" | "uploading" | "transcribing" | "ready" | "error";

