import type { CaptionSegment } from "../types/captions";

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
        const stream = (videoElement as any).captureStream
          ? (videoElement as any).captureStream()
          : (videoElement as any).mozCaptureStream
          ? (videoElement as any).mozCaptureStream()
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

      recorder.onstop = () => {
        try {
          videoElement.currentTime = originalTime;
          videoElement.muted = originalMuted;

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
        reject(e);
      };

      let animationFrameId: number;

      const formatText = (txt: string) => {
        if (textTransform === "uppercase") return txt.toUpperCase();
        if (textTransform === "lowercase") return txt.toLowerCase();
        return txt;
      };

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

        const activeSeg = segments.find(
          (seg) => currentTime >= seg.start && currentTime <= seg.end,
        );

        if (activeSeg && activeSeg.text.trim()) {
          const text = formatText(activeSeg.text);

          let yPct = 82;
          if (position === "top") yPct = 14;
          else if (position === "center") yPct = 50;
          else if (position === "bottom") yPct = 82;
          else if (position === "custom") yPct = customYPercent;

          const yPos = (yPct / 100) * height;

          let fontSizePx = Math.round(height * 0.045);
          if (fontSize === "sm") fontSizePx = Math.round(height * 0.032);
          else if (fontSize === "lg") fontSizePx = Math.round(height * 0.055);
          else if (fontSize === "xl") fontSizePx = Math.round(height * 0.068);

          ctx.font = `bold ${fontSizePx}px Inter, system-ui, -apple-system, sans-serif`;
          ctx.textAlign = textAlign as CanvasTextAlign;
          ctx.textBaseline = "middle";

          let xPos = width / 2;
          if (textAlign === "left") xPos = width * 0.08;
          if (textAlign === "right") xPos = width * 0.92;

          const metrics = ctx.measureText(text);
          const padX = Math.round(fontSizePx * 0.6);
          const padY = Math.round(fontSizePx * 0.35);

          if (
            styleId === "yellow" ||
            styleId === "classic" ||
            styleId === "dark" ||
            styleId === "red_box" ||
            styleId === "hormozi"
          ) {
            ctx.save();
            ctx.fillStyle =
              styleId === "classic"
                ? "#ffffff"
                : styleId === "red_box"
                ? "#ef4444"
                : styleId === "hormozi"
                ? "#ffe600"
                : "rgba(0, 0, 0, 0.85)";

            const boxWidth = metrics.width + padX * 2;
            const boxHeight = fontSizePx + padY * 2;
            let boxX = xPos - boxWidth / 2;
            if (textAlign === "left") boxX = xPos - padX;
            if (textAlign === "right") boxX = xPos - boxWidth + padX;
            const boxY = yPos - boxHeight / 2;

            ctx.beginPath();
            const rx = 12;
            if (typeof (ctx as any).roundRect === "function") {
              (ctx as any).roundRect(boxX, boxY, boxWidth, boxHeight, rx);
            } else {
              ctx.rect(boxX, boxY, boxWidth, boxHeight);
            }
            ctx.fill();

            if (styleId === "dark" || styleId === "yellow") {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            ctx.fillStyle =
              styleId === "classic"
                ? "#000000"
                : styleId === "hormozi"
                ? "#000000"
                : styleId === "yellow"
                ? highlightHex
                : "#ffffff";
            ctx.fillText(text, xPos, yPos);
            ctx.restore();
          } else {
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 4;

            ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
            ctx.lineWidth = Math.max(3, Math.round(fontSizePx * 0.12));
            ctx.strokeText(text, xPos, yPos);

            ctx.fillStyle =
              styleId === "viral_alex"
                ? "#22c55e"
                : styleId === "neon"
                ? "#06b6d4"
                : highlightHex || "#f6c453";
            ctx.fillText(text, xPos, yPos);
            ctx.restore();
          }
        }

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
