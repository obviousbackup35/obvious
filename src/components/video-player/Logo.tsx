
import { CSSProperties, memo, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogoProps {
  isBackgroundLoaded: boolean;
  style?: CSSProperties;
}

export const Logo = memo(({ isBackgroundLoaded, style }: LogoProps) => {
  const isMobile = useIsMobile();
  const logoRef = useRef<HTMLImageElement>(null);
  const logoWidth = isMobile ? 320 : 660; 
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-30"
      style={{ 
        opacity: 0,
        ...style,
        transition: style?.transition || 'opacity 2s ease-in-out',
        transitionDelay: style?.transition ? '0ms' : '2500ms',
        visibility: isBackgroundLoaded ? 'visible' : 'hidden',
      }}
      aria-label="Brand Logo"
    >
      <img
        ref={logoRef}
        src="/logo.svg"
        alt="Logo"
        className="h-auto"
        style={{ 
          width: `${logoWidth}px`,
          maxWidth: '80vw'
        }}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
});

Logo.displayName = 'Logo';
