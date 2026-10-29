import { SiteHeader } from "@/shared/components/site-header";
import Link from "next/link";
import { Play } from "lucide-react";
import { CaptionDemo } from "./caption-demo";
import { CaptionCta } from "./landing-ui";
import { LandingFeatures } from "./landing-features";
import { LandingWorkflowSteps } from "./landing-workflow-steps";
import {
  LandingPresets,
  LandingUseCases,
} from "./landing-gallery";
import { LandingLanguageShowcase } from "./landing-language-showcase";
import { LandingCreatorReviews } from "./landing-creator-reviews";
import { LandingFaq } from "./landing-faq";
import { LandingFooter } from "./landing-footer";
import { regionalCreatorTestimonials } from "../data/landing-content";
import "./landing.css";

export function LandingPage() {
  return (
    <div className="landing-page">
      <SiteHeader />
      <main id="main-content" className="landing">
        <section className="landing-hero" aria-labelledby="hero-heading">
          <div className="hero-intro">
            <h1 id="hero-heading">
              Auto captions.
              <br />
              <span>Made for your voice.</span>
            </h1>
            <p>
              Turn videos into editable word-by-word captions. Style them, sync
              them, and share your story.
            </p>
            <div className="hero-actions">
              <CaptionCta />
              <Link className="hero-editor-link" href="/editor/demo">
                <Play size={15} fill="currentColor" /> Try the editor
              </Link>
            </div>
            <small>3 free minutes every month. No card needed.</small>
          </div>
          <CaptionDemo />
          <div className="hero-languages" aria-label="Featured languages">
            <span lang="te">తెలుగు</span>
            <i />
            <span lang="hi">हिन्दी</span>
            <i />
            <span>English</span>
            <span className="hero-more-languages">& more</span>
          </div>
        </section>
        <LandingFeatures />
        <LandingWorkflowSteps />
        <LandingPresets />
        <LandingCreatorReviews />
        <LandingUseCases />
        <LandingLanguageShowcase />

        {/* Languages Summary Metric Banner */}
        <div className="mx-auto max-w-4xl px-4 py-4 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/8 bg-[#0f1011] px-6 py-3 text-xs text-[#888]">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#f6c453]" />
              <strong className="text-cream">8 Indian Languages</strong> Supported
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#22c55e]" />
              <strong className="text-cream">99.4%</strong> Word-Level Sync Accuracy
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#06b6d4]" />
              <strong className="text-cream">Zero Setup</strong> In-Browser Audio AI
            </span>
          </div>
        </div>

        {/* Regional Creator Testimonials */}
        <section className="mx-auto max-w-6xl px-4 py-8 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {regionalCreatorTestimonials.slice(0, 3).map((item) => (
              <div
                key={item.creator}
                className="rounded-2xl border border-white/8 bg-[#121315] p-5 space-y-3 shadow-sm hover:border-white/15 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-cream">{item.creator}</h3>
                    <p className="text-[11px] text-[#788084]">{item.channel} · {item.subscriberCount} followers</p>
                  </div>
                  <span className="rounded-md border border-[#f6c453]/30 bg-[#f6c453]/10 px-2 py-0.5 text-[10px] font-bold text-[#f6c453]">
                    {item.language}
                  </span>
                </div>
                <p className="text-xs text-[#b8bebe] leading-relaxed">&ldquo;{item.feedback}&rdquo;</p>
              </div>
            ))}
          </div>
        </section>

        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
