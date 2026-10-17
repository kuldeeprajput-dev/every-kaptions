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
  LandingLanguages,
} from "./landing-gallery";
import { LandingCreatorReviews } from "./landing-creator-reviews";
import { LandingFaq } from "./landing-faq";
import { LandingFooter } from "./landing-footer";
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
        <LandingLanguages />
        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
