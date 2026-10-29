import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  captionStyles,
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
  "creator-desk",
  "creator-podcast",
  "creator-tech",
  "creator-lifestyle",
  "creator-fitness",
];
const uses = [
  {
    title: "Reels & Shorts",
    description: "Make your next scroll-stopping moment easier to follow.",
    photo: "creator-outdoor",
    caption: (
      <>
        A little <mark>more you.</mark>
      </>
    ),
  },
  {
    title: "Tutorials",
    description: "Keep each tip, step, and little detail clear.",
    photo: "creator-tutorial",
    caption: (
      <>
        <mark>Step one:</mark> tell your story.
      </>
    ),
  },
  {
    title: "Podcasts",
    description: "Bring the best moments of your conversation to the feed.",
    photo: "creator-podcast",
    caption: (
      <>
        Ideas make a <mark>brighter you.</mark>
      </>
    ),
  },
  {
    title: "Explainers",
    description: "Help the words land when you have something to share.",
    photo: "creator-explainer",
    caption: (
      <>
        Small changes.<mark>Big ideas.</mark>
      </>
    ),
  },
];

export function LandingPresets() {
  return (
    <section id="presets" className="preset-section">
      <div className="landing-section">
        <div className="preset-heading">
          <h2>Find a style for your story.</h2>
          <p>
            Preview the looks in the editor.
            <br />
            Make the details your own.
          </p>
        </div>
        <div className="preset-rail">
          {presetIds.map((id, index) => {
            const style = captionStyles.find((item) => item.id === id)!;
            return (
              <Link
                href="/editor/demo"
                key={id}
                className="preset-card group"
                aria-label={`Explore ${style.name} in the caption editor`}
              >
                <div className="preset-card-photo">
                  <Image
                    src={`/media/landing/${photos[index]}.webp`}
                    alt={`Creator wearing ${style.name} captions`}
                    fill
                    quality={90}
                    sizes="(max-width: 640px) 48vw, (max-width: 1024px) 25vw, 360px"
                  />
                  <div className="preset-card-overlay" aria-hidden="true" />
                  <p
                    className={`preset-caption ${style.textClass} ${style.previewClass}`}
                  >
                    Your story.
                    <br />
                    <span className={style.activeWordClass}>Your way.</span>
                  </p>
                </div>
                <span className="preset-card-label">
                  <strong>{style.name}</strong>
                  <ArrowRight size={13} className="preset-card-arrow" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LandingUseCases() {
  return (
    <section className="use-cases" aria-labelledby="use-cases-heading">
      <div className="landing-section">
        <div className="landing-heading">
          <h2 id="use-cases-heading">
            One tool. So many ways
            <br />
            to tell a story.
          </h2>
          <p>Make the words work for the content you love to create.</p>
        </div>
        <div className="use-case-grid">
          {uses.map((item) => (
            <Link href="/studio" key={item.title} className="use-case-card">
              <div className="use-case-photo">
                <Image
                  src={`/media/landing/${item.photo}.webp`}
                  alt={`${item.title} creator example`}
                  fill
                  quality={90}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
                />
                <p>{item.caption}</p>
              </div>
              <div>
                <h3>
                  {item.title}
                  <ArrowRight size={17} />
                </h3>
                <p>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


