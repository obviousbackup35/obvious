
import { useCallback, memo } from "react";
import NavigationButton from "./NavigationButton";
import { RefreshCw, Triangle } from "lucide-react";
import type { ContentView } from "@/types/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface RefreshButtonProps {
  isPlaying: boolean;
  currentView: ContentView;
}

const RefreshButton = memo(({ isPlaying, currentView }: RefreshButtonProps) => {
  const isMobile = useIsMobile();
  
  const handleRefresh = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.reload();
  }, []);

  const handleLeftArrow = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Left arrow functionality can be added later
  }, []);

  const getTextColor = () => {
    if (currentView === 'dunes') {
      return '#555555';
    }
    return '#c8c5ad';
  };

  return (
    <div className="absolute bottom-8 flex items-center gap-4 transition-all duration-700 z-50" style={{ left: '4px' }}>
      <NavigationButton
        onClick={handleLeftArrow}
        className="p-2 transition-all duration-700"
        style={{
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          willChange: 'opacity'
        }}
      >
        <Triangle 
          className="w-7 h-7 rotate-270" 
          style={{ 
            color: getTextColor(), 
            transition: 'color 0.7s ease-in-out', 
            transform: 'rotate(270deg)' 
          }} 
          aria-hidden="true" 
          fill={getTextColor()}
        />
        <span className="sr-only">Previous</span>
      </NavigationButton>
      
      <NavigationButton
        onClick={handleRefresh}
        className="p-2 transition-all duration-700"
        style={{
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          willChange: 'opacity'
        }}
      >
        <RefreshCw 
          className="w-7 h-7" 
          style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} 
          aria-hidden="true" 
        />
        <span className="sr-only">Refresh</span>
      </NavigationButton>
    </div>
  );
});

RefreshButton.displayName = 'RefreshButton';

export default RefreshButton;
