import type { TranscriptPayload } from "@/features/editor/types/captions";

export const runtime = "nodejs";
export const maxDuration = 60;

const GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
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

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return errorResponse("Groq is not configured. Add GROQ_API to .env.local and restart the app.", 503);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const language = formData.get("language");

    if (!(file instanceof File)) return errorResponse("Choose a video or audio file first.", 400);
    if (file.size === 0) return errorResponse("The selected file is empty.", 400);
    if (file.size > MAX_UPLOAD_BYTES) {
      return errorResponse("For Groq transcription, upload a file smaller than 25 MB.", 413);
    }
    if (file.type && !SUPPORTED_TYPES.has(file.type)) {
      return errorResponse("Use an MP3, MP4, MOV, WAV, or WebM file.", 415);
    }

    const providerBody = new FormData();
    providerBody.append("file", file, file.name);
    providerBody.append("model", process.env.GROQ_TRANSCRIPTION_MODEL ?? "whisper-large-v3-turbo");
    providerBody.append("response_format", "verbose_json");
    providerBody.append("temperature", "0");
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
    return Response.json(transcript, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return errorResponse("The transcription request could not be completed. Please try again.", 500);
  }
}
