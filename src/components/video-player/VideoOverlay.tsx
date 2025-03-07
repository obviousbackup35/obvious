
import { CSSProperties, memo } from "react";

interface VideoOverlayProps {
  isBackgroundLoaded: boolean;
  style?: CSSProperties;
}

export const VideoOverlay = memo(({ isBackgroundLoaded, style }: VideoOverlayProps) => {
  return (
    <div 
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
      style={{ 
        backgroundImage: 'url("/fundo.webp")',
        opacity: isBackgroundLoaded ? 1 : 0,
        willChange: 'opacity',
        transition: 'opacity 2s ease-in-out',
        ...style,
        // Combina as transições mantendo a suavidade
        transitionProperty: 'opacity',
        transitionDuration: '2s',
        transitionTimingFunction: 'ease-in-out'
      }}
      aria-hidden="true"
    />
  );
});

VideoOverlay.displayName = 'VideoOverlay';
