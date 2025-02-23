
import { forwardRef, CSSProperties, useEffect, memo } from "react";

interface VideoPlayerProps {
  isPlaying: boolean;
  isActive: boolean;
  src: string;
  style?: CSSProperties;
}

export const VideoPlayer = memo(forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ isPlaying, isActive, src, style }, ref) => {
    useEffect(() => {
      // Pré-carrega o vídeo assim que o componente montar
      if (ref && 'current' in ref && ref.current) {
        ref.current.load();
        // Adiciona preload hint
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = src;
        document.head.appendChild(link);

        return () => {
          document.head.removeChild(link);
        };
      }
    }, [ref, src]);

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
          willChange: 'opacity',
          ...style
        }}
        src={src}
      />
    );
  }
));

VideoPlayer.displayName = 'VideoPlayer';
