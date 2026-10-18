"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, Layers, Music, Pause, Play, Redo2, Scissors, Search, Undo2, Video } from "lucide-react";
import { CaptionDemoStyles } from "./caption-demo-styles";
import { DEMO_SEGMENTS, STYLE_OPTIONS, TOTAL_DURATION, type DemoStyleId } from "../data/caption-demo-data";

export function CaptionDemo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(1.4);
  const [styleId, setStyleId] = useState<DemoStyleId>("yellow");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev + 0.1 >= TOTAL_DURATION ? 0 : Number((prev + 0.1).toFixed(1))));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeSegment = useMemo(
    () => DEMO_SEGMENTS.find((s) => currentTime >= s.start && currentTime < s.end) ?? DEMO_SEGMENTS[0],
    [currentTime],
  );

  const activeWordIndex = useMemo(() => {
    const elapsed = currentTime - activeSegment.start;
    const duration = activeSegment.end - activeSegment.start;
    const progress = Math.min(1, Math.max(0, elapsed / duration));
    return Math.min(activeSegment.words.length - 1, Math.max(0, Math.floor(progress * activeSegment.words.length)));
  }, [activeSegment, currentTime]);

  const currentStyle = useMemo(
    () => STYLE_OPTIONS.find((s) => s.id === styleId) ?? STYLE_OPTIONS[0],
    [styleId],
  );

  const playheadPercent = (currentTime / TOTAL_DURATION) * 100;

  return (
    <div className="hero-editor-frame" aria-label="EveryKaptions Studio Editor Showcase">
      <header className="hero-editor-header">
        <div className="header-left">
          <div className="window-dots" aria-hidden="true">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <div className="header-divider" />
          <div className="project-badge">
            <span className="app-logo-pill">ek</span>
            <span className="project-title">podcast_reel_final.mp4</span>
            <span className="status-saved"><span className="status-dot" /> Saved locally</span>
          </div>
        </div>

        <div className="header-center">
          <div className="history-pill" role="group" aria-label="Undo Redo">
            <button type="button" className="history-btn" title="Undo (Ctrl+Z)" aria-label="Undo"><Undo2 size={13} /></button>
            <span className="history-sep" />
            <button type="button" className="history-btn" title="Redo (Ctrl+Y)" aria-label="Redo"><Redo2 size={13} /></button>
          </div>
        </div>

        <div className="header-right">
          <div className="ratio-toggle-group" role="group" aria-label="Aspect Ratio">
            <button type="button" className={`ratio-btn ${aspectRatio === "16:9" ? "is-active" : ""}`} onClick={() => setAspectRatio("16:9")}>16:9</button>
            <button type="button" className={`ratio-btn ${aspectRatio === "9:16" ? "is-active" : ""}`} onClick={() => setAspectRatio("9:16")}>9:16</button>
          </div>
          <Link href="/studio" className="editor-export-btn">
            <Download size={13} />
            <span>Export Video</span>
          </Link>
        </div>
      </header>

      <div className="hero-editor-workspace">
        <aside className="editor-left-panel" aria-label="Captions transcript list">
          <div className="panel-title-bar">
            <div className="panel-title-meta">
              <Layers size={13} className="text-amber-500" />
              <strong>CAPTIONS</strong>
              <small>Review & sync</small>
            </div>
            <span className="lines-count-pill">3 lines</span>
          </div>

          <div className="panel-search-box">
            <Search size={11} className="search-icon" aria-hidden="true" />
            <input type="text" readOnly value="Search caption lines..." className="search-input" aria-label="Search captions" />
          </div>

          <div className="voice-sync-bar">
            <span className="sync-label">Voice Sync</span>
            <div className="sync-buttons">
              <span>-0.2s</span>
              <span>-0.1s</span>
              <span>+0.1s</span>
              <span>+0.2s</span>
            </div>
          </div>

          <div className="caption-lines-list">
            {DEMO_SEGMENTS.map((seg) => {
              const isCurrent = activeSegment.id === seg.id;
              return (
                <div key={seg.id} onClick={() => setCurrentTime(seg.start)} className={`caption-line-card ${isCurrent ? "is-active" : ""}`}>
                  <div className="line-card-top">
                    <span className="line-time-tag"><Play size={8} fill="currentColor" /> {seg.time}</span>
                    <span className="line-num">#{seg.id}</span>
                    <span className="line-tools">Split · Merge</span>
                  </div>
                  <p className="line-text">{seg.fullText}</p>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="editor-canvas-stage" aria-label="Video preview viewport">
          <div className={`canvas-viewport ${aspectRatio === "16:9" ? "canvas--widescreen" : "canvas--vertical"}`}>
            <Image
              src="/media/creator-tutorial.webp"
              alt="Creator editing podcast video with captions"
              fill
              sizes="(max-width: 768px) 100vw, 520px"
              className="canvas-video-media"
              priority
            />
            <div className="canvas-gradient-overlay" />
            <div className="canvas-header-pill">00:0{Math.floor(currentTime)}s / 00:09s</div>
            <div className="canvas-caption-container">
              <div className={`canvas-caption-box ${currentStyle.previewClass}`}>
                {activeSegment.words.map((word, idx) => (
                  <span key={idx} className={`transition-all duration-150 ${idx === activeWordIndex ? currentStyle.activeClass : "opacity-85"}`}>
                    {word}{" "}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`canvas-play-trigger ${isPlaying ? "is-playing" : "is-paused"}`}
              aria-label={isPlaying ? "Pause preview" : "Play preview"}
            >
              {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} className="ml-1 fill-white" />}
            </button>
          </div>
        </section>

        <CaptionDemoStyles
          styleId={styleId}
          onSelectStyle={(id) => setStyleId(id)}
        />
      </div>

      <footer className="hero-editor-timeline">
        <div className="timeline-action-bar">
          <div className="timeline-left-controls">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="timeline-play-btn"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={11} fill="white" /> : <Play size={11} className="ml-0.5 fill-white" />}
            </button>
            <div className="timeline-clock">
              <strong>00:0{Math.floor(currentTime)}.{(currentTime % 1).toFixed(1).slice(2)}</strong>
              <span>/ 00:09.0</span>
            </div>
          </div>
          <div className="timeline-tools">
            <span className="timeline-tool-btn"><Scissors size={11} /> Split</span>
            <span className="timeline-tool-btn">Merge next</span>
            <span className="timeline-tool-btn sync-pill">-0.1s SYNC +0.1s</span>
          </div>
        </div>

        <div className="timeline-tracks-area">
          <div className="timeline-track">
            <div className="track-header"><Video size={11} /><span>Video</span></div>
            <div className="track-lane video-lane">
              <div className="video-clip-block"><span>podcast_reel_final.mp4</span><small>9.0s</small></div>
            </div>
          </div>
          <div className="timeline-track">
            <div className="track-header"><Layers size={11} /><span>Captions</span></div>
            <div className="track-lane captions-lane">
              {DEMO_SEGMENTS.map((seg) => (
                <div
                  key={seg.id}
                  onClick={() => setCurrentTime(seg.start)}
                  style={{ left: `${(seg.start / TOTAL_DURATION) * 100}%`, width: `${((seg.end - seg.start) / TOTAL_DURATION) * 100 - 0.8}%` }}
                  className={`timeline-caption-block ${activeSegment.id === seg.id ? "is-active" : ""}`}
                >
                  <span className="block-duration">{(seg.end - seg.start).toFixed(1)}s</span>
                  <span className="block-text">{seg.fullText}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="timeline-track">
            <div className="track-header"><Music size={11} /><span>Voice</span></div>
            <div className="track-lane audio-lane">
              <div className="waveform-mock" aria-hidden="true" />
            </div>
          </div>
          <div className="timeline-needle" style={{ left: `${playheadPercent}%` }}>
            <div className="needle-head" />
            <div className="needle-line" />
          </div>
        </div>
      </footer>
    </div>
  );
}
