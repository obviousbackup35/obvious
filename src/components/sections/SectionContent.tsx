
import { CSSProperties } from "react";
import { ChevronLeft } from "lucide-react";

interface SectionContentProps {
  isVisible: boolean;
  gradient: string;
  title: string;
  style?: CSSProperties;
  onBack?: () => void;
}

export const SectionContent = ({ isVisible, gradient, title, style, onBack }: SectionContentProps) => {
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ 
        backgroundImage: gradient,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 2s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        ...style
      }}
    >
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute left-8 top-8 text-white hover:opacity-70 transition-opacity p-2"
          aria-label="Voltar para dunas"
        >
          <ChevronLeft size={32} />
        </button>
      )}
      <div className="flex items-center justify-center h-full text-white text-4xl font-montserrat">
        {title} Content
      </div>
    </div>
  );
};
