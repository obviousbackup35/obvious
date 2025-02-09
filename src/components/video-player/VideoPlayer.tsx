
import { forwardRef } from "react";

interface VideoPlayerProps {
  isPlaying: boolean;
  isActive: boolean;
  src: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ isPlaying, isActive, src }, ref) => {
    return (
      <video
        ref={ref}
        muted
        loop={false}
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        style={{
          opacity: isPlaying ? (isActive ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out'
        }}
        src={src}
      />
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
