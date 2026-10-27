"use client";

import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

export type RoadmapSortOption = "newest" | "category" | "alphabetical";

export interface RoadmapFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: CategoryOption[];
  sortBy: RoadmapSortOption;
  onSortChange: (sort: RoadmapSortOption) => void;
  totalResults: number;
  onResetFilters: () => void;
  className?: string;
}

export function RoadmapFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  sortBy,
  onSortChange,
  totalResults,
  onResetFilters,
  className = "",
}: RoadmapFilterBarProps) {
  const isFiltered = searchQuery.trim().length > 0 || selectedCategory !== "all";

  return (
    <div className={`w-full max-w-3xl mx-auto mb-8 space-y-4 font-sans ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-4 text-[#888] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search features, formats, or updates..."
          aria-label="Search roadmap items"
          className="w-full rounded-2xl border border-white/10 bg-[#121314] py-3 pl-11 pr-10 text-xs sm:text-sm text-cream placeholder-[#666] outline-none transition focus:border-[#f6c453]/60 focus:bg-[#0c0d0d] focus:ring-1 focus:ring-[#f6c453]/60"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search query"
            className="absolute right-3.5 grid size-6 place-items-center rounded-full text-[#888] hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {/* Category Filter Chips & Sort Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div
          role="tablist"
          aria-label="Filter roadmap features by category"
          className="flex flex-wrap items-center gap-1.5"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(cat.id)}
                className={`group inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? "bg-[#f6c453] text-black shadow-sm"
                    : "border border-white/8 bg-[#131416] text-[#888] hover:border-white/20 hover:text-cream"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected
                      ? "bg-black/20 text-black"
                      : "bg-white/5 text-[#666] group-hover:text-[#aaa]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label htmlFor="roadmap-sort" className="inline-flex items-center gap-1 text-[11px] font-medium text-[#777]">
            <ArrowUpDown size={12} aria-hidden="true" /> Sort:
          </label>
          <select
            id="roadmap-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as RoadmapSortOption)}
            className="rounded-lg border border-white/10 bg-[#121314] px-2.5 py-1 text-xs text-[#d8d8d6] outline-none focus:border-[#f6c453]/60 cursor-pointer"
          >
            <option value="newest">Timeline Order</option>
            <option value="category">Category</option>
            <option value="alphabetical">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Summary & Quick Reset */}
      {isFiltered ? (
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#121314]/60 px-3.5 py-2 text-xs text-[#888]">
          <span className="font-medium">
            Found <strong className="text-cream">{totalResults}</strong> matching {totalResults === 1 ? "feature" : "features"}
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-bold text-[#f6c453] hover:bg-white/10 transition cursor-pointer"
          >
            <X size={11} aria-hidden="true" /> Reset filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
