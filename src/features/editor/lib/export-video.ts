import type { CaptionSegment } from "../types/captions";
import { drawCaptions } from "./draw-captions";

export type RenderVideoOptions = {
  videoElement: HTMLVideoElement;
  segments: CaptionSegment[];
  styleId: string;
  highlightHex: string;
  position: "top" | "center" | "bottom" | "custom";
  customYPercent: number;
  fontSize: "sm" | "md" | "lg" | "xl";
  textAlign: "left" | "center" | "right";
  textTransform: "uppercase" | "none" | "lowercase";
  filename?: string;
  onProgress?: (progress: number) => void;
};

export async function renderAndExportVideo({
  videoElement,
  segments,
  styleId,
  highlightHex,
  position,
  customYPercent,
  fontSize,
  textAlign,
  textTransform,
  filename = "captioned-video.mp4",
  onProgress,
}: RenderVideoOptions): Promise<boolean> {
  if (!videoElement || segments.length === 0) return false;

  return new Promise<boolean>((resolve, reject) => {
    try {
      const width = videoElement.videoWidth || 1280;
      const height = videoElement.videoHeight || 720;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas 2D context not supported"));
        return;
      }

      let audioTrack: MediaStreamTrack | null = null;
      try {
        type VideoWithCapture = HTMLVideoElement & {
          captureStream?: () => MediaStream;
          mozCaptureStream?: () => MediaStream;
        };
        const v = videoElement as VideoWithCapture;
        const stream = typeof v.captureStream === "function"
          ? v.captureStream()
          : typeof v.mozCaptureStream === "function"
          ? v.mozCaptureStream()
          : null;

        if (stream && stream.getAudioTracks().length > 0) {
          audioTrack = stream.getAudioTracks()[0];
        }
      } catch {
        // Fallback if captureStream is restricted
      }

      const canvasStream = canvas.captureStream(30);
      if (audioTrack) {
        canvasStream.addTrack(audioTrack);
      }

      const mimeTypes = [
        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        "video/mp4",
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ];

      let selectedMime = "";
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType: selectedMime || undefined,
        videoBitsPerSecond: 6000000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const originalTime = videoElement.currentTime;
      const originalMuted = videoElement.muted;
      const originalPlaybackRate = videoElement.playbackRate;
      videoElement.playbackRate = 1;

      recorder.onstop = () => {
        try {
          videoElement.currentTime = originalTime;
          videoElement.muted = originalMuted;
          videoElement.playbackRate = originalPlaybackRate;

          const blob = new Blob(chunks, { type: selectedMime || "video/mp4" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const ext = selectedMime.includes("mp4") ? "mp4" : "webm";
          link.download = filename.replace(/\.[^.]+$/, "") + `.${ext}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };

      recorder.onerror = (e) => {
        videoElement.currentTime = originalTime;
        videoElement.muted = originalMuted;
        videoElement.playbackRate = originalPlaybackRate;
        reject(e);
      };

      let animationFrameId: number;

      const drawFrame = () => {
        if (videoElement.ended || videoElement.currentTime >= videoElement.duration) {
          cancelAnimationFrame(animationFrameId);
          if (recorder.state === "recording") {
            recorder.stop();
          }
          return;
        }

        const currentTime = videoElement.currentTime;
        if (onProgress && videoElement.duration) {
          onProgress(Math.min(100, Math.round((currentTime / videoElement.duration) * 100)));
        }

        ctx.drawImage(videoElement, 0, 0, width, height);

        drawCaptions(ctx, width, height, segments, currentTime, styleId, { highlightHex, position, customYPercent, fontSize, textAlign, textTransform });

        if (recorder.state === "recording") {
          animationFrameId = requestAnimationFrame(drawFrame);
        }
      };

      videoElement.currentTime = 0;
      videoElement.muted = false;

      videoElement.onseeked = () => {
        videoElement.onseeked = null;
        recorder.start(250);
        videoElement.play().catch((err) => reject(err));
        drawFrame();
      };
    } catch (err) {
      reject(err);
    }
  });
}
