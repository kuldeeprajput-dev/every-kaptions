import Image from "next/image";
import {
  CaptionStyleFeature,
  TimingPreview,
  TranscriptPreview,
} from "./feature-previews";
import { CaptionCta } from "./landing-ui";

const features = [
  {
    id: "auto-captions",
    title: "Get captions without the time-consuming part.",
    description:
      "Start with your video. EveryKaptions turns your speech into an editable first draft, so you can spend less time typing and more time making something worth watching.",
    extra: "Review the words, fix the details, and keep your story moving.",
    visual: <TranscriptPreview />,
  },
  {
    id: "word-timing",
    title: "Keep every word in sync.",
    description:
      "A good caption lands at the right moment. Review word-level timings and adjust your captions to match the way you speak.",
    extra:
      "Make small changes in a visual timeline, with your video right beside you.",
    visual: <TimingPreview />,
  },
  {
    id: "caption-styles",
    title: "Make every caption feel like you.",
    description:
      "Keep it clean. Make it bold. Highlight the moment that matters. Find your font, pick your colors, and position the words where they belong.",
    extra: "Your voice does the talking. Your captions bring the personality.",
    visual: <CaptionStyleFeature />,
  },
  {
    id: "language-preview",
    title: "Your language. Your words.",
    description:
      "Create captions in Indian languages including Telugu, Hindi, English, Tamil, Kannada, and more. Choose your spoken language before you generate.",
    extra:
      "Review every word and make the final version feel natural to your audience.",
    visual: (
      <Image
        className="language-art"
        src="/media/landing/language-tiles-teal.webp"
        alt="Colorful speech bubbles with Telugu, Hindi, and English letters"
        fill
        sizes="(max-width: 768px) 100vw, 560px"
      />
    ),
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="landing-section landing-features"
      aria-labelledby="features-heading"
    >
      <div className="landing-heading">
        <h2 id="features-heading">Less typing. More creating.</h2>
        <p>
          A simpler way to get the words right, from your first draft to your
          final video.
        </p>
      </div>
      <div className="feature-rows">
        {features.map((feature, index) => (
          <article
            id={feature.id}
            className={`feature-row ${index % 2 ? "feature-row--reversed" : ""}`}
            key={feature.id}
          >
            <div className="feature-copy">
              <span className="feature-number">0{index + 1}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <p>{feature.extra}</p>
              <CaptionCta tone="black">
                {index === 0 ? "Start captioning" : "Try it for yourself"}
              </CaptionCta>
            </div>
            <div className={`feature-visual feature-visual--${index}`}>
              {index !== 3 && (
                <Image
                  className="ribbon-art"
                  src="/media/landing/paper-backdrop.webp"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                />
              )}
              {feature.visual}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
