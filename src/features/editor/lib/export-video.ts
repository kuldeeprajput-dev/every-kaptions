import type { CaptionSegment } from "../types/captions";
import { drawCaptions } from "./draw-captions";
import { observeVideoFrames } from "./video-frames";

export const videoExportFrameRates = [24, 30, 60] as const;
export const videoExportQualities = [
  { id: "hd", label: "720p HD", shortEdge: 720 },
  { id: "full-hd", label: "1080p Full HD", shortEdge: 1080 },
  { id: "original", label: "Original resolution", shortEdge: Infinity },
] as const;

export type VideoExportFrameRate = typeof videoExportFrameRates[number];
export type VideoExportQuality = typeof videoExportQualities[number]["id"];

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
  quality?: VideoExportQuality;
  frameRate?: VideoExportFrameRate;
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
  quality = "original",
  frameRate = 30,
  onProgress,
}: RenderVideoOptions): Promise<boolean> {
  if (!videoElement || segments.length === 0) return false;

  if (videoElement.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !videoElement.videoWidth) {
    throw new Error("Wait for the video preview to load, then try exporting again.");
  }
  const video = videoElement as HTMLVideoElement & {
    captureStream?: () => MediaStream;
    mozCaptureStream?: () => MediaStream;
  };
  const captureMedia = video.captureStream ?? video.mozCaptureStream;
  const canvas = document.createElement("canvas");
  if (!captureMedia || typeof canvas.captureStream !== "function" || typeof MediaRecorder === "undefined") {
    throw new Error("This browser cannot record captioned video with audio. Try Chrome or Firefox.");
  }
  const shortEdge = videoExportQualities.find(option => option.id === quality)?.shortEdge ?? Infinity;
  const scale = Math.min(1, shortEdge / Math.min(video.videoWidth, video.videoHeight));
  const width = Math.max(2, Math.floor(video.videoWidth * scale / 2) * 2);
  const height = Math.max(2, Math.floor(video.videoHeight * scale / 2) * 2);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error("Could not prepare the video export canvas.");
  const originalTime = video.currentTime;
  const originalRate = video.playbackRate;
  const originalMuted = video.muted;
  const mimeTypes = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
  return new Promise<boolean>((resolve, reject) => {
    let sourceStream: MediaStream | undefined;
    let canvasStream: MediaStream | undefined;
    let recorder: MediaRecorder | undefined;
    let stopFrames = () => { };
    let settled = false;
    let previousProgress = -1;
    const chunks: Blob[] = [];
    const cleanup = () => {
      stopFrames();
      video.removeEventListener("seeked", startRecording);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", mediaFailed);
      if (recorder && recorder.state !== "inactive")
        recorder.stop();
      sourceStream?.getTracks().forEach(track => track.stop());
      canvasStream?.getVideoTracks().forEach(track => track.stop());
      video.pause();
      video.playbackRate = originalRate;
      video.muted = originalMuted;
      video.currentTime = originalTime;
    };
    const fail = (error: unknown) => {
      if (settled)
        return;
      settled = true;
      try {
        cleanup();
      } finally {
        reject(error);
      }
    };
    const mediaFailed = () => fail(new Error("The video could not be read during export."));
    const finish = () => {
      if (recorder?.state === "recording")
        recorder.stop();
    };
    const drawFrame = (currentTime: number) => {
      ctx.drawImage(video, 0, 0, width, height);
      drawCaptions(ctx, width, height, segments, currentTime, styleId, {
        highlightHex, position, customYPercent, fontSize, textAlign, textTransform,
      });
      if (onProgress && video.duration) {
        const progress = Math.min(99, Math.round((currentTime / video.duration) * 100));
        if (progress !== previousProgress) {
          previousProgress = progress;
          onProgress(progress);
        }
      }
    };
    const startRecording = () => {
      try {
        sourceStream = captureMedia.call(video);
        canvasStream = canvas.captureStream(0);
        const canvasTrack = canvasStream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;
        const manualCapture = typeof canvasTrack.requestFrame === "function";
        if (!manualCapture) {
          canvasTrack.stop();
          canvasStream = canvas.captureStream(frameRate);
        }
        for (const track of sourceStream.getAudioTracks())
          canvasStream.addTrack(track);
        const videoBitsPerSecond = Math.min(60_000_000, Math.max(2_000_000, Math.round(width * height * frameRate * 0.14)));
        const recording = new MediaRecorder(canvasStream, { mimeType, videoBitsPerSecond });
        recorder = recording;
        recording.ondataavailable = ({ data }) => {
          if (data.size > 0)
            chunks.push(data);
        };
        recording.onerror = () => fail(new Error("The browser stopped recording the video."));
        recording.onstop = () => {
          if (settled)
            return;
          try {
            const actualType = chunks[0]?.type || recording.mimeType;
            const blob = new Blob(chunks, { type: actualType });
            if (!blob.size)
              throw new Error("The recording was empty.");
            cleanup();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const extension = actualType.includes("mp4") ? "mp4" : "webm";
            link.href = url;
            link.download = filename.replace(/\.[^.]+$/, "") + `.${extension}`;
            document.body.appendChild(link);
            try {
              link.click();
            }
            finally {
              link.remove();
              window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
            }
            settled = true;
            resolve(true);
          }
          catch (error) {
            fail(error);
          }
        };
        video.addEventListener("ended", finish, { once: true });
        recording.start(250);
        drawFrame(0);
        if (manualCapture) canvasTrack.requestFrame();
        let lastFrameSlot = 0;
        stopFrames = observeVideoFrames(video, time => {
          // Capture after compositing to avoid the browser sampling between rendered frames.
          const frameSlot = Math.round(time * frameRate);
          if (frameSlot <= lastFrameSlot) return;
          try {
            lastFrameSlot = frameSlot;
            drawFrame(time);
            if (manualCapture) canvasTrack.requestFrame();
          }
          catch (error) {
            fail(error);
          }
        });
        void video.play().catch(fail);
      } catch (error) {
        fail(error);
      }
    };
    try {
      video.pause();
      video.playbackRate = 1;
      video.muted = false;
      video.addEventListener("error", mediaFailed, { once: true });
      if (video.currentTime === 0 && !video.seeking)
        startRecording();
      else {
        video.addEventListener("seeked", startRecording, { once: true });
        video.currentTime = 0;
      }
    } catch (error) {
      fail(error);
    }
  });
}
