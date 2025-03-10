
import { memo, CSSProperties } from 'react';

interface DunesSectionProps {
  scrollProgress: number;
  style?: CSSProperties;
}

const DunesSection = memo(({ scrollProgress, style }: DunesSectionProps) => {
  return (
    <div 
      className="fixed inset-0 w-full h-full z-10"
      style={{
        backgroundImage: 'url(/dunes.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: scrollProgress,
        transition: 'opacity 100ms ease-out', // Transição ainda mais rápida
        pointerEvents: 'none',
        ...style
      }}
      role="region"
      aria-label="Dunes Section"
    />
  );
});

DunesSection.displayName = 'DunesSection';

export default DunesSection;
