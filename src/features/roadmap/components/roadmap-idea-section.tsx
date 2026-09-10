"use client";

import { useEffect, useRef, useState } from "react";

const TOPIC_SUGGESTIONS = [
  "Captions",
  "Presets",
  "Fonts",
  "Export",
  "Instagram",
] as const;

export function RoadmapIdeaSection() {
  const [idea, setIdea] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const doneButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!submitted) return;
    doneButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSubmitted(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitted]);

  const handleTopicClick = (topic: string) => {
    setSelectedTopic((prev) => (prev === topic ? null : topic));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!idea.trim()) {
      setError("Write your idea first.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  const handleDismissModal = () => {
    setSubmitted(false);
    setIdea("");
    setSelectedTopic(null);
  };

  return (
    <>
      <section
        className="max-w-[640px] mx-auto mt-10 mb-0 max-[719px]:mb-6 px-[var(--page-gutter)] pb-6 max-[719px]:pb-[max(24px,env(safe-area-inset-bottom,0px))] text-center"
        aria-labelledby="roadmap-ideas-title"
      >
        <div className="font-body text-[clamp(10px,0.45vw+8px,13px)] font-semibold tracking-[0.85px] uppercase text-amber mb-3.5 [text-shadow:0_0_18px_rgba(246,196,83,0.18)]">
          YOUR TURN
        </div>
        <h2
          id="roadmap-ideas-title"
          className="font-display text-[clamp(1.35rem,3vw,1.75rem)] text-cream mb-2"
        >
          Have an idea we missed?
        </h2>
        <p className="text-body mb-4 text-[0.95rem]">
          One sentence is enough. We read every submission.
        </p>

        <form
          className="text-left border border-[var(--hairline)] rounded-xl bg-surface p-3.5 shadow-[var(--card-shadow)]"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="text-[11px] text-dim font-medium mr-1">Topics:</span>
            {TOPIC_SUGGESTIONS.map((topic) => {
              const isActive = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicClick(topic)}
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                    isActive
                      ? "bg-amber text-[#0c0b0a] border-amber"
                      : "bg-surface-raised text-body border-[var(--hairline)] hover:border-amber/40 hover:text-cream"
                  }`}
                  aria-pressed={isActive}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          <label htmlFor="roadmap-idea-input" className="sr-only">
            Your idea or feature request
          </label>
          <textarea
            id="roadmap-idea-input"
            name="idea"
            value={idea}
            maxLength={300}
            onChange={(e) => {
              setIdea(e.target.value);
              if (error && e.target.value.trim()) {
                setError(null);
              }
            }}
            placeholder="e.g. Auto-split long captions into two lines on export"
            rows={3}
            className="w-full min-h-24 resize-y font-body text-[0.95rem] leading-normal text-cream bg-surface-raised border border-[var(--hairline)] rounded-lg py-2.5 px-3 mb-2 placeholder:text-dim focus:outline-none focus:border-amber/45"
          />

          <div className="flex items-center justify-between gap-2.5 mb-1">
            <span className="text-[11px] text-dim mono">
              {idea.length}/300
            </span>
            <button
              type="submit"
              className="font-body text-[13px] font-semibold text-[#0c0b0a] bg-amber border-none rounded-full py-2.5 px-4.5 cursor-pointer transition-[filter,opacity] duration-150 hover:not-disabled:brightness-105"
            >
              Submit idea
            </button>
          </div>

          {error && (
            <p
              className="text-[12px] text-[#e88] mt-2 mb-0.5 font-body"
              role="alert"
            >
              {error}
            </p>
          )}
          <p className="text-dim text-[12px] leading-[1.45] mt-1.5 mb-0 font-body">
            Ideas may be stored and reviewed by our team. Do not submit personal
            data.
          </p>
        </form>
      </section>

      {/* Success Modal Popup */}
      <div
        className={`fixed inset-0 bg-black/78 z-[200] flex items-center justify-center p-5 transition-[opacity,visibility] duration-200 ${
          submitted
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
        id="roadmapIdeaModal"
        aria-hidden={!submitted}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleDismissModal();
          }
        }}
      >
        <div
          className={`w-full max-w-[420px] bg-surface border border-[var(--hairline-strong)] rounded-[18px] p-7 max-[480px]:p-6 text-center transition-[transform,opacity] duration-[260ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            submitted
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-3.5 scale-[0.97]"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="roadmapIdeaModalTitle"
        >
          <div
            className="w-12 h-12 rounded-full bg-[#6ee7a0]/[0.14] border border-[#6ee7a0]/[0.35] flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" className="block">
              <path
                d="M5 13l4 4 10-11"
                fill="none"
                stroke="#6ee7a0"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2
            id="roadmapIdeaModalTitle"
            className="font-display text-[24px] text-cream mb-2 tracking-[-0.02em]"
          >
            Thanks, we got your idea.
          </h2>
          <p className="text-[14px] text-dim mb-5 leading-normal">
            We read every submission. Keep the ideas coming.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              ref={doneButtonRef}
              type="button"
              className="btn-primary w-full"
              id="roadmapIdeaModalDone"
              onClick={handleDismissModal}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
