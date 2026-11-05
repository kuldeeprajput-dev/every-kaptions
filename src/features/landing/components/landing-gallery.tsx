import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  captionStyles,
  indianLanguageOptions,
} from "@/features/editor/data/editor-config";
import { CaptionCta } from "./landing-ui";

const presetIds = [
  "minimal",
  "yellow",
  "hormozi",
  "classic",
  "viral_alex",
  "red_box",
];

const photos = [
  "creator-outdoor",
  "preset-yellow-v2",
  "creator-podcast",
  "preset-classic-v2",
  "preset-green-v2",
  "preset-red-v2",
];

const uses = [
  {
    title: "Reels & Shorts",
    description: "Make your next scroll-stopping moment easier to follow.",
    photo: "creator-outdoor",
    caption: (
      <>
        A little <mark className="inline-block text-white bg-[#c63838] px-1 rounded-xs">more you.</mark>
      </>
    ),
  },
  {
    title: "Tutorials",
    description: "Keep each tip, step, and little detail clear.",
    photo: "usecase-tutorial-v2",
    caption: (
      <>
        <mark className="inline-block text-white bg-[#c63838] px-1 rounded-xs">Step one:</mark> tell your story.
      </>
    ),
  },
  {
    title: "Podcasts",
    description: "Bring the best moments of your conversation to the feed.",
    photo: "creator-podcast",
    caption: (
      <>
        Ideas make a <mark className="inline-block text-white bg-[#c63838] px-1 rounded-xs">brighter you.</mark>
      </>
    ),
  },
  {
    title: "Explainers",
    description: "Help the words land when you have something to share.",
    photo: "usecase-explainer-v2",
    caption: (
      <>
        Small changes.<mark className="inline-block text-white bg-[#c63838] px-1 rounded-xs">Big ideas.</mark>
      </>
    ),
  },
];

export function LandingPresets() {
  return (
    <section id="presets" className="w-full border-y border-[#e6e6ec] bg-[#f5f5f5] py-11 sm:py-14" aria-labelledby="presets-heading">
      <div className="mx-auto w-full max-w-[1176px] px-5 sm:px-7">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end sm:gap-8">
          <h2 id="presets-heading" className="max-w-[540px] text-[clamp(29px,3vw,40px)] font-[780] leading-[1.1] tracking-[-0.055em] text-[#18181b]">
            Find a style for your story.
          </h2>
          <p className="max-w-[240px] text-[13px] leading-[1.75] text-[#71717a]">
            A different look for every voice.<br />Choose a starting point. Make it yours.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-3">
          {presetIds.map((id, index) => {
            const style = captionStyles.find((item) => item.id === id)!;
            return (
              <Link
                href="/editor/demo"
                key={id}
                className="group block min-w-0 rounded-2xl border border-[#dfdfe6] bg-white p-1.5 no-underline shadow-[0_3px_10px_-5px_rgba(24,24,27,0.15)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-[#bdbdc7] hover:shadow-[0_12px_24px_-14px_rgba(24,24,27,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c63838] motion-reduce:transform-none motion-reduce:transition-none"
                aria-label={`Explore ${style.name} in the caption editor`}
              >
                <div className="relative aspect-[9/13] overflow-hidden rounded-[10px] bg-[#e4e4e7]">
                  <Image
                    src={`/landing/${photos[index]}.webp`}
                    alt={`Creator portrait with a ${style.name} caption example`}
                    fill
                    unoptimized
                    className="object-cover object-[50%_25%]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[35%] bg-gradient-to-t from-black/25 to-transparent" aria-hidden="true" />
                  <p className={`pointer-events-none absolute inset-x-[5%] bottom-[9%] z-[2] mx-auto w-fit max-w-[90%] rounded-md px-2 py-1.5 text-center text-[clamp(10px,0.9vw,13px)] font-[750] leading-[1.4] ${style.textClass} ${style.previewClass}`}>
                    Your story.<br /><span className={style.activeWordClass}>Your way.</span>
                  </p>
                </div>
                <span className="flex min-h-11 items-center justify-between gap-1 px-1.5 pb-0.5 pt-1 text-[11px] font-semibold text-[#3f3f46] transition-colors group-hover:text-[#18181b]">
                  <span>{style.name}</span>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#f5f5f7] text-[#71717a] transition-colors group-hover:bg-[#18181b] group-hover:text-white"><ArrowRight size={12} aria-hidden="true" /></span>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[11px] text-[#8b8b95]">Preview a style in the editor, then adjust the font, color, and placement.</p>
      </div>
    </section>
  );
}

export function LandingUseCases() {
  return (
    <section className="w-full bg-[#f5f5f5] py-12 sm:py-14" aria-labelledby="use-cases-heading">
      <div className="w-full max-w-[1176px] mx-auto px-7">
        <div className="text-left mb-7">
          <h2 id="use-cases-heading" className="text-[clamp(28px,3vw,40px)] font-[780] tracking-[-0.055em] leading-[1.12] text-[#18181b]">
            One tool. So many ways
            <br />
            to tell a story.
          </h2>
          <p className="text-[#6b6b76] text-sm leading-[1.7] mt-3">
            Make the words work for the content you love to create.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {uses.map((item) => (
            <Link
              href="/studio"
              key={item.title}
              className="overflow-hidden rounded-[13px] bg-white block shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group no-underline"
            >
              <div className="relative aspect-[1.2] overflow-hidden">
                <Image
                  src={`/landing/${item.photo}.webp`}
                  alt={`${item.title} creator example`}
                  fill
                  unoptimized
                  className="object-cover object-[50%_35%] transition-transform duration-300 group-hover:scale-105"
                />
                <p className="absolute bottom-[12%] inset-x-[8%] mx-auto w-fit p-1 px-2 text-white bg-[#171719]/85 rounded text-[15px] font-[750] leading-[1.4] text-center tracking-[-0.03em] backdrop-blur-xs">
                  {item.caption}
                </p>
              </div>
              <div className="p-4.5 flex flex-col gap-1.5">
                <h3 className="flex justify-between items-center gap-2 text-base font-bold text-[#18181b] tracking-[-0.035em]">
                  <span>{item.title}</span>
                  <ArrowRight size={17} className="text-[#c63838] transition-transform duration-200 group-hover:translate-x-1" />
                </h3>
                <p className="text-[#6b6b76] text-[11px] leading-[1.75]">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingLanguages() {
  return (
    <section
      id="languages"
      className="w-full max-w-[1176px] mx-auto px-7 pt-[75px] pb-[45px] grid grid-cols-1 lg:grid-cols-[1fr_1.08fr] gap-[35px] items-center"
      aria-labelledby="languages-heading"
    >
      <div className="flex flex-col">
        <h2
          id="languages-heading"
          className="text-[clamp(29px,3.1vw,42px)] font-[780] tracking-[-0.055em] leading-[1.12] text-[#18181b] mb-[22px]"
        >
          Different languages.
          <br />
          One clear message.
        </h2>
        <div className="bg-[#f3f3f3] rounded-[18px] p-[27px] flex flex-col">
          <p className="text-[17px] leading-[1.5] text-[#34343c] tracking-[-0.02em] font-medium">
            Create captions in the language you speak and bring more people into
            the story.
          </p>
          <p className="text-[14px] leading-[1.8] text-[#5b5b65] mt-[15px]">
            Choose from English and supported Indian languages, including
            Hinglish, Hindi, Tamil, and Kannada. Review the transcript and shape
            every line before you share.
          </p>
          <div
            className="flex flex-wrap gap-1.5 mt-5"
            aria-label="Supported spoken languages"
          >
            {indianLanguageOptions
              .filter((option) => option.supported)
              .map((option) => (
                <span
                  key={option.value}
                  className="text-[#6b6b76] bg-white border border-[#dedee5] rounded-full px-2.5 py-1 text-[9px] font-semibold"
                >
                  {option.value === "te" ? "Hinglish" : option.label}
                </span>
              ))}
          </div>
        </div>
        <CaptionCta className="mt-5 self-start" />
      </div>

      <div className="relative w-full aspect-square rounded-[19px] overflow-hidden bg-[#f5f5f5]">
        <Image
          src="/landing/language-tiles-teal.webp"
          alt="Speech bubbles representing Hinglish, Hindi, and English"
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover grayscale"
        />
      </div>
    </section>
  );
}
