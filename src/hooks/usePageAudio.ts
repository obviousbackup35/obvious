
import { useEffect } from 'react';
import { useAudio } from "@/contexts/AudioContext";

export const usePageAudio = (isPlaying: boolean, currentView: string) => {
  const { audioRef } = useAudio();
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error resuming audio:", error);
        });
      }
    }
  }, [isPlaying, audioRef, currentView]);
  
  return { audioRef };
};
