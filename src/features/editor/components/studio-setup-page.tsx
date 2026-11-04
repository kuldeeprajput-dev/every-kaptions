"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCaptionEditor } from "../hooks/use-caption-editor";
import { getProject, saveProject, type StoredProject } from "../lib/media-db";
import { usePlanSummary } from "../store/plan-store";
import { CaptionSetupCard } from "./caption-setup-card";

export function StudioSetupPage({ projectId }: { projectId: string }) {
  const router = useRouter();
  const editor = useCaptionEditor();
  const plan = usePlanSummary();
  const [project, setProject] = useState<StoredProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");
  const [generating, setGenerating] = useState(false);
  const running = useRef(false);
  const completed = useRef<Pick<StoredProject, "segments" | "duration" | "language" | "outputMode"> | null>(null);
  const { chooseFile, setLanguage, setOutputLanguage } = editor;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const stored = await getProject(projectId);
      if (cancelled) return;
      if (stored?.status === "ready") {
        router.replace(`/editor/${projectId}`);
        return;
      }
      if (stored) {
        const file = new File([stored.fileBlob], stored.name, { type: stored.fileType || stored.fileBlob.type });
        chooseFile(file);
        setLanguage(stored.language);
        setOutputLanguage(stored.outputMode);
        setProject(stored);
      }
      setLoading(false);
    }
    void load();
    return () => { cancelled = true; };
  }, [projectId, chooseFile, setLanguage, setOutputLanguage, router]);

  const generate = async () => {
    if (!project || running.current) return;
    running.current = true;
    setGenerating(true);
    setSaveError("");
    try {
      if (!completed.current) {
        await saveProject({ ...project, language: editor.language, outputMode: editor.outputLanguage, updatedAt: Date.now() });
        const result = await editor.transcribe();
        if (!result) return;
        completed.current = { ...result, language: editor.language, outputMode: editor.outputLanguage };
      }
      await saveProject({ ...project, ...completed.current, styleId: editor.styleId, status: "ready", updatedAt: Date.now() });
      router.push(`/editor/${projectId}`);
    } catch {
      setSaveError("The project could not be saved. Check your browser storage and try again.");
    } finally {
      running.current = false;
      setGenerating(false);
    }
  };

  return (
    <main id="main-content" className="studio-shell studio-setup-page min-h-[100dvh] [color:var(--cream)] [background:var(--canvas)]">
      <header className="studio-setup-header">
        <button type="button" disabled={generating} onClick={() => router.push("/studio")}><ArrowLeft size={15} aria-hidden="true" />All projects</button>
        <span title={project?.name}>{project?.name || "Project setup"}</span>
        <small>Project setup</small>
      </header>
      {loading ? <p className="studio-setup-loading" role="status">Loading your project…</p>
        : !project || !editor.file ? <div className="studio-setup-loading"><p role="alert">This project is unavailable in this browser.</p><Link href="/studio">Back to projects</Link></div>
        : <CaptionSetupCard
          file={editor.file} language={editor.language} outputLanguage={editor.outputLanguage}
          status={generating && !["uploading", "transcribing", "translating"].includes(editor.status) ? "preparing" : editor.status}
          uploadProgress={editor.uploadProgress} error={saveError || editor.error}
          remainingMinutes={plan.remainingMinutes} canTranscribe={plan.canTranscribe || editor.status === "ready"}
          onLanguageChange={language => { completed.current = null; editor.setLanguage(language); }}
          onOutputLanguageChange={language => { completed.current = null; editor.setOutputLanguage(language); }}
          onGenerate={() => { void generate(); }} onReset={() => router.push("/studio")}
        />}
    </main>
  );
}
