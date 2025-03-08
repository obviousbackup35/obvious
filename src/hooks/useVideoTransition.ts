
import { useCallback, useRef, useState, useEffect } from "react";

export const useVideoTransition = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const transitionPoint = useRef<number>(0);
  const isTransitioning = useRef(false);
  const timeUpdateFrame = useRef<number>();
  const lastUpdateTime = useRef(0);
  
  // Reduced throttling for timeupdate events (50ms instead of 100ms)
  const handleTimeUpdate = useCallback(() => {
    const now = Date.now();
    // Reduced throttle time to ensure smoother transitions
    if (now - lastUpdateTime.current < 50) return;
    lastUpdateTime.current = now;
    
    if (timeUpdateFrame.current) {
      cancelAnimationFrame(timeUpdateFrame.current);
    }

    timeUpdateFrame.current = requestAnimationFrame(() => {
      const video1 = video1Ref.current;
      const video2 = video2Ref.current;
      
      if (!video1 || !video2 || isTransitioning.current) return;

      // Set transition point if not set yet
      if (transitionPoint.current === 0 && video1.duration) {
        // Set transition 1 second before end (safer margin)
        transitionPoint.current = Math.max(video1.duration - 1, 0);
        console.log("Set transition point:", transitionPoint.current);
      }
      
      // Enhanced logging to debug transition issues
      if (activeVideo === 1 && video1.currentTime > 0 && transitionPoint.current > 0) {
        const timeRemaining = transitionPoint.current - video1.currentTime;
        if (timeRemaining < 0.5) {
          console.log(`Video 1 near transition: ${timeRemaining.toFixed(2)}s remaining`);
        }
      } else if (activeVideo === 2 && video2.currentTime > 0 && transitionPoint.current > 0) {
        const timeRemaining = transitionPoint.current - video2.currentTime;
        if (timeRemaining < 0.5) {
          console.log(`Video 2 near transition: ${timeRemaining.toFixed(2)}s remaining`);
        }
      }
      
      if (activeVideo === 1 && video1.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        console.log("Starting transition to video 2");
        
        // Ensure video2 is ready before transition
        video2.currentTime = 0;
        
        // Use more stable promise chaining for playback
        video2.play()
          .then(() => {
            console.log("Transitioned to video 2");
            setActiveVideo(2);
            isTransitioning.current = false;
          })
          .catch(err => {
            console.error("Video 2 playback error:", err);
            // Try one more time with a delay
            setTimeout(() => {
              video2.play()
                .then(() => {
                  setActiveVideo(2);
                  isTransitioning.current = false;
                })
                .catch(deepErr => {
                  console.error("Retry video 2 playback failed:", deepErr);
                  isTransitioning.current = false;
                });
            }, 200);
          });
          
      } else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
        isTransitioning.current = true;
        console.log("Starting transition to video 1");
        
        video1.currentTime = 0;
        
        video1.play()
          .then(() => {
            console.log("Transitioned to video 1");
            setActiveVideo(1);
            isTransitioning.current = false;
          })
          .catch(err => {
            console.error("Video 1 playback error:", err);
            // Try one more time with a delay
            setTimeout(() => {
              video1.play()
                .then(() => {
                  setActiveVideo(1);
                  isTransitioning.current = false;
                })
                .catch(deepErr => {
                  console.error("Retry video 1 playback failed:", deepErr);
                  isTransitioning.current = false;
                });
            }, 200);
          });
      }
    });
  }, [activeVideo]);

  // Clean up resources on unmount but don't clear sources during app operation
  useEffect(() => {
    return () => {
      if (timeUpdateFrame.current) {
        cancelAnimationFrame(timeUpdateFrame.current);
      }
      
      // Only clear videos on complete component unmount, not during regular operation
      if (video1Ref.current) {
        video1Ref.current.pause();
      }
      
      if (video2Ref.current) {
        video2Ref.current.pause();
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
