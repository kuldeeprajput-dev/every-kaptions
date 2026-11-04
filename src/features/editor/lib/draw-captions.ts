import type { CaptionAppearance, CaptionSegment } from "../types/captions";
import { ensureSegmentWords } from "./captions";

export interface CaptionBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** One renderer for the live preview and exported video. */
export function drawCaptions(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  segments: CaptionSegment[],
  time: number,
  styleId: string,
  appearance: CaptionAppearance,
) {
  const segment = segments.find((item) => time >= item.start && time < item.end);
  if (!segment?.text.trim()) return;
  ctx.save();
  const factors = { sm: 0.032, md: 0.045, lg: 0.055, xl: 0.068 };
  const size = Math.max(10, height * factors[appearance.fontSize]);
  ctx.font = `700 ${size}px Inter, system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const space = ctx.measureText(" ").width;
  const words = ensureSegmentWords(segment).map((word) => {
    const text = appearance.textTransform === "uppercase" ? word.text.toUpperCase() : appearance.textTransform === "lowercase" ? word.text.toLowerCase() : word.text;
    return { ...word, text, width: Math.min(width * 0.8, ctx.measureText(text).width) };
  });
  const lines: (typeof words)[] = [];
  let line: typeof words = [];
  let used = 0;
  for (const word of words) {
    if (line.length && used + space + word.width > width * 0.8) {
      lines.push(line);
      line = [];
      used = 0;
    }
    used += (line.length ? space : 0) + word.width;
    line.push(word);
  }
  if (line.length) lines.push(line);
  const lineHeight = size * 1.45;
  const blockHeight = lines.length * lineHeight;
  const pct = appearance.position === "custom" ? appearance.customYPercent : appearance.position === "top" ? 14 : appearance.position === "center" ? 50 : 82;
  const top = Math.max(size * 0.5, Math.min(height - blockHeight - size * 0.5, (height * pct) / 100 - blockHeight / 2));
  lines.forEach((row, index) => {
    const rowWidth = row.reduce((sum, word) => sum + word.width, 0) + space * (row.length - 1);
    let x = appearance.textAlign === "left" ? width * 0.1 : appearance.textAlign === "right" ? width * 0.9 - rowWidth : (width - rowWidth) / 2;
    const y = top + index * lineHeight + lineHeight / 2;
    const box = ["yellow", "dark", "classic", "hormozi", "red_box"].includes(styleId);
    if (box) {
      ctx.fillStyle = styleId === "classic" ? "#fff" : styleId === "red_box" ? "#c63838" : "rgba(0,0,0,.85)";
      ctx.beginPath();
      ctx.roundRect(x - size * 0.45, y - lineHeight / 2, rowWidth + size * 0.9, lineHeight, size * 0.18);
      ctx.fill();
    }
    row.forEach((word) => {
      const active = time >= word.start && time < word.end;
      ctx.fillStyle = styleId === "classic" ? "#18181b" : active && styleId !== "dark" && styleId !== "red_box" ? appearance.highlightHex : "#fff";
      if (!box) {
        ctx.strokeStyle = "#18181b";
        ctx.lineWidth = size * 0.1;
        ctx.strokeText(word.text, x, y, word.width);
      }
      ctx.fillText(word.text, x, y, word.width);
      x += word.width + space;
    });
  });
  ctx.restore();
}

/** Measures canvas caption bounds to prevent overlap with platform safe zones. */
export function getCaptionBoundingBox(
  width: number,
  height: number,
  fontSize: CaptionAppearance["fontSize"],
  position: CaptionAppearance["position"],
  customYPercent: number,
  lineCount: number,
): CaptionBoundingBox {
  const factors = { sm: 0.032, md: 0.045, lg: 0.055, xl: 0.068 };
  const size = Math.max(10, height * factors[fontSize]);
  const lineHeight = size * 1.45;
  const blockHeight = Math.max(1, lineCount) * lineHeight;
  const pct = position === "custom" ? customYPercent : position === "top" ? 14 : position === "center" ? 50 : 82;
  const top = Math.max(size * 0.5, Math.min(height - blockHeight - size * 0.5, (height * pct) / 100 - blockHeight / 2));
  return { x: width * 0.1, y: top, width: width * 0.8, height: blockHeight };
}
