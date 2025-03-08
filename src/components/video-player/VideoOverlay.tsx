
import { CSSProperties, memo, useEffect, useRef } from "react";

interface VideoOverlayProps {
  isBackgroundLoaded: boolean;
  style?: CSSProperties;
}

export const VideoOverlay = memo(({ isBackgroundLoaded, style }: VideoOverlayProps) => {
  const prevLoadedState = useRef(false);
  
  // Optimize transitions by only applying willChange when the state is changing
  useEffect(() => {
    prevLoadedState.current = isBackgroundLoaded;
  }, [isBackgroundLoaded]);
  
  const isChanging = prevLoadedState.current !== isBackgroundLoaded;
  
  return (
    <div 
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
      style={{ 
        backgroundImage: 'url("/fundo.webp")',
        opacity: isBackgroundLoaded ? 1 : 0,
        willChange: isChanging ? 'opacity' : 'auto',
        transition: 'opacity 2s ease-in-out',
        ...style,
        // Prioritize hardware acceleration only when needed
        transitionProperty: 'opacity',
        transitionDuration: '2s',
        transitionTimingFunction: 'ease-in-out'
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
});

VideoOverlay.displayName = 'VideoOverlay';
