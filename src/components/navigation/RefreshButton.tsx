
import { useCallback, memo } from "react";
import NavigationButton from "./NavigationButton";
import { RefreshCw, Triangle } from "lucide-react";
import type { ContentView } from "@/types/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface RefreshButtonProps {
  isPlaying: boolean;
  currentView: ContentView;
  onViewChange: (view: ContentView) => void;
}

const RefreshButton = memo(({ isPlaying, currentView, onViewChange }: RefreshButtonProps) => {
  const isMobile = useIsMobile();
  
  const handleRefresh = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.reload();
  }, []);

  const handlePreviousView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For content pages, we need to store and retrieve the previous main view
    if (['company', 'projects', 'gallery', 'contact', 'profile', 'auth'].includes(currentView)) {
      // Get the last main view from sessionStorage, defaulting to 'dunes' if not found
      const lastView = sessionStorage.getItem('lastMainView') as ContentView || 'dunes';
      onViewChange(lastView);
    }
    // Main navigation views
    else if (currentView === 'dunes') {
      onViewChange('black');
    } else if (currentView === 'black') {
      onViewChange('video');
    } 
    // Policy pages
    else if (currentView !== 'video') {
      // For policy pages, also use the stored last main view
      const lastView = sessionStorage.getItem('lastMainView') as ContentView || 'dunes';
      onViewChange(lastView);
    }
  }, [currentView, onViewChange]);

  const handleNextView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Main navigation views
    if (currentView === 'video') {
      onViewChange('black');
    } else if (currentView === 'black') {
      onViewChange('dunes');
    }
  }, [currentView, onViewChange]);

  const getTextColor = () => {
    if (currentView === 'dunes') {
      return '#555555';
    }
    return '#c8c5ad';
  };

  return (
    <div className="absolute bottom-8 flex justify-between w-full transition-all duration-700 z-50">
      {isMobile && (
        <div className="flex items-center" style={{ marginLeft: '1.75rem' }}>
          <NavigationButton
            onClick={handlePreviousView}
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
        </div>
      )}
      
      <div className={`${isMobile ? 'absolute left-1/2 -translate-x-1/2 transform' : 'mx-auto'}`}>
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
      
      {isMobile && (
        <div className="flex items-center" style={{ marginRight: '1.75rem' }}>
          <NavigationButton
            onClick={handleNextView}
            className="p-2 transition-all duration-700"
            style={{
              opacity: isPlaying ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              willChange: 'opacity'
            }}
          >
            <Triangle 
              className="w-7 h-7" 
              style={{ 
                color: getTextColor(), 
                transition: 'color 0.7s ease-in-out', 
                transform: 'rotate(90deg)' 
              }} 
              aria-hidden="true" 
              fill={getTextColor()}
            />
            <span className="sr-only">Next</span>
          </NavigationButton>
        </div>
      )}
    </div>
  );
});

RefreshButton.displayName = 'RefreshButton';

export default RefreshButton;
