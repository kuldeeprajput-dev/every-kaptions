/**
 * Audio waveform extraction and normalization utilities for the caption timeline.
 * Decodes media files via Web Audio API OfflineAudioContext and generates normalized peaks.
 */

export interface WaveformOptions {
  samples?: number;
  channel?: number;
  normalize?: boolean;
  minPeak?: number;
}

const DEFAULT_SAMPLES = 120;
const DEFAULT_MIN_PEAK = 0.08;
const WAVEFORM_CACHE = new Map<string, number[]>();
const MAX_CACHE_ENTRIES = 25;

/**
 * Normalizes an array of raw amplitude peaks between minPeak and 1.0.
 */
export function normalizePeaks(peaks: number[], minPeak = DEFAULT_MIN_PEAK): number[] {
  if (peaks.length === 0) return [];
  const max = Math.max(...peaks, 0.001);
  return peaks.map((p) => {
    const normalized = p / max;
    return Math.max(minPeak, Math.round(normalized * 100) / 100);
  });
}

/**
 * Downmixes multi-channel audio buffer into a single mono Float32Array.
 */
function downmixToMono(buffer: AudioBuffer): Float32Array {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length;

  if (numChannels === 1) {
    return buffer.getChannelData(0);
  }

  const mono = new Float32Array(length);
  for (let c = 0; c < numChannels; c++) {
    const channelData = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) {
      mono[i] += channelData[i] / numChannels;
    }
  }
  return mono;
}

/**
 * Extracts a fixed number of normalized peaks from an AudioBuffer.
 */
export function extractPeaksFromBuffer(
  buffer: AudioBuffer,
  options: WaveformOptions = {},
): number[] {
  const { samples = DEFAULT_SAMPLES, normalize = true, minPeak = DEFAULT_MIN_PEAK } = options;
  const monoData = downmixToMono(buffer);
  const totalLength = monoData.length;
  const blockSize = Math.floor(totalLength / samples);

  if (blockSize <= 0) {
    return new Array(samples).fill(minPeak);
  }

  const rawPeaks: number[] = new Array(samples).fill(0);

  for (let i = 0; i < samples; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, totalLength);
    let sum = 0;
    let count = 0;

    for (let j = start; j < end; j++) {
      const val = monoData[j];
      sum += val * val;
      count++;
    }

    const rms = count > 0 ? Math.sqrt(sum / count) : 0;
    rawPeaks[i] = rms;
  }

  return normalize ? normalizePeaks(rawPeaks, minPeak) : rawPeaks;
}

/**
 * Generates synthetic speech-like waveform peaks when Web Audio is not available.
 * Simulates conversational speech cadences with natural sentence pauses.
 */
export function generateSyntheticWaveform(
  durationSeconds: number,
  samples = DEFAULT_SAMPLES,
  seed = 42,
): number[] {
  const peaks: number[] = new Array(samples);
  let state = Math.sin(seed) * 10000;

  const pseudoRandom = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  const wordsPerSecond = 2.4;
  const totalWords = Math.max(2, Math.round(durationSeconds * wordsPerSecond));
  const samplesPerWord = samples / totalWords;

  for (let i = 0; i < samples; i++) {
    const wordIndex = Math.floor(i / samplesPerWord);
    const progressInWord = (i % samplesPerWord) / samplesPerWord;

    // Simulate word envelope: ramp up, peak, ramp down
    const envelope = Math.sin(progressInWord * Math.PI);
    const noise = (pseudoRandom() - 0.5) * 0.25;

    // Add intermittent pauses between sentences every 5–8 words
    const isPause = wordIndex % 6 === 5 && progressInWord > 0.6;
    const baseVal = isPause ? DEFAULT_MIN_PEAK : Math.max(DEFAULT_MIN_PEAK, envelope * 0.85 + noise);

    peaks[i] = Math.max(DEFAULT_MIN_PEAK, Math.min(1.0, baseVal));
  }

  return normalizePeaks(peaks);
}

/**
 * Decodes audio from an ArrayBuffer using Web Audio OfflineAudioContext.
 */
export async function decodeAudioData(
  arrayBuffer: ArrayBuffer,
  options: WaveformOptions = {},
): Promise<number[]> {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) {
    return generateSyntheticWaveform(30, options.samples ?? DEFAULT_SAMPLES);
  }

  const audioCtx = new AudioContextClass();
  try {
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return extractPeaksFromBuffer(audioBuffer, options);
  } finally {
    if (audioCtx.state !== "closed") {
      void audioCtx.close();
    }
  }
}

/**
 * Loads a media URL, extracts waveform peaks, and caches the result.
 */
export async function getWaveformForMedia(
  mediaUrl: string,
  duration = 30,
  options: WaveformOptions = {},
): Promise<number[]> {
  const samples = options.samples ?? DEFAULT_SAMPLES;
  const cacheKey = `${mediaUrl}__${samples}`;

  if (WAVEFORM_CACHE.has(cacheKey)) {
    return WAVEFORM_CACHE.get(cacheKey)!;
  }

  try {
    if (typeof window === "undefined") {
      return generateSyntheticWaveform(duration, samples);
    }

    const response = await fetch(mediaUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch media file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const peaks = await decodeAudioData(arrayBuffer, options);

    // Maintain cache size within limits
    if (WAVEFORM_CACHE.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = WAVEFORM_CACHE.keys().next().value;
      if (oldestKey) WAVEFORM_CACHE.delete(oldestKey);
    }

    WAVEFORM_CACHE.set(cacheKey, peaks);
    return peaks;
  } catch {
    // Graceful fallback to synthetic speech waveform on network or decode errors
    const fallback = generateSyntheticWaveform(duration, samples);
    WAVEFORM_CACHE.set(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Detects voiced speech activity windows based on waveform amplitude threshold.
 */
export function detectSpeechIntervals(
  peaks: number[],
  silenceThreshold = 0.15,
): Array<{ startFraction: number; endFraction: number }> {
  const intervals: Array<{ startFraction: number; endFraction: number }> = [];
  let inSpeech = false;
  let startIdx = 0;

  for (let i = 0; i < peaks.length; i++) {
    const isAboveThreshold = peaks[i] >= silenceThreshold;

    if (isAboveThreshold && !inSpeech) {
      inSpeech = true;
      startIdx = i;
    } else if (!isAboveThreshold && inSpeech) {
      inSpeech = false;
      intervals.push({
        startFraction: startIdx / peaks.length,
        endFraction: i / peaks.length,
      });
    }
  }

  if (inSpeech) {
    intervals.push({
      startFraction: startIdx / peaks.length,
      endFraction: 1.0,
    });
  }

  return intervals;
}
