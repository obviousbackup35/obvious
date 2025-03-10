
import { VideoPlayer } from "./VideoPlayer";
import { VideoOverlay } from "./VideoOverlay";
import { Logo } from "./Logo";
import { RefObject, memo, useMemo, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log(`VideoManager: isPlaying=${isPlaying}, currentView=${currentView}, activeVideo=${activeVideo}`);
  }, [isPlaying, currentView, activeVideo]);
  
  const loadVideoSources = useCallback(() => {
    if (currentView === 'video' && video1Ref.current && video2Ref.current) {
      if (!video1Ref.current.src || video1Ref.current.src === '') {
        video1Ref.current.src = '/loft-video.webm';
        video1Ref.current.load();
        console.log("Reloaded video 1 source");
      }
      
      if (!video2Ref.current.src || video2Ref.current.src === '') {
        video2Ref.current.src = '/loft-video.webm';
        video2Ref.current.load();
        console.log("Reloaded video 2 source");
      }
    }
  }, [currentView, video1Ref, video2Ref]);
  
  useEffect(() => {
    loadVideoSources();
  }, [loadVideoSources]);
  
  const overlayStyle = useMemo(() => ({ 
    opacity: !isPlaying && currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
    transition: 'opacity 2s ease-in-out',
    contain: 'content',
    willChange: (!isPlaying && currentView === 'video') ? 'opacity' : 'auto',
  }), [isPlaying, currentView, isBackgroundLoaded]);
  
  const video1Style = useMemo(() => ({
    opacity: currentView === 'video' && isPlaying ? (activeVideo === 1 ? 1 : 0) : 0,
    transition: 'opacity 1s ease-in-out',
    zIndex: 20,
    willChange: (currentView === 'video' && isPlaying && activeVideo === 1) ? 'opacity' : 'auto',
  }), [currentView, isPlaying, activeVideo]);
  
  const video2Style = useMemo(() => ({
    opacity: currentView === 'video' && isPlaying ? (activeVideo === 2 ? 1 : 0) : 0,
    transition: 'opacity 1s ease-in-out',
    zIndex: 20,
    willChange: (currentView === 'video' && isPlaying && activeVideo === 2) ? 'opacity' : 'auto',
  }), [currentView, isPlaying, activeVideo]);
  
  const logoStyle = useMemo(() => ({
    opacity: currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
    transition: 'opacity 2s ease-in-out',
    transitionDelay: '2s',
    willChange: (currentView === 'video' && isBackgroundLoaded) ? 'opacity' : 'auto',
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

