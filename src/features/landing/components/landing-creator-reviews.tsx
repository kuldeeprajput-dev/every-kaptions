"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { spotlightReviews } from "../data/landing-content";

const reviews = spotlightReviews.slice(0, 3);

export function LandingCreatorReviews() {
  const [active, setActive] = useState(0);
  const review = reviews[active];

  return (
    <section
      className="w-full max-w-[1176px] mx-auto px-7 pt-12 pb-12"
      aria-label="Creator reviews"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 items-center p-6 sm:p-12 bg-[#18181b] rounded-[23px] text-white shadow-xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#e2e2e8]">
            EVERYKAPTIONS, IN THEIR WORDS
          </span>
          <h2 className="text-[clamp(29px,3.2vw,43px)] font-[780] tracking-[-0.055em] leading-[1.1] text-white mt-4">
            Made for the way
            <br />
            creators create.
          </h2>
          <p className="text-[#c4c4cd] text-[13px] leading-[1.8] max-w-[350px] mt-5">
            A focused caption tool for people who want to get the words right
            and get back to creating.
          </p>
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() =>
                setActive((active + reviews.length - 1) % reviews.length)
              }
              aria-label="Previous review"
              className="w-[34px] h-[34px] rounded-full border border-white/25 text-white grid place-items-center hover:bg-white/10 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setActive((active + 1) % reviews.length)}
              aria-label="Next review"
              className="w-[34px] h-[34px] rounded-full border border-white/25 text-white grid place-items-center hover:bg-white/10 transition cursor-pointer"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative min-w-0 pt-4 pr-3.5">
          <figure key={review.handle} className="relative z-[1] bg-[#f3f3f3] rounded-xl p-7 min-h-[220px] flex flex-col text-[#18181b]">
            <blockquote className="text-[#292931] text-[19px] leading-[1.6] tracking-[-0.03em] flex-1 font-medium">
              &ldquo;{review.quote}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3 mt-6">
              <Image
                src={`/reviews/demo-creator-${active + 1}.png`}
                width={48}
                height={48}
                alt="AI-generated demo portrait, not the reviewer's photo"
                className="rounded-full size-11 object-cover border border-zinc-300"
              />
              <div>
                <strong className="block text-xs font-bold text-[#55565f]">
                  {review.handle}
                </strong>
                <small className="block mt-0.5 text-[#8d8e97] text-[10px]">
                  AI-generated demo portrait
                </small>
              </div>
            </figcaption>
          </figure>

          <div
            className="flex justify-center gap-2 mt-5 relative z-10"
            role="group"
            aria-label="Choose a creator review"
          >
            {reviews.map((item, index) => (
              <button
                key={item.handle}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Read review from ${item.handle}`}
                aria-pressed={active === index}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  active === index
                    ? "bg-[#c63838] scale-110"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-9">
        <div className="text-center rounded-[9px] py-4 px-2.5 bg-[#f3f3f3]">
          <strong className="block text-[#24242c] text-base font-bold tracking-[-0.03em]">
            Word by word
          </strong>
          <span className="block mt-1 text-[#81818b] text-[10px]">
            Fine-tune your caption timing
          </span>
        </div>
        <div className="text-center rounded-[9px] py-4 px-2.5 bg-[#f3f3f3]">
          <strong className="block text-[#24242c] text-base font-bold tracking-[-0.03em]">
            Your kind of style
          </strong>
          <span className="block mt-1 text-[#81818b] text-[10px]">
            Fonts, colors, and placement
          </span>
        </div>
        <div className="text-center rounded-[9px] py-4 px-2.5 bg-[#f3f3f3]">
          <strong className="block text-[#24242c] text-base font-bold tracking-[-0.03em]">
            Ready to share
          </strong>
          <span className="block mt-1 text-[#81818b] text-[10px]">
            Video and subtitle exports
          </span>
        </div>
      </div>
    </section>
  );
}
