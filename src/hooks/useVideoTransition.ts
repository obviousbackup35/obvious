
import { useCallback, useEffect, useRef, useState } from "react";

export const useVideoTransition = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const transitionPoint = useRef<number>(0);

  const handleTimeUpdate = useCallback(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    
    if (!video1 || !video2) return;

    // Armazena o ponto de transição apenas uma vez
    if (transitionPoint.current === 0) {
      transitionPoint.current = video1.duration - 1;
    }
    
    if (activeVideo === 1 && video1.currentTime >= transitionPoint.current) {
      video2.currentTime = 0;
      void video2.play();
      setActiveVideo(2);
    } else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
      video1.currentTime = 0;
      void video1.play();
      setActiveVideo(1);
    }
  }, [activeVideo]);

  return {
    activeVideo,
    video1Ref,
    video2Ref,
    handleTimeUpdate
  };
};
