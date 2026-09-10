import Image from "next/image";
import Link from "next/link";
import { thumbnailSamples } from "../data/landing-content";

export function LandingWorkflowSteps() {
  const allThumbs = [...thumbnailSamples, ...thumbnailSamples];

  return (
    <>
      {/* Steps Section */}
      <section
        className="py-[clamp(40px,4vw,80px)] border-t border-[var(--hairline)] animate-[fadeUp_0.7s_ease_0.18s_both]"
        id="how-it-works"
      >
        <div className="inline-block text-[clamp(10px,0.45vw+8px,13px)] font-semibold tracking-[0.85px] uppercase text-amber mb-3.5 [text-shadow:0_0_14px_rgba(246,196,83,0.25)]">
          How it works
        </div>
        <h2 className="font-display text-[clamp(1.35rem,0.35rem+1.8vw,2.25rem)] font-bold text-cream mb-2 tracking-[-0.02em] leading-[1.55]">
          Upload, edit, post
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] max-[899px]:grid-cols-1 gap-5 max-[899px]:gap-3">
          <article className="bg-surface border border-[var(--hairline)] rounded-2xl p-[24px_20px] shadow-[var(--card-shadow)] hover:-translate-y-[3px] hover:border-[rgba(246,196,83,0.28)] hover:shadow-[var(--card-shadow),0_0_20px_rgba(246,196,83,0.08)] transition-[transform,border-color,box-shadow] duration-200 flex flex-col">
            <div className="text-xs font-bold text-amber mb-3 tracking-[0.08em] [text-shadow:0_0_14px_rgba(246,196,83,0.25)] mono">
              01
            </div>
            <h3 className="font-display text-[22px] font-bold text-cream mb-2 tracking-[-0.02em] leading-[1.55] flex items-center gap-2.5">
              Upload
            </h3>
            <p className="text-sm text-body leading-[1.5]">
              Drop a Reel or Short. Your audio in, word timings out.
            </p>
            <div className="mt-4 rounded-xl border border-[var(--hairline-strong)] shadow-[0_8px_24px_rgba(0,0,0,0.32)] h-[360px] overflow-hidden bg-surface-raised">
              <Image
                className="w-full h-full object-cover object-top"
                src="/media/step-upload.webp"
                width={640}
                height={360}
                alt="Upload screen in EveryKaptions"
              />
            </div>
          </article>

          <article className="bg-surface border border-[var(--hairline)] rounded-2xl p-[24px_20px] shadow-[var(--card-shadow)] hover:-translate-y-[3px] hover:border-[rgba(246,196,83,0.28)] hover:shadow-[var(--card-shadow),0_0_20px_rgba(246,196,83,0.08)] transition-[transform,border-color,box-shadow] duration-200 flex flex-col">
            <div className="text-xs font-bold text-amber mb-3 tracking-[0.08em] [text-shadow:0_0_14px_rgba(246,196,83,0.25)] mono">
              02
            </div>
            <h3 className="font-display text-[22px] font-bold text-cream mb-2 tracking-[-0.02em] leading-[1.55] flex items-center gap-2.5">
              Edit
            </h3>
            <p className="text-sm text-body leading-[1.5]">
              Fix a word, drag position, pick a style. No typing every line by hand.
            </p>
            <div className="mt-4 rounded-xl border border-[var(--hairline-strong)] shadow-[0_8px_24px_rgba(0,0,0,0.32)] h-[360px] overflow-hidden bg-surface-raised">
              <Image
                className="w-full h-full object-cover object-top"
                src="/media/step-edit.webp"
                width={640}
                height={360}
                alt="Caption editor with word timeline"
              />
            </div>
          </article>

          <article className="bg-surface border border-[var(--hairline)] rounded-2xl p-[24px_20px] shadow-[var(--card-shadow)] hover:-translate-y-[3px] hover:border-[rgba(246,196,83,0.28)] hover:shadow-[var(--card-shadow),0_0_20px_rgba(246,196,83,0.08)] transition-[transform,border-color,box-shadow] duration-200 flex flex-col bg-[radial-gradient(circle_at_78%_78%,rgba(246,196,83,0.12),transparent_42%),var(--surface)]">
            <div className="text-xs font-bold text-amber mb-3 tracking-[0.08em] [text-shadow:0_0_14px_rgba(246,196,83,0.25)] mono">
              03
            </div>
            <h3 className="font-display text-[22px] font-bold text-cream mb-2 tracking-[-0.02em] leading-[1.55] flex items-center gap-2.5">
              Post to Instagram
            </h3>
            <p className="text-sm text-body leading-[1.5] mb-4.5">
              Finish your captioned Reel, then post it to Instagram from EveryKaptions. Creator posts now; Studio can schedule up to 30 days ahead.
            </p>
            <div
              className="relative min-h-[230px] max-[640px]:min-h-[210px] max-[640px]:mt-1 grid place-items-center mt-auto"
              aria-hidden="true"
            >
              <div className="w-[168px] p-2.5 border border-[rgba(244,236,220,0.2)] rounded-[22px] bg-[#0f0e0b] shadow-[0_20px_48px_rgba(0,0,0,0.45),0_0_30px_rgba(246,196,83,0.1)] rotate-4">
                <div className="flex items-center justify-between text-[9px] text-cream">
                  <span className="w-1.5 h-1.5 rounded-full bg-[linear-gradient(135deg,#f9ce34,#ee2a7b_52%,#6228d7)]" />
                  <strong>New Reel</strong>
                  <b className="text-amber font-normal">Share</b>
                </div>
                <div className="aspect-[9/12] my-[9px] grid place-items-center rounded-[14px] bg-[linear-gradient(160deg,rgba(246,196,83,0.22),transparent_46%),linear-gradient(26deg,#442d18,#19140f_58%,#302024)] text-cream text-center">
                  <span className="text-[8px] font-bold tracking-[0.15em]">CAPTION READY</span>
                  <i className="not-italic text-amber text-[22px]">▶</i>
                </div>
                <div className="text-body text-[10px] m-[0_0_9px] text-center">
                  Your Reel is ready to post.
                </div>
                <div className="flex items-center justify-center gap-2 text-[9px]">
                  <span className="px-2 py-0.5 rounded-full text-amber bg-[rgba(246,196,83,0.1)]">Post now</span>
                  <span className="px-2 py-0.5 rounded-full text-amber bg-[rgba(246,196,83,0.1)]">Schedule</span>
                </div>
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 w-fit min-h-[44px] mt-3.5 py-2.5 text-amber text-sm font-semibold no-underline hover:text-cream hover:underline hover:[text-underline-offset:4px] transition-colors"
            >
              See plans →
            </Link>
          </article>
        </div>
      </section>

      {/* Content Pack Feature Section */}
      <section
        className="py-[clamp(40px,4vw,80px)] border-t border-[var(--hairline)]"
        aria-labelledby="contentPackHeading"
      >
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(240px,380px)] max-[480px]:grid-cols-1 gap-[clamp(28px,4vw,48px)] items-center">
          <div className="min-w-0">
            <div className="inline-block text-[clamp(10px,0.45vw+8px,13px)] font-semibold tracking-[0.85px] uppercase text-amber mb-3.5 [text-shadow:0_0_18px_rgba(246,196,83,0.18)]">
              Creator + Studio
            </div>
            <h2
              id="contentPackHeading"
              className="font-display text-[clamp(1.5rem,0.5rem+2vw,2.75rem)] font-bold text-cream mb-4 tracking-[-0.02em] leading-[1.55] [text-wrap:balance]"
            >
              The caption is done. So is the post.
            </h2>
            <p className="text-[clamp(15px,2vw,17px)] text-body leading-[1.65] max-w-[58ch]">
              AI-generated YouTube title options, an Instagram caption, and hashtags, written from what you actually said in the video, not from a keyword guess.
            </p>
          </div>
          <div className="flex justify-center max-[480px]:order-first">
            <div
              className="w-full max-w-[340px] rounded-[20px] border border-[var(--hairline-strong)] bg-[linear-gradient(165deg,var(--surface-raised)_0%,var(--surface)_65%)] shadow-[var(--card-shadow),0_0_40px_rgba(246,196,83,0.08)] p-6"
              aria-hidden="true"
            >
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] uppercase text-amber mb-[18px]">
                <span className="w-[7px] h-[7px] rounded-full bg-amber shadow-[0_0_8px_rgba(246,196,83,0.6)]" />
                <span>Content Pack</span>
              </div>
              <div className="relative min-h-[172px]">
                <div className="absolute inset-0 flex flex-col justify-center opacity-0 animate-[packSlideCycle_18s_ease-in-out_infinite]">
                  <span className="block text-[10px] font-bold tracking-[0.06em] uppercase text-dim mb-2">Title options</span>
                  <p className="font-display text-[15px] leading-[1.4] text-cream p-[8px_10px] rounded-lg bg-[rgba(244,236,220,0.05)] border border-[var(--hairline)] mb-1.5">3 Editing Habits That Changed My Views</p>
                  <p className="font-display text-[15px] leading-[1.4] text-cream p-[8px_10px] rounded-lg bg-[rgba(244,236,220,0.05)] border border-[var(--hairline)] mb-1.5">I Wasted 6 Months Before I Learned This</p>
                </div>
                <div className="absolute inset-0 flex flex-col justify-center opacity-0 animate-[packSlideCycle_18s_ease-in-out_infinite] [animation-delay:-12s]">
                  <span className="block text-[10px] font-bold tracking-[0.06em] uppercase text-dim mb-2">Instagram caption</span>
                  <p className="font-body text-[13px] text-body italic p-[8px_10px] rounded-lg bg-[rgba(244,236,220,0.05)] border border-[var(--hairline)] mb-1.5">Most creators skip this one step. Here&#39;s what changed when I stopped.</p>
                </div>
                <div className="absolute inset-0 flex flex-col justify-center opacity-0 animate-[packSlideCycle_18s_ease-in-out_infinite] [animation-delay:-6s]">
                  <span className="block text-[10px] font-bold tracking-[0.06em] uppercase text-dim mb-2">Hashtags</span>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-amber px-3 py-1 rounded-full bg-[rgba(246,196,83,0.1)] border border-[rgba(246,196,83,0.22)]">#contentcreator</span>
                    <span className="text-xs text-amber px-3 py-1 rounded-full bg-[rgba(246,196,83,0.1)] border border-[rgba(246,196,83,0.22)]">#videoediting</span>
                    <span className="text-xs text-amber px-3 py-1 rounded-full bg-[rgba(246,196,83,0.1)] border border-[rgba(246,196,83,0.22)]">#reelsgrowth</span>
                    <span className="text-xs text-amber px-3 py-1 rounded-full bg-[rgba(246,196,83,0.1)] border border-[rgba(246,196,83,0.22)]">#creator</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-1.5 mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--hairline-strong)] animate-[packDotCycle_18s_ease-in-out_infinite]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--hairline-strong)] animate-[packDotCycle_18s_ease-in-out_infinite] [animation-delay:-12s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--hairline-strong)] animate-[packDotCycle_18s_ease-in-out_infinite] [animation-delay:-6s]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-[clamp(40px,4vw,80px)] border-t border-[var(--hairline)]"
        aria-labelledby="thumbStudioHeading"
      >
        <div className="max-w-[760px] mx-auto mb-8 text-center">
          <div className="inline-block text-[clamp(10px,0.45vw+8px,13px)] font-semibold tracking-[0.85px] uppercase text-amber mb-3.5 [text-shadow:0_0_18px_rgba(246,196,83,0.18)]">
            Coming soon
          </div>
          <h2
            id="thumbStudioHeading"
            className="font-display text-[clamp(1.5rem,0.5rem+2vw,2.75rem)] font-bold text-cream mb-4 tracking-[-0.02em] leading-[1.55]"
          >
            Your face, ready for every cover.
          </h2>
          <p className="text-[clamp(15px,2vw,17px)] text-body leading-[1.65] max-w-[58ch] mx-auto">
            Personalized vertical thumbnails are being built next. Your supplied profile photo now previews the direction across every sample.
          </p>
        </div>
        <div className="relative group" aria-label="Personalized thumbnail preview">
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] max-[899px]:overflow-x-auto max-[899px]:[mask-image:none]">
            <div className="flex w-max gap-4 animate-[thumbMarquee_65s_linear_infinite] group-hover:[animation-play-state:paused] max-[899px]:animate-none max-[899px]:px-1">
              {allThumbs.map((thumbSrc, i) => (
                <div key={`thumb-${i}`} className="relative aspect-[9/16] w-[160px] shrink-0 overflow-hidden rounded-[14px] border border-[var(--hairline-strong)] bg-surface shadow-[0_12px_28px_rgba(0,0,0,0.35)] max-[480px]:w-[130px]">
                  <Image
                    className="h-full w-full object-cover object-center sepia-[.08]"
                    src={thumbSrc}
                    width={160}
                    height={284}
                    alt=""
                  />
                  <span className="absolute inset-x-2 bottom-2 rounded-full border border-white/15 bg-[#0c0b0ad9] px-2 py-1 text-center text-[9px] font-bold uppercase tracking-[.08em] text-cream">
                    Cover preview
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="rounded-full border border-amber/35 bg-[#0c0b0af2] px-5 py-2.5 text-sm font-bold text-amber shadow-[var(--gold-glow)]">
              Thumbnail tools coming soon
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
