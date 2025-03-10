
import { useState, useCallback, useMemo, useEffect } from "react";
import { useVideoTransition } from "@/hooks/useVideoTransition";
import { usePageAudio } from "@/hooks/usePageAudio";
import { useViewTransition } from "@/hooks/useViewTransition";
import { Navigation } from "@/components/Navigation";
import { useAudio } from "@/contexts/AudioContext";
import { ContentSections } from "@/components/sections/ContentSections";
import type { ContentView } from "@/types/navigation";
import InteractionHandler from "@/components/interaction/InteractionHandler";
import VideoSection from "@/components/video-player/VideoSection";
import { useBackgroundLoader } from "@/hooks/useBackgroundLoader";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isBackgroundLoaded } = useBackgroundLoader();
  const { currentView, setCurrentView, handleViewTransition } = useViewTransition(isPlaying);
  const { activeVideo, video1Ref, video2Ref, handleTimeUpdate } = useVideoTransition();
  const { audioRef } = usePageAudio(isPlaying, currentView);
  const { 
    isPlaying: isAudioPlaying, 
    toggleAudio, 
    currentTime,
    setCurrentTime
  } = useAudio();
  
  useEffect(() => {
    console.log(`Current view changed to: ${currentView}`);
  }, [currentView]);

  const handleViewChange = useCallback((view: ContentView) => {
    console.log(`View change requested to: ${view}`);
    setCurrentView(view);
  }, [setCurrentView]);

  const overlayElement = useMemo(() => (
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
  ), [isPlaying]);

  const navigationElement = useMemo(() => (
    <Navigation 
      audioRef={audioRef} 
      isPlaying={isAudioPlaying} 
      toggleAudio={toggleAudio} 
      isVisible={isPlaying}
      onViewChange={handleViewChange}
      currentView={currentView}
    />
  ), [audioRef, isAudioPlaying, toggleAudio, isPlaying, handleViewChange, currentView]);

  const contentSectionsElement = useMemo(() => (
    <ContentSections 
      currentView={currentView} 
      onViewChange={handleViewChange}
    />
  ), [currentView, handleViewChange]);

  return (
    <InteractionHandler
      audioRef={audioRef}
      video1Ref={video1Ref}
      video2Ref={video2Ref}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      currentTime={currentTime}
    >
      {navigationElement}
      {overlayElement}
      
      <VideoSection
        isPlaying={isPlaying}
        isBackgroundLoaded={isBackgroundLoaded}
        currentView={currentView}
        activeVideo={activeVideo}
        video1Ref={video1Ref}
        video2Ref={video2Ref}
        handleTimeUpdate={handleTimeUpdate}
        setCurrentTime={setCurrentTime}
      />
      
      {contentSectionsElement}
    </InteractionHandler>
  );
};

export default Index;
