
import { useState, useCallback } from 'react';
import type { ContentView } from '@/types/navigation';

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  
  const handleViewChange = useCallback((view: ContentView) => {
    setCurrentView(view);
  }, []);
  
  return { 
    currentView, 
    setCurrentView: handleViewChange
  };
};
