import type { CaptionSegment, CaptionWord, TranscriptPayload, TranscriptionResult } from "../types/captions";

const WORDS_PER_SEGMENT = 6;

function cleanText(value: string | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export function normalizeWord(
  word: NonNullable<TranscriptPayload["words"]>[number],
  index: number,
  fallbackStart = 0,
): CaptionWord | null {
  const text = cleanText(word.word);
  if (!text) return null;

  const start = Math.max(0, Number(word.start ?? fallbackStart));
  const end = Math.max(start + 0.08, Number(word.end ?? start + 0.45));
  return { id: `word-${index}-${start.toFixed(3)}`, text, start, end };
}

/**
 * Generates smoothly distributed word timings across a segment's duration based on token character length.
 * Provides approximate word timestamps when the transcription has no word alignment.
 */
export function interpolateSegmentWords(
  segment: Pick<CaptionSegment, "id" | "text" | "start" | "end">,
): CaptionWord[] {
  const tokens = segment.text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const start = Math.max(0, segment.start);
  const end = Math.max(start + 0.2, segment.end);
  const totalDuration = end - start;

  // Weight each word by token length + 2 (so short words like "to", "a" get adequate duration)
  const weights = tokens.map((token) => Math.max(1, Array.from(token.replace(/[^\p{L}\p{N}]/gu, "")).length + 2));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let currentStart = start;
  return tokens.map((token, index) => {
    const wordDuration = (weights[index] / totalWeight) * totalDuration;
    const wordStart = currentStart;
    const wordEnd = index === tokens.length - 1 ? end : Math.min(end, currentStart + wordDuration);
    currentStart = wordEnd;

    return {
      id: `${segment.id}-w${index}-${wordStart.toFixed(2)}`,
      text: token,
      start: Number(wordStart.toFixed(3)),
      end: Number(wordEnd.toFixed(3)),
    };
  });
}

/**
 * Ensures a segment has valid, non-empty word timings that match its current text.
 */
export function ensureSegmentWords(segment: CaptionSegment): CaptionWord[] {
  const tokens = segment.text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  if (segment.words && segment.words.length === tokens.length && segment.words.length > 0) {
    const aligned = segment.words.map((word, index, words) => ({
      ...word, text: tokens[index],
      start: Math.max(segment.start, word.start),
      end: Math.min(segment.end, word.end, words[index + 1]?.start ?? segment.end),
    }));
    if (aligned.every((word, index) => Number.isFinite(word.start) && Number.isFinite(word.end) && word.end > word.start && (index === 0 || word.start >= aligned[index - 1].end))) return aligned;
  }

  return interpolateSegmentWords(segment);
}

function chunkWords(words: CaptionWord[]): CaptionSegment[] {
  const segments: CaptionSegment[] = [];

  for (let index = 0; index < words.length; index += WORDS_PER_SEGMENT) {
    const chunk = words.slice(index, index + WORDS_PER_SEGMENT);
    const first = chunk[0];
    const last = chunk.at(-1);
    if (!first || !last) continue;

    const segId = `segment-${segments.length}-${first.start.toFixed(2)}`;
    segments.push({
      id: segId,
      text: chunk.map((word) => word.text).join(" "),
      start: first.start,
      end: last.end,
      words: chunk,
    });
  }

  return segments;
}

export function normalizeTranscript(payload: TranscriptPayload): TranscriptionResult {
  const flatWords = (payload.words ?? [])
    .map((word, index) => normalizeWord(word, index))
    .filter((word): word is CaptionWord => word !== null);

  const rawSegments = payload.segments ?? [];
  let segments: CaptionSegment[] = [];

  if (rawSegments.length > 0) {
    let wordCursor = 0;

    segments = rawSegments.flatMap((segment, segmentIndex) => {
      const segText = cleanText(segment.text);
      const segStart = Math.max(0, Number(segment.start ?? 0));
      const segEnd = Math.max(segStart + 0.2, Number(segment.end ?? segStart + 2));

      // 1. First check if segment.words exists in Whisper response
      let words = (segment.words ?? [])
        .map((word, wordIndex) => normalizeWord(word, segmentIndex * 1000 + wordIndex, segStart))
        .filter((word): word is CaptionWord => word !== null);

      // 2. If segment.words is empty but flatWords exists, map words matching this segment's timing
      if (words.length === 0 && flatWords.length > 0) {
        const matched: CaptionWord[] = [];
        while (wordCursor < flatWords.length) {
          const currentWord = flatWords[wordCursor];
          if (currentWord.start < segStart - 0.2) {
            wordCursor++;
            continue;
          }
          if (currentWord.start >= segEnd + 0.2) {
            break;
          }
          matched.push(currentWord);
          wordCursor++;
        }
        if (matched.length > 0) {
          words = matched;
        }
      }

      const text = segText || words.map((w) => w.text).join(" ");
      if (!text) return [];

      const constructed: CaptionSegment = {
        id: `segment-${segment.id ?? segmentIndex}`,
        text,
        start: segStart,
        end: segEnd,
        words,
      };

      // Ensure every segment has valid words
      constructed.words = ensureSegmentWords(constructed);
      return [constructed];
    });
  }

  // If no segments were returned, chunk from flatWords
  const normalizedSegments = segments.length > 0 ? segments : chunkWords(flatWords);

  return {
    text: cleanText(payload.text) || normalizedSegments.map((segment) => segment.text).join(" "),
    duration: Math.max(0, Number(payload.duration ?? normalizedSegments.at(-1)?.end ?? 0)),
    language: cleanText(payload.language) || "Detected automatically",
    segments: normalizedSegments,
  };
}

/**
 * Finds the currently spoken word within a segment's words at currentTime.
 */
export function findActiveWord(
  words: CaptionWord[],
  currentTime: number,
): { activeWord: CaptionWord | null; activeIndex: number } {
  if (!words || words.length === 0) return { activeWord: null, activeIndex: -1 };

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Slightly generous boundary for smooth vocal sync
    if (currentTime >= word.start - 0.04 && currentTime <= word.end + 0.08) {
      return { activeWord: word, activeIndex: i };
    }
  }

  // If between words within the segment, find the closest previous word
  if (currentTime >= words[0].start && currentTime <= words.at(-1)!.end) {
    for (let i = words.length - 1; i >= 0; i--) {
      if (currentTime >= words[i].start) {
        return { activeWord: words[i], activeIndex: i };
      }
    }
  }

  return { activeWord: null, activeIndex: -1 };
}

/**
 * Shifts all caption segment timings forward or backward by deltaSeconds.
 */
export function shiftCaptionsTiming(
  segments: CaptionSegment[],
  deltaSeconds: number,
): CaptionSegment[] {
  return segments.map((seg) => {
    const start = Math.max(0, Number((seg.start + deltaSeconds).toFixed(3)));
    const end = Math.max(start + 0.2, Number((seg.end + deltaSeconds).toFixed(3)));
    const shiftedWords = (seg.words ?? []).map((word) => ({
      ...word,
      start: Math.max(0, Number((word.start + deltaSeconds).toFixed(3))),
      end: Math.max(0.08, Number((word.end + deltaSeconds).toFixed(3))),
    }));

    return {
      ...seg,
      start,
      end,
      words: shiftedWords.length > 0 ? shiftedWords : interpolateSegmentWords({ id: seg.id, text: seg.text, start, end }),
    };
  });
}

function pad(value: number, size = 2) {
  return Math.max(0, Math.floor(value)).toString().padStart(size, "0");
}

export function formatClockTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  return `${pad(safeSeconds / 60)}:${pad(safeSeconds % 60)}`;
}

export function formatClockTimeWithMs(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const ms = Math.floor((safeSeconds % 1) * 10);
  return `${pad(safeSeconds / 60)}:${pad(safeSeconds % 60)}.${ms}`;
}

export function formatCaptionTimestamp(seconds: number, separator: "," | "." = ",") {
  const safeSeconds = Math.max(0, seconds);
  const totalMilliseconds = Math.round(safeSeconds * 1000);
  const hours = pad(totalMilliseconds / 3_600_000);
  const minutes = pad((totalMilliseconds % 3_600_000) / 60_000);
  const secs = pad((totalMilliseconds % 60_000) / 1000);
  const milliseconds = pad(totalMilliseconds % 1000, 3);
  return `${hours}:${minutes}:${secs}${separator}${milliseconds}`;
}

export function buildSrt(segments: CaptionSegment[]) {
  return segments
    .map((segment, index) => `${index + 1}\n${formatCaptionTimestamp(segment.start)} --> ${formatCaptionTimestamp(segment.end)}\n${segment.text}`)
    .join("\n\n");
}

export function buildVtt(segments: CaptionSegment[]) {
  const cues = segments
    .map((segment) => `${formatCaptionTimestamp(segment.start, ".")} --> ${formatCaptionTimestamp(segment.end, ".")}\n${segment.text}`)
    .join("\n\n");
  return `WEBVTT\n\n${cues}`;
}

/** Keep word timestamps attached to a line when its timing changes. */
export function retimeCaptionSegment(segment: CaptionSegment, start: number, end: number): CaptionSegment {
  const span = Math.max(.001, segment.end - segment.start);
  const scale = (end - start) / span;
  return { ...segment, start, end, words: ensureSegmentWords(segment).map(word => ({
    ...word,
    start: Math.max(start, Math.min(end, start + (word.start - segment.start) * scale)),
    end: Math.max(start, Math.min(end, start + (word.end - segment.start) * scale)),
  })) };
}
