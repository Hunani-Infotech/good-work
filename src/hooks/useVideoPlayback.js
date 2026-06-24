import { useEffect, useRef } from 'react';

export function useVideoPlayback(videoRef, hlsRef, src, active) {
  const attachedSrcRef = useRef('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !active) return undefined;

    const resumeAt = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    const isHls = src.includes('.m3u8');
    let destroyed = false;

    const playFrom = (time = resumeAt) => {
      if (destroyed) return;
      if (time > 0 && Number.isFinite(time)) {
        try {
          video.currentTime = time;
        } catch {
          /* seek may fail before metadata */
        }
      }
      video.play().catch(() => {});
    };

    const startPlayback = async () => {
      if (isHls && hlsRef.current?.media === video) {
        playFrom();
        return;
      }

      if (!isHls && attachedSrcRef.current === src && video.src) {
        playFrom();
        return;
      }

      if (!isHls) {
        video.src = src;
        video.load();
        attachedSrcRef.current = src;
        const onMeta = () => playFrom(resumeAt);
        if (video.readyState >= 1) onMeta();
        else video.addEventListener('loadedmetadata', onMeta, { once: true });
        return;
      }

      const { default: Hls } = await import('hls.js');
      if (destroyed) return;

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, backBufferLength: 60 });
        hlsRef.current = hls;
        attachedSrcRef.current = src;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => playFrom(resumeAt));
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.load();
        attachedSrcRef.current = src;
        const onMeta = () => playFrom(resumeAt);
        if (video.readyState >= 1) onMeta();
        else video.addEventListener('loadedmetadata', onMeta, { once: true });
      }
    };

    startPlayback();

    return () => {
      destroyed = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      } else if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      attachedSrcRef.current = '';
    };
  }, [src, active]);
}
