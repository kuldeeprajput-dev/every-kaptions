import Image from "next/image";
import { Camera, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/shared/components/reveal";
import { SiteFooter } from "@/shared/components/site-footer";
import { SiteHeader } from "@/shared/components/site-header";
import { Eyebrow, PrimaryButton } from "@/shared/components/ui";
import { compactReviews, spotlightReviews, thumbnailSamples } from "../data/landing-content";
import { PhonePreview } from "./phone-preview";

export function LandingPage() {
  return (
    <main>
      <SiteHeader />
      <div className="section-shell">
        <section className="relative flex min-h-[calc(88vh-64px)] items-center justify-center overflow-hidden py-20 text-center">
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-60 mix-blend-screen"
            autoPlay
            muted
            loop
            playsInline
            poster="/media/hero-glow-poster.jpg"
            aria-hidden="true"
          >
            <source src="/media/hero-glow.mp4" type="video/mp4" />
          </video>
          <Reveal className="relative z-10 mx-auto flex max-w-[980px] flex-col items-center">
            <Eyebrow>For creators who post in their own language</Eyebrow>
            <h1 className="display max-w-[13em] text-[clamp(2.65rem,6.4vw,6.75rem)] leading-[1.04] tracking-[-.035em] text-cream">
              Your content studio for every post.
            </h1>
            <p className="mt-6 max-w-[760px] text-[clamp(1rem,1.8vw,1.55rem)] leading-relaxed text-dim">
              Editable word-by-word captions, plus a title, caption, hashtags, and thumbnail, ready to post.
            </p>
            <PrimaryButton href="/editor" className="pulse-glow mt-7">Open app</PrimaryButton>
          </Reveal>
        </section>
      </div>

      <section className="section-shell">
        <div className="page-container grid items-center gap-12 border-b hairline py-16 lg:grid-cols-[1.18fr_.82fr] lg:gap-24 lg:py-20">
          <Reveal>
            <Eyebrow>Built by a creator, not an agency</Eyebrow>
            <h2 className="display text-3xl leading-tight text-cream sm:text-5xl">Built by @ssktechy</h2>
            <p className="mt-6 max-w-[690px] border-l-2 border-amber/70 pl-5 text-base leading-8 text-copy sm:text-lg">
              I caption Reels and Shorts every day. Auto captioning tools get native-language spelling wrong, and typing every word out by hand is too slow, so I built the tool I actually needed. Edit the details, then publish with confidence.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-amber/25 bg-amber/7 px-4 py-2 text-xs text-copy">
              <Camera size={14} className="text-amber" />
              <strong className="text-cream">300K+</strong> followers across platforms
            </div>
          </Reveal>
          <Reveal className="justify-self-center lg:justify-self-end" delay={0.08}>
            <Image
              src="/media/founder.webp"
              width={480}
              height={480}
              alt="Sai Santosh Kumar, creator of Replix Captions"
              className="aspect-square w-full max-w-[390px] rounded-3xl border border-white/10 object-cover shadow-[0_24px_80px_rgba(0,0,0,.45)]"
            />
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <div className="page-container border-b hairline py-16 lg:py-20">
          <Reveal>
            <Eyebrow>What creators are saying</Eyebrow>
            <h2 className="display text-3xl text-cream sm:text-5xl">Real feedback from real creators</h2>
            <p className="mt-3 text-base text-dim sm:text-lg">Creators use these captions in their daily posting workflow.</p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {spotlightReviews.map((review, index) => (
              <Reveal key={review.handle} delay={index * 0.07}>
                <article className="card-shadow h-full min-h-64 rounded-2xl border hairline bg-raised p-6 transition hover:-translate-y-1 hover:border-amber/25">
                  <div className="flex items-center gap-3">
                    <Image src={review.image} width={48} height={48} alt="" className="size-12 rounded-full border border-amber/35 object-cover" />
                    <div>
                      <p className="text-sm font-bold text-cream">{review.handle} <CheckCircle2 className="inline text-amber" size={13} /></p>
                      <p className="mt-1 text-[11px] text-dim">{review.followers}</p>
                    </div>
                  </div>
                  <blockquote className="mt-7 text-base leading-7 text-cream">“{review.quote}”</blockquote>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-12 text-xs font-semibold text-dim">More from creators</p>
          <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">
            {[...compactReviews, ...compactReviews].map((review, index) => (
              <article key={`${review.name}-${index}`} className="min-w-[300px] snap-start rounded-2xl border hairline bg-surface p-5 sm:min-w-[390px]">
                <p className="flex items-center gap-3 text-sm font-bold text-cream"><span className="grid size-8 place-items-center rounded-full bg-amber/10 text-amber">S</span>{review.name}</p>
                <blockquote className="mt-4 line-clamp-3 text-sm leading-6 text-copy">“{review.quote}”</blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="page-container border-b hairline py-16 lg:py-20">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="display text-3xl text-cream sm:text-5xl">Upload, edit, post</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <WorkflowCard number="01" title="Upload" text="Drop a Reel or Short. Your audio in, word timings out.">
              <Image src="/media/step-upload.webp" width={640} height={360} alt="Upload screen in Replix Captions" loading="eager" className="mt-7 w-full rounded-xl border border-white/10" />
            </WorkflowCard>
            <WorkflowCard number="02" title="Edit" text="Fix a word, drag position, pick a style. No typing every line by hand.">
              <Image src="/media/step-edit.webp" width={640} height={360} alt="Caption editor with word timeline" loading="eager" className="mt-7 w-full rounded-xl border border-white/10" />
            </WorkflowCard>
            <WorkflowCard number="03" title="Post to Instagram" text="Finish your captioned Reel, then post it to Instagram from Replix. Creator posts now; Studio can schedule up to 30 days ahead.">
              <div className="mt-8"><PhonePreview /></div>
            </WorkflowCard>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="page-container grid items-center gap-12 border-b hairline py-16 lg:grid-cols-[1.25fr_.75fr] lg:py-20">
          <Reveal>
            <Eyebrow>Creator + Studio</Eyebrow>
            <h2 className="display text-3xl text-cream sm:text-5xl">The caption is done. So is the post.</h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-copy sm:text-lg">AI-generated YouTube title options, an Instagram caption, and hashtags, written from what you actually said in the video, not from a keyword guess.</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card-shadow rounded-3xl border hairline bg-raised p-7">
              <Eyebrow className="mb-7">● Content pack</Eyebrow>
              <p className="text-xs uppercase tracking-widest text-dim">Instagram caption</p>
              <p className="mt-4 rounded-xl border hairline bg-white/3 p-5 text-sm italic leading-6 text-copy">Most creators skip this one step. Here’s what changed when I stopped.</p>
              <div className="mt-7 flex justify-center gap-2"><span className="size-1.5 rounded-full bg-amber" /><span className="size-1.5 rounded-full bg-white/20" /><span className="size-1.5 rounded-full bg-white/20" /></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <Reveal className="section-shell text-center">
          <Eyebrow>Creator + Studio</Eyebrow>
          <h2 className="display text-3xl text-cream sm:text-5xl">A thumbnail ready to use.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-copy sm:text-lg">Vertical thumbnails generated from your video and your photo. Creator gets one option; Studio gets two.</p>
        </Reveal>
        <div className="mt-12 overflow-hidden">
          <div className="marquee-track flex w-max gap-4 px-4">
            {[...thumbnailSamples, ...thumbnailSamples].map((src, index) => (
              <Image key={`${src}-${index}`} src={src} width={270} height={480} alt="" loading="eager" className="h-[310px] w-[174px] rounded-xl border border-white/10 object-cover sm:h-[390px] sm:w-[219px]" />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14 lg:py-24">
        <Reveal className="page-container rounded-3xl border hairline bg-raised px-6 py-14 text-center sm:px-12 sm:py-20">
          <h2 className="display text-3xl text-cream sm:text-5xl">Make your next post from one upload.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-copy sm:text-base">Paid plans include editable captions, a title, caption, and hashtags. Creator and Studio also include thumbnails, with more options on Studio.</p>
          <PrimaryButton href="/editor" className="mt-8">Open app</PrimaryButton>
        </Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}

function WorkflowCard({ number, title, text, children }: { number: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <article className="card-shadow flex h-full flex-col rounded-2xl border hairline bg-raised p-6 sm:p-7">
        <p className="text-xs font-bold tracking-[.16em] text-amber">{number}</p>
        <h3 className="display mt-4 text-2xl text-cream">{title}</h3>
        <p className="mt-3 min-h-14 text-sm leading-6 text-copy">{text}</p>
        <div className="mt-auto">{children}</div>
      </article>
    </Reveal>
  );
}
