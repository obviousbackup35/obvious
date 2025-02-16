
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
      if (isMuted) {
        audioRef.current.volume = 1;
      } else {
        audioRef.current.volume = 0;
      }
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
        preload="auto"
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
