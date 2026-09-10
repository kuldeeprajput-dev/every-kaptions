import { getCaptionMediaType } from "../data/editor-config";
import type { CaptionOutputLanguage, TranscriptPayload } from "../types/captions";

type ApiErrorPayload = {
  error?: string;
};

type UploadedMedia = {
  pathname: string;
  contentType: string;
};

function platformError(response: Response, responseText: string, fallback: string) {
  if (response.status === 413) {
    return "This recording is too large to upload. Choose a file smaller than 25 MB.";
  }
  if (response.status === 504 || /timed?\s*out|maximum duration/i.test(responseText)) {
    return "Caption processing took too long. Try a shorter recording or try again.";
  }
  if (/request entity too large|function_payload_too_large/i.test(responseText)) {
    return "This recording could not pass the upload limit. Choose the file again and retry.";
  }
  return fallback;
}

async function readApiJson<T>(response: Response, fallback: string): Promise<T> {
  const responseText = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  let payload: (T & ApiErrorPayload) | null = null;

  if (responseText && contentType.includes("application/json")) {
    try {
      payload = JSON.parse(responseText) as T & ApiErrorPayload;
    } catch {
      throw new Error(fallback);
    }
  }

  if (!response.ok) {
    throw new Error(payload?.error || platformError(response, responseText, fallback));
  }
  if (!payload) throw new Error(fallback);
  return payload;
}

function safeUploadName(fileName: string) {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return cleaned.slice(-160) || "recording.mp4";
}

export function needsCaptionTranslation(
  spokenLanguage: string,
  outputLanguage: CaptionOutputLanguage,
): outputLanguage is Exclude<CaptionOutputLanguage, "same"> {
  if (outputLanguage === "same") return false;
  return outputLanguage === "hinglish" || outputLanguage !== spokenLanguage;
}

export async function uploadCaptionMedia(
  file: File,
  onProgress: (percentage: number) => void,
): Promise<UploadedMedia> {
  const { upload } = await import("@vercel/blob/client");
  const contentType = getCaptionMediaType(file);
  if (!contentType) throw new Error("Choose an MP4, MOV, WebM, MP3, or WAV file.");

  try {
    const result = await upload(`caption-uploads/${safeUploadName(file.name)}`, file, {
      access: "private",
      contentType,
      handleUploadUrl: "/api/media/upload",
      onUploadProgress: ({ percentage }) => onProgress(Math.round(percentage)),
    });

    return {
      pathname: result.pathname,
      contentType: result.contentType,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "The recording could not be uploaded.";
    if (/413|too large|maximum.*size/i.test(message)) {
      throw new Error("This recording is too large. Choose a file smaller than 25 MB.");
    }
    if (/token|blob|storage|environment/i.test(message)) {
      throw new Error("Media upload is not configured yet. Connect Vercel Blob and redeploy the app.");
    }
    if (/abort|network|fetch|connection|interrupted/i.test(message)) {
      throw new Error("The upload was interrupted. Check your connection and try again.");
    }
    throw new Error(message);
  }
}

export async function transcribeUploadedMedia(
  media: UploadedMedia,
  file: File,
  language: string,
) {
  const response = await fetch("/api/captions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blobPathname: media.pathname,
      fileName: file.name,
      fileType: media.contentType || file.type,
      language,
    }),
  });

  return readApiJson<TranscriptPayload>(response, "Captions could not be created. Please try again.");
}

export async function translateCaptionTranscript(
  transcript: TranscriptPayload,
  outputLanguage: Exclude<CaptionOutputLanguage, "same">,
) {
  const response = await fetch("/api/captions/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, outputLanguage }),
  });

  return readApiJson<TranscriptPayload>(
    response,
    "Captions could not be translated to the selected language.",
  );
}

export async function discardCaptionUpload(pathname: string) {
  await fetch("/api/media/upload?pathname=" + encodeURIComponent(pathname), {
    method: "DELETE",
  }).catch(() => undefined);
}
