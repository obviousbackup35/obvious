import { useState, useCallback, useRef } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const isTransitioning = useRef(false);
  const isMobile = useIsMobile();
  
  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    
    // Set timeout to prevent rapid multiple transitions
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1000);
    
    if (direction === 'down') {
      if (currentView === 'video') {
        setCurrentView('black');
      } else if (currentView === 'black') {
        setCurrentView('dunes');
      }
    } else if (direction === 'up') {
      if (currentView === 'dunes') {
        setCurrentView('black');
      } else if (currentView === 'black') {
        setCurrentView('video');
      }
    }
  }, [currentView]);

  // We're keeping the handleViewTransition function for the triangle buttons
  // but removing all the wheel and touch event handling code and listeners

  return { 
    currentView, 
    setCurrentView 
  };
};
