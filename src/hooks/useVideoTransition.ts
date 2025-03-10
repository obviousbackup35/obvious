
import { useCallback, useRef, useState, useEffect } from "react";

export const useVideoTransition = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const transitionPoint = useRef<number>(0);
  const isTransitioning = useRef(false);
  
  const attemptVideoPlay = useCallback(async (video: HTMLVideoElement, targetVideoNum: number) => {
    try {
      await video.play();
      setActiveVideo(targetVideoNum);
      isTransitioning.current = false;
    } catch (error) {
      // Retry once with a short delay
      setTimeout(async () => {
        try {
          await video.play();
          setActiveVideo(targetVideoNum);
        } catch (secondError) {
          console.error("Failed to play video after retry:", secondError);
        } finally {
          isTransitioning.current = false;
        }
      }, 200);
    }
  }, []);
  
  const handleTimeUpdate = useCallback(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    
    if (!video1 || !video2 || isTransitioning.current) return;

    // Set transition point if not yet set
    if (transitionPoint.current === 0 && video1.duration) {
      transitionPoint.current = Math.max(video1.duration - 1, 0);
    }
    
    // Video1 -> Video2 transition
    if (activeVideo === 1 && video1.currentTime >= transitionPoint.current) {
      isTransitioning.current = true;
      video2.currentTime = 0;
      attemptVideoPlay(video2, 2);
    } 
    // Video2 -> Video1 transition
    else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
      isTransitioning.current = true;
      video1.currentTime = 0;
      attemptVideoPlay(video1, 1);
    }
  }, [activeVideo, attemptVideoPlay]);

  // Cleanup
  useEffect(() => {
    return () => {
      const videos = [video1Ref.current, video2Ref.current].filter(Boolean);
      videos.forEach(video => {
        if (video) {
          video.pause();
          video.src = '';
          video.load();
        }
      });
    };
  }, []);

  return {
    activeVideo,
    video1Ref,
    video2Ref,
    handleTimeUpdate
  };
};
