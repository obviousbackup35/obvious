
import { useRef, useState, useCallback } from 'react';

export const useAudioState = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleAudio = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMuted(prev => !prev);
    
    if (audioRef.current) {
      const fadeStep = 0.05;
      const fadeInterval = 50;
      const targetVolume = isMuted ? 1 : 0;
      let currentVolume = audioRef.current.volume;

      const fade = setInterval(() => {
        if (isMuted) {
          currentVolume = Math.min(1, currentVolume + fadeStep);
          audioRef.current!.volume = currentVolume;
          if (currentVolume >= 1) clearInterval(fade);
        } else {
          currentVolume = Math.max(0, currentVolume - fadeStep);
          audioRef.current!.volume = currentVolume;
          if (currentVolume <= 0) clearInterval(fade);
        }
      }, fadeInterval);
    }
  }, [isMuted]);

  return {
    audioRef,
    isMuted,
    toggleAudio
  };
};
