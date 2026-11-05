/** Use the timestamp of the displayed video frame; fall back for audio/older browsers. */
export function observeVideoFrames(video: HTMLVideoElement, paint: (mediaTime: number) => void): () => void {
  const useVideoFrames = typeof video.requestVideoFrameCallback === "function" && video.videoWidth > 0;
  let stopped = false;
  let frame = 0;
  const schedule = () => {
    if (stopped) return;
    frame = useVideoFrames
      ? video.requestVideoFrameCallback((_now, metadata) => tick(metadata.mediaTime))
      : requestAnimationFrame(() => tick(video.currentTime));
  };
  const tick = (time: number) => {
    if (stopped) return;
    if (!video.seeking) paint(time);
    schedule();
  };
  schedule();
  return () => {
    stopped = true;
    if (useVideoFrames) video.cancelVideoFrameCallback(frame);
    else cancelAnimationFrame(frame);
  };
}
