export type SupportCategory = "all" | "transcription" | "export" | "sync" | "billing";

export interface SupportGuideItem {
  id: string;
  category: "transcription" | "export" | "sync" | "billing";
  categoryLabel: string;
  title: string;
  summary: string;
  steps: string[];
  tag: string;
}

export const SUPPORT_CATEGORIES = [
  { id: "all", label: "All Guides" },
  { id: "transcription", label: "Voice & Transcription" },
  { id: "sync", label: "Timing & Sync" },
  { id: "export", label: "Video Export" },
  { id: "billing", label: "Plans & Billing" },
] as const;

export const SUPPORT_GUIDES: SupportGuideItem[] = [
  {
    id: "accuracy-boost",
    category: "transcription",
    categoryLabel: "Voice & Transcription",
    title: "How to improve transcription accuracy for Indian languages",
    summary: "Tips for cleaner auto-captions in Telugu, Hindi, Tamil, and Hinglish.",
    steps: [
      "Ensure clear speech audio with minimal background music during key sentences.",
      "Select your exact spoken language or 'Hinglish' mode before transcribing.",
      "Click any word in the transcript panel to correct spelling or names instantly.",
    ],
    tag: "Audio Quality",
  },
  {
    id: "timing-nudge",
    category: "sync",
    categoryLabel: "Timing & Sync",
    title: "Syncing caption words to rapid speech or background beats",
    summary: "Fix subtitles that appear slightly ahead or behind your voice.",
    steps: [
      "Open your project in the studio editor and check the Voice Sync bar on the left.",
      "Use -0.1s/-0.2s if captions appear late, or +0.1s/+0.2s if they appear early.",
      "Split long sentences at the playhead (<kbd>S</kbd>) to keep reading pace natural.",
    ],
    tag: "Playback Sync",
  },
  {
    id: "export-mp4",
    category: "export",
    categoryLabel: "Video Export",
    title: "Exporting videos with burned-in styled subtitles",
    summary: "Download MP4 reels ready for Instagram, YouTube Shorts, and TikTok.",
    steps: [
      "Click 'Export' in the top right of the editor or press <kbd>Cmd</kbd> + <kbd>E</kbd>.",
      "Select 'Captioned Video (.MP4)' to burn font colors, animations, and positions.",
      "Keep the browser tab open while the client encoder completes the render pass.",
    ],
    tag: "Reels & Shorts",
  },
  {
    id: "srt-vtt",
    category: "export",
    categoryLabel: "Video Export",
    title: "Downloading .SRT and .VTT subtitle files for YouTube",
    summary: "Export separate subtitle tracks for YouTube Studio and video players.",
    steps: [
      "Open the Export dialog and navigate to 'Download Subtitle Files'.",
      "Choose .SRT for YouTube Studio and standard video editors (Premiere, DaVinci).",
      "Choose .VTT for HTML5 web players, Vimeo, and modern browser video players.",
    ],
    tag: "Subtitles",
  },
  {
    id: "quota-reset",
    category: "billing",
    categoryLabel: "Plans & Billing",
    title: "Understanding free export minutes and subscription renewal",
    summary: "Details on monthly reset cycles, quotas, and export limits.",
    steps: [
      "Free creator accounts include 3 minutes of auto-captions every single month.",
      "Quotas refresh automatically on the first day of each calendar month.",
      "Exported subtitles (.SRT, .VTT, .TXT) never consume monthly video render credits.",
    ],
    tag: "Usage & Limits",
  },
];
