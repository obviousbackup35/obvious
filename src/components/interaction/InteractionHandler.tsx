
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

const FADE_DURATION = 1500; // Aumentando também para 1.5 segundos

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

  // Fade audio in
  const fadeAudioIn = useCallback((audio: HTMLAudioElement) => {
    // Clear any existing fade interval
    if (fadeInterval.current !== null) {
      window.clearInterval(fadeInterval.current);
      fadeInterval.current = null;
    }
    
    // Start with volume at 0
    audio.volume = 0;
    
    const steps = 30; // Aumentado para transição mais suave
    const stepTime = FADE_DURATION / steps;
    let currentStep = 0;
    
    fadeInterval.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.min(currentStep / steps, 1);
      
      if (audio.volume >= 1) {
        window.clearInterval(fadeInterval.current!);
        fadeInterval.current = null;
      }
    }, stepTime);
  }, []);

  // Clean up fade interval on unmount
  useEffect(() => {
    return () => {
      if (fadeInterval.current !== null) {
        window.clearInterval(fadeInterval.current);
      }
    };
  }, []);

  const startPlayback = useCallback(async () => {
    if (isPlaying) return;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        // Initialize volume to 0 for fade-in
        audioRef.current.volume = 0;
        const audioPromise = audioRef.current.play();
        
        if (audioPromise !== undefined) {
          audioPromise
            .then(() => {
              // Start fade-in effect
              fadeAudioIn(audioRef.current!);
            })
            .catch(error => {
              console.error("Error playing audio:", error);
            });
        } else {
          fadeAudioIn(audioRef.current);
        }
      }

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

  const handleInteraction = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault(); // Prevent default behavior for better control
    
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
