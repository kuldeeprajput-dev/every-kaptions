/**
 * Transcript semantic analysis and viral moment detection engine.
 * Scores caption segments for emotional intensity, hook strength,
 * and high-engagement short-form clip cut points.
 */

import type { CaptionSegment } from "../types/captions";

export type MomentCategory = "hook" | "question" | "insight" | "cta" | "high-energy";

export interface HighlightedMoment {
  segmentId: string;
  category: MomentCategory;
  heatScore: number;
  triggerPhrase: string;
  badgeLabel: string;
  colorHex: string;
}

export interface ViralClipSuggestion {
  id: string;
  startSecond: number;
  endSecond: number;
  durationSeconds: number;
  averageHeatScore: number;
  title: string;
  includedSegmentIds: string[];
}

const CATEGORY_STYLES: Record<MomentCategory, { label: string; color: string }> = {
  hook: { label: "Opening Hook", color: "#f59e0b" },
  question: { label: "Curiosity Question", color: "#3b82f6" },
  insight: { label: "Key Takeaway", color: "#10b981" },
  cta: { label: "Call to Action", color: "#f43f5e" },
  "high-energy": { label: "Viral Peak", color: "#8b5cf6" },
};

const HOOK_PATTERNS = [/\b(secret|stop|never|truth|mistake|why you|nobody talks about)\b/i];
const QUESTION_PATTERNS = [/\b(how do you|have you ever|what if|did you know|why is)\b/i, /\?$/];
const INSIGHT_PATTERNS = [/\b(key is|remember|rule number|the framework|takeaway|solution)\b/i];
const CTA_PATTERNS = [/\b(subscribe|follow|link in bio|comment below|share this|save for later)\b/i];
const ENERGY_PATTERNS = [/\b(insane|crazy|10x|mind-blowing|huge|game changer|unbelievable)\b/i, /!$/];

/**
 * Analyzes a single caption segment and returns any classified key moments.
 */
export function analyzeSegmentMoment(segment: CaptionSegment): HighlightedMoment | null {
  const text = segment.text.trim();
  if (text.length < 5) return null;

  for (const regex of HOOK_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      return {
        segmentId: segment.id,
        category: "hook",
        heatScore: 92,
        triggerPhrase: match[0],
        badgeLabel: CATEGORY_STYLES.hook.label,
        colorHex: CATEGORY_STYLES.hook.color,
      };
    }
  }

  for (const regex of ENERGY_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      return {
        segmentId: segment.id,
        category: "high-energy",
        heatScore: 88,
        triggerPhrase: match[0],
        badgeLabel: CATEGORY_STYLES["high-energy"].label,
        colorHex: CATEGORY_STYLES["high-energy"].color,
      };
    }
  }

  for (const regex of INSIGHT_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      return {
        segmentId: segment.id,
        category: "insight",
        heatScore: 82,
        triggerPhrase: match[0],
        badgeLabel: CATEGORY_STYLES.insight.label,
        colorHex: CATEGORY_STYLES.insight.color,
      };
    }
  }

  for (const regex of QUESTION_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      return {
        segmentId: segment.id,
        category: "question",
        heatScore: 78,
        triggerPhrase: match[0],
        badgeLabel: CATEGORY_STYLES.question.label,
        colorHex: CATEGORY_STYLES.question.color,
      };
    }
  }

  for (const regex of CTA_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      return {
        segmentId: segment.id,
        category: "cta",
        heatScore: 75,
        triggerPhrase: match[0],
        badgeLabel: CATEGORY_STYLES.cta.label,
        colorHex: CATEGORY_STYLES.cta.color,
      };
    }
  }

  return null;
}

/**
 * Scans all segments in the video and returns marked highlight moments.
 */
export function extractTranscriptHighlights(
  segments: CaptionSegment[],
): HighlightedMoment[] {
  const moments: HighlightedMoment[] = [];
  for (const seg of segments) {
    const moment = analyzeSegmentMoment(seg);
    if (moment) {
      moments.push(moment);
    }
  }
  return moments;
}

/**
 * Identifies high-density viral clip windows (30s to 60s) from the transcript.
 */
export function detectViralClipSuggestions(
  segments: CaptionSegment[],
  targetDurationSeconds: number = 45,
): ViralClipSuggestion[] {
  if (segments.length === 0) return [];

  const highlights = extractTranscriptHighlights(segments);
  const highlightMap = new Map(highlights.map((h) => [h.segmentId, h.heatScore]));

  const suggestions: ViralClipSuggestion[] = [];
  const windowTolerance = 15;

  for (let i = 0; i < segments.length; i++) {
    const startSeg = segments[i];
    let endIdx = i;
    let accumulatedTime = 0;
    let cumulativeScore = 0;
    const includedIds: string[] = [];

    while (endIdx < segments.length) {
      const current = segments[endIdx];
      accumulatedTime = current.end - startSeg.start;
      includedIds.push(current.id);

      const score = highlightMap.get(current.id) ?? 40;
      cumulativeScore += score;

      if (accumulatedTime >= targetDurationSeconds - windowTolerance) {
        if (accumulatedTime <= targetDurationSeconds + windowTolerance) {
          const avgScore = Math.round(cumulativeScore / includedIds.length);
          const title = startSeg.text.split(/[.?!]/)[0]?.slice(0, 45) || "Viral Highlight";

          suggestions.push({
            id: `clip-${i}-${endIdx}`,
            startSecond: Math.round(startSeg.start * 10) / 10,
            endSecond: Math.round(current.end * 10) / 10,
            durationSeconds: Math.round(accumulatedTime * 10) / 10,
            averageHeatScore: avgScore,
            title,
            includedSegmentIds: includedIds,
          });
        }
        break;
      }
      endIdx++;
    }
  }

  // Deduplicate and rank by average heat score
  suggestions.sort((a, b) => b.averageHeatScore - a.averageHeatScore);
  return suggestions.slice(0, 3);
}

/**
 * Calculates overall video engagement score (1 to 100) based on highlight density.
 */
export function calculateVideoEngagementIndex(
  segments: CaptionSegment[],
): { index: number; tier: "Viral Potential" | "High Engagement" | "Standard" } {
  if (segments.length === 0) return { index: 50, tier: "Standard" };

  const highlights = extractTranscriptHighlights(segments);
  const density = highlights.length / Math.max(1, segments.length / 10);
  const index = Math.min(98, Math.max(35, Math.round(50 + density * 12)));

  const tier = index >= 85 ? "Viral Potential" : index >= 70 ? "High Engagement" : "Standard";
  return { index, tier };
}
