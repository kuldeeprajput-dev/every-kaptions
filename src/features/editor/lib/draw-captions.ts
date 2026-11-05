import type { CaptionAppearance, CaptionSegment } from "../types/captions";
import { ensureSegmentWords } from "./captions";
import { getCaptionPreset } from "../data/caption-presets";

export interface CaptionBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const clampProgress = (value: number) => Math.max(0, Math.min(1, value));
const easeOut = (value: number) => 1 - (1 - value) ** 3;
const popScale = (value: number) => {
  const t = value - 1;
  return 1 + 2.70158 * t ** 3 + 1.70158 * t ** 2;
};

/** One renderer for the live preview and exported video. Animations use media time, so seeking is deterministic. */
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
  const preset = getCaptionPreset(styleId);
  const family = preset.family === "serif" ? "Georgia, serif" : preset.family === "monospace" ? "monospace" : "Inter, system-ui, sans-serif";
  ctx.font = `${preset.italic ? "italic " : ""}${preset.weight ?? 700} ${size}px ${family}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const space = ctx.measureText(" ").width;
  const motion = preset.animation;
  const wordMotion = motion === "word-reveal" || motion === "word-pop" || motion === "word-fade" || motion === "typewriter";
  const aligned = ensureSegmentWords(segment);
  let activeIndex = -1;
  for (let i = 0; i < aligned.length; i++) { if (time >= aligned[i].start) activeIndex = i; }
  // Keep a stable six-word layout for each spoken phrase, including silent gaps.
  const pageStart = wordMotion ? Math.floor(Math.max(0, activeIndex) / 6) * 6 : 0;
  const phrase = wordMotion ? aligned.slice(pageStart, pageStart + 6) : aligned;
  const words = phrase.map((word) => {
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
  const entrance = clampProgress((time - segment.start) / Math.min(.3, Math.max(.04, (segment.end - segment.start) * .3)));
  const eased = easeOut(entrance);
  if (motion === "fade") {
    ctx.globalAlpha *= eased;
  }
  if (motion === "rise") {
    ctx.globalAlpha *= eased;
    ctx.translate(0, size * .35 * (1 - eased));
  }
  if (motion === "slide") {
    ctx.globalAlpha *= eased;
    ctx.translate(-size * .7 * (1 - eased), 0);
  }
  if (motion === "pop") {
    const scale = .9 + .1 * popScale(entrance);
    ctx.globalAlpha *= eased;
    ctx.translate(width / 2, top + blockHeight / 2);
    ctx.scale(scale, scale);
    ctx.translate(-width / 2, -top - blockHeight / 2);
  }
  lines.forEach((row, index) => {
    const rowWidth = row.reduce((sum, word) => sum + word.width, 0) + space * (row.length - 1);
    let x = appearance.textAlign === "left" ? width * 0.1 : appearance.textAlign === "right" ? width * 0.9 - rowWidth : (width - rowWidth) / 2;
    const y = top + index * lineHeight + lineHeight / 2;
    if (wordMotion && !row.some(word => time >= word.start)) return;
    if (preset.background) {
      ctx.fillStyle = preset.background;
      ctx.beginPath();
      ctx.roundRect(x - size * .45, y - lineHeight / 2, rowWidth + size * .9, lineHeight, size * (preset.radius ?? .18));
      ctx.fill();
      if (preset.border) {
        ctx.strokeStyle = preset.border;
        ctx.lineWidth = size * .035;
        ctx.stroke();
      }
    }
    row.forEach((word) => {
      const active = word.id === aligned[activeIndex]?.id && time >= word.start && time < word.end;
      if (wordMotion && time < word.start) {
        x += word.width + space;
        return;
      }
      ctx.save();
      const wordProgress = clampProgress((time - word.start) / Math.min(.14, Math.max(.02, (word.end - word.start) * .55)));
      let text = word.text;
      if (motion === "word-fade") {
        ctx.globalAlpha *= easeOut(wordProgress);
      }
      if (motion === "word-pop") {
        const scale = .88 + .12 * popScale(wordProgress);
        ctx.globalAlpha *= easeOut(wordProgress);
        ctx.translate(x + word.width / 2, y);
        ctx.scale(scale, scale);
        ctx.translate(-x - word.width / 2, -y);
      }
      if (motion === "typewriter") {
        const characters = Array.from(graphemes.segment(word.text), part => part.segment);
        const progress = clampProgress((time - word.start) / Math.max(.02, (word.end - word.start) * .7));
        text = characters.slice(0, Math.ceil(characters.length * progress)).join("");
      }
      if (active && preset.active === "box") {
        ctx.fillStyle = appearance.highlightHex;
        ctx.beginPath();
        ctx.roundRect(x - size * .12, y - size * .57, word.width + size * .24, size * 1.14, size * .12);
        ctx.fill();
      }
      ctx.fillStyle = active && preset.active === "text" ? appearance.highlightHex : preset.color;
      if (preset.shadow) {
        ctx.shadowColor = "rgba(0,0,0,.75)";
        ctx.shadowBlur = size * .15;
        ctx.shadowOffsetY = size * .06;
      }
      if (preset.outline) {
        ctx.strokeStyle = preset.outlineColor ?? "#18181b";
        ctx.lineWidth = size * preset.outline;
        ctx.lineJoin = "round";
        ctx.strokeText(text, x, y, word.width);
      }
      ctx.fillText(text, x, y, word.width);
      if (active && preset.active === "underline") {
        ctx.fillStyle = appearance.highlightHex;
        ctx.fillRect(x, y + size * .53, word.width, size * .09);
      }
      ctx.restore();
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
