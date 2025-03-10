import { useState, useEffect, useCallback, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useScrollTransition } from "@/hooks/useScrollTransition";

interface InteractionHandlerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  video1Ref: React.RefObject<HTMLVideoElement>;
  video2Ref: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  children: React.ReactNode;
}

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
  const { scrollProgress } = useScrollTransition();

  const fadeAudioIn = useCallback((audio: HTMLAudioElement) => {
    if (fadeInterval.current !== null) {
      window.clearInterval(fadeInterval.current);
      fadeInterval.current = null;
    }
    
    audio.volume = 0;
    
    const steps = 30;
    const stepTime = FADE_DURATION / steps;
    let currentStep = 0;
    
    fadeInterval.current = window.setInterval(() => {
      currentStep++;
      audio.volume = Math.min(currentStep / steps, 1);
      
      if (currentStep >= steps) {
        if (fadeInterval.current !== null) {
          window.clearInterval(fadeInterval.current);
          fadeInterval.current = null;
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

  const startPlayback = useCallback(async () => {
    if (isPlaying) return;

    try {
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.volume = 0;
        
        try {
          await audio.play();
          fadeAudioIn(audio);
        } catch (error) {
          console.error("Audio autoplay prevented:", error);
          audio.volume = 1;
        }
      }

      const videos = [video1Ref.current, video2Ref.current].filter(Boolean);
      
      await Promise.allSettled(
        videos.map(async (video) => {
          if (video) {
            video.currentTime = currentTime;
            try {
              await video.play();
            } catch (error) {
              console.error("Video playback error:", error);
            }
          }
        })
      );

      setIsPlaying(true);
    } catch (error) {
      console.error('Playback initialization error:', error);
    }
  }, [isPlaying, audioRef, currentTime, video1Ref, video2Ref, setIsPlaying, fadeAudioIn]);

  const handleInteraction = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
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
    <div className="relative w-full" style={{ height: '200vh' }}>
      <div 
        className="fixed top-0 left-0 w-full h-screen overflow-hidden cursor-pointer bg-black"
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        role="application"
        aria-label="Interactive video experience"
      >
        {children}
      </div>
    </div>
  );
};

export default InteractionHandler;
