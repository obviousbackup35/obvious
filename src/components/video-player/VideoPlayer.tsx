
import { forwardRef, CSSProperties, useEffect, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoPlayerProps {
  isPlaying: boolean;
  isActive: boolean;
  src: string;
  style?: CSSProperties;
}

export const VideoPlayer = memo(forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ isPlaying, isActive, src, style }, ref) => {
    const isMobile = useIsMobile();
    
    useEffect(() => {
      // Preload video when component mounts
      if (ref && 'current' in ref && ref.current) {
        ref.current.load();
      }
    }, [ref]);

    // Skip rendering if the video is not playing and not active
    if (!isPlaying && !isActive) {
      return null;
    }

    return (
      <video
        ref={ref}
        muted
        loop={false}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: isPlaying ? (isActive ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          willChange: 'opacity',
          objectFit: isMobile ? 'contain' : 'cover',
          transform: isMobile ? 'scale(1.15)' : 'none',
          ...style
        }}
        src={src}
      />
    );
  }
));

VideoPlayer.displayName = 'VideoPlayer';
