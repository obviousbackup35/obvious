
import { useCallback, memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import NavigationButton from "./NavigationButton";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import type { ContentView } from "@/types/navigation";
import { cn } from "@/lib/utils";

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
    // Placeholder for left arrow functionality
    console.log("Left arrow clicked");
  }, []);

  const handleRightArrow = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Placeholder for right arrow functionality
    console.log("Right arrow clicked");
  }, []);

  const getTextColor = () => {
    if (currentView === 'dunes') {
      return '#555555';
    }
    return '#c8c5ad';
  };

  // Fixed the duplicate property issue here
  const buttonClasses = cn(
    "transition-all duration-700 z-50",
    "absolute left-1/2 -translate-x-1/2 bottom-8"
  );

  return (
    <div 
      className="fixed bottom-8 w-full flex justify-between px-4 items-center transition-opacity duration-1000"
      style={{
        opacity: isPlaying ? 1 : 0,
        pointerEvents: isPlaying ? 'auto' : 'none',
        willChange: 'opacity'
      }}
    >
      {isMobile && (
        <NavigationButton
          onClick={handleLeftArrow}
          className="p-2 transition-all duration-700 z-50"
        >
          <ChevronLeft 
            className="w-7 h-7" 
            style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} 
            aria-hidden="true" 
          />
          <span className="sr-only">Previous</span>
        </NavigationButton>
      )}

      <NavigationButton
        onClick={handleRefresh}
        className={buttonClasses}
      >
        <RefreshCw 
          className="w-7 h-7" 
          style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} 
          aria-hidden="true" 
        />
        <span className="sr-only">Refresh</span>
      </NavigationButton>

      {isMobile && (
        <NavigationButton
          onClick={handleRightArrow}
          className="p-2 transition-all duration-700 z-50"
        >
          <ChevronRight 
            className="w-7 h-7" 
            style={{ color: getTextColor(), transition: 'color 0.7s ease-in-out' }} 
            aria-hidden="true" 
          />
          <span className="sr-only">Next</span>
        </NavigationButton>
      )}
    </div>
  );
});

RefreshButton.displayName = 'RefreshButton';

export default RefreshButton;
