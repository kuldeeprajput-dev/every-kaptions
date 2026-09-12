import type { CaptionSegment } from "../types/captions";
import { ensureSegmentWords } from "./captions";

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
          ctx.textBaseline = "middle";

          const words = ensureSegmentWords(activeSeg);
          const spaceWidth = ctx.measureText(" ").width;
          const measuredWords = words.map((w) => {
            const formatted = formatText(w.text);
            const wWidth = ctx.measureText(formatted).width;
            return { word: w, formatted, width: wWidth };
          });

          const totalContentWidth = measuredWords.reduce(
            (sum, item, idx) => sum + item.width + (idx < measuredWords.length - 1 ? spaceWidth : 0),
            0,
          );

          let xPos = width / 2;
          if (textAlign === "left") xPos = width * 0.08;
          if (textAlign === "right") xPos = width * 0.92;

          let startX = xPos - totalContentWidth / 2;
          if (textAlign === "left") startX = xPos;
          if (textAlign === "right") startX = xPos - totalContentWidth;

          const padX = Math.round(fontSizePx * 0.6);
          const padY = Math.round(fontSizePx * 0.35);

          type ContextWithRoundRect = CanvasRenderingContext2D & {
            roundRect?: (x: number, y: number, w: number, h: number, r: number) => void;
          };
          const ctxWithRoundRect = ctx as ContextWithRoundRect;

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

            const boxWidth = totalContentWidth + padX * 2;
            const boxHeight = fontSizePx + padY * 2;
            const boxX = startX - padX;
            const boxY = yPos - boxHeight / 2;

            ctx.beginPath();
            const rx = 12;
            if (typeof ctxWithRoundRect.roundRect === "function") {
              ctxWithRoundRect.roundRect(boxX, boxY, boxWidth, boxHeight, rx);
            } else {
              ctx.rect(boxX, boxY, boxWidth, boxHeight);
            }
            ctx.fill();

            if (styleId === "dark" || styleId === "yellow") {
              ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
              ctx.lineWidth = 2;
              ctx.stroke();
            }

            ctx.textAlign = "left";
            let curX = startX;
            for (const item of measuredWords) {
              const isCurrent = currentTime >= item.word.start - 0.04 && currentTime <= item.word.end + 0.08;

              if (isCurrent) {
                if (styleId === "hormozi") {
                  ctx.fillStyle = highlightHex || "#ffe600";
                  ctx.beginPath();
                  const badgePad = 4;
                  if (typeof ctxWithRoundRect.roundRect === "function") {
                    ctxWithRoundRect.roundRect(curX - badgePad, yPos - fontSizePx * 0.55, item.width + badgePad * 2, fontSizePx * 1.1, 6);
                  } else {
                    ctx.rect(curX - badgePad, yPos - fontSizePx * 0.55, item.width + badgePad * 2, fontSizePx * 1.1);
                  }
                  ctx.fill();
                  ctx.fillStyle = "#000000";
                  ctx.fillText(item.formatted, curX, yPos);
                } else if (styleId === "yellow") {
                  ctx.fillStyle = highlightHex || "#f6c453";
                  ctx.fillText(item.formatted, curX, yPos);
                } else if (styleId === "classic") {
                  ctx.fillStyle = "#000000";
                  ctx.fillText(item.formatted, curX, yPos);
                } else {
                  ctx.fillStyle = highlightHex || "#f6c453";
                  ctx.fillText(item.formatted, curX, yPos);
                }
              } else {
                ctx.fillStyle = styleId === "classic" || styleId === "hormozi" ? "#000000" : "#ffffff";
                ctx.fillText(item.formatted, curX, yPos);
              }

              curX += item.width + spaceWidth;
            }
            ctx.restore();
          } else {
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 12;
            ctx.shadowOffsetY = 4;

            ctx.textAlign = "left";
            let curX = startX;
            for (const item of measuredWords) {
              const isCurrent = currentTime >= item.word.start - 0.04 && currentTime <= item.word.end + 0.08;
              const strokeWidth = Math.max(3, Math.round(fontSizePx * 0.12));

              ctx.save();
              if (isCurrent) {
                // Apply subtle active word scale & glow highlight on canvas
                const wordCenterX = curX + item.width / 2;
                ctx.translate(wordCenterX, yPos);
                ctx.scale(1.08, 1.08);
                ctx.translate(-wordCenterX, -yPos);

                const activeGlowColor =
                  styleId === "viral_alex"
                    ? (highlightHex === "#f6c453" ? "#22c55e" : highlightHex)
                    : styleId === "neon"
                    ? (highlightHex === "#f6c453" ? "#ec4899" : highlightHex)
                    : (highlightHex || "#f6c453");

                ctx.shadowColor = activeGlowColor;
                ctx.shadowBlur = 16;
              }

              ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
              ctx.lineWidth = strokeWidth;
              ctx.strokeText(item.formatted, curX, yPos);

              if (isCurrent) {
                ctx.fillStyle =
                  styleId === "viral_alex"
                    ? (highlightHex === "#f6c453" ? "#22c55e" : highlightHex)
                    : styleId === "neon"
                    ? (highlightHex === "#f6c453" ? "#ec4899" : highlightHex)
                    : (highlightHex || "#f6c453");
              } else {
                ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
              }

              ctx.fillText(item.formatted, curX, yPos);
              ctx.restore();

              curX += item.width + spaceWidth;
            }
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
