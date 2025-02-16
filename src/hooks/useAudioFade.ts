
import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

export const useAudioFade = (isPlaying: boolean, currentView: string) => {
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { audioRef } = useAudio();

  useEffect(() => {
    if (!isPlaying) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      if (currentView === 'video' || currentView === 'dunes') {
        const fadeStep = 0.05;
        const fadeInterval = 50;
        const currentVolume = audioRef.current?.volume || 1;

        if (event.deltaY > 0) { // Scrolling down
          const startFadeOut = () => {
            if (!audioRef.current) return;
            
            const newVolume = Math.max(0, (audioRef.current.volume - fadeStep));
            audioRef.current.volume = newVolume;
            
            if (newVolume <= 0) {
              if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
              }
            }
          };

          fadeIntervalRef.current = setInterval(startFadeOut, fadeInterval);
          startFadeOut();
        } else if (event.deltaY < 0) { // Scrolling up
          const startFadeIn = () => {
            if (!audioRef.current) return;
            
            const newVolume = Math.min(1, (audioRef.current.volume + fadeStep));
            audioRef.current.volume = newVolume;
            
            if (newVolume >= 1) {
              if (fadeIntervalRef.current) {
                clearInterval(fadeIntervalRef.current);
              }
            }
          };

          fadeIntervalRef.current = setInterval(startFadeIn, fadeInterval);
          startFadeIn();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [isPlaying, audioRef, currentView]);

  return { audioRef };
};
