
import { CSSProperties, memo, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SectionContentProps {
  isVisible: boolean;
  gradient?: string;
  backgroundImage?: string;
  title: string;
  style?: CSSProperties;
  onBack?: () => void;
}

export const SectionContent = memo(({ 
  isVisible, 
  gradient, 
  backgroundImage, 
  title, 
  style
}: SectionContentProps) => {
  const isMobile = useIsMobile();
  
  const backgroundStyle = useMemo(() => {
    return backgroundImage 
      ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } 
      : { backgroundImage: gradient };
  }, [backgroundImage, gradient]);

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ 
        ...backgroundStyle,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 2s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        ...style
      }}
      role={isVisible ? "region" : "presentation"}
      aria-hidden={!isVisible}
      aria-label={title}
    />
  );
});

SectionContent.displayName = 'SectionContent';
