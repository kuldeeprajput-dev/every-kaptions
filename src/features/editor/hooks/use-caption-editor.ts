"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCaptionMediaType, MAX_CAPTION_FILE_BYTES } from "../data/editor-config";
import {
  discardCaptionUpload,
  needsCaptionTranslation,
  transcribeUploadedMedia,
  translateCaptionTranscript,
  uploadCaptionMedia,
} from "../lib/caption-api";
import { buildSrt, buildVtt, normalizeTranscript } from "../lib/captions";
import { usePlanSummary } from "../store/plan-store";
import {
  isCaptionOutputLanguage,
  type CaptionExportFormat,
  type CaptionOutputLanguage,
  type CaptionSegment,
  type CaptionStyleId,
  type TranscriptionState,
} from "../types/captions";

function fileError(file: File) {
  if (file.size === 0) return "This file is empty. Choose another recording.";
  if (file.size > MAX_CAPTION_FILE_BYTES) return "Choose a file smaller than 25 MB for transcription.";
  if (!getCaptionMediaType(file)) return "Choose an MP4, MOV, WebM, MP3, or WAV file.";
  return "";
}

export function useCaptionEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState<CaptionOutputLanguage>("same");
  const [status, setStatus] = useState<TranscriptionState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [segments, setSegments] = useState<CaptionSegment[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [styleId, setStyleId] = useState<CaptionStyleId>("yellow");
  const [past, setPast] = useState<CaptionSegment[][]>([]);
  const [future, setFuture] = useState<CaptionSegment[][]>([]);
  const mediaUrlRef = useRef("");
  const lastTextEditRef = useRef<{ segmentId: string; updatedAt: number } | null>(null);
  const plan = usePlanSummary();

  useEffect(() => {
    return () => {
      if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    };
  }, []);

  const chooseFile = useCallback((nextFile: File) => {
    const validationError = fileError(nextFile);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return false;
    }

    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    const nextUrl = URL.createObjectURL(nextFile);
    mediaUrlRef.current = nextUrl;
    setFile(nextFile);
    setMediaUrl(nextUrl);
    setOutputLanguage("same");
    setSegments([]);
    setPast([]);
    setFuture([]);
    lastTextEditRef.current = null;
    setDuration(0);
    setCurrentTime(0);
    setSelectedSegmentId("");
    setError("");
    setUploadProgress(0);
    setStatus("idle");
    return true;
  }, []);

  const transcribe = useCallback(async () => {
    if (!file) {
      setError("Choose a video or audio file before creating captions.");
      setStatus("error");
      return;
    }

    if (!plan.canTranscribe) {
      setError("You have used all free transcription minutes. Upgrade to create more captions.");
      setStatus("error");
      return;
    }

    setError("");
    setUploadProgress(0);
    setStatus("uploading");
    let temporaryPathname = "";

    try {
      const uploadedMedia = await uploadCaptionMedia(file, setUploadProgress);
      temporaryPathname = uploadedMedia.pathname;

      setStatus("transcribing");
      let payload = await transcribeUploadedMedia(uploadedMedia, file, language);
      temporaryPathname = "";

      if (needsCaptionTranslation(language, outputLanguage)) {
        setStatus("translating");
        payload = await translateCaptionTranscript(payload, outputLanguage);
      }

      setStatus("preparing");
      const result = normalizeTranscript(payload);
      if (result.segments.length === 0) throw new Error("No speech was found. Try a video with clearer audio.");
      setSegments(result.segments);
      setPast([]);
      setFuture([]);
      lastTextEditRef.current = null;
      setDuration(result.duration);
      setCurrentTime(0);
      setSelectedSegmentId(result.segments[0]?.id ?? "");
      plan.recordTranscription(result.duration);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      setStatus("ready");
    } catch (caughtError) {
      if (temporaryPathname) await discardCaptionUpload(temporaryPathname);
      setError(caughtError instanceof Error ? caughtError.message : "Captions could not be created. Please try again.");
      setStatus("error");
    }
  }, [file, language, outputLanguage, plan]);

  const activeSegment = useMemo(
    () => segments.find((segment) => currentTime >= segment.start && currentTime < segment.end) ?? null,
    [currentTime, segments],
  );

  const pushHistory = useCallback((nextSegments: CaptionSegment[]) => {
    setPast((previous) => [...previous.slice(-29), segments]);
    setFuture([]);
    lastTextEditRef.current = null;
    setSegments(nextSegments);
  }, [segments]);

  const undo = useCallback(() => {
    const previous = past.at(-1);
    if (!previous) return;
    setPast((history) => history.slice(0, -1));
    setFuture((history) => [segments, ...history].slice(0, 30));
    setSegments(previous);
    setSelectedSegmentId((selectedId) =>
      previous.some((segment) => segment.id === selectedId) ? selectedId : (previous[0]?.id ?? ""),
    );
    lastTextEditRef.current = null;
  }, [past, segments]);

  const redo = useCallback(() => {
    const next = future[0];
    if (!next) return;
    setFuture((history) => history.slice(1));
    setPast((history) => [...history.slice(-29), segments]);
    setSegments(next);
    setSelectedSegmentId((selectedId) =>
      next.some((segment) => segment.id === selectedId) ? selectedId : (next[0]?.id ?? ""),
    );
    lastTextEditRef.current = null;
  }, [future, segments]);

  const updateSegment = useCallback((segmentId: string, text: string) => {
    const now = Date.now();
    const lastEdit = lastTextEditRef.current;
    const beginsNewEdit = !lastEdit || lastEdit.segmentId !== segmentId || now - lastEdit.updatedAt > 800;

    if (beginsNewEdit) {
      setPast((history) => [...history.slice(-29), segments]);
    }
    setFuture([]);
    lastTextEditRef.current = { segmentId, updatedAt: now };
    setSegments((current) =>
      current.map((segment) => (segment.id === segmentId ? { ...segment, text } : segment)),
    );
  }, [segments]);

  const splitSegment = useCallback((segmentId: string) => {
    const index = segments.findIndex((segment) => segment.id === segmentId);
    const segment = segments[index];
    if (!segment || segment.end - segment.start < 0.4) return;

    const preferredTime = currentTime > segment.start && currentTime < segment.end ? currentTime : (segment.start + segment.end) / 2;
    const splitTime = Math.min(segment.end - 0.2, Math.max(segment.start + 0.2, preferredTime));
    const tokens = segment.text.trim().split(/\s+/).filter(Boolean);
    if (tokens.length < 2) return;

    const ratio = (splitTime - segment.start) / (segment.end - segment.start);
    const tokenIndex = Math.min(tokens.length - 1, Math.max(1, Math.round(tokens.length * ratio)));
    const hasWordTiming = segment.words.length >= 2;
    const wordIndex = hasWordTiming
      ? Math.min(segment.words.length - 1, Math.max(1, Math.round(segment.words.length * ratio)))
      : 0;
    const first = { ...segment, text: tokens.slice(0, tokenIndex).join(" "), end: splitTime, words: hasWordTiming ? segment.words.slice(0, wordIndex) : [] };
    const second = {
      ...segment,
      id: `${segment.id}-split-${splitTime.toFixed(2)}`,
      text: tokens.slice(tokenIndex).join(" "),
      start: splitTime,
      words: hasWordTiming ? segment.words.slice(wordIndex) : [],
    };
    const next = [...segments];
    next.splice(index, 1, first, second);
    pushHistory(next);
    setSelectedSegmentId(second.id);
  }, [currentTime, pushHistory, segments]);

  const mergeWithNext = useCallback((segmentId: string) => {
    const index = segments.findIndex((segment) => segment.id === segmentId);
    const segment = segments[index];
    const nextSegment = segments[index + 1];
    if (!segment || !nextSegment) return;

    const merged = {
      ...segment,
      text: `${segment.text.trim()} ${nextSegment.text.trim()}`.trim(),
      end: nextSegment.end,
      words: [...segment.words, ...nextSegment.words],
    };
    const next = [...segments];
    next.splice(index, 2, merged);
    pushHistory(next);
    setSelectedSegmentId(merged.id);
  }, [pushHistory, segments]);

  const deleteSegment = useCallback((segmentId: string) => {
    const next = segments.filter((segment) => segment.id !== segmentId);
    pushHistory(next);
    setSelectedSegmentId("");
  }, [pushHistory, segments]);

  const reset = useCallback(() => {
    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    mediaUrlRef.current = "";
    setFile(null);
    setMediaUrl("");
    setOutputLanguage("same");
    setSegments([]);
    setPast([]);
    setFuture([]);
    lastTextEditRef.current = null;
    setDuration(0);
    setCurrentTime(0);
    setSelectedSegmentId("");
    setError("");
    setUploadProgress(0);
    setStatus("idle");
  }, []);

  const downloadCaptions = useCallback((format: CaptionExportFormat) => {
    if (segments.length === 0) return false;
    if (!plan.canExport) {
      setError("Your monthly exports limit is reached. Upgrade to export more caption files.");
      return false;
    }
    try {
      setError("");
      let content = "";
      if (format === "srt") content = buildSrt(segments);
      else if (format === "vtt") content = buildVtt(segments);
      else content = segments.map((s) => s.text).join("\n");

      const mime = format === "txt" ? "text/plain" : "text/plain;charset=utf-8";
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file?.name.replace(/\.[^.]+$/, "") || "captions"}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // ONLY record export quota after successful file delivery!
      plan.recordExport();
      return true;
    } catch {
      setError("Export failed. Your plan export count was not charged.");
      return false;
    }
  }, [file, plan, segments]);

  const loadStoredProject = useCallback((stored: {
    name: string;
    fileBlob: Blob;
    fileType: string;
    language: string;
    outputMode?: CaptionOutputLanguage;
    segments: CaptionSegment[];
    duration: number;
    styleId?: string;
  }) => {
    const fileObj = new File([stored.fileBlob], stored.name, {
      type: stored.fileType || "video/mp4",
    });
    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    const nextUrl = URL.createObjectURL(fileObj);
    mediaUrlRef.current = nextUrl;

    setFile(fileObj);
    setMediaUrl(nextUrl);
    setLanguage(stored.language || "en");
    setOutputLanguage(isCaptionOutputLanguage(stored.outputMode) ? stored.outputMode : "same");
    setSegments(stored.segments || []);
    setPast([]);
    setFuture([]);
    lastTextEditRef.current = null;
    setDuration(stored.duration || 0);
    setCurrentTime(0);
    if (stored.styleId) setStyleId(stored.styleId as CaptionStyleId);
    setSelectedSegmentId(stored.segments?.[0]?.id ?? "");
    setStatus("ready");
    setError("");
  }, []);

  return {
    file,
    mediaUrl,
    language,
    outputLanguage,
    status,
    uploadProgress,
    error,
    segments,
    duration,
    currentTime,
    selectedSegmentId,
    styleId,
    activeSegment,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
    chooseFile,
    transcribe,
    reset,
    loadStoredProject,
    updateSegment,
    splitSegment,
    mergeWithNext,
    deleteSegment,
    downloadCaptions,
    setLanguage,
    setOutputLanguage,
    setDuration,
    setCurrentTime,
    setSelectedSegmentId,
    setStyleId,
  };
}
