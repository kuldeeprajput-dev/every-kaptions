"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Brand } from "@/shared/components/brand";
import { cn } from "@/shared/lib/cn";
import { AccountMenu } from "./account-menu";
import { EditorSidebar } from "./editor-sidebar";
import { UploadCard } from "./upload-card";

type ReelTab = "In progress" | "Finished";

export function EditorPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<ReelTab>("In progress");
  const [uploadedName, setUploadedName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const openUpload = () => inputRef.current?.click();

  return (
    <main className="min-h-screen bg-[#080909] text-[#d5d5d5]">
      <header className="relative z-40 flex h-16 items-center border-b border-white/8 px-4 sm:h-[66px] sm:px-6 lg:px-14">
        <button
          type="button"
          className="mr-3 grid size-10 place-items-center text-cream md:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={21} />
        </button>
        <Brand large />
        <div className="ml-auto flex items-center gap-3">
          <AccountMenu open={menuOpen} onToggle={() => setMenuOpen((value) => !value)} />
          <Link
            href="/pricing"
            className="hidden min-h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-cream sm:flex"
          >
            Upgrade
          </Link>
          <p className="hidden text-xs text-[#8b8b8b] xl:block">3 of 3 free exports left · resets Oct 1, 2026</p>
        </div>
      </header>

      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onUpload={openUpload} />

      <section className="px-4 py-7 md:ml-[266px] md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white sm:text-[28px]">Your reels</h1>
          <div className="flex rounded-full border border-white/10 bg-[#171717] p-1">
            {(["In progress", "Finished"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold",
                  tab === item ? "bg-amber text-black" : "text-[#838383]",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-amber/25 bg-amber/5 px-4 py-3 text-sm text-amber">
          Edits stay about 1 hour to tweak and re-export.
        </div>
        {tab === "In progress" ? (
          <UploadCard fileName={uploadedName} onClick={openUpload} />
        ) : (
          <div className="mt-24 text-center text-sm text-[#6f7476]">Your finished exports will appear here.</div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          className="sr-only"
          onChange={(event) => setUploadedName(event.target.files?.[0]?.name ?? "")}
        />
      </section>
    </main>
  );
}
