
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
      className="absolute inset-0 w-full h-full"
      style={{ 
        backgroundImage: gradient,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 2s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        ...style
      }}
    >
      <div className="flex items-center justify-center h-full w-full">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-white text-4xl font-montserrat">{title} Content</h2>
          </div>
        </div>
      </div>
    </div>
  );
};
