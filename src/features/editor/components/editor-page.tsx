"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Film, Menu, Play, Trash2 } from "lucide-react";
import { LogoWordmark } from "@/shared/components/logo-wordmark";
import { cn } from "@/shared/lib/cn";
import { useCaptionEditor } from "../hooks/use-caption-editor";
import { formatClockTime } from "../lib/captions";
import { deleteProject, getAllProjects, saveProject, type StoredProject } from "../lib/media-db";
import { usePlanSummary } from "../store/plan-store";
import { AccountMenu } from "./account-menu";
import { CaptionSetupCard } from "./caption-setup-card";
import { EditorSidebar } from "./editor-sidebar";
import { UploadCard } from "./upload-card";

type ReelTab = "In progress" | "Finished";

function StoredReelCard({
  project,
  onDelete,
}: {
  project: StoredProject;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    if (!project.fileBlob) return;
    const url = URL.createObjectURL(project.fileBlob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [project.fileBlob]);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#141311] p-3.5 transition hover:border-[#f6c453]/40 hover:bg-[#191815] font-sans">
      {/* Thumbnail */}
      <div
        onClick={() => router.push(`/editor/${project.id}`)}
        className="relative aspect-[9/16] max-h-[220px] w-full cursor-pointer overflow-hidden rounded-xl bg-black flex items-center justify-center border border-white/5"
      >
        {videoUrl ? (
          project.fileType?.startsWith("audio/") ? (
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <Film className="text-[#f6c453]" size={28} />
              <span className="mt-1 text-[10px] text-[#888]">Audio file</span>
            </div>
          ) : (
            <video
              src={videoUrl}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="text-xs text-[#555]">Loading...</div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#f6c453] text-black shadow-lg">
            <Play size={18} className="ml-0.5 fill-black" />
          </div>
        </div>
      </div>

      {/* Title & Info */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div
          onClick={() => router.push(`/editor/${project.id}`)}
          className="cursor-pointer overflow-hidden flex-1"
        >
          <h3 className="truncate text-xs font-semibold text-white group-hover:text-[#f6c453] transition">
            {project.name}
          </h3>
          <p className="mt-0.5 text-[10px] text-[#777]">
            {formatClockTime(project.duration || 0)} · {project.segments?.length || 0} lines
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="p-1 text-[#666] hover:text-red-400 transition cursor-pointer"
          title="Delete reel"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

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
      <div className="app-header relative z-40 flex h-[56px] items-center justify-between border-b border-white/8 bg-[#0c0b0ad1] px-4 py-[8px] sm:px-6 md:px-[48px] text-[#c8c2b6]">
        <button
          type="button"
          className="mr-3 grid size-9 place-items-center text-[#888] md:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <Link href="/studio" className="inline-flex shrink-0 items-center">
          <LogoWordmark className="w-[210.57px] h-[26.7px]" />
        </Link>
        <div className="header-actions ml-auto flex items-center gap-3 text-[#c8c2b6]">
          <AccountMenu open={menuOpen} onToggle={() => setMenuOpen((value) => !value)} />
          <Link
            href="/pricing"
            className="flex h-8 items-center rounded-full border border-white/20 px-3.5 text-xs font-semibold text-white transition hover:border-white/40"
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
      <section className="px-6 py-5 md:ml-[266px]">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">Your reels</h1>

          <div className="flex items-center rounded-full border border-white/5 bg-[#161616] p-0.5">
            {(["In progress", "Finished"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
                  tab === item ? "bg-[#f6c453] text-black" : "text-[#777] hover:text-white",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Notice Banner */}
        <div className="mt-4 rounded-xl border border-[#3e3419] bg-[#141209] px-4 py-2.5 text-xs text-[#d9a838]">
          Edits stay about 1 hour to tweak and re-export.
        </div>

        {/* Tab Content */}
        {tab === "In progress" ? (
          <div className="mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <UploadCard onClick={openUpload} onFile={selectFile} />

              {/* Saved reels from IndexedDB */}
              {projects.map((project) => (
                <StoredReelCard
                  key={project.id}
                  project={project}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>

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
                error={editor.error}
                canTranscribe={plan.canTranscribe}
                onLanguageChange={editor.setLanguage}
                onOutputLanguageChange={editor.setOutputLanguage}
                onGenerate={editor.transcribe}
                onReset={editor.reset}
              />
            ) : null}
          </div>
        ) : (
          <div className="mt-20 text-center">
            <CheckCircle2 className="mx-auto text-[#444]" size={28} />
            <h2 className="mt-3 text-sm font-semibold text-[#888]">No finished exports yet</h2>
            <p className="mt-1 text-xs text-[#555]">Exported caption files will appear here.</p>
          </div>
        )}

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
