
import { useState, useEffect, useCallback } from "react";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";
import { VideoOverlay } from "@/components/video-player/VideoOverlay";
import { Logo } from "@/components/video-player/Logo";
import { useVideoTransition } from "@/hooks/useVideoTransition";
import { useAudioFade } from "@/hooks/useAudioFade";
import { Navigation } from "@/components/Navigation";
import { useAudio } from "@/contexts/AudioContext";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const { activeVideo, video1Ref, video2Ref, handleTimeUpdate } = useVideoTransition();
  const { showBlackScreen } = useAudioFade(isPlaying);
  const { audioRef, isMuted, toggleAudio } = useAudio();
  
  const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const videos = event.currentTarget.querySelectorAll('video');
    if (videos.length && !isPlaying) {
      videos.forEach(video => video.play());
      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.volume = 1;
      }
      setIsPlaying(true);
    }
  }, [isPlaying, audioRef]);

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
      <Navigation 
        audioRef={audioRef} 
        isMuted={isMuted} 
        toggleAudio={toggleAudio} 
        isVisible={isPlaying}
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
        className="absolute inset-0 w-full h-full z-20"
        style={{ 
          backgroundImage: 'url(/dunes.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: showBlackScreen ? 1 : 0,
          transition: 'opacity 2s ease-in-out',
        }}
      />
    </div>
  );
};

export default Index;
