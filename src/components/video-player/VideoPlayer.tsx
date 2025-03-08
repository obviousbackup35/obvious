
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
    
    // Optimized: useEffect with proper dependencies and cleanup
    useEffect(() => {
      // Optimized: On-demand loading (lazy loading)
      if (ref && 'current' in ref && ref.current && !videoLoaded.current) {
        // Mark as loaded to prevent redundant reloads
        videoLoaded.current = true;
        
        // Optimized: Check if URL is already set to avoid unnecessary reloads
        if (ref.current.src !== src) {
          ref.current.src = src;
          ref.current.load();
          console.log("Video source loaded:", src);
        }
      }
      
      // No cleanup logic here - will be handled in parent component
    }, [ref, src]); // Minimized and correct dependencies

    // Optimized: Memoized styles to avoid recalculations
    const videoStyles = useMemo(() => ({
      opacity: isPlaying ? (isActive ? 1 : 0) : 0,
      transition: 'opacity 1s ease-in-out',
      // Optimized: Selective use of willChange only when needed
      willChange: isPlaying && isActive ? 'opacity' : 'auto',
      objectFit: isMobile ? 'contain' as const : 'cover' as const,
      // Optimized: Use transform to trigger GPU compositing
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
