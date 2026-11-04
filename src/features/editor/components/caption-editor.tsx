"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, Merge, Pause, Play, Redo2, Scissors, Search, Trash2, Undo2, Volume2 } from "lucide-react";
import type { useCaptionEditor } from "../hooks/use-caption-editor";
import type { CaptionAppearance } from "../types/captions";
import { formatClockTime } from "../lib/captions";
import { drawCaptions } from "../lib/draw-captions";
import { renderAndExportVideo } from "../lib/export-video";
import { usePlanSummary } from "../store/plan-store";
import "./caption-editor.css";

const looks = [{ id: "yellow", label: "Word highlight" }, { id: "minimal", label: "Minimal" }, { id: "classic", label: "White box" }, { id: "dark", label: "Dark box" }, { id: "red_box", label: "Red box" }] as const;

export function CaptionEditor({ editor, onBack }: { editor: ReturnType<typeof useCaptionEditor>; onBack?: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rows = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("");
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
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => { if (video.current) setTime(video.current.currentTime); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, setTime]);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, mediaSize.width, mediaSize.height);
    drawCaptions(ctx, mediaSize.width, mediaSize.height, editor.segments, editor.currentTime, editor.styleId, appearance);
  }, [mediaSize, editor.segments, editor.currentTime, editor.styleId, appearance]);
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
      <fieldset disabled={exporting} className="ce-body">
        <div className="ce-workspace">
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
          <section className="ce-preview" aria-label="Video preview">
            <div className="ce-preview-label">Preview <span>Original video size · captions follow playback</span></div>
            <div className="ce-stage" ref={stage}>
              <div className="ce-video-frame" style={{ width: mediaSize.width * scale, height: mediaSize.height * scale }}>
                {audio && <div className="ce-audio"><Volume2 size={40} /><span>Audio caption preview</span></div>}
                <video ref={video} src={editor.mediaUrl} playsInline onClick={() => { if (!exporting) toggle(); }} onLoadedMetadata={event => { const node = event.currentTarget; if (node.videoWidth) setMediaSize({ width: node.videoWidth, height: node.videoHeight }); if (Number.isFinite(node.duration)) editor.setDuration(node.duration); }} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onSeeked={event => setTime(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} className={audio ? "ce-audio-media" : ""} />
                <canvas ref={canvas} width={mediaSize.width} height={mediaSize.height} aria-hidden="true" />
              </div>
            </div>
            <div className="ce-player"><button type="button" className="ce-play" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>{playing ? <Pause size={18} /> : <Play size={18} />}</button><span>{formatClockTime(editor.currentTime)} / {formatClockTime(duration)}</span><label className="ce-speed">Speed<select aria-label="Playback speed" defaultValue="1" onChange={event => { if (video.current) video.current.playbackRate = Number(event.target.value); }}>{[.5, .75, 1, 1.25, 1.5, 2].map(rate => <option key={rate} value={rate}>{rate}×</option>)}</select></label></div>
          </section>
          <aside className="ce-settings" aria-label="Caption appearance">
            <h2>Caption style</h2><p className="ce-muted">Adjust the look. Your video stays intact.</p>
            <div className="ce-looks">{looks.map(look => <button type="button" key={look.id} aria-pressed={editor.styleId === look.id} onClick={() => editor.setStyleId(look.id)}><span className={`ce-look-sample look-${look.id}`}>Your story.</span>{look.label}</button>)}</div>
            <label>Text size<select value={appearance.fontSize} onChange={event => setAppearance({ fontSize: event.target.value as CaptionAppearance["fontSize"] })}>{["sm", "md", "lg", "xl"].map((size, index) => <option key={size} value={size}>{["Small", "Medium", "Large", "Extra large"][index]}</option>)}</select></label>
            <label>Position <span>{appearance.position === "custom" ? `${appearance.customYPercent}%` : appearance.position}</span><input aria-label="Caption vertical position" type="range" min="5" max="95" value={appearance.position === "custom" ? appearance.customYPercent : appearance.position === "top" ? 14 : appearance.position === "center" ? 50 : 82} onChange={event => setAppearance({ position: "custom", customYPercent: Number(event.target.value) })} /></label>
            <label>Alignment<select value={appearance.textAlign} onChange={event => setAppearance({ textAlign: event.target.value as CaptionAppearance["textAlign"] })}>{["left", "center", "right"].map(value => <option key={value}>{value}</option>)}</select></label>
            <label>Letter case<select value={appearance.textTransform} onChange={event => setAppearance({ textTransform: event.target.value as CaptionAppearance["textTransform"] })}><option value="none">As written</option><option value="uppercase">UPPERCASE</option><option value="lowercase">lowercase</option></select></label>
            <label className="ce-color">Highlight color<input type="color" value={appearance.highlightHex} onChange={event => setAppearance({ highlightHex: event.target.value })} /></label>
          </aside>
        </div>
        <section className="ce-timeline" aria-label="Caption timeline">
          <div className="ce-timeline-tools"><strong>Caption timeline</strong><button type="button" disabled={!selected || selected.text.trim().split(/\s+/).length < 2 || editor.currentTime <= selected.start + .2 || editor.currentTime >= selected.end - .2} onClick={() => selected && editor.splitSegment(selected.id)}><Scissors size={14} />Split at playhead</button><button type="button" disabled={!selected || editor.segments.at(-1)?.id === selected.id} onClick={() => selected && editor.mergeWithNext(selected.id)}><Merge size={14} />Merge next</button><button type="button" disabled={!selected} onClick={() => selected && editor.deleteSegment(selected.id)}><Trash2 size={14} />Delete</button><span className="ce-sync-controls">All captions<button type="button" onClick={() => editor.nudgeTiming(-.1)}>−0.1s</button><button type="button" onClick={() => editor.nudgeTiming(.1)}>+0.1s</button></span></div>
          <input className="ce-scrubber" aria-label="Seek video" type="range" min="0" max={duration} step="0.01" value={Math.min(editor.currentTime, duration)} onChange={event => seek(Number(event.target.value))} />
          <div className="ce-ruler">{Array.from({ length: 6 }, (_, index) => <span key={index}>{formatClockTime(duration * index / 5)}</span>)}</div>
          <div className="ce-tracks"><div className="ce-track"><span className="ce-playhead" style={{ left: `${editor.currentTime / duration * 100}%` }} />{editor.segments.map(segment => <button key={segment.id} type="button" title={`${segment.text} · ${segment.start.toFixed(2)}–${segment.end.toFixed(2)}s`} className={selected?.id === segment.id ? "is-selected" : ""} style={{ left: `${segment.start / duration * 100}%`, width: `${Math.max(.2, (segment.end - segment.start) / duration * 100)}%` }} onClick={() => { editor.setSelectedSegmentId(segment.id); seek(segment.start); }}>{segment.text}</button>)}</div></div>
        </section>
      </fieldset>
      {exporting && <div className="ce-export-progress" role="status">Rendering captioned video… {progress}%<progress max="100" value={progress} /></div>}
    </main>
  );
}
