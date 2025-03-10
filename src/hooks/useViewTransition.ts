
import { useState, useCallback, useRef, useEffect } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const isTransitioning = useRef(false);
  const isMobile = useIsMobile();
  
  // Debug current view changes
  useEffect(() => {
    console.log(`View transition - Current view is now: ${currentView}`);
  }, [currentView]);

  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    console.log(`View transition - Direction: ${direction}, Current view: ${currentView}`);
    
    // Set timeout to prevent rapid multiple transitions
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1000);
    
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
