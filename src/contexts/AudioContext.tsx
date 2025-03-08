
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

const FADE_DURATION = 1500; // Aumentado para 1.5 segundos para um fade mais suave

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasInitialInteraction, setHasInitialInteraction] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const fadeInterval = useRef<number | null>(null);

  // Fade audio in or out
  const fadeAudio = useCallback((fadeIn: boolean) => {
    if (!audioRef.current) return;
    
    // Clear any existing fade interval
    if (fadeInterval.current !== null) {
      window.clearInterval(fadeInterval.current);
      fadeInterval.current = null;
    }
    
    const audio = audioRef.current;
    const steps = 30; // Aumentado o número de steps para uma transição mais suave
    const stepTime = FADE_DURATION / steps;
    
    // Set initial volume based on whether we're fading in or out
    if (fadeIn) {
      audio.volume = 0;
    }
    
    let currentStep = 0;
    
    fadeInterval.current = window.setInterval(() => {
      currentStep++;
      
      if (fadeIn) {
        // Fade in: gradually increase volume
        audio.volume = Math.min(currentStep / steps, 1);
        if (audio.volume >= 1) {
          window.clearInterval(fadeInterval.current!);
          fadeInterval.current = null;
        }
      } else {
        // Fade out: gradually decrease volume
        audio.volume = Math.max(1 - (currentStep / steps), 0);
        
        if (audio.volume <= 0) {
          window.clearInterval(fadeInterval.current!);
          fadeInterval.current = null;
          audio.pause(); // Actually pause the audio after fade out is complete
        }
      }
    }, stepTime);
  }, []);

  // Clean up any fade interval on unmount
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
        // Start fade out
        fadeAudio(false);
        // Atualizamos o estado somente depois de iniciar o fade para melhorar a UX
        setIsPlaying(false);
      } else {
        // Start playback and fade in
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
