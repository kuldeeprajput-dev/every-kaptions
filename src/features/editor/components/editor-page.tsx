"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCaptionFileError } from "../hooks/use-caption-editor";
import {
  deleteProject,
  getAllProjects,
  saveProject,
  type StoredProject,
} from "../lib/media-db";
import { EditorProjectGrid } from "./editor-project-grid";

export function EditorPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState("");
  const saving = useRef(false);

  // Load saved projects from IndexedDB on mount
  useEffect(() => {
    async function loadProjects() {
      const list = await getAllProjects();
      setProjects(list);
    }
    void loadProjects();
  }, []);

  const openUpload = () => inputRef.current?.click();
  const selectFile = async (file: File) => {
    if (saving.current) return;
    const error = getCaptionFileError(file);
    setUploadError(error);
    if (error) return;
    saving.current = true;
    try {
      const id = crypto.randomUUID();
      const now = Date.now();
      await saveProject({
        id, name: file.name, fileBlob: file, fileType: file.type,
        fileSize: file.size, language: "en", outputMode: "same", status: "idle",
        createdAt: now, updatedAt: now, segments: [], duration: 0,
      });
      router.push(`/studio/${id}`);
    } catch {
      setUploadError("The project could not be saved. Check your browser storage and try again.");
    } finally {
      saving.current = false;
    }
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

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateProject = async (project: StoredProject) => {
    await saveProject(project);
    setProjects(previous => [...previous.filter(item => item.id !== project.id), project]);
  };

  return (
    <main id="main-content" className="studio-shell studio-compact min-h-[100dvh] [color:var(--cream)] [background:var(--canvas)]">
      <EditorProjectGrid projects={projects} onDeleteProject={handleDeleteProject} onUpdateProject={handleUpdateProject} onUpload={openUpload} />
      {uploadError && <p role="alert" className="mt-3 text-sm text-[#b32e2e]">{uploadError}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,audio/mpeg,audio/wav,audio/webm"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void selectFile(file);
          event.target.value = "";
        }}
      />
    </main>
  );
}
