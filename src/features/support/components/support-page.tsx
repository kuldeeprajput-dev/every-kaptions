"use client";

import { ArrowRight, CheckCircle2, ChevronDown, Upload } from "lucide-react";
import { useRef, useState } from "react";

export function SupportPage() {
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <main className="min-h-screen bg-[#080808] px-5 py-16 text-[#ded5c5] sm:py-24 lg:pb-16 lg:pt-44">
      <section className="mx-auto w-full max-w-[820px]">
        <h1 className="text-5xl font-semibold tracking-tight text-[#ded5c5] sm:text-6xl">Support</h1>
        <p className="mt-14 text-lg leading-7 sm:text-xl">Replix Captions is run by a small team. We read every message and typically reply within <strong>24 to 48 hours.</strong></p>
        {submitted ? (
          <div className="mt-12 rounded-2xl border border-amber/30 bg-[#171717] p-8 sm:p-12">
            <CheckCircle2 className="text-amber" size={34} />
            <h2 className="mt-5 text-2xl font-bold text-[#eee6d8]">Message received</h2>
            <p className="mt-3 text-base text-[#aaa49a]">Thanks for reaching out. We’ll get back to you within 24 to 48 hours.</p>
            <button type="button" onClick={() => setSubmitted(false)} className="mt-7 rounded-xl bg-amber px-5 py-3 font-bold text-black">Send another message</button>
          </div>
        ) : (
          <form className="mt-10 space-y-8" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <Field label="Your email" required>
              <input type="email" required placeholder="you@example.com" className="h-11 w-full rounded-xl border border-white/15 bg-[#171717] px-4 text-base text-[#eee6d8] placeholder:text-[#625e58] sm:max-w-[375px]" />
            </Field>
            <Field label="What do you need help with?" required>
              <div className="relative sm:max-w-[375px]">
                <select required defaultValue="" className="h-11 w-full appearance-none rounded-xl border border-white/15 bg-[#171717] px-4 pr-12 text-base text-[#eee6d8]">
                  <option value="" disabled>Select an option</option>
                  <option>Caption or transcription issue</option>
                  <option>Export problem</option>
                  <option>Billing and plans</option>
                  <option>Account access</option>
                  <option>Something else</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8b857b]" size={18} />
              </div>
            </Field>
            <Field label="Message" required>
              <textarea required placeholder="Describe the issue or question" className="h-28 w-full resize-y rounded-xl border border-white/15 bg-[#171717] p-4 text-base text-[#eee6d8] placeholder:text-[#625e58]" />
            </Field>
            <Field label="Screenshot (optional)">
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="sr-only" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  setFileName(event.dataTransfer.files?.[0]?.name ?? "");
                }}
                className="flex min-h-40 w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/30 bg-[#171717] px-5 text-center transition hover:border-amber/55"
              >
                <span className="flex items-center gap-3 text-base font-semibold text-[#aaa49a]"><Upload size={19} />{fileName || "Click to choose a file or drag here"}</span>
                <span className="mt-7 text-sm text-[#8b857b]">Accepts .jpg, .jpeg, .png, .webp files</span>
                <span className="mt-2 text-sm text-[#8b857b]">Size limit: 10 MB</span>
              </button>
            </Field>
            <button type="submit" className="inline-flex h-12 items-center gap-3 rounded-xl bg-amber px-5 text-base font-bold text-black transition hover:-translate-y-0.5">Submit <ArrowRight size={19} /></button>
          </form>
        )}
      </section>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-3 block text-xl font-semibold sm:text-2xl">{label} {required ? <span className="inline-grid size-5 place-items-center rounded-full bg-[#222] align-middle text-xs">*</span> : null}</span>
      {children}
    </label>
  );
}
