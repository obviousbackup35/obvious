
import { useEffect, useMemo, useCallback } from "react";
import { VideoManager } from "./VideoManager";
import type { ContentView } from "@/types/navigation";

interface VideoSectionProps {
  isPlaying: boolean;
  isBackgroundLoaded: boolean;
  currentView: ContentView;
  activeVideo: number;
  video1Ref: React.RefObject<HTMLVideoElement>;
  video2Ref: React.RefObject<HTMLVideoElement>;
  handleTimeUpdate: () => void;
  setCurrentTime: (time: number) => void;
  isVisible?: boolean;
}

const VideoSection = ({
  isPlaying,
  isBackgroundLoaded,
  currentView,
  activeVideo,
  video1Ref,
  video2Ref,
  handleTimeUpdate,
  setCurrentTime,
  isVisible = true
}: VideoSectionProps) => {
  const handleVideoTimeUpdate = useCallback(() => {
    handleTimeUpdate();
    if (video1Ref.current) {
      setCurrentTime(video1Ref.current.currentTime);
    }
  }, [handleTimeUpdate, video1Ref, setCurrentTime]);

  useEffect(() => {
    if (!isPlaying) return;

    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (video1) {
      video1.addEventListener('timeupdate', handleVideoTimeUpdate);
    }
    
    if (video2) {
      video2.addEventListener('timeupdate', handleVideoTimeUpdate);
    }

    return () => {
      if (video1) {
        video1.removeEventListener('timeupdate', handleVideoTimeUpdate);
      }
      
      if (video2) {
        video2.removeEventListener('timeupdate', handleVideoTimeUpdate);
      }
    };
  }, [isPlaying, handleVideoTimeUpdate, video1Ref, video2Ref]);

  return useMemo(() => (
    <VideoManager
      isPlaying={isPlaying}
      isBackgroundLoaded={isBackgroundLoaded}
      currentView={currentView}
      activeVideo={activeVideo}
      video1Ref={video1Ref}
      video2Ref={video2Ref}
      isVisible={isVisible}
    />
  ), [isPlaying, isBackgroundLoaded, currentView, activeVideo, video1Ref, video2Ref, isVisible]);
};

export default VideoSection;
