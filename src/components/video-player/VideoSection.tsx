
import { useEffect, useMemo } from "react";
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
}

const VideoSection = ({
  isPlaying,
  isBackgroundLoaded,
  currentView,
  activeVideo,
  video1Ref,
  video2Ref,
  handleTimeUpdate,
  setCurrentTime
}: VideoSectionProps) => {
  // Set up video time update event listeners
  useEffect(() => {
    if (!isPlaying) return;

    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    const handleVideoTimeUpdate = () => {
      handleTimeUpdate();
      if (video1) {
        setCurrentTime(video1.currentTime);
      }
    };

    video1?.addEventListener('timeupdate', handleVideoTimeUpdate);
    video2?.addEventListener('timeupdate', handleVideoTimeUpdate);

    return () => {
      video1?.removeEventListener('timeupdate', handleVideoTimeUpdate);
      video2?.removeEventListener('timeupdate', handleVideoTimeUpdate);
    };
  }, [isPlaying, handleTimeUpdate, video1Ref, video2Ref, setCurrentTime]);

  return useMemo(() => (
    <VideoManager
      isPlaying={isPlaying}
      isBackgroundLoaded={isBackgroundLoaded}
      currentView={currentView}
      activeVideo={activeVideo}
      video1Ref={video1Ref}
      video2Ref={video2Ref}
    />
  ), [isPlaying, isBackgroundLoaded, currentView, activeVideo, video1Ref, video2Ref]);
};

export default VideoSection;
