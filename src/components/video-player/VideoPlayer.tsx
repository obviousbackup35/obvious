
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
    
    // High-performance effect with proper dependencies and cleanup
    useEffect(() => {
      // On-demand loading to reduce initial load time
      if (ref && 'current' in ref && ref.current && !videoLoaded.current) {
        // Mark as loaded to prevent redundant reloads
        videoLoaded.current = true;
        
        // Only set src if it's different to avoid unnecessary reloads
        if (ref.current.src !== src) {
          ref.current.src = src;
          ref.current.load();
        }
      }
    }, [ref, src]); // Minimized dependencies for optimal effect execution

    // Memoized styles to prevent recalculations on each render
    const videoStyles = useMemo(() => ({
      opacity: isPlaying ? (isActive ? 1 : 0) : 0,
      transition: 'opacity 1s ease-in-out',
      // Only apply will-change when actually changing for better performance
      willChange: isPlaying && isActive ? 'opacity' : 'auto',
      objectFit: isMobile ? 'contain' as const : 'cover' as const,
      // GPU acceleration hints only when needed
      transform: isMobile ? 'translate3d(0,0,0) scale(1.15)' : 'translate3d(0,0,0)',
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
        // Remove src from here since we're setting it programmatically in useEffect
        // This prevents double loading
      />
    );
  }
));

VideoPlayer.displayName = 'VideoPlayer';
