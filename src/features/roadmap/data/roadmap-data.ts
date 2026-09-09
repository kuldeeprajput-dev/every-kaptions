export type RoadmapItem = {
  category: string;
  date: string;
  title: string;
  description: string;
  status: "shipped" | "next";
};

export const roadmapItems: RoadmapItem[] = [
  { category: "Publishing", date: "Aug 2026", title: "Post Reels to Instagram from Replix", description: "After you export, post the Reel to Instagram from the editor. Creator posts now; Studio can schedule up to 30 days ahead.", status: "shipped" },
  { category: "Editor", date: "Jul 2026", title: "Hindi and English captions", description: "Word-by-word captions in Hindi and English, on top of Telugu, for Creator and Studio creators.", status: "shipped" },
  { category: "Editor", date: "Jul 2026", title: "AI video thumbnails", description: "Create vertical thumbnails from your video and your own photo. Creator gets one option; Studio gets two.", status: "shipped" },
  { category: "Editor", date: "Jul 2026", title: "Bigger font library", description: "A wide range of Telugu and English fonts to match your style.", status: "shipped" },
  { category: "Editor", date: "Jul 2026", title: "Content Pack", description: "Get title options, an Instagram caption, and hashtags for your video, generated from what you actually said.", status: "shipped" },
  { category: "Plans", date: "Jul 2026", title: "Watermark-free exports", description: "Free videos carry a small watermark. A paid plan removes it and unlocks premium styles.", status: "shipped" },
  { category: "Editor", date: "Jul 2026", title: "Caption animations", description: "Add fade and pop entrance effects so your captions feel alive, not static.", status: "shipped" },
  { category: "Editor", date: "Jun 2026", title: "Real progress bar", description: "Upload, transcription, and export show real progress, not a fake bar that stalls at 99 percent.", status: "shipped" },
  { category: "Editor", date: "Jun 2026", title: "Premium style presets", description: "One-tap caption looks with bold fonts and colors, tuned for Telugu short-form.", status: "shipped" },
  { category: "Export", date: "Jun 2026", title: "My Exports library", description: "Your recent exports are saved in your account so you can re-download them anytime.", status: "shipped" },
  { category: "Plans", date: "Jun 2026", title: "Yearly plan", description: "Pay once for a full year of captions. No monthly auto-debit.", status: "shipped" },
  { category: "Mobile", date: "Jun 2026", title: "Mobile editor", description: "Caption and edit fully on your phone, and add Replix to your home screen for quick access.", status: "shipped" },
  { category: "Export", date: "Jun 2026", title: "Faster exports", description: "Long videos render and download noticeably faster.", status: "shipped" },
  { category: "Export", date: "May 2026", title: "SRT subtitle download", description: "Download a subtitle file along with your captioned video for YouTube and other platforms.", status: "shipped" },
  { category: "Editor", date: "Apr 2026", title: "Custom spelling dictionary", description: "Fix a word once and it stays fixed on every future video, so you stop making the same edit.", status: "shipped" },
  { category: "Editor", date: "Mar 2026", title: "Telugu script or Tanglish", description: "Choose Telugu script or Tanglish before you upload, and your captions come out that way.", status: "shipped" },
  { category: "Editor", date: "Mar 2026", title: "Word-by-word Telugu captions", description: "Karaoke-style captions that highlight each word as it is spoken, made for Reels and Shorts.", status: "shipped" },
  { category: "Editor", date: "Next up", title: "Smarter shared spelling", description: "Common Telugu word fixes learned across creators, so your first draft needs fewer edits.", status: "next" },
  { category: "Export", date: "Planned", title: "Post to YouTube from Replix", description: "Send your exported video straight to YouTube from Replix, no manual re-upload.", status: "next" },
];
