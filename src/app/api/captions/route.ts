import {
  isCaptionOutputLanguage,
  type CaptionOutputLanguage,
  type TranscriptPayload,
} from "@/features/editor/types/captions";

export const runtime = "nodejs";
export const maxDuration = 60;

const GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const OUTPUT_INSTRUCTIONS: Record<Exclude<CaptionOutputLanguage, "same">, string> = {
  en: "Write clear, natural English captions.",
  hi: "Write natural Hindi captions in Devanagari script.",
  hinglish: "Write natural conversational Hinglish in Latin script. Translate the meaning into Hindi while keeping commonly used English creator and technology terms.",
  te: "Write natural Telugu captions in Telugu script.",
  ta: "Write natural Tamil captions in Tamil script.",
  kn: "Write natural Kannada captions in Kannada script.",
  ml: "Write natural Malayalam captions in Malayalam script.",
  mr: "Write natural Marathi captions in Devanagari script.",
  bn: "Write natural Bengali captions in Bengali script.",
  gu: "Write natural Gujarati captions in Gujarati script.",
  pa: "Write natural Punjabi captions in Gurmukhi script.",
};
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const SUPPORTED_TYPES = new Set([
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function needsConversion(spokenLanguage: unknown, outputLanguage: CaptionOutputLanguage) {
  if (outputLanguage === "same") return false;
  return outputLanguage === "hinglish" || outputLanguage !== spokenLanguage;
}

type GroqTranslationResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

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

async function convertTranscript(
  transcript: TranscriptPayload,
  outputLanguage: Exclude<CaptionOutputLanguage, "same">,
  apiKey: string,
): Promise<TranscriptPayload> {
  const originalSegments = transcript.segments ?? [];
  const sourceSegments = originalSegments.length > 0
    ? originalSegments
      .map((segment, index) => ({
        id: String(segment.id ?? index),
        text: (segment.text ?? "").replace(/\s+/g, " ").trim(),
      }))
      .filter((segment) => segment.text.length > 0)
    : [{ id: "full", text: (transcript.text ?? "").replace(/\s+/g, " ").trim() }];

  if (sourceSegments.every((segment) => !segment.text)) return transcript;

  const sourceText = sourceSegments
    .map((segment, index) => `${index}\t${segment.text.replace(/[\r\n\t]+/g, " ")}`)
    .join("\n");
  const conversionResponse = await fetch(GROQ_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_TRANSLATION_MODEL ?? "openai/gpt-oss-20b",
      temperature: 0.1,
      max_completion_tokens: Math.min(2048, Math.max(300, Math.ceil(sourceText.length * 0.8))),
      messages: [
        {
          role: "system",
          content: OUTPUT_INSTRUCTIONS[outputLanguage] + " Keep names, numbers, product terms, and meaning accurate. You will receive numbered caption lines. Return exactly one translated line for every input line using the format NUMBER<TAB>CAPTION. Preserve every number and its order. Do not return JSON, markdown, code fences, notes, or explanations.",
        },
        { role: "user", content: sourceText },
      ],
    }),
    cache: "no-store",
  });

  const completion = await conversionResponse.json().catch(() => null) as GroqTranslationResponse | null;
  if (!conversionResponse.ok) {
    throw new Error(completion?.error?.message || "Groq could not convert the captions to the selected output language.");
  }

  const content = completion?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty caption conversion.");

  const translatedByIndex = parseConvertedLines(content, sourceSegments.length);
  if (translatedByIndex.size !== sourceSegments.length) {
    throw new Error("Groq returned an incomplete caption conversion. Please try again.");
  }

  const translatedSegments = originalSegments.map((segment, index) => ({
    ...segment,
    text: translatedByIndex.get(index) || segment.text,
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

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return errorResponse("Groq is not configured. Add GROQ_API to .env.local and restart the app.", 503);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const language = formData.get("language");
    const requestedOutput = formData.get("outputLanguage");

    if (!(file instanceof File)) return errorResponse("Choose a video or audio file first.", 400);
    if (file.size === 0) return errorResponse("The selected file is empty.", 400);
    if (file.size > MAX_UPLOAD_BYTES) {
      return errorResponse("For Groq transcription, upload a file smaller than 25 MB.", 413);
    }
    if (file.type && !SUPPORTED_TYPES.has(file.type)) {
      return errorResponse("Use an MP3, MP4, MOV, WAV, or WebM file.", 415);
    }
    if (requestedOutput !== null && !isCaptionOutputLanguage(requestedOutput)) {
      return errorResponse("Choose a supported caption output language.", 400);
    }
    const outputLanguage: CaptionOutputLanguage = requestedOutput === null ? "same" : requestedOutput;

    const providerBody = new FormData();
    providerBody.append("file", file, file.name);
    providerBody.append("model", process.env.GROQ_TRANSCRIPTION_MODEL ?? "whisper-large-v3-turbo");
    providerBody.append("response_format", "verbose_json");
    providerBody.append("temperature", "0");
    providerBody.append(
      "prompt",
      "Transcribe faithfully in the selected spoken language. Do not translate the speech into another language.",
    );
    providerBody.append("timestamp_granularities[]", "word");
    if (typeof language === "string" && language && language !== "auto") {
      providerBody.append("language", language);
    }

    const response = await fetch(GROQ_TRANSCRIPTION_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: providerBody,
      cache: "no-store",
    });

    if (!response.ok) {
      const providerError = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      const message = providerError?.error?.message;
      return errorResponse(message || "Groq could not transcribe this file. Try another recording.", response.status);
    }

    const transcript = (await response.json()) as TranscriptPayload;
    let outputTranscript = transcript;

    if (outputLanguage !== "same" && needsConversion(language, outputLanguage)) {
      try {
        outputTranscript = await convertTranscript(transcript, outputLanguage, apiKey);
      } catch (conversionError) {
        const message = conversionError instanceof Error
          ? conversionError.message
          : "Captions could not be converted to the selected output language.";
        return errorResponse(message, 502);
      }
    }

    return Response.json(outputTranscript, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return errorResponse("The transcription request could not be completed. Please try again.", 500);
  }
}
