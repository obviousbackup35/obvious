
import { useState, useEffect, useRef } from 'react';

export const useAudioState = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : 1;
      if (!audio.paused) {
        return;
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [isMuted]);

  const toggleAudio = (event: React.MouseEvent) => {
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
  };

  return {
    audioRef,
    isMuted,
    toggleAudio
  };
};
