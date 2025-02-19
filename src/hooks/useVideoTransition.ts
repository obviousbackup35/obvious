
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

    // Armazena o ponto de transição apenas uma vez
    if (transitionPoint.current === 0) {
      transitionPoint.current = video1.duration - 1;
    }
    
    if (activeVideo === 1 && video1.currentTime >= transitionPoint.current) {
      isTransitioning.current = true;
      video2.currentTime = 0;
      void video2.play().then(() => {
        setActiveVideo(2);
        isTransitioning.current = false;
      });
    } else if (activeVideo === 2 && video2.currentTime >= transitionPoint.current) {
      isTransitioning.current = true;
      video1.currentTime = 0;
      void video1.play().then(() => {
        setActiveVideo(1);
        isTransitioning.current = false;
      });
    }
  }, [activeVideo]);

  useEffect(() => {
    return () => {
      // Cleanup para garantir que os vídeos são pausados quando o componente é desmontado
      video1Ref.current?.pause();
      video2Ref.current?.pause();
    };
  }, []);

  return {
    activeVideo,
    video1Ref,
    video2Ref,
    handleTimeUpdate
  };
};
