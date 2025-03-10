
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
  const { scrollProgress, getTextColor } = useScrollTransition();
  const { 
    isPlaying: isAudioPlaying, 
    toggleAudio, 
    currentTime,
    setCurrentTime
  } = useAudio();

  // Configuramos um efeito para permitir apenas um único scroll completo
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        window.scrollTo({ top: 100, behavior: 'smooth' });
      } else if (e.deltaY < 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      e.preventDefault();
    };
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
