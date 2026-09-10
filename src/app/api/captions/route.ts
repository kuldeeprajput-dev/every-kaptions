import { del, get } from "@vercel/blob";
import { CAPTION_MEDIA_TYPES, MAX_CAPTION_FILE_BYTES } from "@/features/editor/data/editor-config";
import { GroqCaptionError, transcribeMedia } from "@/features/editor/server/groq-captions";

export const runtime = "nodejs";
export const maxDuration = 300;

const UPLOAD_PREFIX = "caption-uploads/";
const SUPPORTED_TYPES = new Set<string>(CAPTION_MEDIA_TYPES);

type CaptionRequest = {
  blobPathname?: unknown;
  fileName?: unknown;
  fileType?: unknown;
  language?: unknown;
};

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function cleanFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(-180) || "recording.mp4";
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return errorResponse("Groq is not configured. Add GROQ_API to Vercel and redeploy.", 503);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return errorResponse("Media storage is not configured. Connect a private Vercel Blob store and redeploy.", 503);
  }

  let body: CaptionRequest;
  try {
    body = await request.json() as CaptionRequest;
  } catch {
    return errorResponse("The caption request was invalid. Upload the recording again.", 400);
  }

  const blobPathname = typeof body.blobPathname === "string" ? body.blobPathname : "";
  const fileName = typeof body.fileName === "string" ? cleanFileName(body.fileName) : "recording.mp4";
  const requestedType = typeof body.fileType === "string" ? body.fileType : "";
  const language = typeof body.language === "string" ? body.language : "auto";

  if (!blobPathname.startsWith(UPLOAD_PREFIX) || blobPathname.includes("..")) {
    return errorResponse("The uploaded media reference is invalid. Choose the file again.", 400);
  }
  if (requestedType && !SUPPORTED_TYPES.has(requestedType)) {
    return errorResponse("Use an MP3, MP4, MOV, WAV, or WebM file.", 415);
  }

  try {
    const stored = await get(blobPathname, { access: "private", useCache: false });
    if (!stored || stored.statusCode !== 200) {
      return errorResponse("The temporary upload could not be found. Choose the file again.", 404);
    }

    const contentType = stored.blob.contentType || requestedType;
    if (!SUPPORTED_TYPES.has(contentType)) {
      return errorResponse("The uploaded file type is not supported.", 415);
    }
    if (stored.blob.size === 0) return errorResponse("The selected file is empty.", 400);
    if (stored.blob.size > MAX_CAPTION_FILE_BYTES) {
      return errorResponse("Choose a file smaller than 25 MB for transcription.", 413);
    }

    const bytes = await new Response(stored.stream).arrayBuffer();
    const media = new Blob([bytes], { type: contentType });
    const transcript = await transcribeMedia(media, fileName, language, apiKey);

    return Response.json(transcript, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof GroqCaptionError) {
      return errorResponse(error.message, error.status);
    }
    return errorResponse("The recording could not be processed. Please try again.", 500);
  } finally {
    await del(blobPathname).catch(() => undefined);
  }
}
