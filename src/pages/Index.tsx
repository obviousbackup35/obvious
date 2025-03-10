
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
import DunesSection from "@/components/sections/DunesSection";
import { useBackgroundLoader } from "@/hooks/useBackgroundLoader";
import { useScrollTransition } from "@/hooks/useScrollTransition";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isBackgroundLoaded } = useBackgroundLoader();
  const { currentView, setCurrentView } = useViewTransition(isPlaying);
  const { activeVideo, video1Ref, video2Ref, handleTimeUpdate } = useVideoTransition();
  const { audioRef } = usePageAudio(isPlaying, currentView);
  const { 
    scrollProgress, 
    getTextColor, 
    isDunesVisible, 
    toggleDunes 
  } = useScrollTransition();
  const { 
    isPlaying: isAudioPlaying, 
    toggleAudio, 
    currentTime,
    setCurrentTime
  } = useAudio();

  const handleViewChange = useCallback((view: ContentView) => {
    setCurrentView(view);
  }, [setCurrentView]);

  const textColor = useMemo(() => {
    return getTextColor();
  }, [getTextColor]);

  const navigationElement = useMemo(() => (
    <Navigation 
      audioRef={audioRef} 
      isPlaying={isAudioPlaying} 
      toggleAudio={toggleAudio} 
      isVisible={isPlaying}
      onViewChange={handleViewChange}
      currentView={currentView}
      textColor={textColor}
    />
  ), [audioRef, isAudioPlaying, toggleAudio, isPlaying, handleViewChange, currentView, textColor]);

  const contentSectionsElement = useMemo(() => (
    <ContentSections 
      currentView={currentView} 
      onViewChange={handleViewChange}
    />
  ), [currentView, handleViewChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && !isDunesVisible) {
        toggleDunes();
      } else if (e.key === 'ArrowUp' && isDunesVisible) {
        toggleDunes();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDunesVisible, toggleDunes]);

  return (
    <InteractionHandler
      audioRef={audioRef}
      video1Ref={video1Ref}
      video2Ref={video2Ref}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      currentTime={currentTime}
      toggleDunes={toggleDunes}
    >
      {navigationElement}
      
      <VideoSection
        isPlaying={isPlaying}
        isBackgroundLoaded={isBackgroundLoaded}
        currentView={currentView}
        activeVideo={activeVideo}
        video1Ref={video1Ref}
        video2Ref={video2Ref}
        handleTimeUpdate={handleTimeUpdate}
        setCurrentTime={setCurrentTime}
        isVisible={!isDunesVisible}
      />
      
      <DunesSection 
        scrollProgress={scrollProgress} 
        isVisible={isDunesVisible} 
      />
      
      {contentSectionsElement}
    </InteractionHandler>
  );
};

export default Index;
