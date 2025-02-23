
import { VideoPlayer } from "./VideoPlayer";
import { VideoOverlay } from "./VideoOverlay";
import { Logo } from "./Logo";
import { RefObject, memo } from "react";

interface VideoManagerProps {
  isPlaying: boolean;
  isBackgroundLoaded: boolean;
  currentView: string;
  activeVideo: number;
  video1Ref: RefObject<HTMLVideoElement>;
  video2Ref: RefObject<HTMLVideoElement>;
}

// Memoização do componente para evitar re-renders desnecessários
export const VideoManager = memo(({
  isPlaying,
  isBackgroundLoaded,
  currentView,
  activeVideo,
  video1Ref,
  video2Ref
}: VideoManagerProps) => {
  return (
    <>
      <VideoOverlay 
        isBackgroundLoaded={isBackgroundLoaded} 
        style={{ 
          opacity: !isPlaying && currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
          transition: 'opacity 2s ease-in-out',
          willChange: 'opacity',
        }}
      />
      <VideoPlayer
        ref={video1Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 1}
        src="/loft-video.webm"
        style={{
          opacity: currentView === 'video' && isPlaying ? (activeVideo === 1 ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20,
          willChange: 'opacity',
        }}
      />
      <VideoPlayer
        ref={video2Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 2}
        src="/loft-video.webm"
        style={{
          opacity: currentView === 'video' && isPlaying ? (activeVideo === 2 ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20,
          willChange: 'opacity',
        }}
      />
      <Logo 
        isBackgroundLoaded={isBackgroundLoaded}
        style={{
          opacity: currentView === 'video' ? (isBackgroundLoaded ? 1 : 0) : 0,
          transition: 'opacity 2s ease-in-out',
          transitionDelay: '2s',
          willChange: 'opacity',
        }}
      />
    </>
  );
});

VideoManager.displayName = 'VideoManager';
