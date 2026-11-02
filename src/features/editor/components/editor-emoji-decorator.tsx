"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Plus, Smile, Trash2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface EmojiDecoratorConfig {
  density: "minimal" | "moderate" | "dynamic";
  placement: "inline" | "floating-badge";
  animatedBounce: boolean;
  scalePercent: number;
  customWordMappings: Record<string, string>;
}

export interface EditorEmojiDecoratorProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplyDecoration: (config: EmojiDecoratorConfig) => void;
  initialConfig?: Partial<EmojiDecoratorConfig>;
}

const DEFAULT_EMOJI_RULES: Record<string, string> = {
  money: "💰",
  dollar: "💵",
  fire: "🔥",
  crazy: "🤯",
  secret: "🤫",
  growth: "📈",
  rocket: "🚀",
  warning: "⚠️",
  love: "❤️",
  win: "🏆",
};

export function EditorEmojiDecorator({
  isOpen,
  onClose,
  segments,
  onApplyDecoration,
  initialConfig,
}: EditorEmojiDecoratorProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [density, setDensity] = useState<"minimal" | "moderate" | "dynamic">(
    initialConfig?.density ?? "moderate",
  );
  const [placement, setPlacement] = useState<"inline" | "floating-badge">(
    initialConfig?.placement ?? "inline",
  );
  const [animatedBounce, setAnimatedBounce] = useState<boolean>(
    initialConfig?.animatedBounce ?? true,
  );
  const [scale, setScale] = useState<number>(initialConfig?.scalePercent ?? 115);
  const [mappings, setMappings] = useState<Record<string, string>>(
    initialConfig?.customWordMappings ?? DEFAULT_EMOJI_RULES,
  );
  const [newKeyword, setNewKeyword] = useState("");
  const [newEmoji, setNewEmoji] = useState("");

  if (!isOpen) return null;

  const matchedKeywordsCount = useMemo(() => {
    let count = 0;
    const fullText = segments.map((s) => s.text.toLowerCase()).join(" ");
    for (const key of Object.keys(mappings)) {
      if (fullText.includes(key.toLowerCase())) count++;
    }
    return count;
  }, [segments, mappings]);

  const handleAddRule = () => {
    if (!newKeyword.trim() || !newEmoji.trim()) return;
    setMappings({
      ...mappings,
      [newKeyword.trim().toLowerCase()]: newEmoji.trim(),
    });
    setNewKeyword("");
    setNewEmoji("");
  };

  const handleRemoveRule = (key: string) => {
    const next = { ...mappings };
    delete next[key];
    setMappings(next);
  };

  const handleSave = () => {
    onApplyDecoration({
      density,
      placement,
      animatedBounce,
      scalePercent: scale,
      customWordMappings: mappings,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl bg-surface border border-hairline rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
              <Smile size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Caption Emoji & Sticker Decorator</h2>
              <p className="text-xs text-dim">Automatically attach animated emojis to viral spoken keywords</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close emoji modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "minimal", label: "Minimalist", desc: "1 emoji per punchline" },
              { id: "moderate", label: "Engaging", desc: "Key highlighted nouns" },
              { id: "dynamic", label: "High-Energy", desc: "TikTok fast retention" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDensity(d.id as "minimal" | "moderate" | "dynamic")}
                className={cn(
                  "p-3 rounded-xl border text-left text-xs transition-all cursor-pointer",
                  density === d.id
                    ? "border-accent bg-accent-soft text-cream font-medium shadow-sm"
                    : "border-hairline bg-surface-raised/40 hover:bg-surface-raised text-body hover:text-cream",
                )}
              >
                <span className="font-semibold block mb-0.5">{d.label}</span>
                <span className="text-[10px] text-dim">{d.desc}</span>
              </button>
            ))}
          </div>

          <section className="space-y-3 pt-2 border-t border-hairline text-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">Word-to-Emoji Mappings</span>
              <span className="text-[11px] text-dim font-mono">{matchedKeywordsCount} triggers in video</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Spoken word (e.g. secret)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Emoji (e.g. 🤫)"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-center outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleAddRule}
                disabled={!newKeyword.trim() || !newEmoji.trim()}
                className="px-3 py-1.5 rounded-lg bg-surface border border-hairline hover:border-accent text-accent text-xs font-semibold cursor-pointer disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl border border-hairline bg-surface-raised/20">
              {Object.entries(mappings).map(([word, emoji]) => (
                <span key={word} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-hairline bg-surface text-xs font-medium text-cream">
                  <span>{emoji}</span>
                  <span className="text-dim font-mono text-[11px]">{word}</span>
                  <button type="button" onClick={() => handleRemoveRule(word)} className="text-dim/60 hover:text-red-400 cursor-pointer ml-0.5">
                    <Trash2 size={11} />
                  </button>
                </span>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-cream">Emoji Scale Size</span>
                <span className="text-dim font-mono">{scale}%</span>
              </div>
              <input type="range" min="90" max="150" step="5" value={scale} onChange={(e) => setScale(parseInt(e.target.value, 10))} className="w-full accent-accent h-1.5 bg-surface-raised rounded-lg cursor-pointer" />
            </div>

            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-raised cursor-pointer text-body hover:text-cream">
              <input type="checkbox" checked={animatedBounce} onChange={(e) => setAnimatedBounce(e.target.checked)} className="rounded text-accent accent-accent" />
              <span>Animate pop-in bounce when word is spoken on video</span>
            </label>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">{Object.keys(mappings).length} emoji rules active</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Apply Emojis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
