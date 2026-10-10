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
      className="landing-section review-section"
      aria-label="Creator reviews"
    >
      <div className="review-panel">
        <div className="review-intro">
          <span>EVERYKAPTIONS, IN THEIR WORDS</span>
          <h2>
            Made for the way
            <br />
            creators create.
          </h2>
          <p>
            A focused caption tool for people who want to get the words right
            and get back to creating.
          </p>
          <div className="review-controls">
            <button
              type="button"
              onClick={() =>
                setActive((active + reviews.length - 1) % reviews.length)
              }
              aria-label="Previous review"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setActive((active + 1) % reviews.length)}
              aria-label="Next review"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="review-stack">
          <figure key={review.handle}>
            <blockquote>{review.quote}</blockquote>
            <figcaption>
              <Image
                src={`/media/reviews/demo-creator-${active + 1}.png`}
                width={48}
                height={48}
                alt="AI-generated demo portrait, not the reviewer's photo"
              />
              <div>
                <strong>{review.handle}</strong>
                <small>AI-generated demo portrait</small>
              </div>
            </figcaption>
          </figure>
          <div
            className="review-dots"
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
              />
            ))}
          </div>
        </div>
      </div>
      <div className="product-facts">
        <div>
          <strong>Word by word</strong>
          <span>Fine-tune your caption timing</span>
        </div>
        <div>
          <strong>Your kind of style</strong>
          <span>Fonts, colors, and placement</span>
        </div>
        <div>
          <strong>Ready to share</strong>
          <span>Video and subtitle exports</span>
        </div>
      </div>
    </section>
  );
}
