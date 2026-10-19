"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search, X } from "lucide-react";
import { formatClockTime } from "../lib/captions";
import { type StoredProject } from "../lib/media-db";
import { EditorEmptyState } from "./editor-empty-state";
import { StoredReelCard } from "./stored-reel-card";

interface EditorProjectGridProps {
  tab: "In progress" | "Finished";
  projects: StoredProject[];
  onDeleteProject: (id: string) => void;
  onSwitchTab: () => void;
}

type SortOption = "newest" | "oldest" | "name";

export function EditorProjectGrid({
  tab,
  projects,
  onDeleteProject,
  onSwitchTab,
}: EditorProjectGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredProjects = useMemo(() => {
    let list = [...projects];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "oldest") {
        return (a.createdAt || 0) - (b.createdAt || 0);
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
    return list;
  }, [projects, searchQuery, sortBy]);

  const totalDuration = useMemo(() => {
    return projects.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  }, [projects]);

  if (tab === "Finished") {
    return (
      <section className="w-full" aria-label="Finished exports view">
        <EditorEmptyState
          type="finished"
          onSwitchToInProgress={onSwitchTab}
        />
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="w-full" aria-label="In-progress projects empty view">
        <EditorEmptyState type="in-progress" />
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col gap-4" aria-label="In-progress project grid">
      {/* Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cream">Saved Projects</span>
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-bold text-dim">
            {projects.length}
          </span>
          {totalDuration > 0 && (
            <span className="text-[10px] text-body border-l border-hairline pl-2">
              {formatClockTime(totalDuration)} total
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              aria-label="Filter projects by title"
              className="w-full rounded-lg border border-hairline bg-surface py-1.5 pl-7 pr-7 text-xs text-cream placeholder:text-dim focus:border-amber focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-dim hover:text-cream cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 text-xs">
            <ArrowUpDown size={12} className="text-dim" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort projects"
              className="rounded-lg border border-hairline bg-surface px-2 py-1.5 text-xs text-cream focus:border-amber focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid or Filter Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="project-grid" role="region" aria-label="Saved local projects">
          {filteredProjects.map((project) => (
            <StoredReelCard
              key={project.id}
              project={project}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline p-8 text-center">
          <p className="text-xs font-semibold text-cream">
            No projects matched &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="mt-2 text-xs font-semibold text-amber hover:underline cursor-pointer"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
