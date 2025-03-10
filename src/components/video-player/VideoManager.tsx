
import { VideoPlayer } from "./VideoPlayer";
import { VideoOverlay } from "./VideoOverlay";
import { Logo } from "./Logo";
import { RefObject, memo, useMemo, useEffect, useCallback } from "react";

interface VideoManagerProps {
  isPlaying: boolean;
  isBackgroundLoaded: boolean;
  currentView: string;
  activeVideo: number;
  video1Ref: RefObject<HTMLVideoElement>;
  video2Ref: RefObject<HTMLVideoElement>;
}

export const VideoManager = memo(({
  isPlaying,
  isBackgroundLoaded,
  currentView,
  activeVideo,
  video1Ref,
  video2Ref
}: VideoManagerProps) => {
  
  // Optimize by moving this to a useCallback that only runs when dependencies change
  const loadVideoSources = useCallback(() => {
    if (currentView === 'video' && video1Ref.current && video2Ref.current) {
      const videoSrc = '/loft-video.webm';
      
      if (!video1Ref.current.src || video1Ref.current.src === '') {
        video1Ref.current.src = videoSrc;
        video1Ref.current.load();
      }
      
      if (!video2Ref.current.src || video2Ref.current.src === '') {
        video2Ref.current.src = videoSrc;
        video2Ref.current.load();
      }
    }
  }, [currentView, video1Ref, video2Ref]);
  
  useEffect(() => {
    loadVideoSources();
  }, [loadVideoSources]);
  
  // Pre-calculate styles with useMemo to avoid recalculations
  const overlayStyle = useMemo(() => ({ 
    opacity: !isPlaying && currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
    transition: 'opacity 2s ease-in-out',
  }), [isPlaying, currentView, isBackgroundLoaded]);
  
  const video1Style = useMemo(() => ({
    opacity: currentView === 'video' && isPlaying ? (activeVideo === 1 ? 1 : 0) : 0,
    transition: 'opacity 1s ease-in-out',
    zIndex: 20,
  }), [currentView, isPlaying, activeVideo]);
  
  const video2Style = useMemo(() => ({
    opacity: currentView === 'video' && isPlaying ? (activeVideo === 2 ? 1 : 0) : 0,
    transition: 'opacity 1s ease-in-out',
    zIndex: 20,
  }), [currentView, isPlaying, activeVideo]);
  
  const logoStyle = useMemo(() => ({
    opacity: currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
    transition: 'opacity 2s ease-in-out',
    transitionDelay: '2s',
  }), [currentView, isBackgroundLoaded]);
  
  return (
    <>
      <VideoOverlay 
        isBackgroundLoaded={isBackgroundLoaded} 
        style={overlayStyle}
      />
      
      <VideoPlayer
        ref={video1Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 1}
        src="/loft-video.webm" 
        style={video1Style}
      />
      
      <VideoPlayer
        ref={video2Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 2}
        src="/loft-video.webm"
        style={video2Style}
      />
      
      <Logo 
        isBackgroundLoaded={isBackgroundLoaded}
        style={logoStyle}
      />
    </>
  );
});

VideoManager.displayName = 'VideoManager';
