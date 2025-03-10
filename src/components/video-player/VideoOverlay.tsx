
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
        transition: 'opacity 2s ease-in-out',
        ...style
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
});

VideoOverlay.displayName = 'VideoOverlay';
