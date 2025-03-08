
import { forwardRef, CSSProperties, useEffect, memo, useRef } from "react";
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
    const videoLoaded = useRef(false);
    
    useEffect(() => {
      // Only preload video when needed and not already loaded
      if (ref && 'current' in ref && ref.current && !videoLoaded.current) {
        // Mark as loaded to avoid redundant loads
        videoLoaded.current = true;
        ref.current.load();
      }
      
      // Clean up when component unmounts
      return () => {
        if (ref && 'current' in ref && ref.current) {
          if (!isPlaying) {
            // If not playing, we can free up resources
            ref.current.src = '';
            videoLoaded.current = false;
          }
        }
      };
    }, [ref, isPlaying]);

    return (
      <video
        ref={ref}
        muted
        loop={false}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        style={{
          opacity: isPlaying ? (isActive ? 1 : 0) : 0,
          transition: 'opacity 1s ease-in-out',
          willChange: isPlaying && isActive ? 'opacity' : 'auto', // Only use willChange when needed
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
