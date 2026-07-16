import { useState, useEffect, useRef } from 'react';
import { useVideoPlayback } from '../../../hooks/useVideoPlayback.js';

export function ProfileVideoLoop({
  imageSrc,
  videoSrc,
  imageAlt = 'Profile',
  muted = true,
  onPlayingChange,
}) {
  const [mode, setMode] = useState('image'); // 'image' or 'video'
  
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Load the video via the shared hook
  useVideoPlayback(videoRef, hlsRef, videoSrc, true);

  // State machine for looping
  useEffect(() => {
    let timer;
    if (mode === 'image') {
      // Show image for 4 seconds, then transition to video
      timer = setTimeout(() => {
        setMode('video');
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [mode]);

  const handleVideoEnded = () => {
    if (mode === 'video') {
      setMode('image');
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    
    // HLS streams sometimes fail to fire 'ended' natively. 
    // Manually trigger the end transition if we are within 0.3s of the end.
    if (video.currentTime >= video.duration - 0.3) {
      handleVideoEnded();
    }
  };

  useEffect(() => {
    onPlayingChange?.(mode === 'video');
  }, [mode, onPlayingChange]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* Static Profile Image (position: relative so it provides intrinsic dimensions to the wrapper) */}
      <img
        src={imageSrc}
        alt={imageAlt}
        width={468}
        height={856}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          opacity: mode === 'image' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 1
        }}
      />

      {/* Video CV */}
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        onEnded={handleVideoEnded}
        onTimeUpdate={handleTimeUpdate}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: mode === 'video' ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 2,
          pointerEvents: mode === 'video' ? 'auto' : 'none'
        }}
      />

    </div>
  );
}
