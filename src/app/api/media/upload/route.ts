import { del } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { CAPTION_MEDIA_TYPES, MAX_CAPTION_FILE_BYTES } from "@/features/editor/data/editor-config";

export const runtime = "nodejs";

const UPLOAD_PREFIX = "caption-uploads/";
const SUPPORTED_TYPES = [...CAPTION_MEDIA_TYPES];

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return errorResponse("Media storage is not configured. Connect a private Vercel Blob store and redeploy.", 503);
  }

  let body: HandleUploadBody;
  try {
    body = await request.json() as HandleUploadBody;
  } catch {
    return errorResponse("The upload request was invalid. Choose the file again.", 400);
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(UPLOAD_PREFIX) || pathname.includes("..")) {
          throw new Error("Invalid upload destination.");
        }

        return {
          allowedContentTypes: SUPPORTED_TYPES,
          maximumSizeInBytes: MAX_CAPTION_FILE_BYTES,
          addRandomSuffix: true,
          allowOverwrite: false,
          validUntil: Date.now() + 10 * 60 * 1000,
          tokenPayload: JSON.stringify({ purpose: "caption-transcription" }),
        };
      },
    });

    return Response.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The media upload could not be started.";
    return errorResponse(message, 400);
  }
}

export async function DELETE(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return errorResponse("Media storage is not configured.", 503);
  }

  const pathname = new URL(request.url).searchParams.get("pathname") ?? "";
  if (!pathname.startsWith(UPLOAD_PREFIX) || pathname.includes("..")) {
    return errorResponse("The upload reference is invalid.", 400);
  }

  try {
    await del(pathname);
    return new Response(null, { status: 204 });
  } catch {
    return errorResponse("The temporary upload could not be removed.", 500);
  }
}
