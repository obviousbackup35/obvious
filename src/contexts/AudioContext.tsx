
import { createContext, useContext, useRef, useState, useCallback, ReactNode, useEffect } from 'react';

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  toggleAudio: (event: React.MouseEvent) => void;
  hasInitialInteraction: boolean;
  setHasInitialInteraction: (value: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const FADE_DURATION = 1500;

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasInitialInteraction, setHasInitialInteraction] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const fadeInterval = useRef<number | null>(null);

  const fadeAudio = useCallback((fadeIn: boolean) => {
    if (!audioRef.current) return;
    
    if (fadeInterval.current !== null) {
      window.clearInterval(fadeInterval.current);
      fadeInterval.current = null;
    }
    
    const audio = audioRef.current;
    const steps = 30;
    const stepTime = FADE_DURATION / steps;
    
    if (fadeIn) {
      audio.volume = 0;
    }
    
    let currentStep = 0;
    
    fadeInterval.current = window.setInterval(() => {
      currentStep++;
      
      if (fadeIn) {
        audio.volume = Math.min(currentStep / steps, 1);
        if (audio.volume >= 1) {
          window.clearInterval(fadeInterval.current!);
          fadeInterval.current = null;
        }
      } else {
        audio.volume = Math.max(1 - (currentStep / steps), 0);
        
        if (audio.volume <= 0) {
          window.clearInterval(fadeInterval.current!);
          fadeInterval.current = null;
          audio.pause();
        }
      }
    }, stepTime);
  }, []);

  useEffect(() => {
    return () => {
      if (fadeInterval.current !== null) {
        window.clearInterval(fadeInterval.current);
      }
    };
  }, []);

  const toggleAudio = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (audioRef.current) {
      if (isPlaying) {
        fadeAudio(false);
        setIsPlaying(false);
      } else {
        const audio = audioRef.current;
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              fadeAudio(true);
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Error playing audio:", error);
            });
        } else {
          fadeAudio(true);
          setIsPlaying(true);
        }
      }
    }
  }, [isPlaying, fadeAudio]);

  return (
    <AudioContext.Provider value={{ 
      audioRef, 
      isPlaying, 
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
