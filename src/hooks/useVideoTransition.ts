
import { useCallback, useRef, useState, useEffect } from "react";

export const useVideoTransition = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const transitionPoint = useRef<number>(0);
  const isTransitioning = useRef(false);
  const timeUpdateFrame = useRef<number>();

  const handleTimeUpdate = useCallback(() => {
    if (timeUpdateFrame.current) {
      cancelAnimationFrame(timeUpdateFrame.current);
    }

    timeUpdateFrame.current = requestAnimationFrame(() => {
      const video1 = video1Ref.current;
      const video2 = video2Ref.current;
      
      if (!video1 || !video2 || isTransitioning.current) return;

      if (transitionPoint.current === 0) {
        transitionPoint.current = video1.duration - 1;
      }
      
      if (activeVideo === 1 && video1.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        video2.currentTime = 0;
        
        // Use Promise.resolve to avoid unhandled promise rejections
        Promise.resolve(video2.play())
          .then(() => {
            setActiveVideo(2);
            isTransitioning.current = false;
          })
          .catch(err => {
            console.error("Error playing video 2:", err);
            isTransitioning.current = false;
          });
      } else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        video1.currentTime = 0;
        
        Promise.resolve(video1.play())
          .then(() => {
            setActiveVideo(1);
            isTransitioning.current = false;
          })
          .catch(err => {
            console.error("Error playing video 1:", err);
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
      
      // Pause videos to free resources
      if (video1Ref.current) {
        video1Ref.current.pause();
        video1Ref.current.src = "";
      }
      
      if (video2Ref.current) {
        video2Ref.current.pause();
        video2Ref.current.src = "";
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
