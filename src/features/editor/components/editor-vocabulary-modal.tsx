"use client";

import { useId, useRef, useState } from "react";
import { BookOpen, Check, Download, Plus, Trash2, X } from "lucide-react";
import { useDialogFocus } from "@/shared/hooks/use-dialog-focus";
import type { CaptionSegment } from "../types/captions";

export interface VocabularyRule {
  id: string;
  originalText: string;
  replacementText: string;
  matchWholeWord: boolean;
  matchCase: boolean;
}

export interface EditorVocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  segments: CaptionSegment[];
  onApplyReplacements: (updatedSegments: CaptionSegment[], replacedCount: number) => void;
  initialRules?: VocabularyRule[];
}

const DEFAULT_VOCABULARY_RULES: VocabularyRule[] = [
  { id: "vr-1", originalText: "every captions", replacementText: "EveryKaptions", matchWholeWord: true, matchCase: false },
  { id: "vr-2", originalText: "next js", replacementText: "Next.js", matchWholeWord: true, matchCase: false },
  { id: "vr-3", originalText: "open ai", replacementText: "OpenAI", matchWholeWord: true, matchCase: false },
  { id: "vr-4", originalText: "you tube", replacementText: "YouTube", matchWholeWord: true, matchCase: false },
  { id: "vr-5", originalText: "tik tok", replacementText: "TikTok", matchWholeWord: true, matchCase: false },
];

export function EditorVocabularyModal({
  isOpen,
  onClose,
  segments,
  onApplyReplacements,
  initialRules = DEFAULT_VOCABULARY_RULES,
}: EditorVocabularyModalProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, isOpen);

  const [rules, setRules] = useState<VocabularyRule[]>(initialRules);
  const [newOriginal, setNewOriginal] = useState("");
  const [newReplacement, setNewReplacement] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(true);

  if (!isOpen) return null;

  const handleAddRule = () => {
    if (!newOriginal.trim() || !newReplacement.trim()) return;
    const rule: VocabularyRule = {
      id: `vr-${Date.now()}`,
      originalText: newOriginal.trim(),
      replacementText: newReplacement.trim(),
      matchWholeWord: wholeWord,
      matchCase,
    };
    setRules([...rules, rule]);
    setNewOriginal("");
    setNewReplacement("");
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + ["Original,Replacement,WholeWord,MatchCase", ...rules.map((r) => `"${r.originalText}","${r.replacementText}",${r.matchWholeWord},${r.matchCase}`)].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "custom-vocabulary.csv");
    link.click();
  };

  const handleApply = () => {
    let replacedCount = 0;
    const updated = segments.map((seg) => {
      let text = seg.text;
      for (const rule of rules) {
        const flags = rule.matchCase ? "g" : "gi";
        const escaped = rule.originalText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const pattern = rule.matchWholeWord ? new RegExp(`\\b${escaped}\\b`, flags) : new RegExp(escaped, flags);
        if (pattern.test(text)) {
          replacedCount++;
          text = text.replace(pattern, rule.replacementText);
        }
      }
      return { ...seg, text };
    });

    onApplyReplacements(updated, replacedCount);
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
              <BookOpen size={18} />
            </div>
            <div>
              <h2 id={titleId} className="text-sm font-semibold text-cream">Custom Vocabulary & Spelling Rules</h2>
              <p className="text-xs text-dim">Fix mispronounced brand names, slang, and technical terms</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-dim hover:text-cream hover:bg-surface transition-colors cursor-pointer" aria-label="Close vocabulary modal">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="p-3.5 rounded-xl border border-hairline bg-surface-raised/40 space-y-3">
            <span className="text-xs font-semibold text-cream block">Add New Vocabulary Correction</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-dim block mb-1">Misrecognized Spoken Text</span>
                <input
                  type="text"
                  placeholder="e.g. chat gpt"
                  value={newOriginal}
                  onChange={(e) => setNewOriginal(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
                />
              </div>
              <div>
                <span className="text-[10px] text-dim block mb-1">Correct Preferred Spelling</span>
                <input
                  type="text"
                  placeholder="e.g. ChatGPT"
                  value={newReplacement}
                  onChange={(e) => setNewReplacement(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-hairline bg-surface text-xs text-cream outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-body cursor-pointer">
                  <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} className="rounded text-accent accent-accent" />
                  <span className="text-[11px]">Whole word only</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-body cursor-pointer">
                  <input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} className="rounded text-accent accent-accent" />
                  <span className="text-[11px]">Match exact case</span>
                </label>
              </div>
              <button
                type="button"
                onClick={handleAddRule}
                disabled={!newOriginal.trim() || !newReplacement.trim()}
                className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold disabled:opacity-40 hover:bg-accent/90 cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Plus size={13} /> Add Rule
              </button>
            </div>
          </div>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-dim uppercase tracking-wider">
                Active Vocabulary Dictionary ({rules.length})
              </span>
              <button type="button" onClick={handleExportCsv} className="text-xs text-dim hover:text-cream flex items-center gap-1 cursor-pointer">
                <Download size={12} /> Export CSV
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
              {rules.map((rule) => (
                <div key={rule.id} className="p-2.5 rounded-xl border border-hairline bg-surface text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-dim line-through font-mono">{rule.originalText}</span>
                    <span className="text-dim">→</span>
                    <span className="font-semibold text-accent font-mono">{rule.replacementText}</span>
                    {rule.matchWholeWord && <span className="text-[9px] bg-surface-raised px-1 py-0.5 rounded text-dim">word</span>}
                  </div>
                  <button type="button" onClick={() => handleRemoveRule(rule.id)} className="text-dim hover:text-red-400 p-1 cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-surface-raised">
          <p className="text-xs text-dim">Scans all {segments.length} segments and replaces matching phrases</p>
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-dim hover:text-cream transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-accent text-white hover:bg-accent/90 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} /> Replace in Transcript
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
