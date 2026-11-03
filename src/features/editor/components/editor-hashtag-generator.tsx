"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Hash, Plus, RefreshCw, Share2, Sparkles, Trash2, X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export type PlatformTarget = "tiktok" | "instagram" | "youtube";
export type CaptionTone = "engaging" | "educational" | "story";

export interface EditorHashtagGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  projectTitle?: string;
}

const DEFAULT_HASHTAGS: Record<PlatformTarget, string[]> = {
  tiktok: ["#fyp", "#viral", "#creator", "#contentcreator", "#foryoupage", "#edits", "#learnontiktok"],
  instagram: ["#reelsinstagram", "#reelsviral", "#contentcreation", "#videocreator", "#storytelling"],
  youtube: ["#shorts", "#youtubeshorts", "#viralshorts", "#creativestudio", "#shortvideo"],
};

export function EditorHashtagGenerator({
  isOpen,
  onClose,
  segments,
  projectTitle,
}: EditorHashtagGeneratorProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogFocus(dialogRef, isOpen);

  const [platform, setPlatform] = useState<PlatformTarget>("tiktok");
  const [tone, setTone] = useState<CaptionTone>("engaging");
  const [copied, setCopied] = useState(false);
  const [includeCta, setIncludeCta] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [customTag, setCustomTag] = useState("");
  const [customTags, setCustomTags] = useState<string[]>(["#everykaptions"]);

  const transcriptSummary = useMemo(() => {
    if (!segments || segments.length === 0) {
      return "Check out this quick breakdown! Let me know your thoughts in the comments.";
    }
    const hook = segments[0]?.text || "Must watch tip!";
    if (tone === "educational") return `${hook} Here is a step-by-step breakdown you need to implement today.`;
    if (tone === "story") return `${hook} Here is the behind-the-scenes story of how this happened.`;
    return `${hook} This completely changed the way I look at this!`;
  }, [segments, tone]);

  const activeHashtags = [...DEFAULT_HASHTAGS[platform], ...customTags];
  const emojiPrefix = includeEmojis ? "🔥 " : "";
  const ctaLine = includeCta ? "\n\n👉 Follow for more daily creator tips and breakdowns!" : "";
  const fullCopyText = `${emojiPrefix}${projectTitle ? `${projectTitle}\n\n` : ""}${transcriptSummary}${ctaLine}\n\n${activeHashtags.join(" ")}`;

  if (!isOpen) return null;

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = customTag.trim().startsWith("#") ? customTag.trim() : `#${customTag.trim()}`;
    if (formatted.length > 1 && !customTags.includes(formatted)) {
      setCustomTags([...customTags, formatted]);
      setCustomTag("");
    }
  };

  const handleRemoveCustomTag = (tag: string) => {
    setCustomTags(customTags.filter((t) => t !== tag));
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullCopyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-xl rounded-2xl border border-hairline bg-surface-raised shadow-2xl overflow-hidden flex flex-col max-h-[90vh] outline-none"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/10 text-accent"><Hash size={18} /></div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Social Caption & Hashtags</h2>
              <p className="text-xs text-dim">Generate viral hook captions and hashtags tailored for feeds</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close hashtag generator">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-dim uppercase tracking-wider block mb-1.5">Platform</span>
              <div className="flex gap-1">
                {(["tiktok", "instagram", "youtube"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={cn("flex-1 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer",
                      platform === p ? "bg-accent text-white" : "bg-surface border border-hairline text-dim hover:text-cream")}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-dim uppercase tracking-wider block mb-1.5">Tone Style</span>
              <div className="flex gap-1">
                {(["engaging", "educational", "story"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={cn("flex-1 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer",
                      tone === t ? "bg-accent text-white" : "bg-surface border border-hairline text-dim hover:text-cream")}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-hairline bg-surface/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cream flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent" /> Generated Post Caption Copy
              </span>
              <span className="text-[10px] text-dim font-mono">{fullCopyText.length} / 2200 chars</span>
            </div>

            <textarea
              readOnly
              value={fullCopyText}
              rows={5}
              className="w-full p-3 rounded-xl border border-hairline bg-surface text-xs text-cream outline-none resize-none font-sans leading-relaxed"
            />

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-hairline/40">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-dim hover:text-cream">
                <input
                  type="checkbox"
                  checked={includeCta}
                  onChange={(e) => setIncludeCta(e.target.checked)}
                  className="accent-accent w-3.5 h-3.5 cursor-pointer"
                />
                Append Follow CTA
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-dim hover:text-cream">
                <input
                  type="checkbox"
                  checked={includeEmojis}
                  onChange={(e) => setIncludeEmojis(e.target.checked)}
                  className="accent-accent w-3.5 h-3.5 cursor-pointer"
                />
                Add Hook Emoji Prefix
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">Hashtags ({platform})</span>
              <form onSubmit={handleAddCustomTag} className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="#addcustomtag"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  className="px-2 py-0.5 rounded border border-hairline bg-surface text-xs text-cream outline-none w-28"
                />
                <button
                  type="submit"
                  disabled={!customTag.trim()}
                  className="p-1 rounded bg-accent hover:bg-accent-hover text-white disabled:opacity-40 cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </form>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeHashtags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-hairline bg-surface-raised text-xs font-mono text-dim hover:text-accent transition-colors"
                >
                  {tag}
                  {customTags.includes(tag) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomTag(tag)}
                      className="hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-hairline bg-surface/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-cream">
              <Share2 size={14} className="text-accent" />
              <span>Ready for Instagram Reels, TikTok, or YouTube Shorts captions.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface/50">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-dim hover:text-cream transition-colors cursor-pointer"
          >
            <RefreshCw size={13} /> {copied ? "Copied!" : "Copy Post Text"}
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer">
              <Check size={14} /> Copy &amp; Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
