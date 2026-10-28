"use client";

import { useId, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Check, ChevronDown, ChevronUp, Replace, Search, X } from "lucide-react";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface EditorFindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onBatchReplace: (newSegments: CaptionSegment[]) => void;
}

interface MatchOccurrence {
  segmentId: string;
  segmentIndex: number;
  originalText: string;
  replacedText: string;
}

export function EditorFindReplaceModal({
  isOpen,
  onClose,
  segments,
  onBatchReplace,
}: EditorFindReplaceModalProps) {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [replaceNotice, setReplaceNotice] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useDialogFocus(modalRef, isOpen);

  const matches: MatchOccurrence[] = useMemo(() => {
    if (!findText.trim()) return [];
    const flags = matchCase ? "g" : "gi";
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, flags);
    } catch {
      return [];
    }

    const results: MatchOccurrence[] = [];
    segments.forEach((seg, idx) => {
      if (regex.test(seg.text)) {
        results.push({
          segmentId: seg.id,
          segmentIndex: idx,
          originalText: seg.text,
          replacedText: seg.text.replace(regex, replaceText),
        });
      }
    });
    return results;
  }, [findText, replaceText, matchCase, wholeWord, segments]);

  const handleNavMatch = (delta: number) => {
    if (matches.length === 0) return;
    setActiveMatchIndex((prev) => (prev + delta + matches.length) % matches.length);
  };

  const handleReplaceSingle = () => {
    if (matches.length === 0) return;
    const current = matches[activeMatchIndex] || matches[0];
    const newSegments = segments.map((seg) =>
      seg.id === current.segmentId ? { ...seg, text: current.replacedText } : seg,
    );
    onBatchReplace(newSegments);
    setReplaceNotice(`Replaced in line ${current.segmentIndex + 1}`);
    setTimeout(() => setReplaceNotice(null), 2500);
  };

  const handleReplaceAll = () => {
    if (matches.length === 0) return;
    const matchMap = new Map(matches.map((m) => [m.segmentId, m.replacedText]));
    const newSegments = segments.map((seg) =>
      matchMap.has(seg.id) ? { ...seg, text: matchMap.get(seg.id)! } : seg,
    );
    onBatchReplace(newSegments);
    setReplaceNotice(`Replaced ${matches.length} occurrences`);
    setTimeout(() => {
      setReplaceNotice(null);
      onClose();
    }, 1200);
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
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-white/10 bg-[#0c0d0d] font-sans text-white shadow-2xl overflow-hidden focus-visible:outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#f6c453]/15 text-[#f6c453] border border-[#f6c453]/20">
              <ArrowLeftRight size={17} aria-hidden="true" />
            </span>
            <div>
              <h2 id={titleId} className="text-base font-bold text-cream">Find & Replace</h2>
              <p className="text-xs text-[#788084]">Batch edit transcript words, spellings, and tags</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="grid size-8 place-items-center rounded-full text-[#888] hover:bg-white/10 hover:text-white transition cursor-pointer">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-4 border-b border-white/8 bg-[#111214]">
          <div className="space-y-1.5">
            <label htmlFor="find-input" className="text-xs font-semibold text-[#888]">Find in captions</label>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666]" aria-hidden="true" />
              <input
                id="find-input"
                type="text"
                value={findText}
                onChange={(e) => {
                  setFindText(e.target.value);
                  setActiveMatchIndex(0);
                }}
                placeholder="Enter word to find..."
                className="w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-9 pr-20 text-xs text-white placeholder-[#555] outline-none focus:border-[#f6c453]/60"
              />
              {findText ? (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[#788084]">
                  {matches.length} {matches.length === 1 ? "match" : "matches"}
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="replace-input" className="text-xs font-semibold text-[#888]">Replace with</label>
            <div className="relative">
              <Replace size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666]" aria-hidden="true" />
              <input
                id="replace-input"
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Enter replacement text..."
                className="w-full rounded-xl border border-white/10 bg-black/50 py-2.5 pl-9 pr-4 text-xs text-white placeholder-[#555] outline-none focus:border-[#f6c453]/60"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1 text-xs text-[#888]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} className="rounded border-white/20 bg-black/50 text-[#f6c453] accent-[#f6c453]" />
              <span>Match case</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} className="rounded border-white/20 bg-black/50 text-[#f6c453] accent-[#f6c453]" />
              <span>Whole words only</span>
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar min-h-[120px]">
          {matches.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#666]">
              {findText ? "No matches found in the transcript." : "Type a word above to see live preview."}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/8 bg-[#141517] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#888]">
                <span>Preview match {activeMatchIndex + 1} of {matches.length}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => handleNavMatch(-1)} title="Previous match" className="grid size-6 place-items-center rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                    <ChevronUp size={14} />
                  </button>
                  <button type="button" onClick={() => handleNavMatch(1)} title="Next match" className="grid size-6 place-items-center rounded bg-white/5 hover:bg-white/10 text-white cursor-pointer">
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/50 p-3 space-y-1 text-xs">
                <p className="text-[#888] line-through">{matches[activeMatchIndex]?.originalText}</p>
                <p className="text-cream font-bold">{matches[activeMatchIndex]?.replacedText}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/8 bg-[#0c0d0d] px-6 py-4">
          <span className="text-xs text-[#22c55e] font-bold">
            {replaceNotice ? (
              <span className="inline-flex items-center gap-1"><Check size={14} /> {replaceNotice}</span>
            ) : null}
          </span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={matches.length === 0} onClick={handleReplaceSingle} className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer">
              Replace Next
            </button>
            <button type="button" disabled={matches.length === 0} onClick={handleReplaceAll} className="rounded-xl bg-[#f6c453] px-4 py-2 text-xs font-bold text-black hover:brightness-105 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shadow-md">
              Replace All ({matches.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
