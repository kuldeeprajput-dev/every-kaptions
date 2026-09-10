import Image from "next/image";
import {
  type SpotlightReview,
  type CompactReview,
  spotlightReviews,
  compactReviews,
} from "../data/landing-content";

function VerifiedBadge() {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0 leading-none"
      title="Verified creator"
      aria-label="Verified creator"
    >
      <svg
        className="block rounded-full"
        viewBox="0 0 40 40"
        width="16"
        height="16"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          cx="20"
          cy="20"
          r="20"
          fill="rgba(246,196,83,0.15)"
          stroke="rgba(246,196,83,0.55)"
          strokeWidth="1"
        />
        <path
          fill="#f4ecdc"
          d="M17.2 26.4 11.7 20.9l1.9-1.9 3.6 3.6 8.9-8.9 1.9 1.9z"
        />
      </svg>
    </span>
  );
}

interface SpotlightReviewCardProps {
  review: SpotlightReview;
}

function SpotlightReviewCard({ review }: SpotlightReviewCardProps) {
  return (
    <article className="bg-surface-raised border border-[var(--hairline)] rounded-2xl p-[24px_22px] shrink-0 shadow-[var(--card-shadow)] max-[899px]:flex-[0_0_min(82vw,300px)] max-[899px]:snap-start hover:-translate-y-[3px] hover:border-[rgba(246,196,83,0.35)] hover:shadow-[var(--card-shadow),0_0_24px_rgba(246,196,83,0.1)] transition-[transform,border-color,box-shadow] duration-200">
      <div className="flex items-center gap-3 mb-3.5">
        <Image
          className="w-12 h-12 rounded-full object-cover shrink-0 border border-[var(--hairline-strong)]"
          src={review.image}
          width={48}
          height={48}
          alt={review.handle}
        />
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-cream leading-[1.3] truncate">
              {review.handle}
            </span>
            {review.verified && <VerifiedBadge />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted tracking-[0.2px] mono">
              {review.followers}
            </span>
            {review.role && (
              <span className="text-[10px] text-amber/80 border border-amber/20 px-1.5 py-0.5 rounded-full">
                {review.role}
              </span>
            )}
          </div>
        </div>
      </div>
      <blockquote className="m-0 text-[clamp(14px,1.4vw,16px)] leading-[1.6] text-cream">
        “{review.quote}”
      </blockquote>
    </article>
  );
}

interface CompactReviewCardProps {
  item: CompactReview;
}

function CompactReviewCard({ item }: CompactReviewCardProps) {
  const initial = item.name.charAt(item.name.startsWith("@") ? 1 : 0).toUpperCase();

  return (
    <article className="w-[min(360px,82vw)] p-[16px_14px] bg-surface border border-[var(--hairline)] rounded-2xl shrink-0 shadow-[var(--card-shadow)] hover:-translate-y-0.5 hover:border-[var(--hairline-strong)] transition-[transform,border-color,box-shadow] duration-200 max-[899px]:flex-[0_0_min(78vw,300px)] max-[899px]:snap-start">
      <div className="flex items-center gap-3 mb-2.5">
        <span
          className="w-10 h-10 rounded-full inline-flex items-center justify-center font-mono text-[13px] font-medium text-amber bg-[rgba(246,196,83,0.08)] border border-[var(--hairline-strong)] shrink-0"
          aria-hidden="true"
        >
          {initial}
        </span>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-cream leading-[1.3] truncate">
              {item.name}
            </span>
          </div>
        </div>
      </div>
      <blockquote className="m-0 text-sm leading-[1.5] text-body line-clamp-3">
        “{item.quote}”
      </blockquote>
    </article>
  );
}

export function LandingCreatorReviews() {
  const marqueeItems = [...compactReviews, ...compactReviews];

  return (
    <section
      className="pt-[clamp(40px,4vw,80px)] pb-[clamp(36px,3.5vw,72px)] border-t border-[var(--hairline)]"
      aria-labelledby="reviewsHeading"
    >
      <div className="inline-block text-[clamp(10px,0.45vw+8px,13px)] font-semibold tracking-[0.85px] uppercase text-amber mb-3.5 [text-shadow:0_0_18px_rgba(246,196,83,0.18)]">
        What creators are saying
      </div>
      <h2
        id="reviewsHeading"
        className="font-display text-[clamp(1.35rem,0.35rem+1.8vw,2.25rem)] font-bold text-cream mb-2 tracking-[-0.02em] leading-[1.55]"
      >
        Real feedback from real creators
      </h2>
      <p className="text-[clamp(15px,1vw+12px,20px)] text-dim leading-[1.55] max-w-[52ch] mb-7">
        Creators use these captions in their daily posting workflow.
      </p>

      <div className="flex flex-col gap-5 w-full">
        <div aria-label="Creator testimonials">
          <div className="grid grid-cols-4 min-[900px]:max-[1199px]:grid-cols-2 max-[899px]:flex max-[899px]:gap-3.5 max-[899px]:overflow-x-auto max-[899px]:snap-x max-[899px]:snap-mandatory max-[899px]:pb-1 max-[899px]:-mx-[var(--page-gutter)] max-[899px]:px-[var(--page-gutter)] gap-4">
            {spotlightReviews.map((review) => (
              <SpotlightReviewCard key={review.handle} review={review} />
            ))}
          </div>
        </div>

        <div
          className="mt-7 pt-6 border-t border-[var(--hairline)]"
          aria-label="More creator feedback"
        >
          <p className="text-[13px] text-muted mb-4 tracking-[0.2px]">
            More from creators
          </p>
          <div className="flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_28px,#000_calc(100%-28px),transparent)] max-[899px]:[mask-image:none] max-[899px]:overflow-visible group">
            <div className="overflow-hidden w-full">
              <div className="flex gap-3 w-max animate-[reviewsMarquee_42s_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] max-[899px]:animate-none max-[899px]:w-auto max-[899px]:overflow-x-auto max-[899px]:snap-x max-[899px]:snap-mandatory max-[899px]:-mx-[var(--page-gutter)] max-[899px]:px-[var(--page-gutter)] max-[899px]:pb-1">
                {marqueeItems.map((item, idx) => (
                  <CompactReviewCard key={`rev-${idx}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
