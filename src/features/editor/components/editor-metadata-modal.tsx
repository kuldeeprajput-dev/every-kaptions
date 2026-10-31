"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, FileText, Hash, Sparkles, X, Share2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface EditorMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  videoTitle?: string;
}

type SocialPlatform = "reels" | "youtube" | "linkedin";
type MetadataTone = "viral" | "educational" | "minimal";

interface GeneratedMetadata {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
}

function generateMetadataFromTranscript(
  transcript: string,
  platform: SocialPlatform,
  tone: MetadataTone,
  fallbackTitle?: string,
): GeneratedMetadata {
  const words = transcript.split(/\s+/).filter(Boolean);
  const cleanFirstSentence = transcript.split(/[.?!]/)[0]?.trim() || fallbackTitle || "Video Highlight";
  const title = (fallbackTitle && fallbackTitle.trim()) || cleanFirstSentence.slice(0, 70);

  const hookMap: Record<MetadataTone, string> = {
    viral: `Stop scrolling! 🚨 ${cleanFirstSentence}...`,
    educational: `Key takeaway from today's session: ${cleanFirstSentence}.`,
    minimal: cleanFirstSentence,
  };

  const tags = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")).filter((w) => w.length >= 5);
  const hashtags = Array.from(new Set([...tags.slice(0, 5), "contentcreator", "viralreels"])).slice(0, 6).map((t) => `#${t}`);

  const captionTemplates: Record<SocialPlatform, string> = {
    reels: `${hookMap[tone]}\n\n${transcript.slice(0, 300)}...\n\n👇 Drop your thoughts below!\n\n${hashtags.join(" ")}`,
    youtube: `${title}\n\nIn this short: ${transcript.slice(0, 220)}...\n\nSubscribe for more tips.\n\n${hashtags.slice(0, 3).join(" ")}`,
    linkedin: `💡 Key takeaway from our recording:\n\n1. ${cleanFirstSentence}\n2. Consistent distribution wins\n\nPreview: "${transcript.slice(0, 220)}..."\n\n${hashtags.slice(0, 4).join(" ")}`,
  };

  return { title, hook: hookMap[tone], caption: captionTemplates[platform], hashtags };
}

export function EditorMetadataModal({
  isOpen,
  onClose,
  segments,
  videoTitle,
}: EditorMetadataModalProps) {
  const [platform, setPlatform] = useState<SocialPlatform>("reels");
  const [tone, setTone] = useState<MetadataTone>("viral");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useDialogFocus(modalRef, isOpen);

  const fullTranscript = useMemo(
    () => segments.map((s) => s.text.trim()).filter(Boolean).join(" "),
    [segments],
  );

  const metadata = useMemo(
    () => generateMetadataFromTranscript(fullTranscript, platform, tone, videoTitle),
    [fullTranscript, platform, tone, videoTitle],
  );

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-[#0c0d0d] font-sans text-white shadow-2xl overflow-hidden focus-visible:outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#f6c453]/15 text-[#f6c453] border border-[#f6c453]/20">
              <Share2 size={18} aria-hidden="true" />
            </span>
            <div>
              <h2 id={titleId} className="text-base font-bold text-cream">Social Post & Metadata</h2>
              <p className="text-xs text-[#788084]">Ready-to-publish hooks, captions, and tags</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close metadata dialog"
            className="grid size-8 place-items-center rounded-full text-[#888] hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-white/8 bg-[#111214] px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {(["reels", "youtube", "linkedin"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer capitalize",
                  platform === p ? "bg-[#f6c453] text-black" : "bg-white/5 text-[#888] hover:text-white",
                )}
              >
                {p === "reels" ? "Reels & TikTok" : p === "youtube" ? "Shorts" : "LinkedIn"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {(["viral", "educational", "minimal"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer capitalize",
                  tone === t ? "bg-white/15 text-white" : "text-[#788084] hover:text-[#c8c2b6]",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          <div className="rounded-2xl border border-white/10 bg-[#121315] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#81898e] uppercase tracking-wider text-[11px]">Hook / Headline</span>
              <button
                type="button"
                onClick={() => handleCopy(metadata.hook, "hook")}
                className="flex items-center gap-1 text-[#f6c453] hover:underline cursor-pointer font-semibold"
              >
                {copiedKey === "hook" ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedKey === "hook" ? "Copied" : "Copy Hook"}</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-cream bg-black/40 p-2.5 rounded-xl border border-white/5">
              {metadata.hook}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121315] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#81898e] uppercase tracking-wider text-[11px]">Formatted Description</span>
              <button
                type="button"
                onClick={() => handleCopy(metadata.caption, "caption")}
                className="flex items-center gap-1 text-[#f6c453] hover:underline cursor-pointer font-semibold"
              >
                {copiedKey === "caption" ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedKey === "caption" ? "Copied" : "Copy Post"}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={metadata.caption}
              rows={6}
              className="w-full rounded-xl border border-white/5 bg-black/40 p-3 font-mono text-xs text-[#d8d8d6] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121315] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#81898e] uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Hash size={12} /> Keywords & Hashtags
              </span>
              <button
                type="button"
                onClick={() => handleCopy(metadata.hashtags.join(" "), "tags")}
                className="flex items-center gap-1 text-[#f6c453] hover:underline cursor-pointer font-semibold"
              >
                {copiedKey === "tags" ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedKey === "tags" ? "Copied" : "Copy All Tags"}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {metadata.hashtags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleCopy(tag, tag)}
                  className="rounded-lg bg-black/60 border border-white/10 px-2.5 py-1 text-[11px] font-mono text-[#c8c2b6] hover:border-[#f6c453]/50 hover:text-white transition cursor-pointer"
                >
                  {copiedKey === tag ? "✓ Copied" : tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 bg-[#0c0d0d] px-6 py-4">
          <div className="text-[11px] text-[#788084] flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#f6c453]" />
            <span>Generated from {segments.length} caption timestamps</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(`${metadata.hook}\n\n${metadata.caption}`, "all")}
            className="flex items-center gap-1.5 rounded-xl bg-[#f6c453] px-4 py-2 text-xs font-bold text-black hover:brightness-105 transition cursor-pointer"
          >
            {copiedKey === "all" ? <Check size={14} /> : <FileText size={14} />}
            <span>{copiedKey === "all" ? "Everything Copied!" : "Copy Full Post"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
