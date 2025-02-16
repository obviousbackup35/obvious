
import { useAudio } from "@/contexts/AudioContext";

export const usePageAudio = (isPlaying: boolean, currentView: string) => {
  const { audioRef } = useAudio();
  return { audioRef };
};
