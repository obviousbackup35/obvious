
import { useState, useEffect, useCallback } from "react";
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
    try {
      if (!isPlaying) {
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
      }
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  }, [isPlaying, audioRef, currentTime, video1Ref, video2Ref]);

  const handleClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
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
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      <div 
        className="absolute inset-0 w-full h-full z-10"
        style={{ 
          backgroundColor: 'black',
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      />

      <VideoManager
        isPlaying={isPlaying}
        isBackgroundLoaded={isBackgroundLoaded}
        currentView={currentView}
        activeVideo={activeVideo}
        video1Ref={video1Ref}
        video2Ref={video2Ref}
      />

      <ContentSections 
        currentView={currentView} 
        onViewChange={handleViewChange}
      />
    </div>
  );
};

export default Index;
