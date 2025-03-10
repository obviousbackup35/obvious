
import { useState, useCallback, useRef, useEffect } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const isMobile = useIsMobile();
  
  // Enhanced debugging
  useEffect(() => {
    console.log(`View transition - Current view changed to: ${currentView}`);
  }, [currentView]);

  // Simplified transition handler - removed complex state tracking
  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    console.log(`View transition - Direction: ${direction}, Current view: ${currentView}`);
    
    // Simple state machine for view transitions
    if (direction === 'down') {
      if (currentView === 'video') {
        console.log('Transitioning: video -> black');
        setCurrentView('black');
      } else if (currentView === 'black') {
        console.log('Transitioning: black -> dunes');
        setCurrentView('dunes');
      }
    } else if (direction === 'up') {
      if (currentView === 'dunes') {
        console.log('Transitioning: dunes -> black');
        setCurrentView('black');
      } else if (currentView === 'black') {
        console.log('Transitioning: black -> video');
        setCurrentView('video');
      }
    }
  }, [currentView]);

  return { 
    currentView, 
    setCurrentView,
    handleViewTransition
  };
};
