"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import {
  STYLE_OPTIONS,
  type DemoStyleId,
} from "../data/caption-demo-data";

interface CaptionDemoStylesProps {
  styleId: DemoStyleId;
  onSelectStyle: (styleId: DemoStyleId) => void;
}

type TabCategory = "styles" | "text" | "layout";

export function CaptionDemoStyles({
  styleId,
  onSelectStyle,
}: CaptionDemoStylesProps) {
  const [activeTab, setActiveTab] = useState<TabCategory>("styles");

  return (
    <aside
      className="hidden lg:flex flex-col bg-white border-l border-[#f0f0f4] p-[14px_12px] gap-2.5 overflow-hidden"
      aria-label="Caption Style Customizer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#c63838]" aria-hidden="true" />
          <strong className="text-[11px] font-bold tracking-[0.06em] text-[#18181b]">
            CAPTION STYLES
          </strong>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        className="flex gap-[3px] bg-[#f4f4f6] rounded-md p-0.5"
        role="tablist"
        aria-label="Customizer sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "styles"}
          className={`flex-1 text-center text-[9px] font-semibold py-[3px] px-1 rounded transition-all cursor-pointer ${
            activeTab === "styles"
              ? "text-[#18181b] bg-white shadow-xs font-bold"
              : "text-[#71717a] hover:text-[#18181b]"
          }`}
          onClick={() => setActiveTab("styles")}
        >
          Styles
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "text"}
          className={`flex-1 text-center text-[9px] font-semibold py-[3px] px-1 rounded transition-all cursor-pointer ${
            activeTab === "text"
              ? "text-[#18181b] bg-white shadow-xs font-bold"
              : "text-[#71717a] hover:text-[#18181b]"
          }`}
          onClick={() => setActiveTab("text")}
        >
          Text & Color
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "layout"}
          className={`flex-1 text-center text-[9px] font-semibold py-[3px] px-1 rounded transition-all cursor-pointer ${
            activeTab === "layout"
              ? "text-[#18181b] bg-white shadow-xs font-bold"
              : "text-[#71717a] hover:text-[#18181b]"
          }`}
          onClick={() => setActiveTab("layout")}
        >
          Layout
        </button>
      </div>

      {/* Preset Grid */}
      {activeTab === "styles" ? (
        <div
          className="grid grid-cols-2 gap-1.5 overflow-y-auto"
          role="region"
          aria-label="Preset styles grid"
        >
          {STYLE_OPTIONS.map((opt) => {
            const isCurrent = styleId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectStyle(opt.id)}
                aria-pressed={isCurrent}
                className={`bg-[#fafafc] border rounded-[7px] p-1.5 text-left cursor-pointer flex flex-col gap-1 transition-all ${
                  isCurrent
                    ? "border-[#c63838] bg-[#fff8f8] shadow-[0_3px_10px_rgba(198,56,56,0.1)]"
                    : "border-[#e8e8ed] hover:border-[#d4d4d8] hover:bg-white"
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded p-[5px_3px] text-[8px] font-black leading-tight tracking-wider ${opt.tileBg}`}
                  aria-hidden="true"
                >
                  <span className={opt.activeClass}>YOUR</span>&nbsp;STORY
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <strong className="text-[9px] text-[#18181b] font-semibold">
                    {opt.name}
                  </strong>
                  {isCurrent ? (
                    <span className="text-[7px] font-bold text-[#c63838]">
                      Active
                    </span>
                  ) : (
                    <small className="text-[7px] text-[#71717a]">
                      {opt.badge}
                    </small>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : activeTab === "text" ? (
        <div className="p-3 text-xs text-zinc-500 text-center flex flex-col gap-2">
          <span>Primary & Highlight Color adjustments available in Studio.</span>
        </div>
      ) : (
        <div className="p-3 text-xs text-zinc-500 text-center flex flex-col gap-2">
          <span>Position, scale & line padding adjustable in full editor.</span>
        </div>
      )}
    </aside>
  );
}
