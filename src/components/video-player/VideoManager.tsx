
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
  isVisible?: boolean;
}

export const VideoManager = memo(({
  isPlaying,
  isBackgroundLoaded,
  currentView,
  activeVideo,
  video1Ref,
  video2Ref,
  isVisible = true
}: VideoManagerProps) => {
  
  const loadVideoSources = useCallback(() => {
    if (currentView === 'video' && video1Ref.current && video2Ref.current) {
      const videoSrc = '/loft-video.webm';
      
      if (!video1Ref.current.src) {
        video1Ref.current.src = videoSrc;
        video1Ref.current.load();
      }
      
      if (!video2Ref.current.src) {
        video2Ref.current.src = videoSrc;
        video2Ref.current.load();
      }
    }
  }, [currentView, video1Ref, video2Ref]);
  
  useEffect(() => {
    loadVideoSources();
  }, [loadVideoSources]);

  const containerStyle = useMemo(() => ({
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 500ms ease-in-out',
    zIndex: isVisible ? 5 : 0,
  }), [isVisible]);
  
  const sharedVideoProps = useMemo(() => ({
    transition: 'opacity 1s ease-in-out',
    zIndex: 5,
  }), []);
  
  const overlayStyle = useMemo(() => ({ 
    opacity: !isPlaying && currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
    transition: 'opacity 2s ease-in-out',
    zIndex: 4,
  }), [isPlaying, currentView, isBackgroundLoaded]);
  
  const video1Style = useMemo(() => ({
    ...sharedVideoProps,
    opacity: currentView === 'video' && isPlaying ? (activeVideo === 1 ? 1 : 0) : 0,
    pointerEvents: 'none' as const,
  }), [currentView, isPlaying, activeVideo, sharedVideoProps]);
  
  const video2Style = useMemo(() => ({
    ...sharedVideoProps,
    opacity: currentView === 'video' && isPlaying ? (activeVideo === 2 ? 1 : 0) : 0,
    pointerEvents: 'none' as const,
  }), [currentView, isPlaying, activeVideo, sharedVideoProps]);
  
  const logoStyle = useMemo(() => ({
    opacity: currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
    transition: 'opacity 2s ease-in-out',
    transitionDelay: '2s',
    zIndex: 7,
  }), [currentView, isBackgroundLoaded]);
  
  return (
    <div style={containerStyle} className="absolute inset-0">
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
    </div>
  );
});

VideoManager.displayName = 'VideoManager';
