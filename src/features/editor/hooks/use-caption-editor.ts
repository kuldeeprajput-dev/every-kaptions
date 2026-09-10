"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MAX_CAPTION_FILE_BYTES } from "../data/editor-config";
import { buildSrt, buildVtt, normalizeTranscript } from "../lib/captions";
import type {
  CaptionExportFormat,
  CaptionSegment,
  CaptionStyleId,
  TranscriptPayload,
  TranscriptionState,
} from "../types/captions";

const ACCEPTED_FILE_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm", "audio/mpeg", "audio/wav", "audio/webm"]);

function fileError(file: File) {
  if (file.size === 0) return "This file is empty. Choose another recording.";
  if (file.size > MAX_CAPTION_FILE_BYTES) return "Choose a file smaller than 25 MB for transcription.";
  if (file.type && !ACCEPTED_FILE_TYPES.has(file.type)) return "Choose an MP4, MOV, WebM, MP3, or WAV file.";
  return "";
}

export function useCaptionEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [language, setLanguage] = useState("auto");
  const [status, setStatus] = useState<TranscriptionState>("idle");
  const [error, setError] = useState("");
  const [segments, setSegments] = useState<CaptionSegment[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [styleId, setStyleId] = useState<CaptionStyleId>("yellow");
  const mediaUrlRef = useRef("");

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
    setSegments([]);
    setDuration(0);
    setCurrentTime(0);
    setSelectedSegmentId("");
    setError("");
    setStatus("idle");
    return true;
  }, []);

  const transcribe = useCallback(async () => {
    if (!file) {
      setError("Choose a video or audio file before creating captions.");
      setStatus("error");
      return;
    }

    setError("");
    setStatus("transcribing");
    const body = new FormData();
    body.append("file", file);
    body.append("language", language);

    try {
      const response = await fetch("/api/captions", { method: "POST", body });
      const payload = (await response.json()) as TranscriptPayload & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Captions could not be created.");

      const result = normalizeTranscript(payload);
      if (result.segments.length === 0) throw new Error("No speech was found. Try a video with clearer audio.");
      setSegments(result.segments);
      setDuration(result.duration);
      setSelectedSegmentId(result.segments[0]?.id ?? "");
      setStatus("ready");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Captions could not be created. Please try again.");
      setStatus("error");
    }
  }, [file, language]);

  const activeSegment = useMemo(
    () => segments.find((segment) => currentTime >= segment.start && currentTime < segment.end) ?? null,
    [currentTime, segments],
  );

  const updateSegment = useCallback((segmentId: string, text: string) => {
    setSegments((current) => current.map((segment) => (segment.id === segmentId ? { ...segment, text } : segment)));
  }, []);

  const deleteSegment = useCallback((segmentId: string) => {
    setSegments((current) => current.filter((segment) => segment.id !== segmentId));
    setSelectedSegmentId("");
  }, []);

  const reset = useCallback(() => {
    if (mediaUrlRef.current) URL.revokeObjectURL(mediaUrlRef.current);
    mediaUrlRef.current = "";
    setFile(null);
    setMediaUrl("");
    setSegments([]);
    setDuration(0);
    setCurrentTime(0);
    setSelectedSegmentId("");
    setError("");
    setStatus("idle");
  }, []);

  const downloadCaptions = useCallback((format: CaptionExportFormat) => {
    if (segments.length === 0) return;
    const content = format === "srt" ? buildSrt(segments) : buildVtt(segments);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file?.name.replace(/\.[^.]+$/, "") || "captions"}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }, [file, segments]);

  return {
    file,
    mediaUrl,
    language,
    status,
    error,
    segments,
    duration,
    currentTime,
    selectedSegmentId,
    styleId,
    activeSegment,
    chooseFile,
    transcribe,
    reset,
    updateSegment,
    deleteSegment,
    downloadCaptions,
    setLanguage,
    setDuration,
    setCurrentTime,
    setSelectedSegmentId,
    setStyleId,
  };
}
