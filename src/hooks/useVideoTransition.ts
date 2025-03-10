
import { useCallback, useRef, useState, useEffect } from "react";

export const useVideoTransition = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const transitionPoint = useRef<number>(0);
  const isTransitioning = useRef(false);
  
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
      
      video2.play()
        .then(() => {
          setActiveVideo(2);
          isTransitioning.current = false;
        })
        .catch(() => {
          setTimeout(() => {
            video2.play()
              .then(() => {
                setActiveVideo(2);
                isTransitioning.current = false;
              })
              .catch(() => isTransitioning.current = false);
          }, 200);
        });
    } 
    // Video2 -> Video1 transition
    else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
      isTransitioning.current = true;
      video1.currentTime = 0;
      
      video1.play()
        .then(() => {
          setActiveVideo(1);
          isTransitioning.current = false;
        })
        .catch(() => {
          setTimeout(() => {
            video1.play()
              .then(() => {
                setActiveVideo(1);
                isTransitioning.current = false;
              })
              .catch(() => isTransitioning.current = false);
          }, 200);
        });
    }
  }, [activeVideo]);

  // Cleanup
  useEffect(() => {
    return () => {
      [video1Ref.current, video2Ref.current].forEach(video => {
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
