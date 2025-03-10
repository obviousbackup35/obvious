
import { useState, useCallback } from 'react';
import type { ContentView } from '@/types/navigation';
import { useIsMobile } from "@/hooks/use-mobile";

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  const isMobile = useIsMobile();
  
  // Log for debugging
  console.log(`View transition - Current view: ${currentView}, isMobile: ${isMobile}`);

  // Direct transition handler - video to content and back
  const handleViewTransition = useCallback((direction: 'up' | 'down') => {
    console.log(`View transition triggered - Direction: ${direction}, Current view: ${currentView}`);
    
    // If we're going down from video, show content directly (company, projects, etc)
    // If we're on a content page, going up returns to video
    if (currentView === 'video' && direction === 'down') {
      // Default to first content page when scrolling down from video
      setCurrentView('company');
    } else if (currentView !== 'video' && direction === 'up') {
      // Any content page going up returns to video
      setCurrentView('video');
    }
  }, [currentView]);

  return { 
    currentView, 
    setCurrentView,
    handleViewTransition
  };
};
