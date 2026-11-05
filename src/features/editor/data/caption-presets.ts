/** Original presets made from typography and canvas shapes; no template or image assets. */
export interface CaptionPreset {
  id: string;
  label: string;
  color: string;
  background?: string;
  weight?: number;
  italic?: boolean;
  family?: "sans-serif" | "serif" | "monospace";
  outline?: number;
  outlineColor?: string;
  radius?: number;
  border?: string;
  shadow?: boolean;
  active?: "text" | "box" | "underline";
  animation?: "fade" | "rise" | "pop" | "slide" | "word-reveal" | "word-pop" | "word-fade" | "typewriter";
}

export const originalCaptionPresets = [
  { id: "yellow", label: "Word highlight", color: "#fff", background: "rgba(0,0,0,.85)", active: "text" },
  { id: "minimal", label: "Minimal", color: "#fff", outline: .1, active: "text" },
  { id: "classic", label: "White box", color: "#18181b", background: "#fff" },
  { id: "dark", label: "Dark box", color: "#fff", background: "rgba(0,0,0,.85)" },
  { id: "red_box", label: "Red box", color: "#fff", background: "#c63838" },
  { id: "soft_shadow", label: "Soft shadow", color: "#fff", weight: 600, shadow: true },
  { id: "bold_outline", label: "Bold outline", color: "#fff", weight: 900, outline: .16 },
  { id: "editorial", label: "Editorial", color: "#fff", family: "serif", weight: 500, shadow: true },
  { id: "typewriter", label: "Typewriter", color: "#fff", family: "monospace", background: "#27272a", weight: 500 },
  { id: "italic_note", label: "Italic note", color: "#fff", family: "serif", italic: true, shadow: true },
  { id: "round_pill", label: "Round pill", color: "#18181b", background: "#fff", radius: 1 },
  { id: "slate_pill", label: "Slate pill", color: "#fff", background: "#334155", radius: 1 },
  { id: "warm_paper", label: "Warm paper", color: "#422f23", background: "#fff3dc", family: "serif", weight: 600 },
  { id: "midnight", label: "Midnight", color: "#e0f2fe", background: "#172554" },
  { id: "forest", label: "Forest", color: "#ecfdf5", background: "#14532d" },
  { id: "plum", label: "Plum", color: "#fae8ff", background: "#581c87", radius: .4 },
  { id: "ink_border", label: "Ink border", color: "#18181b", background: "#fff", border: "#18181b", radius: .05 },
  { id: "frosted", label: "Frosted", color: "#18181b", background: "rgba(255,255,255,.82)", radius: .4 },
  { id: "sunshine", label: "Sunshine", color: "#27272a", background: "#fde047", weight: 800, radius: .05 },
  { id: "word_marker", label: "Word marker", color: "#fff", outline: .06, active: "box" },
  { id: "word_underline", label: "Word underline", color: "#fff", outline: .06, active: "underline" },
  { id: "quiet_subtitle", label: "Quiet subtitle", color: "#fff", weight: 500, background: "rgba(0,0,0,.6)", radius: .05 },
  { id: "mono_light", label: "Mono light", color: "#18181b", background: "#fafafa", family: "monospace", weight: 500, border: "#d4d4d8" },
  { id: "coral", label: "Coral", color: "#fff", background: "#d94841", weight: 800, radius: .4 },
  { id: "ocean", label: "Ocean", color: "#ecfeff", background: "#155e75", radius: .4 },
  { id: "mint", label: "Mint", color: "#064e3b", background: "#a7f3d0", weight: 800 },
  { id: "lavender", label: "Lavender", color: "#3b0764", background: "#e9d5ff", family: "serif" },
  { id: "accent_ink", label: "Accent ink", color: "#fff", background: "#18181b", border: "#f6c453", active: "text" },
  { id: "electric_outline", label: "Electric outline", color: "#bef264", outline: .12, weight: 900 },
  { id: "bold_headline", label: "Bold headline", color: "#fff", weight: 900, shadow: true, active: "text" },
  { id: "animated_fade", label: "Soft fade", color: "#fff", shadow: true, animation: "fade" },
  { id: "animated_rise", label: "Rise in", color: "#fff", background: "#18181b", animation: "rise" },
  { id: "animated_pop", label: "Pop in", color: "#fff", weight: 900, outline: .1, animation: "pop" },
  { id: "animated_slide", label: "Slide in", color: "#18181b", background: "#fff", radius: .4, animation: "slide" },
  { id: "animated_words", label: "Word reveal", color: "#fff", outline: .08, active: "text", animation: "word-reveal" },
  { id: "animated_word_pop", label: "Word pop", color: "#fff", weight: 800, outline: .08, active: "text", animation: "word-pop" },
  { id: "animated_word_fade", label: "Word fade", color: "#fff", background: "rgba(0,0,0,.75)", animation: "word-fade" },
  { id: "animated_typewriter", label: "Type reveal", color: "#fff", family: "monospace", background: "#27272a", animation: "typewriter" },
] as const satisfies readonly CaptionPreset[];

export type OriginalCaptionPresetId = typeof originalCaptionPresets[number]["id"];
const presetMap = new Map<string, CaptionPreset>(originalCaptionPresets.map(preset => [preset.id, preset]));
export function getCaptionPreset(id: string): CaptionPreset {
  return presetMap.get(id === "hormozi" ? "yellow" : id) ?? presetMap.get("minimal")!;
}
