
import { memo, CSSProperties } from 'react';

interface DunesSectionProps {
  scrollProgress: number;
  style?: CSSProperties;
  isVisible: boolean;
}

const DunesSection = memo(({ scrollProgress, style, isVisible }: DunesSectionProps) => {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-10"
      style={{
        backgroundImage: 'url(/dunes.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 500ms ease-out',
        pointerEvents: isVisible ? 'auto' : 'none',
        ...style
      }}
      role="region"
      aria-label="Dunes Section"
    />
  );
});

DunesSection.displayName = 'DunesSection';

export default DunesSection;
