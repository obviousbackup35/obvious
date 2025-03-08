
import { forwardRef, CSSProperties, useEffect, memo, useRef, useMemo } from "react";
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
    
    // Optimize with useEffect cleanup
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

    // Memoize style calculations to avoid recalculation
    const videoStyles = useMemo(() => ({
      opacity: isPlaying ? (isActive ? 1 : 0) : 0,
      transition: 'opacity 1s ease-in-out',
      willChange: isPlaying && isActive ? 'opacity' : 'auto',
      objectFit: isMobile ? 'contain' as const : 'cover' as const,
      transform: isMobile ? 'translate3d(0,0,0) scale(1.15)' : 'translate3d(0,0,0)',
      contain: 'content' as const,
      ...style
    }), [isPlaying, isActive, isMobile, style]);

    return (
      <video
        ref={ref}
        muted
        loop={false}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={videoStyles}
        src={src}
      />
    );
  }
));

VideoPlayer.displayName = 'VideoPlayer';
