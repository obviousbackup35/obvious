
import { useState, useEffect, useCallback, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";

interface InteractionHandlerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  video1Ref: React.RefObject<HTMLVideoElement>;
  video2Ref: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  children: React.ReactNode;
}

const FADE_DURATION = 1500; // Mantendo em 1.5 segundos para fade suave

const InteractionHandler = ({
  audioRef,
  video1Ref,
  video2Ref,
  isPlaying,
  setIsPlaying,
  currentTime,
  children
}: InteractionHandlerProps) => {
  const { hasInitialInteraction, setHasInitialInteraction } = useAudio();
  const fadeInterval = useRef<number | null>(null);

  // Otimizado: Memoized fade audio function com useCallback
  const fadeAudioIn = useCallback((audio: HTMLAudioElement) => {
    // Clear any existing fade interval
    if (fadeInterval.current !== null) {
      window.clearInterval(fadeInterval.current);
      fadeInterval.current = null;
    }
    
    // Start with volume at 0
    audio.volume = 0;
    
    const steps = 30; // Mantido para transição suave
    const stepTime = FADE_DURATION / steps;
    let currentStep = 0;
    
    // Usar setInterval é mais eficiente que setTimeout recursivo
    fadeInterval.current = window.setInterval(() => {
      currentStep++;
      // Math.min garante que o volume nunca ultrapasse 1 (proteção extra)
      audio.volume = Math.min(currentStep / steps, 1);
      
      // Limpar o intervalo quando a animação terminar
      if (audio.volume >= 1) {
        if (fadeInterval.current !== null) {
          window.clearInterval(fadeInterval.current);
          fadeInterval.current = null;
        }
      }
    }, stepTime);
  }, []);

  // Garantir limpeza adequada para evitar memory leaks
  useEffect(() => {
    return () => {
      if (fadeInterval.current !== null) {
        window.clearInterval(fadeInterval.current);
        fadeInterval.current = null;
      }
    };
  }, []);

  // Otimizado: Uso correto de async/await com tratamento adequado de promises
  const startPlayback = useCallback(async () => {
    if (isPlaying) return;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0;
        const audioPromise = audioRef.current.play();
        
        if (audioPromise !== undefined) {
          audioPromise
            .then(() => {
              fadeAudioIn(audioRef.current!);
            })
            .catch(error => {
              console.error("Error playing audio:", error);
            });
        } else {
          fadeAudioIn(audioRef.current);
        }
      }

      // Otimizado: Processamento de vídeos em paralelo
      const videos = [video1Ref.current, video2Ref.current].filter(Boolean);
      await Promise.all(
        videos.map(video => {
          if (video) {
            video.currentTime = currentTime;
            return video.play();
          }
          return Promise.resolve();
        })
      );

      setIsPlaying(true);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  }, [isPlaying, audioRef, currentTime, video1Ref, video2Ref, setIsPlaying, fadeAudioIn]);

  // Otimizado: Consolidação de lógicas de click e touch em uma única função
  const handleInteraction = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault(); // Evitar comportamento padrão para melhor controle
    
    if (!hasInitialInteraction) {
      setHasInitialInteraction(true);
    }
    startPlayback();
  }, [hasInitialInteraction, setHasInitialInteraction, startPlayback]);

  useEffect(() => {
    if (hasInitialInteraction && !isPlaying) {
      startPlayback();
    }
  }, [hasInitialInteraction, isPlaying, startPlayback]);

  return (
    <div 
      className="relative viewport-height w-full overflow-hidden cursor-pointer bg-white prevent-overscroll no-bounce"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      role="application"
      aria-label="Interactive video experience"
    >
      {children}
    </div>
  );
};

export default InteractionHandler;
