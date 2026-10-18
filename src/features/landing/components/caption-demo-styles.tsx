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
      className="editor-right-panel"
      aria-label="Caption Style Customizer"
    >
      <div className="panel-title-bar">
        <div className="panel-title-meta">
          <Sparkles size={13} className="text-amber-500" aria-hidden="true" />
          <strong>CAPTION STYLES</strong>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        className="styles-tabs-row"
        role="tablist"
        aria-label="Customizer sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "styles"}
          className={`tab-pill ${activeTab === "styles" ? "is-active" : ""}`}
          onClick={() => setActiveTab("styles")}
        >
          Styles
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "text"}
          className={`tab-pill ${activeTab === "text" ? "is-active" : ""}`}
          onClick={() => setActiveTab("text")}
        >
          Text & Color
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "layout"}
          className={`tab-pill ${activeTab === "layout" ? "is-active" : ""}`}
          onClick={() => setActiveTab("layout")}
        >
          Layout
        </button>
      </div>

      {/* Preset Grid */}
      {activeTab === "styles" ? (
        <div
          className="styles-preset-grid"
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
                className={`style-selector-card ${isCurrent ? "is-active" : ""}`}
              >
                <div
                  className={`style-card-preview ${opt.tileBg}`}
                  aria-hidden="true"
                >
                  <span className={opt.activeClass}>YOUR</span>&nbsp;STORY
                </div>
                <div className="style-card-footer">
                  <strong>{opt.name}</strong>
                  {isCurrent ? (
                    <span className="active-check">Active</span>
                  ) : (
                    <small>{opt.badge}</small>
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
