
import { useEffect, useRef, useState } from "react";

export const useAudioFade = (isPlaying: boolean) => {
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [audioVolume, setAudioVolume] = useState(1);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentVolumeRef = useRef<number>(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wasMutedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const fadeStep = 0.05;
      const fadeInterval = 50;

      // Removendo a lógica do showBlackScreen e mantendo apenas o controle do áudio
      if (event.deltaY > 0) {
        const startFadeOut = () => {
          if (wasMutedRef.current) return;
          
          const newVolume = Math.max(0, currentVolumeRef.current - fadeStep);
          currentVolumeRef.current = newVolume;
          
          if (audioRef.current) {
            audioRef.current.volume = newVolume;
          }
          setAudioVolume(newVolume);
          
          if (newVolume <= 0) {
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
          }
        };

        fadeIntervalRef.current = setInterval(startFadeOut, fadeInterval);
        startFadeOut();
      } else if (event.deltaY < 0) {
        const startFadeIn = () => {
          if (wasMutedRef.current) return;
          
          const newVolume = Math.min(1, currentVolumeRef.current + fadeStep);
          currentVolumeRef.current = newVolume;
          
          if (audioRef.current) {
            audioRef.current.volume = newVolume;
          }
          setAudioVolume(newVolume);
          
          if (newVolume >= 1) {
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
          }
        };

        fadeIntervalRef.current = setInterval(startFadeIn, fadeInterval);
        startFadeIn();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
      currentVolumeRef.current = audioVolume;
    }
  }, [audioVolume]);

  return {
    showBlackScreen,
    audioRef,
    audioVolume,
    wasMutedRef
  };
};
