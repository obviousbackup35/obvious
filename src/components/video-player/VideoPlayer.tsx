
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
    
    useEffect(() => {
      if (!('current' in ref) || !ref.current || videoLoaded.current) return;
      
      videoLoaded.current = true;
      
      if (ref.current.src !== src) {
        ref.current.src = src;
        ref.current.load();
      }
    }, [ref, src]);

    const videoStyle = useMemo(() => ({
      opacity: isPlaying && isActive ? 1 : 0,
      transition: 'opacity 1s ease-in-out',
      willChange: isPlaying && isActive ? 'opacity' : 'auto',
      objectFit: isMobile ? 'contain' : 'cover',
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
        style={videoStyle}
      />
    );
  }
));

VideoPlayer.displayName = 'VideoPlayer';
