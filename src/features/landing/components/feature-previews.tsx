"use client";

import Image from "next/image";
import { useState } from "react";
import { Captions, Check, SlidersHorizontal } from "lucide-react";

type DemoStyle = "Clean" | "Bold" | "Highlight";
const demoStyles: DemoStyle[] = ["Clean", "Bold", "Highlight"];
const words = ["Your", "words.", "Your", "way."];

export function TranscriptPreview() {
  const [lines, setLines] = useState([
    "Your words. Your way.",
    "Make your next story count.",
  ]);
  const [active, setActive] = useState(0);

  return (
    <div className="mini-editor" aria-label="Editable caption preview">
      <div className="mini-editor-top">
        <div className="editor-dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <div className="editor-title">
          <Captions size={14} />
          <strong>Caption Editor</strong>
        </div>
        <span className="editor-status-badge">
          <Check size={11} /> Editable
        </span>
      </div>

      <div className="mini-editor-content">
        <div className="mini-transcript">
          <div className="mini-panel-header">
            <span className="mini-panel-label">TRANSCRIPT LINES</span>
            <small>Click to edit</small>
          </div>
          <div className="mini-transcript-list">
            {lines.map((line, index) => (
              <label
                key={index}
                className={`transcript-line-item ${active === index ? "is-active" : ""}`}
              >
                <time className="line-time">00:0{index * 4}</time>
                <input
                  value={line}
                  aria-label={`Preview caption line ${index + 1}`}
                  onFocus={() => setActive(index)}
                  onChange={(event) =>
                    setLines((previous) =>
                      previous.map((value, i) =>
                        i === index ? event.target.value : value,
                      ),
                    )
                  }
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mini-editor-media">
          <Image
            src="/media/landing/creator-desk.webp"
            alt="Creator in a caption preview"
            fill
            sizes="(max-width: 768px) 50vw, 300px"
          />
          <div className="mini-media-overlay" />
          <p className="mini-caption-pill">{lines[active] || "Your next story."}</p>
        </div>
      </div>
    </div>
  );
}

export function TimingPreview() {
  const [time, setTime] = useState(2.5);
  const active = Math.min(3, Math.floor(time / 2));

  return (
    <div className="timing-workspace-card" aria-label="Word timing editor">
      <div className="timing-workspace-top">
        <div className="editor-dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <div className="editor-title">
          <SlidersHorizontal size={14} />
          <strong>Word Timing & Sync</strong>
        </div>
        <span className="timing-timecode-badge">
          {time.toFixed(1)}s / 8.0s
        </span>
      </div>

      <div className="timing-workspace-content">
        <div className="timing-media-stage">
          <Image
            src="/media/landing/creator-podcast.webp"
            alt="Podcaster with a word timing preview"
            fill
            sizes="(max-width: 768px) 50vw, 280px"
          />
          <div className="timing-media-overlay" />
          <p className="timing-media-caption">
            {words.map((word, index) => (
              <span
                key={index}
                className={index === active ? "active-word" : ""}
                onClick={() => setTime(index * 2)}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        <div className="timing-inspector-panel">
          <div className="inspector-panel-header">
            <span className="mini-panel-label">AUDIO WAVEFORM</span>
            <span className="waveform-hz">44.1 kHz</span>
          </div>

          <div className="timing-waveform-ruler" aria-hidden="true">
            {Array.from({ length: 28 }, (_, i) => {
              const height = 10 + ((i * 17) % 24);
              const isPast = (i / 28) * 8 <= time;
              return (
                <span
                  key={i}
                  style={{
                    height: `${height}px`,
                    background: isPast ? "#c63838" : "#e4e4e9",
                  }}
                />
              );
            })}
          </div>

          <label className="timing-scrubber-control">
            <span className="scrubber-label">
              <span>Timeline Scrubber</span>
              <strong>{time.toFixed(1)}s</strong>
            </span>
            <input
              type="range"
              min={0}
              max={7.9}
              step={0.1}
              value={time}
              aria-label="Preview caption timing"
              onChange={(event) => setTime(Number(event.target.value))}
            />
          </label>

          <div className="timing-word-grid">
            {words.map((word, index) => (
              <button
                key={index}
                type="button"
                className={`timing-word-chip ${active === index ? "is-active" : ""}`}
                onClick={() => setTime(index * 2)}
                aria-pressed={active === index}
              >
                <time>00:0{index * 2}</time>
                <strong>{word}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaptionStyleFeature() {
  const [style, setStyle] = useState<DemoStyle>("Bold");
  return (
    <div className="appearance-demo">
      <div className={`appearance-photo caption-look--${style.toLowerCase()}`}>
        <Image
          src="/media/landing/creator-outdoor.webp"
          alt="Creator with a customizable caption sample"
          fill
          sizes="(max-width: 768px) 80vw, 380px"
        />
        <p className="hero-demo-caption">
          <span>Make it</span>
          <span className="active-word">yours.</span>
        </p>
      </div>
      <div
        className="appearance-styles"
        role="group"
        aria-label="Try a caption style"
      >
        {demoStyles.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setStyle(name)}
            aria-pressed={style === name}
          >
            <span className={`style-tile--${name.toLowerCase()}`}>Aa</span>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
