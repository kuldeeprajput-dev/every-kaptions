"use client";

import { CheckCircle2, Clock3, Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Brand } from "@/shared/components/brand";
import { cn } from "@/shared/lib/cn";
import { useCaptionEditor } from "../hooks/use-caption-editor";
import { usePlanSummary } from "../store/plan-store";
import { AccountMenu } from "./account-menu";
import { CaptionSetupCard } from "./caption-setup-card";
import { EditorSidebar } from "./editor-sidebar";
import { MediaEditor } from "./media-editor";
import { UploadCard } from "./upload-card";

type ReelTab = "In progress" | "Finished";

export function EditorPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<ReelTab>("In progress");
  const inputRef = useRef<HTMLInputElement>(null);
  const editor = useCaptionEditor();
  const plan = usePlanSummary();
  const openUpload = () => inputRef.current?.click();
  const selectFile = (file: File) => {
    if (editor.chooseFile(file)) setTab("In progress");
  };

  if (editor.status === "ready") return <MediaEditor editor={editor} />;

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
          <p className="hidden text-xs text-[#8b8b8b] xl:block">{plan.remainingExports} of 3 free exports left · resets in {plan.resetDays} days</p>
        </div>
      </header>

      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onUpload={openUpload} />
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <section className="px-4 py-6 sm:px-6 md:ml-[266px] md:px-8 md:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-amber">Caption studio</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-[28px]">Your reels</h1>
          </div>
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
          Projects stay available for about 1 hour, so review and export them before they expire.
        </div>
        {tab === "In progress" ? (
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,640px)_280px]">
            {editor.file ? (
              <CaptionSetupCard
                file={editor.file}
                language={editor.language}
                status={editor.status}
                error={editor.error}
                captionCount={editor.segments.length}
                remainingMinutes={plan.remainingMinutes}
                canTranscribe={plan.canTranscribe}
                onLanguageChange={editor.setLanguage}
                onGenerate={editor.transcribe}
                onDownload={() => editor.downloadCaptions("srt")}
                onReset={editor.reset}
              />
            ) : (
              <div>
                <UploadCard onClick={openUpload} onFile={selectFile} />
                {editor.error ? <p role="alert" className="mt-3 text-sm text-red-300">{editor.error}</p> : null}
              </div>
            )}

            <aside className="mt-5 rounded-2xl border border-white/8 bg-[#101111] p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold text-cream"><Sparkles size={16} className="text-amber" /> A simple first export</h2>
              <div className="mt-5 space-y-5">
                <GuideStep icon={CheckCircle2} title="Use clear audio" copy="Speech close to the microphone creates cleaner captions." />
                <GuideStep icon={Clock3} title="Keep it short" copy="The free plan includes three transcription minutes each month." />
                <GuideStep icon={Sparkles} title="Review before export" copy="Fix names, timing, and emphasis in the media editor." />
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-dashed border-white/10 px-5 py-16 text-center">
            <CheckCircle2 className="mx-auto text-[#596064]" />
            <h2 className="mt-4 font-semibold text-cream">No finished exports yet</h2>
            <p className="mt-2 text-sm text-[#6f7476]">Exported caption files will be easy to find here.</p>
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

type GuideStepProps = {
  icon: typeof Sparkles;
  title: string;
  copy: string;
};

function GuideStep({ icon: Icon, title, copy }: GuideStepProps) {
  return (
    <div className="flex gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-amber"><Icon size={15} /></span>
      <div>
        <h3 className="text-sm font-semibold text-[#d7d9da]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[#727b80]">{copy}</p>
      </div>
    </div>
  );
}
