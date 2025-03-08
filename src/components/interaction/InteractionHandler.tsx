
import { useState, useEffect, useCallback } from "react";
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

  const startPlayback = useCallback(async () => {
    if (isPlaying) return;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1;
        await audioRef.current.play();
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
  }, [isPlaying, audioRef, currentTime, video1Ref, video2Ref, setIsPlaying]);

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
