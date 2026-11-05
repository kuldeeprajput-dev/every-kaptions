"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AudioLines, CalendarDays, CheckSquare, Copy, Info, MoreVertical, Pencil, Play, Trash2, X } from "lucide-react";
import { formatClockTime } from "../lib/captions";
import type { StoredProject } from "../lib/media-db";

type Props = {
  project: StoredProject;
  onDelete: (id: string) => Promise<void>;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (project: StoredProject) => Promise<void>;
};

export function StoredReelCard({ project, onDelete, selected, onSelect, onUpdate }: Props) {
  const projectHref = project.status === "idle" ? `/studio/${project.id}` : `/editor/${project.id}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(project.name);
  const [showInfo, setShowInfo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = infoRef.current;
    if (!dialog) return;
    if (showInfo && !dialog.open) dialog.showModal();
    else if (!showInfo && dialog.open) dialog.close();
  }, [showInfo]);
  useEffect(() => {
    if (!menuOpen) return;
    const outside = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const positionMenu = () => {
      const root = menuRef.current;
      const menu = root?.querySelector<HTMLElement>(".studio-card-menu");
      if (!root || !menu) return;
      if (!window.matchMedia("(max-width: 767px)").matches) {
        menu.removeAttribute("style");
        return;
      }
      const trigger = root.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const width = Math.min(190, window.innerWidth - 24);
      menu.style.maxHeight = `${viewportHeight - 24}px`;
      const height = Math.min(menu.scrollHeight + 2, viewportHeight - 24);
      const top = trigger.bottom + 6 + height <= viewportHeight - 12
        ? trigger.bottom + 6 : trigger.top - height - 6;
      Object.assign(menu.style, {
        position: "fixed", width: `${width}px`, right: "auto",
        left: `${Math.max(12, Math.min(trigger.right - width, window.innerWidth - width - 12))}px`,
        top: `${Math.max(12, top)}px`, overflowY: "auto",
      });
    };
    positionMenu();
    window.addEventListener("resize", positionMenu);
    window.addEventListener("scroll", positionMenu, true);
    return () => {
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu, true);
    };
  }, [menuOpen]);
  const runAction = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true); setError(""); setMenuOpen(false);
    try { await action(); } catch { setError("The project could not be updated. Please try again."); }
    finally { setBusy(false); }
  };
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !project.fileBlob) return;
    const url = URL.createObjectURL(project.fileBlob);
    video.src = url;
    video.load();
    return () => URL.revokeObjectURL(url);
  }, [project.fileBlob]);

  return (
    <article className={`studio-project-card ${selected ? "is-selected" : ""}`}>
      <label className="studio-card-select"><input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Select ${project.name}`} /></label>
      <Link href={projectHref} className="studio-project-preview" aria-label={`Open project ${project.name}`}>
        {project.fileType?.startsWith("audio/") ? (
          <div className="studio-audio-preview"><AudioLines size={36} strokeWidth={1.4} aria-hidden="true" /><span>Audio project</span></div>
        ) : (
          <video ref={videoRef} muted playsInline preload="metadata" onLoadedMetadata={event => {
            const video = event.currentTarget;
            if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Math.min(.1, video.duration / 2);
          }} className="h-full w-full object-contain" />
        )}
        <span className="studio-preview-play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>
        <span className="studio-project-duration">{project.status === "idle" ? "Draft" : formatClockTime(project.duration || 0)}</span>
      </Link>
      <div className="studio-project-details">
        {renaming ? <form className="studio-project-rename" onSubmit={event => {
          event.preventDefault();
          if (!name.trim()) return;
          void runAction(async () => { await onUpdate({ ...project, name: name.trim(), updatedAt: Date.now() }); setRenaming(false); });
        }}><input aria-label="Project name" value={name} onChange={event => setName(event.target.value)} onKeyDown={event => { if (event.key === "Escape") setRenaming(false); }} autoFocus maxLength={180} required /><div><button type="submit" disabled={busy}>Save</button><button type="button" onClick={() => setRenaming(false)}>Cancel</button></div></form> : <Link href={projectHref} className="min-w-0 flex-1">
          <h3 title={project.name}>{project.name}</h3>
          <p className="studio-created-date"><CalendarDays size={12} aria-hidden="true" />Created {new Date(project.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
        </Link>}
        <div className="studio-card-menu-root" ref={menuRef}>
          <button type="button" disabled={busy} onClick={() => setMenuOpen(open => !open)} className="studio-project-delete" aria-label={`Actions for ${project.name}`} aria-expanded={menuOpen}><MoreVertical size={17} aria-hidden="true" /></button>
          {menuOpen && <div className="studio-card-menu">
            <button type="button" onClick={() => { onSelect(); setMenuOpen(false); }}><CheckSquare size={15} />{selected ? "Deselect" : "Select"}</button>
            <button type="button" onClick={() => { setName(project.name); setRenaming(true); setMenuOpen(false); }}><Pencil size={15} />Rename</button>
            <button type="button" onClick={() => void runAction(async () => {
              const now = Date.now();
              await onUpdate({ ...project, id: crypto.randomUUID(), name: `${project.name} (copy)`, createdAt: now, updatedAt: now });
            })}><Copy size={15} />Duplicate</button>
            <button type="button" onClick={() => { setShowInfo(open => !open); setMenuOpen(false); }}><Info size={15} />Info</button>
            <button type="button" className="is-destructive" onClick={() => void runAction(() => onDelete(project.id))}><Trash2 size={15} />Delete</button>
          </div>}
        </div>
      </div>
      <dialog ref={infoRef} className="studio-project-info-dialog" aria-labelledby={`project-info-${project.id}`} onCancel={() => setShowInfo(false)} onClose={() => setShowInfo(false)} onClick={event => { if (event.target === event.currentTarget) setShowInfo(false); }}>
        <section>
          <header><h2 id={`project-info-${project.id}`}>Project info</h2><button type="button" onClick={() => setShowInfo(false)} aria-label="Close project info"><X size={18} aria-hidden="true" /></button></header>
          <p className="studio-info-name">{project.name}</p>
          <dl>
            <dt>Status</dt><dd>{project.status === "idle" ? "Draft" : "Ready to edit"}</dd>
            <dt>File</dt><dd>{project.fileType || "Media"} · {(project.fileSize / 1048576).toFixed(1)} MB</dd>
            <dt>Duration</dt><dd>{project.duration > 0 ? formatClockTime(project.duration) : "Not available yet"}</dd>
            <dt>Captions</dt><dd>{project.segments.length} lines · {project.language}</dd>
            <dt>Created</dt><dd>{new Date(project.createdAt).toLocaleString()}</dd>
            <dt>Modified</dt><dd>{new Date(project.updatedAt).toLocaleString()}</dd>
          </dl>
        </section>
      </dialog>
      {error && <p className="studio-card-error" role="alert">{error}</p>}
    </article>
  );
}
