
import { CSSProperties, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogoProps {
  isBackgroundLoaded: boolean;
  style?: CSSProperties;
}

export const Logo = memo(({ isBackgroundLoaded, style }: LogoProps) => {
  const isMobile = useIsMobile();
  
  // Tamanho ajustado para melhor visualização em mobile
  const logoWidth = isMobile ? 320 : 660; // Desktop: 660px, Mobile: 320px
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-30"
      style={{ 
        opacity: 0, // Always start invisible
        willChange: 'opacity',
        ...style,
        // During first load (when style?.transition is undefined), use slow transition
        // In transitions between pages, use exactly the same timing as the video
        transition: style?.transition || 'opacity 2s ease-in-out',
        transitionDelay: style?.transition ? '0ms' : '2500ms', // Increased to 2.5s to ensure background image is loaded
        visibility: isBackgroundLoaded ? 'visible' : 'hidden', // Ensure logo only appears after background loads
      }}
      aria-label="Brand Logo"
    >
      <img
        src="/logo.svg"
        alt="Logo"
        className="h-auto"
        style={{ 
          width: `${logoWidth}px`,
          maxWidth: '80vw'
        }}
        loading="eager"
      />
    </div>
  );
});

Logo.displayName = 'Logo';
