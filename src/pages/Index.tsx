
import { useState, useEffect, useCallback, useMemo } from "react";
import { useVideoTransition } from "@/hooks/useVideoTransition";
import { usePageAudio } from "@/hooks/usePageAudio";
import { useViewTransition } from "@/hooks/useViewTransition";
import { Navigation } from "@/components/Navigation";
import { useAudio } from "@/contexts/AudioContext";
import { VideoManager } from "@/components/video-player/VideoManager";
import { ContentSections } from "@/components/sections/ContentSections";
import type { ContentView } from "@/types/navigation";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const { currentView, setCurrentView } = useViewTransition(isPlaying);
  const { activeVideo, video1Ref, video2Ref, handleTimeUpdate } = useVideoTransition();
  const { audioRef } = usePageAudio(isPlaying, currentView);
  const { 
    isPlaying: isAudioPlaying, 
    toggleAudio, 
    hasInitialInteraction, 
    setHasInitialInteraction,
    currentTime,
    setCurrentTime
  } = useAudio();

  const handleViewChange = useCallback((view: ContentView) => {
    setCurrentView(view);
  }, [setCurrentView]);

  const startPlayback = useCallback(async () => {
    if (isPlaying) return;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1;
        await audioRef.current.play();
      }

      const videos = [video1Ref.current, video2Ref.current].filter(Boolean);
      await Promise.all(
        videos.map(video => {
          if (video) {
            video.currentTime = currentTime;
            return video.play();
          }
          return Promise.resolve();
        })
      );

      setIsPlaying(true);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  }, [isPlaying, audioRef, currentTime, video1Ref, video2Ref]);

  const handleInteraction = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    // Check if the click is on the mobile menu
    const target = event.target as HTMLElement;
    if (target.closest('#mobile-menu')) {
      console.log('Ignoring click on mobile menu');
      return;
    }
    
    event.preventDefault(); // Prevent default behavior for better control
    
    if (!hasInitialInteraction) {
      setHasInitialInteraction(true);
    }
    startPlayback();
  }, [hasInitialInteraction, setHasInitialInteraction, startPlayback]);

  useEffect(() => {
    if (hasInitialInteraction && !isPlaying) {
      startPlayback();
    }
  }, [hasInitialInteraction, isPlaying, startPlayback]);

  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = "/fundo.webp";
    backgroundImage.loading = "eager"; // Prioritize loading
    backgroundImage.onload = () => setIsBackgroundLoaded(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    const handleVideoTimeUpdate = () => {
      handleTimeUpdate();
      if (video1) {
        setCurrentTime(video1.currentTime);
      }
    };

    video1?.addEventListener('timeupdate', handleVideoTimeUpdate);
    video2?.addEventListener('timeupdate', handleVideoTimeUpdate);

    return () => {
      video1?.removeEventListener('timeupdate', handleVideoTimeUpdate);
      video2?.removeEventListener('timeupdate', handleVideoTimeUpdate);
    };
  }, [isPlaying, handleTimeUpdate, video1Ref, video2Ref, setCurrentTime]);

  // Adicionar classe para prevenir o scroll do documento inteiro
  useEffect(() => {
    document.documentElement.classList.add('no-bounce');
    document.body.classList.add('no-bounce');
    
    return () => {
      document.documentElement.classList.remove('no-bounce');
      document.body.classList.remove('no-bounce');
    };
  }, []);

  const memoizedVideoManager = useMemo(() => (
    <VideoManager
      isPlaying={isPlaying}
      isBackgroundLoaded={isBackgroundLoaded}
      currentView={currentView}
      activeVideo={activeVideo}
      video1Ref={video1Ref}
      video2Ref={video2Ref}
    />
  ), [isPlaying, isBackgroundLoaded, currentView, activeVideo, video1Ref, video2Ref]);

  const memoizedNavigation = useMemo(() => (
    <Navigation 
      audioRef={audioRef} 
      isPlaying={isAudioPlaying} 
      toggleAudio={toggleAudio} 
      isVisible={isPlaying}
      onViewChange={handleViewChange}
      currentView={currentView}
    />
  ), [audioRef, isAudioPlaying, toggleAudio, isPlaying, handleViewChange, currentView]);

  const memoizedContentSections = useMemo(() => (
    <ContentSections 
      currentView={currentView} 
      onViewChange={handleViewChange}
    />
  ), [currentView, handleViewChange]);

  return (
    <div 
      className="relative viewport-height w-full overflow-hidden cursor-pointer bg-white prevent-overscroll no-bounce"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      role="application"
      aria-label="Interactive video experience"
    >
      {memoizedNavigation}

      <div 
        className="absolute inset-0 w-full h-full z-10"
        style={{ 
          backgroundColor: 'black',
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          willChange: 'opacity',
        }}
        aria-hidden="true"
      />

      {memoizedVideoManager}
      {memoizedContentSections}
    </div>
  );
};

export default Index;
