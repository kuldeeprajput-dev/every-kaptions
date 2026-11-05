import { MobileLandingPage } from "./mobile-landing-page";
import { SiteHeader } from "@/shared/components/site-header";
import Link from "next/link";
import { CaptionShowcase } from "./caption-showcase";
import { CaptionCta, EditorDemoCta } from "./landing-ui";
import { LandingFeatures } from "./landing-features";
import {
  LandingPresets,
  LandingUseCases,
} from "./landing-gallery";
import { LandingCreatorReviews } from "./landing-creator-reviews";
import { LandingFaq } from "./landing-faq";
import { LandingFooter } from "./landing-footer";

export function LandingPage() {
  return (
    <>
    <MobileLandingPage />
    <div className="hidden md:block min-h-screen bg-white text-[#18181b] font-sans antialiased selection:bg-amber/30 selection:text-black">
      <SiteHeader />
      <main id="main-content" className="w-full">
        <section
          className="mx-auto flex w-full max-w-[1240px] flex-col items-center px-5 pb-10 pt-10 text-center sm:px-7 sm:pb-14 sm:pt-12"
          aria-labelledby="hero-heading"
        >
          <div className="w-full max-w-[960px]">
            <h1
              id="hero-heading"
              className="text-[clamp(42px,5.3vw,72px)] font-[800] leading-[1.06] tracking-[-0.06em] text-[#18181b]"
            >
              Auto captions.
              <br />
              <span className="text-[#c63838]">Made for your voice.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[620px] text-[15px] leading-[1.7] text-[#5b5b65] sm:text-[17px]">
              Turn videos into editable word-by-word captions.
              Style them, sync them, and share your story.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <CaptionCta className="min-h-[49px] px-6 text-[14px]" />
              <EditorDemoCta />
            </div>
            <p className="mt-3 text-[11px] text-[#71717a]">3 free minutes every month. No card needed.</p>
          </div>
          <CaptionShowcase />
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] font-semibold text-[#52525b]" aria-label="Featured caption languages">
            <span lang="hi-Latn">Hinglish</span>
            <span className="size-1 rounded-full bg-[#d4d4d8]" aria-hidden="true" />
            <span lang="hi">हिन्दी</span>
            <span className="size-1 rounded-full bg-[#d4d4d8]" aria-hidden="true" />
            <span>English</span>
            <Link href="/#languages" className="font-normal text-[#71717a] hover:text-[#c63838]">&amp; more</Link>
          </div>
        </section>

        <LandingFeatures />
        <LandingPresets />
        <LandingCreatorReviews />
        <LandingUseCases />
        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
    </>
  );
}
