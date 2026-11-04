"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { CustomSelect } from "@/shared/components/custom-select";
import { SUPPORT_CATEGORIES, SUPPORT_GUIDES, type SupportCategory } from "../data/support-guides";

export function SupportGuides() {
  const [activeCategory, setActiveCategory] = useState<SupportCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredGuides = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return SUPPORT_GUIDES.filter(guide => (activeCategory === "all" || guide.category === activeCategory) && (!query || [guide.title, guide.summary, guide.tag, ...guide.steps].some(text => text.toLowerCase().includes(query))));
  }, [activeCategory, searchQuery]);
  return (
    <section id="support-guides" className="mt-12 scroll-mt-28 border-t border-[#e4e4e7] pt-10 sm:mt-16 sm:pt-12" aria-labelledby="help-guides-title">
      <h2 id="help-guides-title" className="text-[30px] font-bold leading-[1.15] tracking-[-0.045em] text-[#18181b]">Find a quick answer.</h2>
      <p className="mt-3 text-[14px] leading-[1.8] text-[#71717a]">Simple steps for captions, timing, downloads, and your plan.</p>
      <div className="mb-6 mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1"><Search size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-[#a1a1aa]" aria-hidden="true" /><input type="text" role="searchbox" inputMode="search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search for an answer" aria-label="Search help guides" className="support-field h-11 w-full rounded-xl border border-[#dedee5] bg-[#fafafa] pl-10 pr-10 text-[13px] text-[#27272a] outline-none placeholder:text-[#a1a1aa] focus:border-[#c63838]/50" />{searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search" className="absolute right-2 top-2 grid size-7 place-items-center rounded-md text-[#71717a] hover:bg-[#ededed]"><X size={13} aria-hidden="true" /></button>}</div>
        <div className="flex items-center gap-3 sm:w-[250px]">
          <span className="text-[12px] text-[#8b8b95]">Topic</span>
          <CustomSelect label="Filter help guides by topic" options={SUPPORT_CATEGORIES.map(category => ({ value: category.id, label: category.label }))} value={activeCategory} onChange={value => setActiveCategory(value as SupportCategory)} />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white">
        {filteredGuides.length === 0 ? <div className="px-5 py-10 text-center"><p className="text-[14px] font-semibold text-[#52525b]">No guides found.</p><p className="mt-2 text-[12px] text-[#8b8b95]">Try another word or browse all topics.</p><button type="button" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="mt-3 min-h-9 text-[12px] font-medium text-[#c63838] hover:underline">Show all guides</button></div> : filteredGuides.map(guide => <details key={guide.id} className="group border-b border-[#ededf1] last:border-b-0"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 marker:content-none hover:bg-[#fafafa] [&::-webkit-details-marker]:hidden sm:p-6"><span><span className="block text-[14px] font-semibold leading-[1.5] text-[#27272a]">{guide.title}</span><span className="mt-1.5 block text-[12px] leading-[1.7] text-[#8b8b95]">{guide.summary}</span></span><ChevronDown size={16} aria-hidden="true" className="shrink-0 text-[#a1a1aa] transition-transform group-open:rotate-180 group-open:text-[#c63838]" /></summary><div className="border-t border-[#ededf1] bg-[#fafafa] px-5 py-5 sm:px-6"><ol className="ml-4 list-decimal space-y-3 text-[13px] leading-[1.85] text-[#71717a]">{guide.steps.map(step => <li key={step} className="pl-1 marker:font-semibold marker:text-[#c63838]">{step}</li>)}</ol></div></details>)}
      </div>
    </section>
  );
}
