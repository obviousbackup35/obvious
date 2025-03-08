
import { CSSProperties, memo } from "react";

interface VideoOverlayProps {
  isBackgroundLoaded: boolean;
  isVisible?: boolean;
  style?: CSSProperties;
}

export const VideoOverlay = memo(({ isBackgroundLoaded, isVisible = false, style }: VideoOverlayProps) => {
  // Skip rendering if not loaded and not visible
  if (!isBackgroundLoaded && !isVisible) {
    return null;
  }
  
  return (
    <div 
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
      style={{ 
        backgroundImage: 'url("/fundo.webp")',
        opacity: isBackgroundLoaded && isVisible ? 1 : 0,
        willChange: 'opacity',
        transition: 'opacity 2s ease-in-out',
        ...style
      }}
      aria-hidden={!isVisible}
      role="presentation"
    />
  );
});

VideoOverlay.displayName = 'VideoOverlay';
