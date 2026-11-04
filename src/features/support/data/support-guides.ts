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
  { id: "all", label: "All topics" },
  { id: "transcription", label: "Captions" },
  { id: "sync", label: "Timing" },
  { id: "export", label: "Downloads" },
  { id: "billing", label: "Plans & billing" },
] as const;

export const SUPPORT_GUIDES: SupportGuideItem[] = [
  {
    id: "accuracy-boost",
    category: "transcription",
    categoryLabel: "Voice & Transcription",
    title: "Get clearer captions",
    summary: "Improve the words generated from your recording.",
    steps: [
      "Use a recording where the voice is clear and background music is quiet.",
      "Choose the language spoken in your recording before generating captions.",
      "Review the caption lines in the editor. Click the text to correct names or spelling.",
    ],
    tag: "Audio Quality",
  },
  {
    id: "timing-nudge",
    category: "sync",
    categoryLabel: "Timing & Sync",
    title: "Fix captions that appear too early or too late",
    summary: "Fix subtitles that appear slightly ahead or behind your voice.",
    steps: [
      "Open your project and find Voice Sync in the captions panel.",
      "If captions appear late, shift them earlier with a negative timing adjustment. If they appear early, use a positive adjustment.",
      "Play the video to check the result. Use the Split control on a caption line if it is too long.",
    ],
    tag: "Playback Sync",
  },
  {
    id: "export-mp4",
    category: "export",
    categoryLabel: "Video Export",
    title: "Download a video with captions",
    summary: "Save your video with your chosen caption style.",
    steps: [
      "Open your project, review your captions, and click Export at the top of the editor.",
      "Choose Captioned Video (.MP4) to include your captions in the video.",
      "Keep the tab open while the video is being prepared, then save the downloaded file.",
    ],
    tag: "Reels & Shorts",
  },
  {
    id: "srt-vtt",
    category: "export",
    categoryLabel: "Video Export",
    title: "Download a subtitle file",
    summary: "Save the words and timing separately from your video.",
    steps: [
      "Click Export in your project and find Download Subtitle Files.",
      "Choose .SRT for a subtitle file you can add to YouTube or another video editor.",
      "Choose .VTT for a web video player, or .TXT if you only need the words.",
    ],
    tag: "Subtitles",
  },
  {
    id: "quota-reset",
    category: "billing",
    categoryLabel: "Plans & Billing",
    title: "Check your free minutes and exports",
    summary: "Find your remaining usage and when it resets.",
    steps: [
      "The free plan includes 3 minutes of caption generation and 3 video exports per usage period.",
      "Open the account menu in your workspace to see your remaining usage and reset information.",
      "Downloading a subtitle file does not use a video export. Visit Pricing to compare plans.",
    ],
    tag: "Usage & Limits",
  },
];
