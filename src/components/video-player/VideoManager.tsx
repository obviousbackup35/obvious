
import { VideoPlayer } from "./VideoPlayer";
import { VideoOverlay } from "./VideoOverlay";
import { Logo } from "./Logo";
import { RefObject, memo, useMemo } from "react";
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
  
  // Memoize style calculations to prevent unnecessary re-renders
  const overlayStyle = useMemo(() => ({ 
    opacity: !isPlaying && currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
    transition: 'opacity 2s ease-in-out',
  }), [isPlaying, currentView, isBackgroundLoaded]);
  
  const mobileBackgroundStyle = useMemo(() => ({
    opacity: currentView === 'video' && isPlaying ? 1 : 0,
    transition: 'opacity 1s ease-in-out',
  }), [currentView, isPlaying]);
  
  const video1Style = useMemo(() => ({
    opacity: currentView === 'video' && isPlaying ? (activeVideo === 1 ? 1 : 0) : 0,
    transition: 'opacity 1s ease-in-out',
    zIndex: 20
  }), [currentView, isPlaying, activeVideo]);
  
  const video2Style = useMemo(() => ({
    opacity: currentView === 'video' && isPlaying ? (activeVideo === 2 ? 1 : 0) : 0,
    transition: 'opacity 1s ease-in-out',
    zIndex: 20
  }), [currentView, isPlaying, activeVideo]);
  
  const logoStyle = useMemo(() => ({
    opacity: currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
    transition: 'opacity 2s ease-in-out',
    transitionDelay: '2s'
  }), [currentView, isBackgroundLoaded]);
  
  return (
    <>
      <VideoOverlay 
        isBackgroundLoaded={isBackgroundLoaded} 
        style={overlayStyle}
      />
      
      {/* Only render mobile background when needed */}
      {isMobile && (
        <div 
          className="absolute inset-0 bg-black z-10"
          style={mobileBackgroundStyle}
        />
      )}
      
      {/* Only load first video when needed */}
      {(isPlaying || currentView === 'video') && (
        <VideoPlayer
          ref={video1Ref}
          isPlaying={isPlaying}
          isActive={activeVideo === 1}
          src="/loft-video.webm"
          style={video1Style}
        />
      )}
      
      {/* Only load second video when needed */}
      {(isPlaying || currentView === 'video') && (
        <VideoPlayer
          ref={video2Ref}
          isPlaying={isPlaying}
          isActive={activeVideo === 2}
          src="/loft-video.webm"
          style={video2Style}
        />
      )}
      
      <Logo 
        isBackgroundLoaded={isBackgroundLoaded}
        style={logoStyle}
      />
    </>
  );
});

VideoManager.displayName = 'VideoManager';
