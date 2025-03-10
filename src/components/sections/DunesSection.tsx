
import { memo, CSSProperties } from 'react';

interface DunesSectionProps {
  scrollProgress: number;
  style?: CSSProperties;
}

const DunesSection = memo(({ scrollProgress, style }: DunesSectionProps) => {
  return (
    <div 
      className="fixed inset-0 w-full h-full transition-opacity duration-700"
      style={{
        backgroundImage: 'url(/dunes.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: scrollProgress,
        zIndex: 6,
        ...style
      }}
      role="region"
      aria-label="Dunes Section"
    />
  );
});

DunesSection.displayName = 'DunesSection';

export default DunesSection;
