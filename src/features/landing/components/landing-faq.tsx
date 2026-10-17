import Link from "next/link";
import { Plus } from "lucide-react";
const questions = [
  {
    question: "How many free minutes do I get?",
    answer: (
      <>
        The free plan includes 3 minutes of caption generation and 3 exports
        every month. Free video exports include a watermark. See{" "}
        <Link href="/pricing">pricing</Link> when you need more room to create.
      </>
    ),
  },
  {
    question: "Which languages are supported?",
    answer: (
      <>
        You can choose English, Hindi, Telugu, Tamil, Kannada, Malayalam,
        Marathi, Bengali, Gujarati, or Punjabi as your spoken language. Review
        the transcript before exporting, especially names and local expressions.
      </>
    ),
  },
  {
    question: "Can I customize the caption style?",
    answer: (
      <>
        Yes. Edit the wording and timing, choose a caption preset, and adjust
        the text size, highlight color, alignment, and position in the editor.
      </>
    ),
  },
  {
    question: "What export formats are available?",
    answer: (
      <>
        Export a captioned MP4 video or download your words separately as an
        SRT, VTT, or plain TXT file.
      </>
    ),
  },
  {
    question: "Are my projects saved?",
    answer: (
      <>
        Editor projects are saved in the browser where you create them. Return
        using the same browser to continue editing, and download a copy of your
        finished videos and subtitle files.
      </>
    ),
  },
];
export function LandingFaq() {
  return (
    <section id="faq" className="landing-section faq-section">
      <div>
        <h2>
          A few questions?
          <br />
          We’ve got you.
        </h2>
        <p>
          Everything you need to know about creating captions with
          EveryKaptions.
        </p>
        <Link href="/support">Still need a hand? Get in touch.</Link>
      </div>
      <div className="faq-list">
        {questions.map((item) => (
          <details key={item.question}>
            <summary>
              {item.question}
              <Plus size={17} aria-hidden="true" />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
