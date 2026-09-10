import type { CaptionSegment, CaptionWord, TranscriptPayload, TranscriptionResult } from "../types/captions";

const WORDS_PER_SEGMENT = 7;

function cleanText(value: string | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeWord(
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

function chunkWords(words: CaptionWord[]) {
  const segments: CaptionSegment[] = [];

  for (let index = 0; index < words.length; index += WORDS_PER_SEGMENT) {
    const chunk = words.slice(index, index + WORDS_PER_SEGMENT);
    const first = chunk[0];
    const last = chunk.at(-1);
    if (!first || !last) continue;

    segments.push({
      id: `segment-${segments.length}-${first.start.toFixed(3)}`,
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

  const segments = (payload.segments ?? []).flatMap((segment, segmentIndex) => {
    const words = (segment.words ?? [])
      .map((word, wordIndex) => normalizeWord(word, segmentIndex * 1000 + wordIndex, Number(segment.start ?? 0)))
      .filter((word): word is CaptionWord => word !== null);
    const text = cleanText(segment.text) || words.map((word) => word.text).join(" ");
    if (!text) return [];

    const start = Math.max(0, Number(segment.start ?? words[0]?.start ?? 0));
    const end = Math.max(start + 0.2, Number(segment.end ?? words.at(-1)?.end ?? start + 2));
    return [{ id: `segment-${segment.id ?? segmentIndex}`, text, start, end, words }];
  });

  const normalizedSegments = segments.length > 0 ? segments : chunkWords(flatWords);
  return {
    text: cleanText(payload.text) || normalizedSegments.map((segment) => segment.text).join(" "),
    duration: Math.max(0, Number(payload.duration ?? normalizedSegments.at(-1)?.end ?? 0)),
    language: cleanText(payload.language) || "Detected automatically",
    segments: normalizedSegments,
  };
}

function pad(value: number, size = 2) {
  return Math.max(0, Math.floor(value)).toString().padStart(size, "0");
}

export function formatClockTime(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  return `${pad(safeSeconds / 60)}:${pad(safeSeconds % 60)}`;
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
