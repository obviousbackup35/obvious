
import { useState, useCallback, useMemo } from "react";
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
  const { scrollProgress } = useScrollTransition();
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
    // Interpolate between light and dark color based on scroll progress
    const startColor = { r: 200, g: 197, b: 173 }; // #c8c5ad
    const endColor = { r: 51, g: 51, b: 51 }; // #333333
    
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * scrollProgress);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * scrollProgress);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * scrollProgress);
    
    return `rgb(${r}, ${g}, ${b})`;
  }, [scrollProgress]);

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
      
      <DunesSection scrollProgress={scrollProgress} />
      
      {contentSectionsElement}
    </InteractionHandler>
  );
};

export default Index;
