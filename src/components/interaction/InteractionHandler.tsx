
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

const FADE_DURATION = 1500; // 1.5 seconds for smooth fade

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

  // Highly optimized fade audio function
  const fadeAudioIn = useCallback((audio: HTMLAudioElement) => {
    // Clear any existing fade interval
    if (fadeInterval.current !== null) {
      window.clearInterval(fadeInterval.current);
      fadeInterval.current = null;
    }
    
    // Start with volume at 0
    audio.volume = 0;
    
    const steps = 30; // Higher steps for smoother transition
    const stepTime = FADE_DURATION / steps;
    let currentStep = 0;
    
    // Use setInterval for more consistent timing
    fadeInterval.current = window.setInterval(() => {
      currentStep++;
      // Use Math.min to ensure volume never exceeds 1
      audio.volume = Math.min(currentStep / steps, 1);
      
      // Clear interval when animation completes
      if (currentStep >= steps) {
        if (fadeInterval.current !== null) {
          window.clearInterval(fadeInterval.current);
          fadeInterval.current = null;
        }
      }
    }, stepTime);
  }, []);

  // Proper cleanup to prevent memory leaks
  useEffect(() => {
    return () => {
      if (fadeInterval.current !== null) {
        window.clearInterval(fadeInterval.current);
        fadeInterval.current = null;
      }
    };
  }, []);

  // Optimized playback start with better promise handling
  const startPlayback = useCallback(async () => {
    if (isPlaying) return;

    try {
      // Start audio playback with optimized error handling
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.volume = 0;
        
        try {
          await audio.play();
          fadeAudioIn(audio);
        } catch (error) {
          console.error("Audio autoplay prevented:", error);
          // Skip fade and set volume directly if autoplay fails
          audio.volume = 1;
        }
      }

      // Process videos in parallel for faster startup
      const videos = [video1Ref.current, video2Ref.current].filter(Boolean);
      
      // Use Promise.allSettled to continue even if some videos fail
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

  // Single unified interaction handler for both click and touch
  const handleInteraction = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    
    if (!hasInitialInteraction) {
      setHasInitialInteraction(true);
    }
    
    startPlayback();
  }, [hasInitialInteraction, setHasInitialInteraction, startPlayback]);

  // Auto-start playback when hasInitialInteraction changes
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
