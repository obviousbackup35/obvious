
import { memo, useCallback } from 'react';
import { Hexagon } from 'lucide-react';
import type { ContentView } from '@/types/navigation';

interface HexagonButtonProps {
  onViewChange: (view: ContentView) => void;
}

const HexagonButton = memo(({ onViewChange }: HexagonButtonProps) => {
  const getTextColor = () => '#c8c5ad';
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewChange('video');
  }, [onViewChange]);

  return (
    <button
      className="absolute left-[calc(25%-280px+18.9px)] top-[calc(50%+80px)] transform -translate-y-1/2 p-2 transition-all duration-700 hover:scale-110"
      aria-label="Return to Video"
      onClick={handleClick}
    >
      <Hexagon
        className="w-8 h-8"
        style={{
          color: getTextColor(),
          transition: 'color 0.7s ease-in-out'
        }}
        aria-hidden="true"
      />
    </button>
  );
});

HexagonButton.displayName = 'HexagonButton';

export default HexagonButton;
