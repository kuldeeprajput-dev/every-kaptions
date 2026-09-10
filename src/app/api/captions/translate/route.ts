import { isCaptionOutputLanguage, type TranscriptPayload } from "@/features/editor/types/captions";
import { GroqCaptionError, translateTranscript } from "@/features/editor/server/groq-captions";

export const runtime = "nodejs";
export const maxDuration = 300;

type TranslationRequest = {
  transcript?: unknown;
  outputLanguage?: unknown;
};

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function isTranscriptPayload(value: unknown): value is TranscriptPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as TranscriptPayload;
  return typeof candidate.text === "string" || Array.isArray(candidate.segments);
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return errorResponse("Groq is not configured. Add GROQ_API to Vercel and redeploy.", 503);
  }

  let body: TranslationRequest;
  try {
    body = await request.json() as TranslationRequest;
  } catch {
    return errorResponse("The translation request was invalid. Please try again.", 400);
  }

  if (!isTranscriptPayload(body.transcript)) {
    return errorResponse("No transcript was provided for translation.", 400);
  }
  if (!isCaptionOutputLanguage(body.outputLanguage) || body.outputLanguage === "same") {
    return errorResponse("Choose a supported caption output language.", 400);
  }

  try {
    const translated = await translateTranscript(body.transcript, body.outputLanguage, apiKey);
    return Response.json(translated, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof GroqCaptionError) {
      return errorResponse(error.message, error.status);
    }
    return errorResponse("The captions could not be translated. Please try again.", 500);
  }
}
