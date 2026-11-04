"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useCaptionEditor } from "../hooks/use-caption-editor";
import { getProject, saveProject } from "../lib/media-db";
import { CaptionEditor } from "./caption-editor";

export function EditorProjectPage({ mediaId }: { mediaId: string }) {
  const router = useRouter();
  const editor = useCaptionEditor();
  const { loadStoredProject } = editor;
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const stored = await getProject(mediaId);
        if (cancelled) return;

        if (!stored) {
          if (mediaId === "demo") {
            const resp = await fetch("/media/caption-demo.mp4");
            const blob = await resp.blob();
            const demoProject = {
              id: "demo",
              name: "Sample story — caption demo",
              fileBlob: blob,
              fileType: "video/mp4",
              fileSize: blob.size,
              language: "en",
              outputMode: "same" as const,
              status: "ready" as const,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              segments: [
                {
                  id: "demo-seg-1",
                  text: "Every word matters.",
                  start: 0.0,
                  end: 3.9,
                  words: [],
                },
                {
                  id: "demo-seg-2",
                  text: "Let your story speak for itself.",
                  start: 4.0,
                  end: 8.0,
                  words: [],
                },
              ],
              duration: 8.0,
              styleId: "yellow",
            };
            await saveProject(demoProject);
            loadStoredProject(demoProject);
            setLoading(false);
            return;
          }

          setNotFound(true);
          setLoading(false);
          return;
        }

        if (stored.status === "idle") {
          router.replace(`/studio/${mediaId}`);
          return;
        }

        // Initialize editor with stored data directly
        loadStoredProject(stored);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [mediaId, loadStoredProject, router]);

  // Auto-save changes back to IndexedDB when user edits captions or style
  useEffect(() => {
    if (loading || notFound || !mediaId || editor.status !== "ready" || !editor.file) return;

    const timer = setTimeout(async () => {
      try {
        const existing = await getProject(mediaId);
        if (existing) {
          await saveProject({
            ...existing,
            segments: editor.segments,
            styleId: editor.styleId,
            captionAppearance: editor.captionAppearance,
            language: editor.language,
            outputMode: editor.outputLanguage,
            updatedAt: Date.now(),
          });
        }
      } catch (err) {
        console.error("Failed auto-saving to IndexedDB", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [mediaId, loading, notFound, editor.captionAppearance, editor.segments, editor.styleId, editor.language, editor.outputLanguage, editor.status, editor.file]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-surface text-cream font-sans">
        <LoaderCircle size={32} className="animate-spin text-amber" />
        <p className="mt-4 text-xs font-semibold text-body">Opening your story…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-surface text-cream font-sans">
        <h2 className="text-xl font-bold text-cream">Project not found</h2>
        <p className="mt-2 text-xs text-dim">This project isn’t available in this browser. Try opening it where you created it.</p>
        <Link
          href="/studio"
          className="mt-5 rounded-lg bg-amber px-5 py-2.5 text-xs font-bold text-white hover:brightness-105"
        >
          Return to Studio
        </Link>
      </div>
    );
  }

  return <CaptionEditor editor={editor} onBack={() => router.push("/studio")} />;
}
