
import { CSSProperties } from "react";

interface SectionContentProps {
  isVisible: boolean;
  gradient: string;
  title: string;
  style?: CSSProperties;
}

export const SectionContent = ({ isVisible, gradient, title, style }: SectionContentProps) => {
  return (
    <div 
      className="absolute inset-0 w-full h-full flex items-center justify-center"
      style={{ 
        backgroundImage: gradient,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 2s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        ...style
      }}
    >
      <div className="w-full max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-white text-4xl font-montserrat">{title} Content</h2>
      </div>
    </div>
  );
};
