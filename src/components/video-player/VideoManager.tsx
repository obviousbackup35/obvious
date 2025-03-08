
import { VideoPlayer } from "./VideoPlayer";
import { VideoOverlay } from "./VideoOverlay";
import { Logo } from "./Logo";
import { RefObject, memo } from "react";
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
  const isVideoView = currentView === 'video';
  
  return (
    <>
      <VideoOverlay 
        isBackgroundLoaded={isBackgroundLoaded} 
        isVisible={!isPlaying && isVideoView}
      />
      
      {/* Fundo preto para melhor visualização em dispositivos móveis */}
      {isMobile && isVideoView && isPlaying && (
        <div 
          className="absolute inset-0 bg-black z-10"
          style={{
            opacity: 1,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      )}
      
      <VideoPlayer
        ref={video1Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 1}
        src="/loft-video.webm"
        style={{
          opacity: isVideoView && isPlaying ? (activeVideo === 1 ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20
        }}
      />
      
      <VideoPlayer
        ref={video2Ref}
        isPlaying={isPlaying}
        isActive={activeVideo === 2}
        src="/loft-video.webm"
        style={{
          opacity: isVideoView && isPlaying ? (activeVideo === 2 ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20
        }}
      />
      
      <Logo 
        isBackgroundLoaded={isBackgroundLoaded}
        isVisible={isVideoView}
      />
    </>
  );
});

VideoManager.displayName = 'VideoManager';
