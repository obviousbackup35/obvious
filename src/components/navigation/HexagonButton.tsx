
import { memo, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import type { ContentView } from '@/types/navigation';

interface HexagonButtonProps {
  onViewChange: (view: ContentView) => void;
  textColor: string;
  isDunesVisible: boolean;
  toggleDunes: () => void;
}

const HexagonButton = memo(({ onViewChange, textColor, isDunesVisible, toggleDunes }: HexagonButtonProps) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDunesVisible) {
      toggleDunes();
      onViewChange('video');
    }
  }, [isDunesVisible, toggleDunes, onViewChange]);

  if (!isDunesVisible) return null;

  return (
    <button
      className="absolute left-[calc(25%-280px+15.1px)] top-[calc(50%+80px)] transform -translate-y-1/2 p-2 transition-all duration-700 hover:opacity-70"
      aria-label="Return to Video"
      onClick={handleClick}
    >
      <ChevronUp
        className="w-8 h-8"
        style={{
          color: textColor,
          transition: 'color 0.7s ease-in-out'
        }}
        aria-hidden="true"
      />
    </button>
  );
});

HexagonButton.displayName = 'HexagonButton';

export default HexagonButton;
