"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronRight, Clapperboard, Copy, LayoutGrid, List, Search, Trash2, X } from "lucide-react";
import { CustomSelect } from "@/shared/components/custom-select";
import { type StoredProject } from "../lib/media-db";
import { usePlanSummary } from "../store/plan-store";
import { AccountMenu } from "./account-menu";
import { StoredReelCard } from "./stored-reel-card";

interface EditorProjectGridProps {
  projects: StoredProject[];
  onDeleteProject: (id: string) => Promise<void>;
  onUpdateProject: (project: StoredProject) => Promise<void>;
  onUpload: () => void;
}

type SortOption = "created" | "modified" | "name" | "duration";
const sortOptions = [
  { value: "created", label: "Created" },
  { value: "modified", label: "Modified" },
  { value: "name", label: "Name" },
  { value: "duration", label: "Duration" },
];

export function EditorProjectGrid({ projects, onDeleteProject, onUpdateProject, onUpload }: EditorProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("created");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [accountOpen, setAccountOpen] = useState(false);
  const plan = usePlanSummary();
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [selectionError, setSelectionError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const toggleSelection = (id: string) => setSelection(previous => {
    const next = new Set(previous);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const reverseSortLabel = sortBy === "name"
    ? sortDirection === "asc" ? "Sort Z to A" : "Sort A to Z"
    : sortBy === "duration"
      ? sortDirection === "asc" ? "Sort longest first" : "Sort shortest first"
      : sortDirection === "asc" ? "Sort newest first" : "Sort oldest first";

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return projects.filter(project => project.name.toLowerCase().includes(query)).sort((a, b) => {
      const comparison = sortBy === "name" ? a.name.localeCompare(b.name)
        : sortBy === "duration" ? (a.duration || 0) - (b.duration || 0)
        : sortBy === "modified" ? a.updatedAt - b.updatedAt
        : a.createdAt - b.createdAt;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [projects, searchQuery, sortBy, sortDirection]);

  const selectedIds = projects.filter(project => selection.has(project.id)).map(project => project.id);
  const allSelected = filteredProjects.length > 0 && filteredProjects.every(project => selection.has(project.id));
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = !allSelected && filteredProjects.some(project => selection.has(project.id));
  }, [allSelected, filteredProjects, selection]);

  const libraryControls = <>
          <div className="compact-view-toggle" role="group" aria-label="Project layout">
            <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><LayoutGrid size={17} aria-hidden="true" /></button>
            <button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={18} aria-hidden="true" /></button>
          </div>
          {selectedIds.length > 0 && (
            <div className="compact-selection-actions">
              <button type="button" aria-label="Duplicate selected projects" title="Duplicate selected projects" disabled={!selectedIds.length || deleting} onClick={async () => {
                setDeleting(true); setSelectionError("");
                try {
                  await Promise.all(projects.filter(project => selection.has(project.id)).map(project => {
                    const now = Date.now();
                    return onUpdateProject({ ...project, id: crypto.randomUUID(), name: `${project.name} (copy)`, createdAt: now, updatedAt: now });
                  }));
                } catch { setSelectionError("Some projects could not be duplicated. Please try again."); }
                finally { setDeleting(false); }
              }}><Copy size={16} aria-hidden="true" /></button>
              <button type="button" aria-label="Delete selected projects" title="Delete selected projects" disabled={!selectedIds.length || deleting} onClick={async () => {
                setDeleting(true); setSelectionError("");
                try { await Promise.all(selectedIds.map(onDeleteProject)); setSelection(new Set()); }
                catch { setSelectionError("Some projects could not be deleted. Please try again."); }
                finally { setDeleting(false); }
              }}><Trash2 size={16} aria-hidden="true" /></button>
            </div>
          )}
  </>;

  return (
    <>
      <header className="compact-studio-header">
        <div className="compact-studio-navigation">
          <nav aria-label="Breadcrumb" className="compact-breadcrumb">
            <Link href="/">Home</Link><ChevronRight size={15} aria-hidden="true" /><span aria-current="page">All projects</span>
          </nav>
          <div className="compact-desktop-controls">{libraryControls}</div>
        </div>
        <div className="compact-studio-actions">
          <div className="studio-project-search">
            <input type="text" role="searchbox" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search…" aria-label="Search projects" className="studio-search-input" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded text-[#85858f] hover:text-[#18181b]"><X size={14} aria-hidden="true" /></button>}
          </div>
          <AccountMenu open={accountOpen} onToggle={() => setAccountOpen(open => !open)} />
          <button type="button" onClick={onUpload} className="studio-new-project"><span className="md:hidden">New</span><span className="hidden md:inline">New project</span></button>
        </div>
      </header>

      <section className="compact-studio-body" aria-label="Your projects">
        <div className="compact-library-toolbar">
          <div className="compact-library-summary" aria-live="polite">
            <label className="compact-select-all"><input ref={selectAllRef} type="checkbox" checked={allSelected} disabled={!filteredProjects.length} onChange={() => setSelection(previous => {
              const next = new Set(previous);
              filteredProjects.forEach(project => { if (allSelected) next.delete(project.id); else next.add(project.id); });
              return next;
            })} /><span>{selectedIds.length ? `${selectedIds.length} selected` : "Select all"}</span></label>
            <div className="compact-sort">
              <CustomSelect label="Sort projects by" value={sortBy} onChange={value => {
                setSortBy(value as SortOption);
                setSortDirection(value === "name" ? "asc" : "desc");
              }} options={sortOptions} />
              <button type="button" className="compact-sort-direction" onClick={event => {
                event.stopPropagation();
                setSortDirection(direction => direction === "asc" ? "desc" : "asc");
              }} aria-label={reverseSortLabel} title={reverseSortLabel}>
                {sortDirection === "asc" ? <ArrowUp size={16} aria-hidden="true" /> : <ArrowDown size={16} aria-hidden="true" />}
              </button>
            </div>
            <div className="compact-mobile-controls">{libraryControls}</div>
          </div>
          <p className="compact-plan-summary">{plan.remainingMinutes.toFixed(1)} min available <span>·</span> {plan.remainingExports} exports left <Link href="/pricing">Upgrade</Link></p>
        </div>

        {selectionError && <p role="alert" className="text-xs text-[#b32e2e]">{selectionError}</p>}
        {projects.length === 0 ? (
          <div className="compact-studio-empty" role="status">
            <Clapperboard size={44} strokeWidth={1.5} aria-hidden="true" />
            <h1>No projects yet</h1>
            <p>Create your first captioned video to get started.</p>
            <button type="button" onClick={onUpload} className="studio-new-project">New project</button>
            <small>Video or audio · up to 25 MB</small>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="compact-studio-empty" role="status">
            <Search size={34} strokeWidth={1.5} aria-hidden="true" />
            <h2>No matching projects</h2>
            <p>Try another name or clear your search.</p>
            <button type="button" onClick={() => setSearchQuery("")} className="compact-clear-search">Clear search</button>
          </div>
        ) : (
          <div className={view === "grid" ? "project-grid compact-project-grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] gap-[20px] pt-[24px] grid product-max-1100:[grid-template-columns:repeat(2,_minmax(0,_1fr))] product-max-480:[grid-template-columns:1fr]" : "compact-project-list"} aria-label={view === "grid" ? "Projects in grid view" : "Projects in list view"}>
            {filteredProjects.map(project => <StoredReelCard key={project.id} project={project} onDelete={onDeleteProject} selected={selection.has(project.id)} onSelect={() => toggleSelection(project.id)} onUpdate={onUpdateProject} />)}
          </div>
        )}
        {projects.length > 0 && <p className="compact-storage-note">Projects are saved in this browser. Keep a downloaded copy of your finished videos.</p>}
      </section>
    </>
  );
}
