
import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

export const useAudioFade = (isPlaying: boolean, currentView: string) => {
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { audioRef } = useAudio();

  useEffect(() => {
    // Limpeza do intervalo no unmount do componente
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  return { audioRef };
};
