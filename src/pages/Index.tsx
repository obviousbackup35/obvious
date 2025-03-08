
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
import RefreshButton from "@/components/navigation/RefreshButton";
import { useBackgroundLoader } from "@/hooks/useBackgroundLoader";
import { useScrollBehavior } from "@/hooks/useScrollBehavior";

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
  
  // Pass handleViewTransition to useScrollBehavior
  useScrollBehavior(handleViewTransition);

  // Store the last main view in sessionStorage when it changes
  useEffect(() => {
    if (['video', 'black', 'dunes'].includes(currentView)) {
      sessionStorage.setItem('lastMainView', currentView);
    }
  }, [currentView]);

  const handleViewChange = useCallback((view: ContentView) => {
    setCurrentView(view);
  }, [setCurrentView]);

  // Prepare overlay for video background
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

  // Memoize the navigation to prevent unnecessary re-renders
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

  // Memoize content sections to prevent unnecessary re-renders
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
      
      <RefreshButton
        isPlaying={isPlaying}
        currentView={currentView}
        onViewChange={handleViewChange}
      />
    </InteractionHandler>
  );
};

export default Index;
