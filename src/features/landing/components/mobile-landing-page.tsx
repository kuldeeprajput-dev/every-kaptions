"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MobileAccountSummary } from "@/shared/components/mobile-account-summary";
import { MobileHeaderLogo } from "@/shared/components/logo-wordmark";
import { useAuth } from "@/features/auth/store/auth-store";
import { CaptionCta } from "./landing-ui";

const previews = [
  { label: "Bold", image: "creator-podcast", alt: "A creator recording a podcast", caption: "rounded-[3px] bg-[#c63838] px-2 py-1 font-bold text-white", lines: ["Every word.", "Your way."] },
  { label: "Clean", image: "creator-lifestyle", alt: "A creator in a bright home studio", caption: "rounded bg-white px-2 py-1 font-bold text-[#18181b]", lines: ["A little more", "you."] },
  { label: "Minimal", image: "creator-outdoor", alt: "An outdoor creator sharing her story", caption: "rounded bg-[#18181b]/90 px-2 py-1 font-medium text-white", lines: ["Your story.", "In your words."] },
];
const examples = [
  { label: "Clean", image: "caption-editing-v2", text: "Simple, clear captions.", caption: "bg-white text-[#18181b]" },
  { label: "Red box", image: "preset-red-v2", text: "Words that stand out.", caption: "bg-[#c63838] text-white" },
  { label: "Word highlight", image: "creator-podcast", text: "Your words. Your way.", caption: "bg-[#18181b] text-[#f6c453]" },
  { label: "Animated", image: "creator-outdoor", text: "Make your words move.", caption: "bg-[#18181b]/90 italic text-white" },
];
const steps = [
  { title: "Upload your video", description: "Start with a video or audio recording." },
  { title: "Make the words yours", description: "Generate captions, then edit the text, timing, and style." },
  { title: "Export and share", description: "Download your captioned video or subtitle files." },
];
const questions = [
  { question: "What’s included for free?", answer: "3 minutes of caption generation and 3 watermarked video exports each month. No card needed." },
  { question: "Which languages can I use?", answer: "English, Hindi, Hinglish, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, and Punjabi. Choose the spoken language before generating." },
  { question: "How can I export my captions?", answer: "Download a captioned video, or export subtitles as SRT, VTT, or plain text. Review your captions before sharing." },
];
const navigation = [
  ["How it works", "#mobile-features"], ["Caption styles", "#mobile-presets"], ["Languages", "#mobile-languages"], ["Pricing", "/pricing"], ["Help & support", "/support"],
];

export function MobileLandingPage() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const { user, openAuthModal, signOut } = useAuth();
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const preview = previews[active];
  useEffect(() => {
    if (!menuOpen) return;
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setMenuOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); toggle.current?.focus(); } };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [menuOpen]);

  return <div className="bg-white font-sans text-[#18181b] antialiased md:hidden">
    <a href="#mobile-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-lg focus:bg-white focus:p-3">Skip to content</a>
    <header ref={header} className="sticky top-2 z-50 mx-3 mt-2 rounded-xl border border-[#e4e4e7] bg-white/95 backdrop-blur-lg">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" aria-label="EveryKaptions home"><MobileHeaderLogo /></Link>
        <button ref={toggle} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-landing-menu" onClick={() => setMenuOpen(open => !open)} className="grid size-11 cursor-pointer place-items-center rounded-lg text-[#3f3f46] outline-none focus-visible:outline-none">{menuOpen ? <X size={22} /> : <Menu size={23} />}</button>
      </div>
      {menuOpen && <nav id="mobile-landing-menu" aria-label="Mobile navigation" className="absolute inset-x-0 top-[calc(100%+8px)] max-h-[70dvh] overflow-auto rounded-xl border border-[#e4e4e7] bg-white p-3 shadow-lg">
        <MobileAccountSummary />
        {navigation.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center px-3 text-[14px] font-medium">{label}</Link>)}
        <div className="flex items-center justify-between border-t border-[#ededf0]">
        {user ? <Link href="/studio" className="flex min-h-11 items-center px-3 font-semibold text-[#c63838]" onClick={() => setMenuOpen(false)}>My studio</Link> : <button type="button" className="flex min-h-11 w-full cursor-pointer items-center px-3 text-[14px] font-semibold text-[#c63838]" onClick={() => { setMenuOpen(false); openAuthModal("signin"); }}>Sign in</button>}
        {user && <button type="button" className="flex min-h-11 cursor-pointer items-center px-3 text-[13px] text-[#71717a]" onClick={async () => {
          setSignOutError(null);
          const { error } = await signOut();
          if (error) setSignOutError(error.message);
          else setMenuOpen(false);
        }}>Sign out</button>}
        </div>
        {signOutError && <p role="alert" className="px-3 pb-2 text-xs text-[#b32e2e]">{signOutError}</p>}
      </nav>}
    </header>

    <main id="mobile-main" className="mx-auto max-w-[600px] px-5">
      <section className="pb-7 pt-8" aria-labelledby="mobile-hero-heading">
        <h1 id="mobile-hero-heading" className="text-[clamp(32px,9.2vw,48px)] font-[800] leading-[1.08] tracking-[-0.055em]">Auto captions.<br /><span className="text-[#c63838]">Made for your voice.</span></h1>
        <p className="mt-4 max-w-[290px] text-[15px] leading-[1.65] text-[#62626c]">Turn videos into editable word-by-word captions. Style them, sync them, and share your story.</p>
        <CaptionCta className="mt-5 min-h-12 w-full rounded-lg px-3 text-[14px]" />
        <p className="mt-2.5 text-center text-[11px] text-[#71717a]">3 free minutes every month. No card needed.</p>
        <figure className="mt-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#dedee5] bg-[#f4f4f5]">
            <Image key={preview.image} src={`/landing/${preview.image}.webp`} alt={preview.alt} fill unoptimized loading="eager" sizes="(max-width: 767px) 100vw, 560px" className="object-cover object-[50%_35%]" />
            <p className="absolute bottom-4 left-3 whitespace-nowrap text-[clamp(13px,3.6vw,18px)] leading-[1.25] tracking-[-0.025em]" aria-live="polite"><span className={preview.caption}>{preview.lines.join(" ")}</span></p>
          </div>
          <figcaption className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Preview caption styles">{previews.map((item, index) => <button type="button" key={item.label} aria-pressed={active === index} onClick={() => setActive(index)} className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border text-[13px] font-semibold ${active === index ? "border-[#c63838] bg-[#c63838] text-white" : "border-[#dedee5] bg-white text-[#3f3f46]"}`}>{item.label}{active === index && <Check size={13} aria-hidden="true" />}</button>)}</figcaption>
        </figure>
      </section>

      <section id="mobile-features" className="scroll-mt-24 border-t border-[#dedee5] py-7" aria-labelledby="mobile-workflow-heading">
        <h2 id="mobile-workflow-heading" className="text-[25px] font-[780] leading-[1.15] tracking-[-0.045em]">From video to story.</h2>
        <ol className="mt-5 space-y-5">{steps.map((step, index) => <li key={step.title} className="flex gap-3.5"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#c63838] text-[13px] font-semibold text-white">{index + 1}</span><div><h3 className="text-[16px] font-bold leading-[1.4] tracking-[-0.025em]">{step.title}</h3><p className="mt-1 text-[13px] leading-[1.6] text-[#62626c]">{step.description}</p></div></li>)}</ol>
      </section>

      <section id="mobile-presets" className="scroll-mt-24 border-t border-[#dedee5] py-7" aria-labelledby="mobile-styles-heading">
        <h2 id="mobile-styles-heading" className="text-[25px] font-[780] leading-[1.15] tracking-[-0.045em]">A look for every voice.</h2>
        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4">{examples.map(example => <figure key={example.label} className="min-w-0"><div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f4f4f5]"><Image src={`/landing/${example.image}.webp`} alt={`${example.label} caption style example`} fill unoptimized sizes="(max-width: 767px) 50vw, 260px" className="object-cover object-top" /><p className={`absolute bottom-2 left-1/2 w-max max-w-[calc(100%-16px)] -translate-x-1/2 rounded-[3px] px-1.5 py-1 text-center text-[10px] font-semibold leading-[1.3] ${example.caption}`}>{example.text}</p></div><figcaption className="mt-1.5 text-[12px] font-semibold">{example.label}</figcaption></figure>)}</div>
        <p className="mt-4 text-[11px] leading-[1.6] text-[#71717a]">Style previews. Make them your own in the editor.</p>
      </section>

      <section id="mobile-languages" className="scroll-mt-24 border-t border-[#dedee5] py-7" aria-labelledby="mobile-languages-heading">
        <h2 id="mobile-languages-heading" className="text-[25px] font-[780] leading-[1.15] tracking-[-0.045em]">Speak your language.</h2>
        <ul className="mt-4 flex flex-wrap gap-2 text-[12px] text-[#52525b]">{["Hinglish", "Hindi", "English", "Tamil", "Kannada", "+ more"].map(language => <li key={language} className="rounded-lg border border-[#d4d4d8] px-2.5 py-2">{language}</li>)}</ul>
      </section>

      <section id="mobile-faq" className="scroll-mt-24 border-t border-[#dedee5] pb-8 pt-7" aria-labelledby="mobile-faq-heading">
        <h2 id="mobile-faq-heading" className="text-[25px] font-[780] leading-[1.15] tracking-[-0.045em]">A few helpful answers.</h2>
        <div className="mt-4 border-t border-[#dedee5]">{questions.map(item => <details key={item.question} className="group border-b border-[#dedee5]"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[14px] font-semibold [&::-webkit-details-marker]:hidden">{item.question}<ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" /></summary><p className="pb-4 text-[13px] leading-[1.75] text-[#62626c]">{item.answer}</p></details>)}</div>
        <Link href="/support" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold text-[#b32e2e]">Talk to us<ArrowUpRight size={14} aria-hidden="true" /></Link>
      </section>
    </main>

    <footer className="rounded-t-2xl bg-[#18181b] px-5 pb-6 pt-8 text-white">
      <div className="mx-auto max-w-[560px]">
        <h2 className="max-w-[340px] text-[28px] font-[780] leading-[1.15] tracking-[-0.045em] text-white">Your next video,<br />understood.</h2>
        <CaptionCta tone="white" className="mt-5 min-h-12 w-full rounded-lg text-[14px]">Create captions</CaptionCta>
        <nav aria-label="Footer links" className="mt-6 flex flex-nowrap gap-x-5 whitespace-nowrap text-[12px] text-[#d4d4d8]">{[["Privacy", "/legal/privacy"], ["Terms", "/legal/terms"], ["Refunds", "/legal/refund"], ["Support", "/support"], ["Data", "/legal/data-deletion"]].map(([label, href]) => <Link key={href} href={href} className="flex min-h-11 items-center">{label}</Link>)}</nav>
        <p className="mt-4 border-t border-white/15 pt-4 text-[10px] text-[#a1a1aa]">© {new Date().getFullYear()} EveryKaptions</p>
      </div>
    </footer>
  </div>;
}
