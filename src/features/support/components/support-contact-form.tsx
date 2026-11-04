"use client";

import { ArrowUpRight, Paperclip } from "lucide-react";
import { useState } from "react";
import { CustomSelect } from "@/shared/components/custom-select";
import { brand } from "@/shared/config/brand";

const fieldClass = "support-field mt-2 block min-h-11 w-full rounded-lg border border-[#dedee5] bg-[#fafafa] px-3 py-2.5 text-[13px] font-normal text-[#27272a] outline-none transition-colors placeholder:text-[#a1a1aa] focus:border-[#c63838]/50 focus:bg-white";

const supportTopics = ["Creating or editing captions", "Downloading my video or subtitles", "Plans and billing", "Signing in to my account", "Something else"].map(label => ({ value: label, label }));

export function SupportContactForm() {
  const [issue, setIssue] = useState("");
  const [topicError, setTopicError] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!issue) { setTopicError(true); document.getElementById("support-topic")?.focus(); return; }
    const data = new FormData(event.currentTarget);
    const subject = `EveryKaptions support: ${data.get("issue")}`;
    const body = `From: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="flex min-w-0 flex-col gap-5 rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-7" onSubmit={handleSubmit}>
      <label className="text-[12px] font-semibold text-[#52525b]">Your email address<input name="email" type="email" required placeholder="you@example.com" autoComplete="email" className={fieldClass} /></label>
      <div>
        <label htmlFor="support-topic" className="mb-2 block text-[12px] font-semibold text-[#52525b]">What do you need help with?</label>
        <CustomSelect id="support-topic" name="issue" label="What do you need help with?" required placeholder="Choose a topic" options={supportTopics} value={issue} onChange={value => { setIssue(value); setTopicError(false); }} errorId={topicError ? "support-topic-error" : undefined} />
        {topicError && <p id="support-topic-error" role="alert" className="mt-2 text-[12px] text-[#c63838]">Choose a topic before continuing.</p>}
      </div>
      <label className="text-[12px] font-semibold text-[#52525b]">Tell us what happened<textarea name="message" required maxLength={4000} placeholder="What were you trying to do? What happened instead?" rows={4} className={`${fieldClass} h-32 resize-none overflow-y-auto leading-[1.8]`} /></label>
      <p className="flex items-start gap-2 text-[11px] leading-[1.7] text-[#8b8b95]"><Paperclip size={14} className="mt-0.5 shrink-0" aria-hidden="true" />Have a screenshot? Attach it in your email app after opening the draft.</p>
      <div className="border-t border-[#ededf1] pt-5"><button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c63838] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#ac3030]">Continue in email<ArrowUpRight size={15} aria-hidden="true" /></button><p className="mt-3 text-center text-[10px] leading-[1.7] text-[#8b8b95]">Opens your email app. Review your message and send it from there.</p></div>
    </form>
  );
}
