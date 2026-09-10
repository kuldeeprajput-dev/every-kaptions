"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useCaptionEditor } from "../hooks/use-caption-editor";
import { getProject, saveProject } from "../lib/media-db";
import { MediaEditor } from "./media-editor";

export function EditorProjectPage({ mediaId }: { mediaId: string }) {
  const router = useRouter();
  const editor = useCaptionEditor();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const stored = await getProject(mediaId);
        if (cancelled) return;

        if (!stored) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Initialize editor with stored data directly
        editor.loadStoredProject(stored);
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
  }, [mediaId]);

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
  }, [mediaId, loading, notFound, editor.segments, editor.styleId, editor.language, editor.outputLanguage, editor.status, editor.file]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#070808] text-white font-sans">
        <LoaderCircle size={32} className="animate-spin text-[#f6c453]" />
        <p className="mt-4 text-xs font-semibold text-[#888]">Loading video from IndexedDB...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#070808] text-white font-sans">
        <h2 className="text-xl font-bold text-white">Reel not found</h2>
        <p className="mt-2 text-xs text-[#777]">This project could not be loaded from local browser storage.</p>
        <Link
          href="/studio"
          className="mt-5 rounded-full bg-[#f6c453] px-5 py-2.5 text-xs font-bold text-black hover:brightness-105"
        >
          Return to Studio
        </Link>
      </div>
    );
  }

  return <MediaEditor editor={editor} onBack={() => router.push("/studio")} />;
}
