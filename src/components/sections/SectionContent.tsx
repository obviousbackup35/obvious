
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
      <div className="w-full text-center">
        <h2 className="text-white text-4xl font-montserrat tracking-[0.3em]">{title}</h2>
      </div>
    </div>
  );
};
