import type { CaptionOutputLanguage, TranscriptPayload } from "../types/captions";

const GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

const OUTPUT_INSTRUCTIONS: Record<Exclude<CaptionOutputLanguage, "same">, string> = {
  en: "Write clear, natural English captions.",
  hi: "Write natural Hindi captions in Devanagari script.",
  hinglish: "Write conversational Hinglish in Latin script. Keep familiar English creator and technology terms.",
  te: "Write natural Telugu captions in Telugu script.",
  ta: "Write natural Tamil captions in Tamil script.",
  kn: "Write natural Kannada captions in Kannada script.",
  ml: "Write natural Malayalam captions in Malayalam script.",
  mr: "Write natural Marathi captions in Devanagari script.",
  bn: "Write natural Bengali captions in Bengali script.",
  gu: "Write natural Gujarati captions in Gujarati script.",
  pa: "Write natural Punjabi captions in Gurmukhi script.",
};

type GroqErrorPayload = {
  error?: { message?: string };
};

type GroqTranslationResponse = GroqErrorPayload & {
  choices?: Array<{ message?: { content?: string } }>;
};

export class GroqCaptionError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "GroqCaptionError";
    this.status = status;
  }
}

async function readGroqJson<T extends GroqErrorPayload>(response: Response, fallbackMessage: string) {
  const responseText = await response.text();
  let payload: T | null = null;

  try {
    payload = JSON.parse(responseText) as T;
  } catch {
    if (!response.ok) throw new GroqCaptionError(fallbackMessage, response.status);
  }

  if (!response.ok) {
    throw new GroqCaptionError(payload?.error?.message || fallbackMessage, response.status);
  }
  if (!payload) throw new GroqCaptionError(fallbackMessage);
  return payload;
}

function parseConvertedLines(content: string, expectedCount: number) {
  const translated = new Map<number, string>();
  const cleaned = content
    .replace(/^```(?:text|txt)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  for (const rawLine of cleaned.split(/\r?\n/)) {
    const match = rawLine.match(/^\s*(\d+)\s*(?:\t|\||::)\s*(.+?)\s*$/);
    if (!match) continue;
    const index = Number(match[1]);
    const text = match[2]?.trim();
    if (Number.isInteger(index) && index >= 0 && index < expectedCount && text) {
      translated.set(index, text);
    }
  }

  return translated;
}

export async function transcribeMedia(
  file: Blob,
  fileName: string,
  spokenLanguage: string,
  apiKey: string,
) {
  const providerBody = new FormData();
  providerBody.append("file", file, fileName);
  providerBody.append("model", process.env.GROQ_TRANSCRIPTION_MODEL ?? "whisper-large-v3-turbo");
  providerBody.append("response_format", "verbose_json");
  providerBody.append("temperature", "0");
  providerBody.append("timestamp_granularities[]", "word");
  providerBody.append(
    "prompt",
    "Transcribe faithfully in the selected spoken language. Do not translate the speech into another language.",
  );
  if (spokenLanguage && spokenLanguage !== "auto") {
    providerBody.append("language", spokenLanguage);
  }

  const response = await fetch(GROQ_TRANSCRIPTION_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: providerBody,
    cache: "no-store",
  });

  return readGroqJson<TranscriptPayload & GroqErrorPayload>(
    response,
    "Groq could not transcribe this recording. Try clearer audio or a shorter file.",
  );
}

export async function translateTranscript(
  transcript: TranscriptPayload,
  outputLanguage: Exclude<CaptionOutputLanguage, "same">,
  apiKey: string,
): Promise<TranscriptPayload> {
  const originalSegments = transcript.segments ?? [];
  const sourceSegments = originalSegments.length > 0
    ? originalSegments.map((segment, index) => ({
      originalIndex: index,
      text: (segment.text ?? "").replace(/\s+/g, " ").trim(),
    })).filter((segment) => segment.text.length > 0)
    : [{ originalIndex: 0, text: (transcript.text ?? "").replace(/\s+/g, " ").trim() }];

  if (sourceSegments.length === 0 || sourceSegments.every((segment) => !segment.text)) return transcript;

  const sourceText = sourceSegments
    .map((segment, index) => `${index}\t${segment.text.replace(/[\r\n\t]+/g, " ")}`)
    .join("\n");
  const response = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_TRANSLATION_MODEL ?? "openai/gpt-oss-20b",
      temperature: 0.1,
      max_completion_tokens: Math.min(4096, Math.max(300, Math.ceil(sourceText.length * 0.8))),
      messages: [
        {
          role: "system",
          content: `${OUTPUT_INSTRUCTIONS[outputLanguage]} Keep names, numbers, product terms, and meaning accurate. Return every caption as NUMBER<TAB>CAPTION in the original order. Do not return JSON, Markdown, code fences, or explanations.`,
        },
        { role: "user", content: sourceText },
      ],
    }),
    cache: "no-store",
  });

  const completion = await readGroqJson<GroqTranslationResponse>(
    response,
    "Groq could not convert the captions to the selected language.",
  );
  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new GroqCaptionError("Groq returned an empty caption translation.");

  const translatedByIndex = parseConvertedLines(content, sourceSegments.length);
  if (translatedByIndex.size !== sourceSegments.length) {
    throw new GroqCaptionError("The translated captions were incomplete. Please try again.");
  }

  const translatedByOriginalIndex = new Map(
    sourceSegments.map((segment, index) => [segment.originalIndex, translatedByIndex.get(index) ?? ""]),
  );
  const translatedSegments = originalSegments.map((segment, index) => ({
    ...segment,
    text: translatedByOriginalIndex.get(index) || segment.text,
    words: [],
  }));

  if (translatedSegments.length === 0) {
    const text = translatedByIndex.get(0) || transcript.text || "";
    return {
      ...transcript,
      text,
      language: outputLanguage,
      words: [],
      segments: [{ id: 0, text, start: 0, end: transcript.duration ?? 0, words: [] }],
    };
  }

  return {
    ...transcript,
    text: translatedSegments.map((segment) => segment.text).join(" "),
    language: outputLanguage,
    words: [],
    segments: translatedSegments,
  };
}
