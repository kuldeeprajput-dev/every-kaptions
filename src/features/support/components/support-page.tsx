"use client";
import { ArrowRight, Mail, Paperclip } from "lucide-react";
import { useRef, useState } from "react";
import { SiteHeader } from "@/shared/components/site-header";
import { SiteFooter } from "@/shared/components/site-footer";
export function SupportPage() {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const selectFile = (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Choose an image smaller than 10 MB.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    setFileName(file.name);
    setError("");
  };
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="page-shell support-surface">
        <div className="page-intro">
          <h1>Let’s get you back to creating.</h1>
          <p>
            A question, a little feedback, or something that isn’t working.
            We’re here.
          </p>
        </div>
        <div className="support-layout">
          <aside>
            <Mail size={24} strokeWidth={1.3} />
            <h2>
              Real people.
              <br />A little help.
            </h2>
            <p>
              EveryKaptions is a small, creator-led team. We typically reply
              within 24 to 48 hours.
            </p>
            <a href="mailto:hello@everykaptions.com">
              hello@everykaptions.com <ArrowRight size={14} />
            </a>
            <div>
              <span>Need something quick?</span>
              <a href="/pricing#main-content">
                Plans & billing <ArrowRight size={13} />
              </a>
              <a href="/legal/data-deletion">
                Managing your data <ArrowRight size={13} />
              </a>
            </div>
          </aside>
          <form
            className="support-form"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const subject = `EveryKaptions support: ${data.get("issue")}`;
              const body = `From: ${data.get("email")}\n\n${data.get("message")}${fileName ? `\n\nScreenshot to attach: ${fileName}` : ""}`;
              window.location.href = `mailto:hello@everykaptions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
          >
            <label>
              Your email address
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label>
              What can we help with?
              <select name="issue" required defaultValue="">
                <option value="" disabled>
                  Select a topic
                </option>
                <option>Caption or transcription issue</option>
                <option>Export problem</option>
                <option>Billing and plans</option>
                <option>Account access</option>
                <option>Something else</option>
              </select>
            </label>
            <label>
              Your message
              <textarea
                name="message"
                required
                placeholder="Tell us a little more. What happened, and what were you expecting?"
                rows={5}
              />
            </label>
            <div>
              <span className="support-label">
                Screenshot <small>(optional)</small>
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => selectFile(event.target.files?.[0])}
              />
              <button
                type="button"
                className="support-attachment"
                onClick={() => fileRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  selectFile(event.dataTransfer.files[0]);
                }}
              >
                <Paperclip size={17} />
                <span>{fileName || "Choose an image or drop it here"}</span>
              </button>
              <p className="support-hint">
                JPG, PNG, WebP · Max 10 MB. Attach your image to the email
                draft.
              </p>
              {error && (
                <p role="alert" className="mt-2 text-xs text-red-700">
                  {error}
                </p>
              )}
            </div>
            <button type="submit" className="action-primary">
              Continue in email <ArrowRight size={16} />
            </button>
            <p className="support-hint">
              Opens your email app with your message ready to send.
            </p>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
