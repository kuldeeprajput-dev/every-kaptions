/**
 * Audio noise reduction, spectral gate, and mains hum filter utility.
 * Implements Web Audio API biquad filter nodes and RMS noise floor analysis.
 */

export interface NoiseFloorStats {
  peakDb: number;
  rmsDb: number;
  estimatedNoiseFloorDb: number;
  hasElectricalHum: boolean;
  recommendedGateThresholdDb: number;
}

export interface NoiseGateNodeOptions {
  thresholdDb?: number;
  attackMs?: number;
  releaseMs?: number;
  kneeDb?: number;
}

/**
 * Analyzes an audio channel Float32Array buffer to estimate noise floor and signal dynamics.
 */
export function computeAudioNoiseFloor(
  channelData: Float32Array,
  sampleRate: number = 44100,
): NoiseFloorStats {
  if (channelData.length === 0) {
    return {
      peakDb: -100,
      rmsDb: -100,
      estimatedNoiseFloorDb: -60,
      hasElectricalHum: false,
      recommendedGateThresholdDb: -45,
    };
  }

  let sumSquares = 0;
  let peak = 0;
  const windowSize = Math.max(128, Math.floor(sampleRate * 0.05));
  const windowRmsList: number[] = [];

  for (let i = 0; i < channelData.length; i += windowSize) {
    let windowSum = 0;
    const end = Math.min(channelData.length, i + windowSize);
    for (let j = i; j < end; j++) {
      const sample = channelData[j];
      const abs = Math.abs(sample);
      if (abs > peak) peak = abs;
      sumSquares += sample * sample;
      windowSum += sample * sample;
    }
    const winRms = Math.sqrt(windowSum / (end - i));
    if (winRms > 0.00001) {
      windowRmsList.push(winRms);
    }
  }

  const overallRms = Math.sqrt(sumSquares / channelData.length);
  const peakDb = peak > 0 ? 20 * Math.log10(peak) : -100;
  const rmsDb = overallRms > 0 ? 20 * Math.log10(overallRms) : -100;

  // Approximate noise floor as the 15th percentile of window energy
  windowRmsList.sort((a, b) => a - b);
  const noiseIndex = Math.floor(windowRmsList.length * 0.15);
  const noiseRms = windowRmsList[noiseIndex] ?? overallRms * 0.1;
  const estimatedNoiseFloorDb = noiseRms > 0 ? 20 * Math.log10(noiseRms) : -60;

  const recommendedGate = Math.max(-55, Math.min(-25, estimatedNoiseFloorDb + 6));

  return {
    peakDb: Math.round(peakDb * 10) / 10,
    rmsDb: Math.round(rmsDb * 10) / 10,
    estimatedNoiseFloorDb: Math.round(estimatedNoiseFloorDb * 10) / 10,
    hasElectricalHum: estimatedNoiseFloorDb > -45,
    recommendedGateThresholdDb: Math.round(recommendedGate),
  };
}

/**
 * Creates a steep 80Hz high-pass filter node to eliminate low-frequency microphone rumble.
 */
export function createRumbleCutNode(
  audioCtx: AudioContext,
  cutoffFrequencyHz: number = 80,
): BiquadFilterNode {
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(cutoffFrequencyHz, audioCtx.currentTime);
  filter.Q.setValueAtTime(0.707, audioCtx.currentTime);
  return filter;
}

/**
 * Creates a notch filter targeting 50Hz (Europe/Asia) or 60Hz (US) electrical mains hum.
 */
export function createElectricalHumFilter(
  audioCtx: AudioContext,
  humHz: 50 | 60 = 60,
): BiquadFilterNode {
  const notch = audioCtx.createBiquadFilter();
  notch.type = "notch";
  notch.frequency.setValueAtTime(humHz, audioCtx.currentTime);
  notch.Q.setValueAtTime(8.0, audioCtx.currentTime);
  return notch;
}

/**
 * Creates a dynamics compressor configured as an intelligent noise suppression expander.
 */
export function createNoiseExpanderNode(
  audioCtx: AudioContext,
  options: NoiseGateNodeOptions = {},
): DynamicsCompressorNode {
  const compressor = audioCtx.createDynamicsCompressor();
  const threshold = options.thresholdDb ?? -40;
  const attack = (options.attackMs ?? 15) / 1000;
  const release = (options.releaseMs ?? 180) / 1000;
  const knee = options.kneeDb ?? 6;

  compressor.threshold.setValueAtTime(threshold, audioCtx.currentTime);
  compressor.knee.setValueAtTime(knee, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(4.0, audioCtx.currentTime);
  compressor.attack.setValueAtTime(attack, audioCtx.currentTime);
  compressor.release.setValueAtTime(release, audioCtx.currentTime);

  return compressor;
}

/**
 * Applies digital gain and soft peak normalization in-place on Float32 audio channel samples.
 */
export function normalizeAudioSamples(
  samples: Float32Array,
  targetPeakDb: number = -1.0,
): { appliedGainMultiplier: number; originalPeakDb: number } {
  let maxAbs = 0;
  for (let i = 0; i < samples.length; i++) {
    const val = Math.abs(samples[i]);
    if (val > maxAbs) maxAbs = val;
  }

  if (maxAbs === 0) {
    return { appliedGainMultiplier: 1.0, originalPeakDb: -100 };
  }

  const originalPeakDb = 20 * Math.log10(maxAbs);
  const targetLinear = Math.pow(10, targetPeakDb / 20);
  const gain = Math.min(4.0, targetLinear / maxAbs);

  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.max(-1.0, Math.min(1.0, samples[i] * gain));
  }

  return {
    appliedGainMultiplier: Math.round(gain * 100) / 100,
    originalPeakDb: Math.round(originalPeakDb * 10) / 10,
  };
}

/**
 * Detects whether digital clipping occurred in the audio sample array.
 */
export function detectAudioClipping(
  samples: Float32Array,
  threshold: number = 0.999,
): { clippedSampleCount: number; hasClipping: boolean } {
  let clipped = 0;
  for (let i = 0; i < samples.length; i++) {
    if (Math.abs(samples[i]) >= threshold) clipped++;
  }
  return {
    clippedSampleCount: clipped,
    hasClipping: clipped > 0,
  };
}

/**
 * Chains low-cut, hum notch, and dynamics expander nodes into a processing graph.
 */
export function setupVoiceCleaningGraph(
  audioCtx: AudioContext,
  sourceNode: AudioNode,
  destinationNode: AudioNode,
  settings: {
    cutRumble?: boolean;
    removeHum?: boolean;
    humFrequency?: 50 | 60;
    gateThresholdDb?: number;
  } = {},
): {
  rumbleNode: BiquadFilterNode | null;
  humNode: BiquadFilterNode | null;
  gateNode: DynamicsCompressorNode;
} {
  let currentSource = sourceNode;
  let rumbleNode: BiquadFilterNode | null = null;
  let humNode: BiquadFilterNode | null = null;

  if (settings.cutRumble !== false) {
    rumbleNode = createRumbleCutNode(audioCtx, 85);
    currentSource.connect(rumbleNode);
    currentSource = rumbleNode;
  }

  if (settings.removeHum) {
    humNode = createElectricalHumFilter(audioCtx, settings.humFrequency ?? 60);
    currentSource.connect(humNode);
    currentSource = humNode;
  }

  const gateNode = createNoiseExpanderNode(audioCtx, {
    thresholdDb: settings.gateThresholdDb ?? -42,
  });
  currentSource.connect(gateNode);
  gateNode.connect(destinationNode);

  return { rumbleNode, humNode, gateNode };
}
