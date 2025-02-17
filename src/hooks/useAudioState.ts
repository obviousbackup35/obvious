
import { useRef, useState, useCallback, useEffect } from 'react';

export const useAudioState = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const fadeIntervalRef = useRef<number>();

  const toggleAudio = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMuted(prev => !prev);
    
    if (audioRef.current) {
      // Limpa o intervalo anterior se existir
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const fadeStep = 0.05;
      const fadeInterval = 50;
      const targetVolume = isMuted ? 1 : 0;
      let currentVolume = audioRef.current.volume;

      fadeIntervalRef.current = window.setInterval(() => {
        if (!audioRef.current) return;

        if (isMuted) {
          currentVolume = Math.min(1, currentVolume + fadeStep);
          audioRef.current.volume = currentVolume;
          if (currentVolume >= 1) clearInterval(fadeIntervalRef.current);
        } else {
          currentVolume = Math.max(0, currentVolume - fadeStep);
          audioRef.current.volume = currentVolume;
          if (currentVolume <= 0) clearInterval(fadeIntervalRef.current);
        }
      }, fadeInterval);
    }
  }, [isMuted]);

  // Limpa o intervalo quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  return {
    audioRef,
    isMuted,
    toggleAudio
  };
};
