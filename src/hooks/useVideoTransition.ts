
import { useCallback, useRef, useState, useEffect } from "react";

export const useVideoTransition = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const transitionPoint = useRef<number>(0);
  const isTransitioning = useRef(false);
  const timeUpdateFrame = useRef<number>();
  const lastUpdateTime = useRef(0);
  
  // Optimized: More efficient timeUpdate handling with throttling
  const handleTimeUpdate = useCallback(() => {
    const now = Date.now();
    // Throttle time updates for better performance (40ms ≈ 25fps)
    if (now - lastUpdateTime.current < 40) return;
    lastUpdateTime.current = now;
    
    // Use requestAnimationFrame for sync with render cycle
    if (timeUpdateFrame.current) {
      cancelAnimationFrame(timeUpdateFrame.current);
    }

    timeUpdateFrame.current = requestAnimationFrame(() => {
      const video1 = video1Ref.current;
      const video2 = video2Ref.current;
      
      if (!video1 || !video2 || isTransitioning.current) return;

      // Set transition point if not yet set
      if (transitionPoint.current === 0 && video1.duration) {
        // Safety margin for transition (1 second before end)
        transitionPoint.current = Math.max(video1.duration - 1, 0);
      }
      
      // Enhanced transition logic for video1 -> video2
      if (activeVideo === 1 && video1.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        
        // Prepare video2 before transition
        video2.currentTime = 0;
        
        const playPromise = video2.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setActiveVideo(2);
              isTransitioning.current = false;
            })
            .catch(err => {
              console.error("Video 2 playback error:", err);
              // Recovery attempt with delay
              setTimeout(() => {
                video2.play()
                  .then(() => {
                    setActiveVideo(2);
                    isTransitioning.current = false;
                  })
                  .catch(() => {
                    isTransitioning.current = false;
                  });
              }, 200);
            });
        }
          
      // Enhanced transition logic for video2 -> video1
      } else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        
        video1.currentTime = 0;
        
        const playPromise = video1.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setActiveVideo(1);
              isTransitioning.current = false;
            })
            .catch(err => {
              console.error("Video 1 playback error:", err);
              setTimeout(() => {
                video1.play()
                  .then(() => {
                    setActiveVideo(1);
                    isTransitioning.current = false;
                  })
                  .catch(() => {
                    isTransitioning.current = false;
                  });
              }, 200);
            });
        }
      }
    });
  }, [activeVideo]);

  // Proper cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeUpdateFrame.current) {
        cancelAnimationFrame(timeUpdateFrame.current);
      }
      
      // Clean up video resources on unmount
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
