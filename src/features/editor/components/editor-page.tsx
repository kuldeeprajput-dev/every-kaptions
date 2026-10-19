"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderPlus, Menu } from "lucide-react";
import { LogoWordmark } from "@/shared/components/logo-wordmark";
import { cn } from "@/shared/lib/cn";
import { useCaptionEditor } from "../hooks/use-caption-editor";
import {
  deleteProject,
  getAllProjects,
  saveProject,
  type StoredProject,
} from "../lib/media-db";
import { usePlanSummary } from "../store/plan-store";
import { AccountMenu } from "./account-menu";
import { CaptionSetupCard } from "./caption-setup-card";
import { EditorSidebar } from "./editor-sidebar";
import { EditorProjectGrid } from "./editor-project-grid";

type ReelTab = "In progress" | "Finished";

export function EditorPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<ReelTab>("In progress");
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const editor = useCaptionEditor();
  const plan = usePlanSummary();

  // Load saved projects from IndexedDB on mount
  useEffect(() => {
    async function loadProjects() {
      const list = await getAllProjects();
      setProjects(list);
    }
    void loadProjects();
  }, []);

  const openUpload = () => inputRef.current?.click();
  const selectFile = (file: File) => {
    if (editor.chooseFile(file)) setTab("In progress");
  };

  // Keyboard shortcut listener: Cmd/Ctrl + O to trigger upload dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "o") {
        e.preventDefault();
        openUpload();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle transcription success -> Save project to IndexedDB and redirect to /editor/[mediaId]
  useEffect(() => {
    if (editor.status === "ready" && editor.file && editor.segments.length > 0) {
      const mediaId = `media_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const saveAndNavigate = async () => {
        const newProject: StoredProject = {
          id: mediaId,
          name: editor.file!.name,
          fileBlob: editor.file!,
          fileType: editor.file!.type || "video/mp4",
          fileSize: editor.file!.size,
          language: editor.language,
          outputMode: editor.outputLanguage,
          status: "ready",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          segments: editor.segments,
          duration: editor.duration,
          styleId: editor.styleId,
        };
        await saveProject(newProject);
        router.push(`/editor/${mediaId}`);
      };
      void saveAndNavigate();
    }
  }, [editor.status, editor.file, editor.segments, editor.duration, editor.styleId, editor.language, editor.outputLanguage, router]);

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#080808] text-[#d5d5d5] font-sans">
      {/* Top Header */}
      <div className="app-header relative z-40 flex h-[56px] items-center justify-between border-b border-white/8 bg-[#0c0b0ad1] px-3 sm:px-6 md:px-[48px] text-[#c8c2b6]">
        <button
          type="button"
          className="mr-2 sm:mr-3 grid size-8 sm:size-9 place-items-center text-[#888] md:hidden cursor-pointer"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={19} className="sm:size-5" />
        </button>
        <Link href="/studio" className="inline-flex shrink-0 items-center">
          <LogoWordmark className="text-[18px] sm:text-[22px] md:text-[26px] md:w-[210.57px] md:h-[26.7px]" />
        </Link>
        <div className="header-actions ml-auto flex items-center gap-1.5 sm:gap-2 md:gap-3 text-[#c8c2b6]">
          <AccountMenu open={menuOpen} onToggle={() => setMenuOpen((value) => !value)} />
          <Link
            href="/pricing"
            className="flex h-7 sm:h-8 items-center rounded-full border border-white/20 px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-semibold text-white transition hover:border-white/40 shrink-0"
          >
            Upgrade
          </Link>
          <p className="hidden text-xs text-[#737373] md:block pl-1">
            {plan.remainingExports} of 3 free exports left · resets Oct 1, 2026
          </p>
        </div>
      </div>

      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onUpload={openUpload} />
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      {/* Main Content */}
      <section className="w-full max-w-full min-w-0 px-4 py-5 sm:px-6 md:ml-[266px] md:px-6 md:py-5">
        {/* Header Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-[28px]">
              Your reels
            </h1>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-[#c8c2b6]">
              {projects.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openUpload}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f6c453] px-3.5 py-1.5 text-xs font-bold text-black shadow-sm hover:brightness-105 transition cursor-pointer"
            >
              <FolderPlus size={14} />
              <span>New reel</span>
            </button>

            <div className="flex items-center rounded-full border border-white/5 bg-[#161616] p-0.5 shrink-0">
              {(["In progress", "Finished"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn(
                    "rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition cursor-pointer",
                    tab === item ? "bg-[#f6c453] text-black" : "text-[#777] hover:text-white",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="mt-4 rounded-xl border border-[#3e3419] bg-[#141209] px-4 py-2.5 text-xs text-[#d9a838]">
          Edits stay saved in this browser. Keep a downloaded copy of your exported captions.
        </div>

        {/* Tab Content & Projects Grid */}
        <div className="mt-5">
          <EditorProjectGrid
            tab={tab}
            projects={projects}
            onDeleteProject={handleDeleteProject}
            onSwitchTab={() => setTab("In progress")}
          />

          {editor.error && !editor.file ? (
            <p role="alert" className="mt-3 text-xs text-red-400">
              {editor.error}
            </p>
          ) : null}

          {/* Preparation Popup Modal */}
          {editor.file ? (
            <CaptionSetupCard
              file={editor.file}
              language={editor.language}
              outputLanguage={editor.outputLanguage}
              status={editor.status}
              uploadProgress={editor.uploadProgress}
              error={editor.error}
              canTranscribe={plan.canTranscribe}
              onLanguageChange={editor.setLanguage}
              onOutputLanguageChange={editor.setOutputLanguage}
              onGenerate={editor.transcribe}
              onReset={editor.reset}
            />
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,audio/mpeg,audio/wav,audio/webm"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) selectFile(file);
            event.target.value = "";
          }}
        />
      </section>
    </main>
  );
}
