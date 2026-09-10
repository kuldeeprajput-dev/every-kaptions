"use client";

import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/shared/components/site-header";
import { useAuth } from "@/features/auth/store/auth-store";
import { LandingCreatorReviews } from "./landing-creator-reviews";
import { LandingWorkflowSteps } from "./landing-workflow-steps";

export function LandingPage() {
  const { user, openAuthModal } = useAuth();

  return (
    <>
      <SiteHeader />
      <main className="w-full max-w-none px-[var(--page-gutter)] pb-[clamp(64px,6vw,120px)] max-[899px]:pb-[max(80px,env(safe-area-inset-bottom,0px)+72px)] max-[480px]:pb-16">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center gap-[clamp(16px,2.5vw,36px)] min-h-[calc(88vh-64px)] py-[clamp(56px,9vh,100px)] pb-[clamp(56px,8vh,96px)] overflow-hidden animate-[fadeUp_0.7s_ease_both] border-b border-[var(--hairline)] max-[899px]:gap-7">
          <video
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1600px] h-full object-cover object-top z-0 pointer-events-none mix-blend-screen opacity-[0.62] brightness-[0.85]"
            autoPlay
            muted
            loop
            playsInline
            poster="/media/hero-glow-poster.jpg"
            aria-hidden="true"
          >
            <source src="/media/hero-glow.mp4" type="video/mp4" />
          </video>
          <div className="relative z-[1] min-w-0 overflow-visible max-w-[640px] min-[1200px]:max-w-[960px] mx-auto flex flex-col items-center">
            <div className="inline-block text-[clamp(10px,0.45vw+8px,13px)] font-semibold tracking-[0.85px] uppercase text-amber mb-3.5 [text-shadow:0_1px_3px_rgba(0,0,0,0.7),0_0_18px_rgba(246,196,83,0.18)]">
              For creators who post in their own language
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5vw+0.75rem,6.75rem)] font-normal leading-[1.06] tracking-[-0.02em] text-cream mx-auto mb-4 max-w-[14em] animate-[heroTextShine_4s_ease-in-out_infinite]">
              Your content studio for every post.
            </h1>
            <p className="text-[clamp(16px,1.4vw+13px,25px)] text-dim leading-[1.55] max-w-[46ch] mx-auto mb-5">
              Editable word-by-word captions, plus a title, caption, hashtags, and thumbnail, ready to post.
            </p>
            {user ? (
              <Link
                href="/editor"
                id="heroCta"
                className="btn-primary btn-open-app inline-flex items-center justify-center box-border no-underline min-h-[52px] px-[28px] bg-cream !text-[#0c0b0a] text-[clamp(15px,0.6vw+12px,18px)] font-semibold rounded-full cursor-pointer shadow-[var(--gold-glow)] hover:-translate-y-px hover:shadow-[var(--gold-glow-hover)] transition-[transform,box-shadow] duration-150 active:translate-y-0"
              >
                Open app
              </Link>
            ) : (
              <button
                type="button"
                id="heroCta"
                onClick={() => openAuthModal("signin")}
                className="btn-primary btn-open-app inline-flex items-center justify-center box-border no-underline min-h-[52px] px-[28px] bg-cream !text-[#0c0b0a] text-[clamp(15px,0.6vw+12px,18px)] font-semibold rounded-full cursor-pointer shadow-[var(--gold-glow)] hover:-translate-y-px hover:shadow-[var(--gold-glow-hover)] transition-[transform,box-shadow] duration-150 active:translate-y-0"
              >
                Get started
              </button>
            )}
          </div>
        </section>

        {/* Founder Section */}
        <section className="section-founder py-[clamp(36px,4vw,72px)] border-t border-[var(--hairline)] animate-[fadeUp_0.7s_ease_0.1s_both]">
          <div className="founder-grid grid grid-cols-[minmax(0,1fr)_320px] max-[899px]:grid-cols-1 gap-8 min-[1024px]:gap-[88px] items-center">
            <div className="founder-copy min-w-0">
              <div className="section-label text-[13px] font-semibold tracking-[0.85px] uppercase text-amber mb-[14px] [text-shadow:0_0_18px_rgba(246,196,83,0.18)]">
                Built by a creator, not an agency
              </div>
              <h2 className="is-visible font-display text-[clamp(1.5rem,0.5rem+2vw,2.75rem)] font-bold text-cream mb-[16px] tracking-[-0.02em] leading-[1.55]">
                Built by @ssktechy
              </h2>
              <p className="is-visible text-[clamp(15px,2vw,17px)] text-[#C8C2B6] leading-[1.65] max-w-[58ch] border-l-[3px] border-[rgba(246,196,83,0.65)] pl-[16px]">
                I caption Reels and Shorts every day. Auto captioning tools get native-language spelling wrong, and typing every word out by hand is too slow, so I built the tool I actually needed. Edit the details, then publish with confidence.
              </p>
              <div className="founder-stats flex flex-wrap gap-2.5 mt-5">
                <span className="founder-stat is-visible inline-flex items-center gap-2 px-[14px] py-[10px] rounded-full border border-[rgba(246,196,83,0.28)] bg-[#F6C45314] text-cream text-[13px] hover:border-[rgba(246,196,83,0.5)] hover:bg-[rgba(246,196,83,0.12)] hover:-translate-y-px transition-[border-color,background-color,transform] duration-150">
                  <span className="founder-stat-text">
                    <strong className="text-amber font-bold">300K+</strong> followers across platforms
                  </span>
                </span>
              </div>
            </div>
            <div className="founder-visual flex justify-end max-[899px]:justify-center max-[899px]:order-first">
              <Image
                className="founder-photo is-visible w-[320px] h-[480px] max-[899px]:w-[min(72vw,280px)] max-[899px]:h-auto aspect-[2/3] rounded-[20px] object-cover border border-[var(--hairline-strong)] shadow-[var(--card-shadow),0_0_40px_rgba(246,196,83,0.12)]"
                src="/media/founder.webp"
                width={320}
                height={480}
                alt="Sai Santosh Kumar (@ssktechy)"
                priority
              />
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <LandingCreatorReviews />

        {/* Workflow & Features */}
        <LandingWorkflowSteps />

        {/* Access CTA Section */}
        <section className="pt-[clamp(48px,5vw,96px)] pb-[clamp(24px,2.5vw,48px)] border-t border-[var(--hairline)] animate-[fadeUp_0.7s_ease_0.26s_both]">
          <div className="bg-surface-raised border border-[var(--hairline-strong)] rounded-[20px] p-[clamp(28px,5vw,40px)] text-center shadow-[var(--card-shadow)]">
            <h2 className="font-display text-[clamp(24px,2vw+14px,40px)] font-bold text-cream mb-3 tracking-[-0.02em] leading-[1.55]">
              Make your next post from one upload.
            </h2>
            <p className="text-[clamp(15px,0.9vw+12px,19px)] text-body max-w-[42ch] mx-auto mb-6 leading-[1.55]">
              Paid plans include editable captions, a title, caption, and hashtags. Creator and Studio also include thumbnails, with more options on Studio.
            </p>
            {user ? (
              <Link
                href="/editor"
                id="accessCta"
                className="btn-primary btn-open-app inline-flex items-center justify-center box-border no-underline min-h-[52px] px-[28px] bg-cream !text-[#0c0b0a] text-[clamp(15px,0.6vw+12px,18px)] font-semibold rounded-full cursor-pointer shadow-[var(--gold-glow)] hover:-translate-y-px hover:shadow-[var(--gold-glow-hover)] transition-[transform,box-shadow] duration-150 active:translate-y-0"
              >
                Open app
              </Link>
            ) : (
              <button
                type="button"
                id="accessCta"
                onClick={() => openAuthModal("signin")}
                className="btn-primary btn-open-app inline-flex items-center justify-center box-border no-underline min-h-[52px] px-[28px] bg-cream !text-[#0c0b0a] text-[clamp(15px,0.6vw+12px,18px)] font-semibold rounded-full cursor-pointer shadow-[var(--gold-glow)] hover:-translate-y-px hover:shadow-[var(--gold-glow-hover)] transition-[transform,box-shadow] duration-150 active:translate-y-0"
              >
                Get started
              </button>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-[clamp(40px,4vw,72px)] pt-6 border-t border-[var(--hairline)] flex flex-wrap justify-between gap-4 text-xs text-muted animate-[fadeUp_0.7s_ease_0.32s_both] max-[899px]:gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2 footer-links">
            <Link href="/legal/terms" className="!text-dim hover:!text-cream no-underline transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="!text-dim hover:!text-cream no-underline transition-colors">Privacy</Link>
            <Link href="/legal/refund" className="!text-dim hover:!text-cream no-underline transition-colors">Refunds</Link>
            <Link href="/legal/contact" className="!text-dim hover:!text-cream no-underline transition-colors">Contact</Link>
            <Link href="/roadmap" className="!text-dim hover:!text-cream no-underline transition-colors">Roadmap</Link>
            <Link href="/support" className="!text-dim hover:!text-cream no-underline transition-colors">Support</Link>
            <a href="https://www.instagram.com/replixcaptions/" target="_blank" rel="noopener noreferrer" className="!text-dim hover:!text-cream no-underline transition-colors">Instagram</a>
          </div>
          <div className="flex flex-col items-end gap-1 text-right max-[899px]:items-start max-[899px]:text-left max-[899px]:w-full footer-meta">
            <span>Made by <a href="https://www.instagram.com/ssktechy/" target="_blank" rel="noopener noreferrer" className="footer-creator !text-dim hover:!text-cream no-underline transition-colors">@ssktechy</a></span>
          </div>
        </footer>
      </main>
    </>
  );
}
