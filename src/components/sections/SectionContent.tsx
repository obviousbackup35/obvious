
import { CSSProperties, memo } from "react";
import { ChevronLeft } from "lucide-react";
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
  style, 
  onBack 
}: SectionContentProps) => {
  const isMobile = useIsMobile();
  const backgroundStyle = backgroundImage 
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } 
    : { backgroundImage: gradient };

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ 
        ...backgroundStyle,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 2s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        willChange: isVisible ? 'opacity' : 'auto',
        ...style
      }}
      role={isVisible ? "region" : "presentation"}
      aria-hidden={!isVisible}
      aria-label={title}
    >
      {onBack && !isMobile && (
        <button 
          onClick={onBack}
          className="absolute left-0 top-36 text-white hover:opacity-70 transition-opacity p-3"
          aria-label="Back to video"
        >
          <ChevronLeft size={40} />
        </button>
      )}
    </div>
  );
});

SectionContent.displayName = 'SectionContent';
