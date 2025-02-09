
import { useState, useEffect, useCallback } from "react";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";
import { VideoOverlay } from "@/components/video-player/VideoOverlay";
import { Logo } from "@/components/video-player/Logo";
import { useVideoTransition } from "@/hooks/useVideoTransition";
import { useAudioFade } from "@/hooks/useAudioFade";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const { activeVideo, video1Ref, video2Ref, handleTimeUpdate } = useVideoTransition();
  const { showBlackScreen, audioRef, audioVolume } = useAudioFade(isPlaying);
  
  const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const videos = event.currentTarget.querySelectorAll('video');
    if (videos.length && !isPlaying) {
      videos.forEach(video => video.play());
      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.volume = audioVolume;
      }
      setIsPlaying(true);
    }
  }, [isPlaying, audioRef, audioVolume]);

  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = "/fundo.webp";
    backgroundImage.onload = () => setIsBackgroundLoaded(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    video1?.addEventListener('timeupdate', handleTimeUpdate);
    video2?.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video1?.removeEventListener('timeupdate', handleTimeUpdate);
      video2?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isPlaying, handleTimeUpdate, video1Ref, video2Ref]);
  
  return (
    <div 
      className="relative h-screen w-full overflow-hidden cursor-pointer bg-white"
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        loop
      />
      <VideoOverlay isBackgroundLoaded={isBackgroundLoaded} />
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{ 
          backgroundColor: 'black',
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          transitionDelay: '1s'
        }}
      />
      <VideoPlayer
        ref={video1Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 1}
        src="/loft-video.webm"
      />
      <VideoPlayer
        ref={video2Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 2}
        src="/loft-video.webm"
      />
      <Logo isBackgroundLoaded={isBackgroundLoaded} />
      <div 
        className="absolute inset-0 w-full h-full z-30"
        style={{ 
          backgroundColor: 'black',
          opacity: showBlackScreen ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      />
    </div>
  );
};

export default Index;
