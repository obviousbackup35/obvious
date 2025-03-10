
import { useState } from 'react';
import type { ContentView } from '@/types/navigation';

export const useViewTransition = (isPlaying: boolean) => {
  const [currentView, setCurrentView] = useState<ContentView>('video');
  
  return { 
    currentView, 
    setCurrentView
  };
};
