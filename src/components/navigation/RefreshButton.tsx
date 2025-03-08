
import { useCallback, memo } from "react";
import NavigationButton from "./NavigationButton";
import { RefreshCw } from "lucide-react";
import type { ContentView } from "@/types/navigation";

interface RefreshButtonProps {
  isPlaying: boolean;
  currentView: ContentView;
}

const RefreshButton = memo(({ isPlaying, currentView }: RefreshButtonProps) => {
  const handleRefresh = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.reload();
  }, []);

  const getTextColor = () => {
    if (currentView === 'dunes') {
      return '#555555';
    }
    return '#c8c5ad';
  };

  return (
    <NavigationButton
      onClick={handleRefresh}
      className="absolute left-1/2 -translate-x-1/2 bottom-8 p-2 transition-all duration-700 z-50"
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
  );
});

RefreshButton.displayName = 'RefreshButton';

export default RefreshButton;
