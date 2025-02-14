
import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { VideoPlayer } from "@/components/video-player/VideoPlayer";
import { VideoOverlay } from "@/components/video-player/VideoOverlay";
import { Logo } from "@/components/video-player/Logo";
import { useVideoTransition } from "@/hooks/useVideoTransition";
import { useAudioFade } from "@/hooks/useAudioFade";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { activeVideo, video1Ref, video2Ref, handleTimeUpdate } = useVideoTransition();
  const { showBlackScreen, audioRef, audioVolume, wasMutedRef } = useAudioFade(isPlaying);
  
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

  const toggleAudio = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMuted(prev => !prev);
    wasMutedRef.current = !isMuted;
    
    if (audioRef.current) {
      const fadeStep = 0.05;
      const fadeInterval = 50;
      const targetVolume = isMuted ? 1 : 0;
      let currentVolume = audioRef.current.volume;

      const fade = setInterval(() => {
        if (isMuted) {
          currentVolume = Math.min(1, currentVolume + fadeStep);
          audioRef.current!.volume = currentVolume;
          if (currentVolume >= 1) clearInterval(fade);
        } else {
          currentVolume = Math.max(0, currentVolume - fadeStep);
          audioRef.current!.volume = currentVolume;
          if (currentVolume <= 0) clearInterval(fade);
        }
      }, fadeInterval);
    }
  }, [isMuted, audioRef]);

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
      {isPlaying && (
        <button
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      )}
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
        className="absolute inset-0 w-full h-full z-20 flex flex-col items-center"
        style={{ 
          opacity: showBlackScreen ? 1 : 0,
          transition: 'opacity 2s ease-in-out',
        }}
      >
        <img
          src="/manifesto.webp"
          alt="Manifesto"
          className="w-full max-w-[80%] h-auto mt-8"
        />
        <div 
          className="absolute inset-0 w-full h-full -z-10"
          style={{ 
            backgroundImage: 'url(/dunes.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default Index;
