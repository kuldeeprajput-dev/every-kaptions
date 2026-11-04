import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const previews = [
  {
    image: "creator-podcast",
    alt: "Podcast creator with a bold caption example",
    label: "Bold & expressive",
    firstLine: "EVERY WORD.",
    secondLine: "WORTH HEARING.",
    caption: "bg-[#c63838] px-2 py-1 font-extrabold text-white",
    frame: "sm:rotate-[-3deg] sm:translate-y-4",
  },
  {
    image: "creator-lifestyle",
    alt: "Lifestyle creator with a clean caption example",
    label: "Clean & simple",
    firstLine: "A little more",
    secondLine: "you.",
    caption: "rounded-md bg-white px-2.5 py-1 font-bold text-[#18181b]",
    frame: "sm:-translate-y-2",
  },
  {
    image: "creator-outdoor",
    alt: "Outdoor creator with a minimal caption example",
    label: "Quiet & minimal",
    firstLine: "Your story.",
    secondLine: "In your words.",
    caption: "rounded-md bg-[#18181b]/90 px-2.5 py-1 font-medium text-white",
    frame: "sm:rotate-[3deg] sm:translate-y-4",
  },
];

export function CaptionShowcase() {
  return (
    <section className="mt-12 w-full max-w-[940px] text-left sm:mt-14" aria-labelledby="caption-showcase-heading">
      <div className="mb-7 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end sm:gap-8">
        <h2 id="caption-showcase-heading" className="text-[28px] font-bold leading-[1.12] tracking-[-0.05em] text-[#18181b] sm:text-[34px]">
          Every word. <span className="text-[#c63838]">Your way.</span>
        </h2>
        <p className="max-w-[290px] text-[13px] leading-[1.7] text-[#71717a]">
          The same voice, a different feeling.
          Find the caption style that feels like you.
        </p>
      </div>

      <div className="mx-auto grid max-w-[840px] grid-cols-3 gap-2.5 px-1 sm:gap-6 sm:px-3">
        {previews.map((preview) => (
          <figure key={preview.image} className={`m-0 min-w-0 ${preview.frame}`}>
            <div className="rounded-[14px] border border-[#e0e0e5] bg-white p-1.5 shadow-[0_12px_28px_-16px_rgba(24,24,27,0.25)] sm:rounded-[20px] sm:p-2">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[9px] bg-[#e4e4e7] sm:rounded-[13px]">
                <Image
                  src={`/media/landing/${preview.image}.webp`}
                  alt={preview.alt}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-[14%] text-center text-[clamp(9px,1.8vw,22px)] leading-[1.8] tracking-[-0.035em]">
                  <span className={preview.caption}>{preview.firstLine}</span>
                  <br />
                  <span className={preview.caption}>{preview.secondLine}</span>
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-[9px] font-medium text-[#71717a] sm:mt-4 sm:text-[12px]">{preview.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-7 flex flex-col items-center gap-1.5 sm:mt-11">
        <Link href="/#presets" className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-[#18181b] transition-colors hover:text-[#c63838]">
          Find your caption style <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <p className="text-center text-[10px] text-[#8b8b95]">Caption style examples. Customize your own in the editor.</p>
      </div>
    </section>
  );
}
