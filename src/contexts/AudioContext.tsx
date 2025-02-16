
import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isMuted: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
  hasInitialInteraction: boolean;
  setHasInitialInteraction: (value: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInitialInteraction, setHasInitialInteraction] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

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

  return (
    <AudioContext.Provider value={{ 
      audioRef, 
      isMuted, 
      toggleAudio, 
      hasInitialInteraction, 
      setHasInitialInteraction,
      currentTime,
      setCurrentTime
    }}>
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        loop
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
