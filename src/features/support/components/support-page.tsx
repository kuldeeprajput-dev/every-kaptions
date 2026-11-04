import { ArrowUpRight, BookOpen, Mail } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/shared/components/site-header";
import { SiteFooter } from "@/shared/components/site-footer";
import { brand } from "@/shared/config/brand";
import { SupportContactForm } from "./support-contact-form";
import { SupportGuides } from "./support-guides";

export function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-[1100px] px-5 pb-16 pt-10 sm:px-7 sm:pt-14">
        <div className="mb-9 border-b border-[#e4e4e7] pb-8 sm:mb-10 sm:pb-10">
          <h1 className="text-[clamp(36px,4.5vw,54px)] font-bold leading-[1.1] tracking-[-0.055em] text-[#18181b]">A little help.<br />More time to create.</h1>
          <p className="mt-4 max-w-[560px] text-[15px] leading-[1.8] text-[#71717a]">Find an answer below or tell us what’s happening. We’ll help you take the next step.</p>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch lg:gap-14">
          <aside className="flex flex-col py-1">
            <div className="flex items-center gap-3">
              <Mail size={23} strokeWidth={1.5} className="shrink-0 text-[#c63838]" aria-hidden="true" />
              <h2 className="text-[27px] font-bold leading-[1.2] tracking-[-0.04em] text-[#27272a]">Let’s work it out.</h2>
            </div>
            <p className="mt-4 max-w-[310px] text-[13px] leading-[1.85] text-[#71717a]">Tell us what you were trying to do and what went wrong. Include any error message so we can understand the problem.</p>
            <a href={`mailto:${brand.email}`} className="mt-5 inline-flex min-h-9 items-center gap-2 text-[13px] font-medium text-[#c63838] hover:underline">{brand.email}<ArrowUpRight size={14} aria-hidden="true" /></a>
            <div className="mt-6 flex flex-col gap-1 border-t border-[#e4e4e7] pt-5">
              <Link href="#support-guides" className="inline-flex min-h-10 items-center gap-2 text-[13px] font-medium text-[#52525b] hover:text-[#18181b]"><BookOpen size={15} aria-hidden="true" />Browse help guides<ArrowUpRight size={13} aria-hidden="true" /></Link>
              <Link href="/pricing" className="inline-flex min-h-9 items-center gap-2 text-[12px] text-[#71717a] hover:text-[#18181b]">Plans & billing<ArrowUpRight size={13} aria-hidden="true" /></Link>
              <Link href="/legal/data-deletion" className="inline-flex min-h-9 items-center gap-2 text-[12px] text-[#71717a] hover:text-[#18181b]">Manage your data<ArrowUpRight size={13} aria-hidden="true" /></Link>
            </div>
          </aside>
          <SupportContactForm />
        </div>
        <SupportGuides />
      </main>
      <SiteFooter />
    </div>
  );
}
