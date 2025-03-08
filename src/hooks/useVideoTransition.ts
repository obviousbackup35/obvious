
import { useCallback, useRef, useState, useEffect } from "react";

export const useVideoTransition = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const transitionPoint = useRef<number>(0);
  const isTransitioning = useRef(false);
  const timeUpdateFrame = useRef<number>();
  const lastUpdateTime = useRef(0);
  
  // Use throttling for timeupdate events to reduce CPU usage
  const handleTimeUpdate = useCallback(() => {
    const now = Date.now();
    // Only process updates every 100ms to reduce CPU load
    if (now - lastUpdateTime.current < 100) return;
    lastUpdateTime.current = now;
    
    if (timeUpdateFrame.current) {
      cancelAnimationFrame(timeUpdateFrame.current);
    }

    timeUpdateFrame.current = requestAnimationFrame(() => {
      const video1 = video1Ref.current;
      const video2 = video2Ref.current;
      
      if (!video1 || !video2 || isTransitioning.current) return;

      if (transitionPoint.current === 0 && video1.duration) {
        transitionPoint.current = video1.duration - 1;
      }
      
      if (activeVideo === 1 && video1.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        video2.currentTime = 0;
        
        // Use more stable promise chaining for playback
        video2.play()
          .then(() => {
            setActiveVideo(2);
            isTransitioning.current = false;
          })
          .catch(err => {
            console.warn("Video playback error:", err);
            isTransitioning.current = false;
          });
          
      } else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        video1.currentTime = 0;
        
        video1.play()
          .then(() => {
            setActiveVideo(1);
            isTransitioning.current = false;
          })
          .catch(err => {
            console.warn("Video playback error:", err);
            isTransitioning.current = false;
          });
      }
    });
  }, [activeVideo]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (timeUpdateFrame.current) {
        cancelAnimationFrame(timeUpdateFrame.current);
      }
      
      // Make sure to clear videos to free up memory
      if (video1Ref.current) {
        video1Ref.current.pause();
        video1Ref.current.src = '';
        video1Ref.current.load();
      }
      
      if (video2Ref.current) {
        video2Ref.current.pause();
        video2Ref.current.src = '';
        video2Ref.current.load();
      }
    };
  }, []);

  return {
    activeVideo,
    video1Ref,
    video2Ref,
    handleTimeUpdate
  };
};
