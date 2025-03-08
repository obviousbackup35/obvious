
import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react";
import { useVideoTransition } from "@/hooks/useVideoTransition";
import { usePageAudio } from "@/hooks/usePageAudio";
import { useViewTransition } from "@/hooks/useViewTransition";
import { Navigation } from "@/components/Navigation";
import { useAudio } from "@/contexts/AudioContext";
import { VideoManager } from "@/components/video-player/VideoManager";
import type { ContentView } from "@/types/navigation";

// Lazy load the content sections to improve initial load time
const ContentSections = lazy(() => import("@/components/sections/ContentSections").then(
  module => ({ default: module.ContentSections })
));

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const { currentView, setCurrentView } = useViewTransition(isPlaying);
  const { activeVideo, video1Ref, video2Ref, handleTimeUpdate } = useVideoTransition();
  const { audioRef } = usePageAudio(isPlaying, currentView);
  const { 
    isMuted, 
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
        await audioRef.current.play().catch(() => {
          console.log('Audio playback was prevented by the browser');
        });
      }

      const videos = [video1Ref.current, video2Ref.current].filter(Boolean);
      await Promise.all(
        videos.map(video => {
          if (video) {
            video.currentTime = currentTime;
            return video.play().catch(() => {
              console.log('Video playback was prevented by the browser');
            });
          }
          return Promise.resolve();
        })
      );

      setIsPlaying(true);
    } catch (error) {
      console.error('Error starting playback:', error);
      // Still set isPlaying to true even if there was an error
      // This ensures the UI moves forward even if media playback fails
      setIsPlaying(true);
    }
  }, [isPlaying, audioRef, currentTime, video1Ref, video2Ref]);

  const handleInteraction = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
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

  // Preload background image
  useEffect(() => {
    const backgroundImage = new Image();
    backgroundImage.src = "/fundo.webp";
    backgroundImage.loading = "eager";
    backgroundImage.fetchPriority = "high";
    backgroundImage.onload = () => setIsBackgroundLoaded(true);
    
    // Preload dunes image
    const dunesImage = new Image();
    dunesImage.src = "/dunes.webp";
    dunesImage.loading = "eager";
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

    const timeUpdateThrottled = () => {
      // Use requestAnimationFrame to throttle time updates
      requestAnimationFrame(handleVideoTimeUpdate);
    };

    video1?.addEventListener('timeupdate', timeUpdateThrottled);
    video2?.addEventListener('timeupdate', timeUpdateThrottled);

    return () => {
      video1?.removeEventListener('timeupdate', timeUpdateThrottled);
      video2?.removeEventListener('timeupdate', timeUpdateThrottled);
    };
  }, [isPlaying, handleTimeUpdate, video1Ref, video2Ref, setCurrentTime]);

  // Disable document bounce scrolling
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
      isMuted={isMuted} 
      toggleAudio={toggleAudio} 
      isVisible={isPlaying}
      onViewChange={handleViewChange}
      currentView={currentView}
    />
  ), [audioRef, isMuted, toggleAudio, isPlaying, handleViewChange, currentView]);

  return (
    <div 
      className="relative viewport-height w-full overflow-hidden cursor-pointer bg-black prevent-overscroll no-bounce"
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
          opacity: 1,
          willChange: 'opacity',
        }}
        aria-hidden="true"
      />

      {memoizedVideoManager}
      
      <Suspense fallback={null}>
        <ContentSections 
          currentView={currentView} 
          onViewChange={handleViewChange}
        />
      </Suspense>
    </div>
  );
};

export default Index;
