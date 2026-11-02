/**
 * Subtitle line density and mobile readability optimizer.
 * Splits lengthy subtitle paragraphs into high-retention 2-4 word bursts
 * and balances visual line lengths for short-form video engagement.
 */

import type { CaptionSegment, CaptionWord } from "../types/captions";

export interface DensityOptimizationOptions {
  maxWordsPerSegment?: number;
  maxCharactersPerLine?: number;
  preservePunctuationBreaks?: boolean;
  minDurationSeconds?: number;
}

export interface OptimizationMetrics {
  originalSegmentsCount: number;
  optimizedSegmentsCount: number;
  averageWordsPerSegment: number;
  readingSpeedCharactersPerSecond: number;
  readabilityRating: "Optimal" | "Fast" | "Dense";
}

/**
 * Calculates estimated spoken duration per character based on syllable weighting.
 */
function estimateCharacterDuration(char: string): number {
  if (/[aeiouy]/i.test(char)) return 1.4;
  if (/[.,!?;:]/.test(char)) return 2.0;
  return 1.0;
}

/**
 * Distributes word start and end timestamps proportional to word character length.
 */
function interpolateWordTimings(
  words: string[],
  startTime: number,
  endTime: number,
): CaptionWord[] {
  const totalDuration = Math.max(0.2, endTime - startTime);
  const weights = words.map((w) =>
    Array.from(w).reduce((sum, ch) => sum + estimateCharacterDuration(ch), 0),
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let currentStart = startTime;
  return words.map((text, i) => {
    const fraction = totalWeight > 0 ? weights[i] / totalWeight : 1 / words.length;
    const duration = totalDuration * fraction;
    const wordEnd = Math.min(endTime, currentStart + duration);
    const item: CaptionWord = {
      id: `w-${i}-${Date.now()}`,
      text,
      start: Math.round(currentStart * 1000) / 1000,
      end: Math.round(wordEnd * 1000) / 1000,
    };
    currentStart = wordEnd;
    return item;
  });
}

/**
 * Evaluates pacing and viewer reading comfort across all cues.
 */
export function evaluateReadabilityRating(
  charactersPerSecond: number,
): "Optimal" | "Fast" | "Dense" {
  if (charactersPerSecond <= 18) return "Optimal";
  if (charactersPerSecond <= 25) return "Fast";
  return "Dense";
}

/**
 * Optimizes an array of caption segments into balanced line bursts.
 */
export function optimizeCaptionDensity(
  segments: CaptionSegment[],
  options: DensityOptimizationOptions = {},
): {
  optimizedSegments: CaptionSegment[];
  metrics: OptimizationMetrics;
} {
  const maxWords = options.maxWordsPerSegment ?? 3;
  const maxChars = options.maxCharactersPerLine ?? 28;
  const minDuration = options.minDurationSeconds ?? 0.6;

  const result: CaptionSegment[] = [];
  let totalCharacters = 0;
  let totalTime = 0;

  for (const seg of segments) {
    const rawWords = seg.text.trim().split(/\s+/).filter(Boolean);
    if (rawWords.length <= maxWords && seg.text.length <= maxChars) {
      result.push(seg);
      totalCharacters += seg.text.length;
      totalTime += Math.max(0.1, seg.end - seg.start);
      continue;
    }

    // Split words into smaller coherent chunks
    const chunks: string[][] = [];
    let currentChunk: string[] = [];

    for (let i = 0; i < rawWords.length; i++) {
      const w = rawWords[i];
      currentChunk.push(w);
      const isPunctuationEnd = /[.?!,]$/.test(w) && options.preservePunctuationBreaks !== false;
      const isLengthExceeded = currentChunk.join(" ").length >= maxChars;

      if (currentChunk.length >= maxWords || isPunctuationEnd || isLengthExceeded) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
    }
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    const segDuration = Math.max(minDuration * chunks.length, seg.end - seg.start);
    const timeSlice = segDuration / chunks.length;

    chunks.forEach((chunkWords, idx) => {
      const chunkStart = seg.start + idx * timeSlice;
      const chunkEnd = Math.min(seg.end, chunkStart + timeSlice);
      const text = chunkWords.join(" ");

      const words = seg.words && seg.words.length === rawWords.length
        ? seg.words.slice(idx * maxWords, (idx + 1) * maxWords)
        : interpolateWordTimings(chunkWords, chunkStart, chunkEnd);

      result.push({
        id: `${seg.id}-sub-${idx}`,
        start: Math.round(chunkStart * 1000) / 1000,
        end: Math.round(chunkEnd * 1000) / 1000,
        text,
        words,
      });

      totalCharacters += text.length;
      totalTime += Math.max(0.1, chunkEnd - chunkStart);
    });
  }

  const averageWords =
    result.length > 0
      ? result.reduce((sum, s) => sum + s.text.split(/\s+/).length, 0) / result.length
      : 0;

  const readingSpeed = totalTime > 0 ? Math.round((totalCharacters / totalTime) * 10) / 10 : 0;
  const rating = evaluateReadabilityRating(readingSpeed);

  return {
    optimizedSegments: result,
    metrics: {
      originalSegmentsCount: segments.length,
      optimizedSegmentsCount: result.length,
      averageWordsPerSegment: Math.round(averageWords * 10) / 10,
      readingSpeedCharactersPerSecond: readingSpeed,
      readabilityRating: rating,
    },
  };
}

/**
 * Returns formatted line break preview with balanced margins.
 */
export function formatBalancedLineBreaks(
  text: string,
  maxLineChars: number = 22,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 2) return [text];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + " " + word).length <= maxLineChars) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  return lines;
}

/**
 * Validates whether segment word bursts fit standard mobile display limits.
 */
export function validateSegmentBurstLimits(
  segments: CaptionSegment[],
  charLimit: number = 32,
): { valid: boolean; overflowingSegmentIds: string[] } {
  const overflowing: string[] = [];
  for (const seg of segments) {
    if (seg.text.length > charLimit) {
      overflowing.push(seg.id);
    }
  }
  return {
    valid: overflowing.length === 0,
    overflowingSegmentIds: overflowing,
  };
}
