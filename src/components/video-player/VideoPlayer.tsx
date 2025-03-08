
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
        
        // Explicitly set the source to ensure it's loaded
        if (ref.current.src !== src) {
          ref.current.src = src;
        }
        
        ref.current.load();
        console.log("Video source loaded:", src);
      }
      
      // Clean up only when component unmounts, NOT on every effect run
      return () => {
        // No cleanup logic here - we'll handle cleanup in the parent component
      };
    }, [ref, src]);

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
