
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
      className="w-full min-h-[200px] rounded-lg overflow-hidden"
      style={{ 
        backgroundImage: gradient,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 2s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        ...style
      }}
    >
      <div className="w-full h-full p-8 flex items-center justify-center">
        <h2 className="text-white text-4xl font-montserrat tracking-[0.3em] text-center">{title}</h2>
      </div>
    </div>
  );
};
