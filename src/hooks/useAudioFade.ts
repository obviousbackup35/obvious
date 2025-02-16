
import { useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

export const useAudioFade = (isPlaying: boolean, currentView: string) => {
  const { audioRef } = useAudio();
  return { audioRef };
};
