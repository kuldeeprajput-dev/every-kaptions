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
    id: "languages",
    title: "Your language. Your words.",
    description:
      "Create captions in Indian languages including Telugu, Hindi, English, Tamil, Kannada, and more. Choose your spoken language before you generate.",
    extra:
      "Review every word and make the final version feel natural to your audience.",
    visual: (
      <div className="relative w-full h-[360px]">
        <Image
          className="object-cover grayscale"
          src="/media/landing/language-tiles-teal.webp"
          alt="Speech bubbles with Telugu, Hindi, and English letters"
          fill
          sizes="(max-width: 768px) 100vw, 560px"
        />
      </div>
    ),
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="w-full max-w-[1176px] mx-auto px-7 pt-[72px] pb-[70px]"
      aria-labelledby="features-heading"
    >
      <div className="text-left mb-11">
        <h2
          id="features-heading"
          className="text-[clamp(30px,3.2vw,43px)] leading-[1.12] font-[780] tracking-[-0.055em] text-[#18181b]"
        >
          Less typing. More creating.
        </h2>
        <p className="text-[15px] leading-[1.7] text-[#6b6b76] mt-4 max-w-[640px]">
          A simpler way to get the words right, from your first draft to your
          final video.
        </p>
      </div>

      <div className="grid gap-0">
        {features.map((feature, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <article
              id={feature.id}
              key={feature.id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-11 py-8 border-t border-[#dcdce2] scroll-mt-[100px] items-center ${
                isReversed
                  ? "md:[&>.feature-copy]:order-2 md:[&>.feature-visual]:order-1"
                  : ""
              }`}
            >
              <div className="feature-copy flex flex-col items-start justify-center py-6 pr-5 pl-0">
                <span className="text-xs font-bold tracking-widest text-[#c63838] uppercase mb-2">
                  0{index + 1}
                </span>
                <h3 className="text-[clamp(25px,2.45vw,34px)] font-[740] leading-[1.13] tracking-[-0.055em] text-[#18181b] max-w-[450px]">
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-[1.8] text-[#5b5b65] mt-[18px]">
                  {feature.description}
                </p>
                <p className="text-[14px] leading-[1.8] text-[#5b5b65] mt-3">
                  {feature.extra}
                </p>
                <CaptionCta
                  tone="black"
                  className="mt-[23px] min-h-[40px] text-xs px-[18px] py-[9px]"
                >
                  {index === 0 ? "Start captioning" : "Try it for yourself"}
                </CaptionCta>
              </div>

              <div className={`feature-visual relative flex min-w-0 items-center justify-center overflow-hidden rounded-[19px] bg-[#e9e9ee] ${index < 3 ? "h-[500px] p-4 sm:h-[360px]" : "min-h-[360px]"}`}>
                {index !== 3 && (
                  <Image
                    className={`absolute inset-0 object-cover pointer-events-none grayscale ${
                      index === 1 ? "rotate-180 scale-110" : ""
                    }`}
                    src="/media/landing/paper-backdrop.webp"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                  />
                )}
                {feature.visual}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
