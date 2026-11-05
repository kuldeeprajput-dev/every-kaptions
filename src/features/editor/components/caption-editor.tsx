"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Download, Merge, Pause, Play, Redo2, Scissors, Search, Trash2, Undo2, Volume2 } from "lucide-react";
import type { useCaptionEditor } from "../hooks/use-caption-editor";
import type { CaptionAppearance } from "../types/captions";
import { formatClockTime } from "../lib/captions";
import { drawCaptions } from "../lib/draw-captions";
import { observeVideoFrames } from "../lib/video-frames";
import { renderAndExportVideo } from "../lib/export-video";
import { usePlanSummary } from "../store/plan-store";
import "./caption-editor.css";
import { PlaybackSpeed } from "./playback-speed";
import { EditorColorPicker, EditorSelect } from "./editor-appearance-controls";
import { originalCaptionPresets, type CaptionPreset } from "../data/caption-presets";

function presetSampleStyle(preset: CaptionPreset): CSSProperties {
  return {
    color: preset.active === "text" ? "#c63838" : preset.color,
    background: preset.background ?? "transparent",
    fontWeight: preset.weight ?? 700,
    fontStyle: preset.italic ? "italic" : "normal",
    fontFamily: preset.family === "serif" ? "Georgia, serif" : preset.family === "monospace" ? "monospace" : "inherit",
    borderRadius: `${preset.radius ?? .18}em`,
    border: preset.border ? `1px solid ${preset.border}` : "none",
    WebkitTextStroke: preset.outline ? `${preset.outline * 10}px #18181b` : undefined,
    paintOrder: "stroke fill",
    textShadow: preset.shadow ? "0 1px 3px #18181b" : undefined,
  };
}

type Panel = "transcript" | "settings" | "timeline";
const defaultPanelSizes = { transcript: 360, settings: 360, timeline: 330 };
const panelLayoutKey = "everykaptions.editor-panel-layout.v1";

function PanelDivider({ panel, value, disabled, onResize, onReset, onResizeCorner, onResetCorner }: {
  panel: Panel; value: number; disabled: boolean;
  onResize: (delta: number) => void; onReset: () => void;
  onResizeCorner?: (x: number, y: number) => void; onResetCorner?: () => void;
}) {
  const previous = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const horizontal = panel === "timeline";
  const label = `Resize ${panel === "transcript" ? "captions panel" : panel === "settings" ? "caption style panel" : "timeline"}`;
  const divider = <div
    className={`ce-divider ${horizontal ? "ce-divider-horizontal" : "ce-divider-vertical"}`}
    role="separator" tabIndex={disabled ? -1 : 0} aria-label={label}
    aria-orientation={horizontal ? "horizontal" : "vertical"}
    aria-valuenow={Math.round(value)} aria-valuemin={horizontal ? 160 : panel === "transcript" ? 320 : 360} aria-valuemax={420}
    aria-disabled={disabled} data-resizing={dragging}
    title={`${label} · drag or use arrow keys · double-click to reset`}
    onDoubleClick={() => { if (!disabled) onReset(); }}
    onPointerDown={event => {
      if (disabled || event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.focus();
      event.currentTarget.setPointerCapture(event.pointerId);
      previous.current = horizontal ? event.clientY : event.clientX;
      setDragging(true);
    }}
    onPointerMove={event => {
      if (disabled || previous.current === null) return;
      const position = horizontal ? event.clientY : event.clientX;
      onResize(position - previous.current);
      previous.current = position;
    }}
    onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
    onLostPointerCapture={() => { previous.current = null; setDragging(false); }}
    onKeyDown={event => {
      if (disabled) return;
      const decrease = horizontal ? "ArrowUp" : "ArrowLeft";
      const increase = horizontal ? "ArrowDown" : "ArrowRight";
      if (event.key === decrease || event.key === increase) {
        event.preventDefault();
        onResize((event.key === increase ? 1 : -1) * (event.shiftKey ? 30 : 10));
      } else if (event.key === "Enter") { event.preventDefault(); onReset(); }
    }}
  />;
  return horizontal ? divider : <div className="ce-divider-column">{divider}{onResizeCorner && <PreviewCorner disabled={disabled} onResize={onResizeCorner} onReset={onResetCorner ?? onReset} />}</div>;
}

function PreviewCorner({ disabled, onResize, onReset }: {
  disabled: boolean; onResize: (x: number, y: number) => void; onReset: () => void;
}) {
  const previous = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  return <button type="button" className="ce-preview-corner" disabled={disabled}
    aria-label="Resize preview width and height" title="Drag to resize preview width and height · double-click to reset"
    data-resizing={dragging} onDoubleClick={onReset}
    onPointerDown={event => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.focus();
      event.currentTarget.setPointerCapture(event.pointerId);
      previous.current = { x: event.clientX, y: event.clientY }; setDragging(true);
    }}
    onPointerMove={event => {
      if (!previous.current || disabled) return;
      onResize(event.clientX - previous.current.x, event.clientY - previous.current.y);
      previous.current = { x: event.clientX, y: event.clientY };
    }}
    onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
    onLostPointerCapture={() => { previous.current = null; setDragging(false); }}
    onKeyDown={event => {
      const step = event.shiftKey ? 30 : 10;
      const offsets: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (offsets[event.key]) { event.preventDefault(); onResize(...offsets[event.key]); }
    }}
  />;
}

export function CaptionEditor({ editor, onBack }: { editor: ReturnType<typeof useCaptionEditor>; onBack?: () => void }) {
  const workspace = useRef<HTMLDivElement>(null);
  const timeline = useRef<HTMLElement>(null);
  const [panelSizes, setPanelSizes] = useState<Partial<Record<Panel, number>>>(defaultPanelSizes);
  const [layoutReady, setLayoutReady] = useState(false);
  useEffect(() => {
    const sizes = { ...defaultPanelSizes };
    try {
      const saved = JSON.parse(localStorage.getItem(panelLayoutKey) || "null");
      for (const panel of Object.keys(sizes) as Panel[]) {
        const value = saved?.[panel];
        if (typeof value === "number" && Number.isFinite(value)) {
          sizes[panel] = Math.max(panel === "timeline" ? 160 : panel === "transcript" ? 320 : 360, Math.min(420, value));
        }
      }
    } catch { /* Use the default layout when browser storage is unavailable. */ }
    const frame = requestAnimationFrame(() => { setPanelSizes(sizes); setLayoutReady(true); });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!layoutReady) return;
    const save = () => {
      try { localStorage.setItem(panelLayoutKey, JSON.stringify(panelSizes)); }
      catch { /* Resizing remains available when browser storage is full. */ }
    };
    const timer = setTimeout(save, 150);
    window.addEventListener("pagehide", save);
    return () => { clearTimeout(timer); window.removeEventListener("pagehide", save); };
  }, [layoutReady, panelSizes]);
  const resizePanel = (panel: Panel, delta: number) => {
    const node = workspace.current;
    if (!node) return;
    const left = node.querySelector<HTMLElement>(".ce-transcript")?.getBoundingClientRect().width || 360;
    const right = node.querySelector<HTMLElement>(".ce-settings")?.getBoundingClientRect().width || 360;
    let next: number;
    if (panel === "timeline") {
      const height = timeline.current?.getBoundingClientRect().height || 160;
      const max = Math.max(160, Math.min(420, node.clientHeight + height - 232));
      next = Math.max(160, Math.min(max, height - delta));
    } else {
      const min = panel === "transcript" ? 320 : 360;
      const max = Math.max(min, Math.min(420, node.clientWidth - (panel === "transcript" ? right : left) - 264));
      next = Math.max(min, Math.min(max, (panel === "transcript" ? left : right) + (panel === "transcript" ? delta : -delta)));
    }
    setPanelSizes(previous => ({ ...previous, [panel]: next }));
  };
  const resetPanel = (panel: Panel) => setPanelSizes(previous => ({ ...previous, [panel]: undefined }));
  const layoutStyle = {
    "--ce-transcript-width": panelSizes.transcript === undefined ? undefined : `${panelSizes.transcript}px`,
    "--ce-settings-width": panelSizes.settings === undefined ? undefined : `${panelSizes.settings}px`,
    "--ce-timeline-height": panelSizes.timeline === undefined ? undefined : `${panelSizes.timeline}px`,
  } as CSSProperties;
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rows = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [query, setQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState<"all" | "static" | "animated">("all");
  const [follow, setFollow] = useState(true);
  const [mediaSize, setMediaSize] = useState({ width: 1280, height: 720 });
  const [stageSize, setStageSize] = useState({ width: 800, height: 500 });
  const [exporting, setExporting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const plan = usePlanSummary();
  const appearance = editor.captionAppearance;
  const setAppearance = (patch: Partial<CaptionAppearance>) => editor.setCaptionAppearance(previous => ({ ...previous, ...patch }));
  const duration = Math.max(.01, editor.duration);
  const active = editor.segments.find(segment => editor.currentTime >= segment.start && editor.currentTime < segment.end);
  const selected = editor.segments.find(segment => segment.id === editor.selectedSegmentId);
  const audio = editor.file?.type.startsWith("audio/");
  const scale = Math.max(.01, Math.min((stageSize.width - 40) / mediaSize.width, (stageSize.height - 40) / mediaSize.height));
  const setTime = editor.setCurrentTime;

  const seek = useCallback((time: number) => {
    const next = Math.max(0, Math.min(duration, time));
    if (video.current) video.current.currentTime = next;
    setTime(next);
  }, [duration, setTime]);
  const toggle = useCallback(() => {
    if (!video.current) return;
    if (video.current.paused) void video.current.play().catch(() => setError("Playback could not start. Try again."));
    else video.current.pause();
  }, []);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new ResizeObserver(entries => {
      const bounds = entries[0].contentRect;
      setStageSize({ width: bounds.width, height: bounds.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const paintCaptions = useCallback((time: number) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, mediaSize.width, mediaSize.height);
    drawCaptions(ctx, mediaSize.width, mediaSize.height, editor.segments, time, editor.styleId, appearance);
  }, [mediaSize, editor.segments, editor.styleId, appearance]);
  useEffect(() => {
    if (!playing || !video.current) return;
    return observeVideoFrames(video.current, time => { paintCaptions(time); setTime(time); });
  }, [playing, paintCaptions, setTime]);
  useEffect(() => {
    if (!playing) paintCaptions(editor.currentTime);
  }, [playing, paintCaptions, editor.currentTime]);
  useEffect(() => {
    if (follow && playing && active) rows.current?.querySelector(`[data-caption-id="${CSS.escape(active.id)}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [follow, playing, active]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (exporting || (event.target instanceof Element && event.target.closest("input,textarea,select,button,[contenteditable=true]"))) return;
      if (event.code === "Space") { event.preventDefault(); toggle(); }
      if (event.code === "ArrowLeft") { event.preventDefault(); seek(editor.currentTime - .1); }
      if (event.code === "ArrowRight") { event.preventDefault(); seek(editor.currentTime + .1); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") { event.preventDefault(); if (event.shiftKey) editor.redo(); else editor.undo(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [editor, seek, toggle, exporting]);

  const exportVideo = async () => {
    if (!video.current || exporting) return;
    if (!plan.canExport) { setError("Your video export allowance is used. Choose a plan to export more videos."); return; }
    setExporting(true); setProgress(0); setError(""); setExportOpen(false);
    video.current.pause();
    try {
      const success = await renderAndExportVideo({ videoElement: video.current, segments: editor.segments, styleId: editor.styleId, ...appearance, filename: editor.file?.name, onProgress: setProgress });
      if (success) plan.recordExport();
      else setError("The video could not be exported.");
    } catch { setError("Video export failed. Your export allowance was not used."); }
    finally { setExporting(false); }
  };

  return (
    <main className="ce-editor">
      <header className="ce-header">
        <button onClick={onBack} type="button" disabled={exporting} aria-label="Back to projects"><ArrowLeft size={18} /></button>
        <span className="ce-filename" title={editor.file?.name}>{editor.file?.name || "Caption editor"}</span>
        <div className="ce-history"><button type="button" onClick={editor.undo} disabled={!editor.canUndo || exporting} title="Undo" aria-label="Undo"><Undo2 size={17} /></button><button type="button" onClick={editor.redo} disabled={!editor.canRedo || exporting} title="Redo" aria-label="Redo"><Redo2 size={17} /></button></div>
        <div className="ce-export">
          <button type="button" className="ce-primary" onClick={() => setExportOpen(open => !open)} disabled={exporting || !editor.segments.length} aria-expanded={exportOpen}><Download size={15} />{exporting ? `Exporting ${progress}%` : "Export"}</button>
          {exportOpen && <div className="ce-export-menu"><button type="button" disabled={audio} onClick={() => void exportVideo()}>Captioned video</button>{(["srt", "vtt", "txt"] as const).map(format => <button type="button" key={format} onClick={() => { editor.downloadCaptions(format); setExportOpen(false); }}>{format.toUpperCase()} subtitles</button>)}<button type="button" onClick={() => setExportOpen(false)}>Close</button></div>}
        </div>
      </header>
      {(error || editor.error) && <p className="ce-error" role="alert">{error || editor.error}</p>}
      <fieldset disabled={exporting} className="ce-body" style={layoutStyle}>
        <div className="ce-workspace" ref={workspace}>
          <section className="ce-transcript" aria-label="Edit captions">
            <div className="ce-panel-title"><h1>Captions <span>{editor.segments.length}</span></h1><label><input type="checkbox" checked={follow} onChange={event => setFollow(event.target.checked)} />Follow playback</label></div>
            <div className="ce-search"><Search size={14} /><input aria-label="Search captions" placeholder="Search captions…" value={query} onChange={event => setQuery(event.target.value)} /></div>
            <div className="ce-caption-rows" ref={rows}>
              {editor.segments.filter(segment => segment.text.toLowerCase().includes(query.toLowerCase())).map((segment, index) => <article key={segment.id} data-caption-id={segment.id} className={`ce-caption-row ${selected?.id === segment.id ? "is-selected" : ""} ${active?.id === segment.id ? "is-speaking" : ""}`}>
                <button type="button" className="ce-caption-jump" onClick={() => { editor.setSelectedSegmentId(segment.id); seek(segment.start); }}><Play size={11} />{formatClockTime(segment.start)}<span>#{index + 1}</span></button>
                <textarea aria-label={`Caption ${index + 1}`} value={segment.text} onFocus={() => editor.setSelectedSegmentId(segment.id)} onChange={event => editor.updateSegment(segment.id, event.target.value)} rows={Math.max(2, Math.ceil(segment.text.length / 34))} />
                <div className="ce-times">{(["start", "end"] as const).map(bound => <label key={bound}>{bound}<input key={`${segment.id}-${segment[bound]}`} type="number" step="0.05" min={bound === "start" ? 0 : segment.start + .2} max={bound === "start" ? Math.max(0, segment.end - .2) : duration} defaultValue={segment[bound].toFixed(2)} onFocus={() => editor.setSelectedSegmentId(segment.id)} onBlur={event => {
                  const value = Number(event.target.value);
                  if (!event.target.value || !Number.isFinite(value)) { event.target.value = segment[bound].toFixed(2); return; }
                  const start = bound === "start" ? Math.max(0, Math.min(segment.end - .2, value)) : segment.start;
                  const end = bound === "end" ? Math.max(start + .2, Math.min(duration, value)) : segment.end;
                  editor.updateSegmentTiming(segment.id, start, end);
                }} /></label>)}</div>
              </article>)}
              {!editor.segments.length && <p className="ce-muted">No captions in this project.</p>}
              {query && !editor.segments.some(segment => segment.text.toLowerCase().includes(query.toLowerCase())) && <p className="ce-muted">No captions match your search.</p>}
            </div>
          </section>
          <PanelDivider panel="transcript" value={panelSizes.transcript ?? defaultPanelSizes.transcript} disabled={exporting} onResize={delta => resizePanel("transcript", delta)} onReset={() => resetPanel("transcript")} onResetCorner={() => { resetPanel("transcript"); resetPanel("timeline"); }} onResizeCorner={(x, y) => { resizePanel("transcript", x); resizePanel("timeline", y); }} />
          <section className="ce-preview" aria-label="Video preview">
            <div className="ce-stage" ref={stage}>
              <div className="ce-video-frame" style={{ width: mediaSize.width * scale, height: mediaSize.height * scale }}>
                {audio && <div className="ce-audio"><Volume2 size={40} /><span>Audio caption preview</span></div>}
                <video ref={video} src={editor.mediaUrl} playsInline onClick={() => { if (!exporting) toggle(); }} onLoadedMetadata={event => { const node = event.currentTarget; if (node.videoWidth) setMediaSize({ width: node.videoWidth, height: node.videoHeight }); if (Number.isFinite(node.duration)) editor.setDuration(node.duration); }} onTimeUpdate={event => { if (event.currentTarget.paused || audio) setTime(event.currentTarget.currentTime); }} onSeeked={event => setTime(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} className={audio ? "ce-audio-media" : ""} />
                <canvas ref={canvas} width={mediaSize.width} height={mediaSize.height} aria-hidden="true" />
              </div>
            </div>
          </section>
          <PanelDivider panel="settings" value={panelSizes.settings ?? defaultPanelSizes.settings} disabled={exporting} onResize={delta => resizePanel("settings", delta)} onReset={() => resetPanel("settings")} onResetCorner={() => { resetPanel("settings"); resetPanel("timeline"); }} onResizeCorner={(x, y) => { resizePanel("settings", x); resizePanel("timeline", y); }} />
          <aside className="ce-settings" aria-label="Caption appearance">
            <h2>Caption style</h2><p className="ce-muted">Adjust the look. Your video stays intact.</p>
            <p className="ce-looks-note">{originalCaptionPresets.length} styles · Scroll to explore</p>
            <div className="ce-style-filters" role="group" aria-label="Filter caption styles">{(["all", "static", "animated"] as const).map(filter => <button type="button" key={filter} aria-pressed={styleFilter === filter} onClick={() => setStyleFilter(filter)}>{filter === "all" ? "All" : filter === "static" ? "Static" : "Animated"}</button>)}</div>
            <div className="ce-looks" role="group" aria-label="Original caption styles">{originalCaptionPresets.filter(look => styleFilter === "all" || (styleFilter === "animated" ? "animation" in look : !("animation" in look))).map(look => <button type="button" data-caption-animation={"animation" in look ? look.animation : undefined} key={look.id} aria-pressed={editor.styleId === look.id} onClick={() => editor.setStyleId(look.id)}><span className="ce-look-sample" style={presetSampleStyle(look)}>{"active" in look && look.active === "box" ? <>Your <mark className="ce-word-sample">story.</mark></> : "active" in look && look.active === "underline" ? <>Your <u className="ce-underline-sample">story.</u></> : "Your story."}</span><span className="ce-preset-name">{look.label}{"animation" in look && <small>Animated</small>}</span></button>)}</div>
            <EditorSelect label="Text size" value={appearance.fontSize} onChange={value => setAppearance({ fontSize: value as CaptionAppearance["fontSize"] })} options={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }, { value: "xl", label: "Extra large" }]} />
            <label>Position <span>{appearance.position === "custom" ? `${appearance.customYPercent}%` : appearance.position}</span><input aria-label="Caption vertical position" type="range" min="5" max="95" value={appearance.position === "custom" ? appearance.customYPercent : appearance.position === "top" ? 14 : appearance.position === "center" ? 50 : 82} onChange={event => setAppearance({ position: "custom", customYPercent: Number(event.target.value) })} /></label>
            <EditorSelect label="Alignment" value={appearance.textAlign} onChange={value => setAppearance({ textAlign: value as CaptionAppearance["textAlign"] })} options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]} />
            <EditorSelect label="Letter case" value={appearance.textTransform} onChange={value => setAppearance({ textTransform: value as CaptionAppearance["textTransform"] })} options={[{ value: "none", label: "As written" }, { value: "uppercase", label: "UPPERCASE" }, { value: "lowercase", label: "lowercase" }]} />
            <EditorColorPicker value={appearance.highlightHex} onChange={highlightHex => setAppearance({ highlightHex })} />
          </aside>
        </div>
        <PanelDivider panel="timeline" value={panelSizes.timeline ?? defaultPanelSizes.timeline} disabled={exporting} onResize={delta => resizePanel("timeline", delta)} onReset={() => resetPanel("timeline")} />
        <section className="ce-timeline" ref={timeline} aria-label="Caption timeline">
          <div className="ce-timeline-tools"><strong>Caption timeline</strong><div className="ce-player"><span>{formatClockTime(editor.currentTime)} / {formatClockTime(duration)}</span><button type="button" className="ce-play" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>{playing ? <Pause size={18} /> : <Play size={18} />}</button><PlaybackSpeed value={playbackRate} onChange={rate => { setPlaybackRate(rate); if (video.current) video.current.playbackRate = rate; }} /></div><div className="ce-timeline-actions"><button type="button" disabled={!selected || selected.text.trim().split(/\s+/).length < 2 || editor.currentTime <= selected.start + .2 || editor.currentTime >= selected.end - .2} onClick={() => selected && editor.splitSegment(selected.id)}><Scissors size={14} />Split at playhead</button><button type="button" disabled={!selected || editor.segments.at(-1)?.id === selected.id} onClick={() => selected && editor.mergeWithNext(selected.id)}><Merge size={14} />Merge next</button><button type="button" disabled={!selected} onClick={() => selected && editor.deleteSegment(selected.id)}><Trash2 size={14} />Delete</button><span className="ce-sync-controls">All captions<button type="button" onClick={() => editor.nudgeTiming(-.1)}>−0.1s</button><button type="button" onClick={() => editor.nudgeTiming(.1)}>+0.1s</button></span></div></div>
          <input className="ce-scrubber" aria-label="Seek video" type="range" min="0" max={duration} step="0.01" value={Math.min(editor.currentTime, duration)} onChange={event => seek(Number(event.target.value))} />
          <div className="ce-ruler">{Array.from({ length: 6 }, (_, index) => <span key={index}>{formatClockTime(duration * index / 5)}</span>)}</div>
          <div className="ce-tracks"><div className="ce-track"><span className="ce-playhead" style={{ left: `${editor.currentTime / duration * 100}%` }} />{editor.segments.map(segment => <button key={segment.id} type="button" title={`${segment.text} · ${segment.start.toFixed(2)}–${segment.end.toFixed(2)}s`} className={selected?.id === segment.id ? "is-selected" : ""} style={{ left: `${segment.start / duration * 100}%`, width: `${Math.max(.2, (segment.end - segment.start) / duration * 100)}%` }} onClick={() => { editor.setSelectedSegmentId(segment.id); seek(segment.start); }}>{segment.text}</button>)}</div></div>
        </section>
      </fieldset>
      {exporting && <div className="ce-export-progress" role="status">Rendering captioned video… {progress}%<progress max="100" value={progress} /></div>}
    </main>
  );
}
