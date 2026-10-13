import Image from "next/image";
import { Captions, Download, Upload } from "lucide-react";
import { CaptionCta } from "./landing-ui";

const steps = [
  {
    title: "Upload your video.",
    description: "Choose a video or audio file from your device, then select the language you speak.",
    icon: Upload,
  },
  {
    title: "Generate your captions.",
    description: "Turn your speech into a transcript. Review the words and make any corrections.",
    icon: Captions,
  },
  {
    title: "Make it yours & export.",
    description: "Adjust the timing and style. Download your captioned video or subtitle file.",
    icon: Download,
  },
];
export function LandingWorkflowSteps() {
  return (
    <section
      id="how-it-works"
      className="landing-section workflow-section"
      aria-labelledby="workflow-heading"
    >
      <div className="workflow-card">
        <h2 id="workflow-heading">From upload to ready-to-post.</h2>
        <div className="workflow-banner">
          <Image
            src="/media/landing/paper-backdrop.webp"
            className="ribbon-art"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1000px"
          />
          <div>
            <p>YOUR STORY.<br />WITH CAPTIONS.</p>
            <CaptionCta href="/editor/demo" tone="white">
              Explore the editor demo
            </CaptionCta>
          </div>
          <div className="workflow-portrait">
            <Image
              src="/media/landing/creator-cutout.webp"
              alt="Video creator"
              fill
              sizes="(max-width: 768px) 45vw, 400px"
            />
          </div>
        </div>
        <div className="workflow-steps">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <article key={title}>
              <span className="step-number">{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
