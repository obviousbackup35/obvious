
import { CSSProperties, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LogoProps {
  isBackgroundLoaded: boolean;
  isVisible?: boolean;
  style?: CSSProperties;
}

export const Logo = memo(({ isBackgroundLoaded, isVisible = false, style }: LogoProps) => {
  const isMobile = useIsMobile();
  
  // Skip rendering if not loaded and not visible
  if (!isBackgroundLoaded && !isVisible) {
    return null;
  }
  
  // Tamanho ajustado para melhor visualização em mobile
  const logoWidth = isMobile ? 320 : 660;
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-30"
      style={{ 
        opacity: isVisible ? 1 : 0,
        willChange: 'opacity',
        transition: 'opacity 2s ease-in-out',
        transitionDelay: '2s',
        ...style
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
        fetchPriority="high"
      />
    </div>
  );
});

Logo.displayName = 'Logo';
